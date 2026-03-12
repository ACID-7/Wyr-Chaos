/* ============================================================
   online.js - room-based online multiplayer relay client
   ============================================================ */

const onlineState = {
  mode: 'local',
  socket: null,
  connected: false,
  connecting: false,
  roomCode: '',
  isHost: false,
  playerNumber: null,
  applyingRemote: false,
  guestConnected: false,
  serverStatus: 'Online mode is off.',
};

const originalShowScreen = showScreen;
const originalStartGame = startGame;
const originalChoose = choose;
const originalAwardPoint = awardPoint;
const originalRevealBonus = revealBonus;
const originalTriggerPunishment = triggerPunishment;
const originalOpenSpinner = openSpinner;
const originalCloseSpinner = closeSpinner;
const originalSpinWheel = spinWheel;
const originalCloseBonusCard = closeBonusCard;
const originalClosePunishment = closePunishment;
const originalApplyWheelResult = applyWheelResult;
const originalNextRound = nextRound;
const originalEndGame = endGame;
const originalToggleCat = toggleCat;
const originalSelectRounds = selectRounds;
const originalConfirmAge = confirmAge;
const originalDenyAge = denyAge;
const originalSetCategoryPreset = setCategoryPreset;
const originalHandleContentModeAction = handleContentModeAction;
const originalRerollCurrentQuestion = rerollCurrentQuestion;

function isOnlineMode() {
  return onlineState.mode === 'online';
}

function isConnectedOnline() {
  return isOnlineMode() && onlineState.connected && !!onlineState.roomCode;
}

function getOnlineNameInput() {
  return document.getElementById('onlineName');
}

function getRoomCodeInput() {
  return document.getElementById('roomCodeInput');
}

function normalizeRoomCode(value) {
  return String(value || '').trim().toUpperCase();
}

function getOwnOnlineName() {
  return getOnlineNameInput().value.trim();
}

function getSocketUrl() {
  const configured = window.WYR_CHAOS_CONFIG?.websocketUrl?.trim();
  if (configured) return configured;

  if (location.protocol === 'http:' || location.protocol === 'https:') {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${location.host}`;
    }
    return null;
  }
  return null;
}

function cloneStateSnapshot() {
  return JSON.parse(JSON.stringify(state));
}

function getActiveScreenId() {
  const screen = document.querySelector('.screen.active');
  return screen ? screen.id : 'screen-title';
}

function buildUiSnapshot() {
  return {
    screen: getActiveScreenId(),
    overlays: {
      bonus: document.getElementById('bonusOverlay').classList.contains('show'),
      punishment: {
        show: document.getElementById('punishOverlay').classList.contains('show'),
        icon: document.getElementById('punishIcon').textContent,
        player: document.getElementById('punishPlayer').textContent,
        text: document.getElementById('punishText').textContent,
      },
      spinner: {
        show: document.getElementById('spinnerOverlay').classList.contains('show'),
        resultHtml: document.getElementById('spinResult').innerHTML,
        closeVisible: document.getElementById('closeSpinner').style.display,
      },
    },
  };
}

function applyClonedState(snapshotState) {
  const clone = JSON.parse(JSON.stringify(snapshotState));
  Object.keys(state).forEach((key) => {
    if (clone[key] !== undefined) state[key] = clone[key];
  });
}

function syncSetupFieldsForMode() {
  const p1 = document.getElementById('p1name');
  const p2 = document.getElementById('p2name');
  const onlineName = getOnlineNameInput();
  const roomCode = getRoomCodeInput();

  if (!isOnlineMode()) {
    p1.readOnly = false;
    p2.readOnly = false;
    p1.disabled = false;
    p2.disabled = false;
    syncSetupInputs();
    return;
  }

  p1.value = state.p1 || '';
  p2.value = state.p2 || '';
  p1.readOnly = true;
  p2.readOnly = true;
  p1.disabled = true;
  p2.disabled = true;

  onlineName.disabled = onlineState.connected;
  roomCode.disabled = onlineState.connected;
  roomCode.value = onlineState.roomCode || roomCode.value;
}

function updateModeUI() {
  document.querySelectorAll('.mode-btn').forEach((button) => {
    button.classList.toggle('selected', button.dataset.mode === onlineState.mode);
  });

  const panel = document.getElementById('onlinePanel');
  panel.classList.toggle('show', isOnlineMode());
  syncSetupFieldsForMode();
  updateOnlineStatus(onlineState.serverStatus);
  updateStartButtonState();
  syncOnlineDomState();
}

function updateOnlineStatus(message) {
  onlineState.serverStatus = message;
  const status = document.getElementById('onlineStatus');
  const roomCodeDisplay = document.getElementById('roomCodeDisplay');
  status.textContent = message;
  roomCodeDisplay.textContent = onlineState.roomCode || '------';
}

function updateStartButtonState() {
  const button = document.querySelector('.btn-start');
  const inner = button.querySelector('.btn-start-inner');

  if (!isOnlineMode()) {
    button.disabled = false;
    inner.textContent = '💥 START THE CHAOS';
    return;
  }

  if (!onlineState.connected) {
    button.disabled = true;
    inner.textContent = 'CONNECT ONLINE FIRST';
    return;
  }

  if (!onlineState.isHost) {
    button.disabled = true;
    inner.textContent = 'WAITING FOR HOST';
    return;
  }

  if (!onlineState.guestConnected) {
    button.disabled = true;
    inner.textContent = 'WAITING FOR PLAYER';
    return;
  }

  button.disabled = false;
  inner.textContent = 'START ONLINE MATCH';
}

function syncOnlineDomState() {
  const wheelButton = document.querySelector('.wheel-trigger-btn');
  if (wheelButton) wheelButton.disabled = isConnectedOnline() && !onlineState.isHost;

  const hostOnly = [
    ...document.querySelectorAll('.award-btn'),
    ...document.querySelectorAll('.btn-reveal-bonus'),
    ...document.querySelectorAll('.punish-action'),
    ...document.querySelectorAll('.round-tool-btn'),
  ];

  hostOnly.forEach((element) => {
    if (!isConnectedOnline()) {
      element.disabled = false;
      return;
    }
    element.disabled = !onlineState.isHost;
  });

  if (isConnectedOnline()) {
    [PLAYER_ONE, PLAYER_TWO].forEach((player) => {
      const panel = document.getElementById(`pick-panel-${player}`);
      if (!panel) return;
      const isLocalPanel = player === onlineState.playerNumber;
      panel.querySelectorAll('button[data-choice]').forEach((button) => {
        button.disabled = !isLocalPanel || state.currentChoices[player] !== null || state.currentRoundResolved;
      });
    });
  }
}

function sendSocketMessage(type, payload = {}) {
  if (!onlineState.socket || onlineState.socket.readyState !== WebSocket.OPEN) return;
  onlineState.socket.send(JSON.stringify({ type, payload }));
}

function maybeSendLobbyUpdate() {
  if (!isConnectedOnline() || !onlineState.isHost || onlineState.applyingRemote) return;
  sendSocketMessage('lobby_update', {
    hostName: state.p1,
    guestName: state.p2,
    totalRounds: state.totalRounds,
    selectedCats: state.selectedCats,
    safeMode: state.safeMode,
    ageConfirmed: state.ageConfirmed,
  });
}

function maybeSendHostSnapshot() {
  if (!isConnectedOnline() || !onlineState.isHost || onlineState.applyingRemote) return;
  sendSocketMessage('host_sync', {
    state: cloneStateSnapshot(),
    ui: buildUiSnapshot(),
  });
}

function connectSocket(onOpenAction) {
  const url = getSocketUrl();
  if (!url) {
    showToast('Set window.WYR_CHAOS_CONFIG.websocketUrl to your realtime backend URL.');
    updateOnlineStatus('No multiplayer backend configured.');
    return;
  }
  if (onlineState.socket && onlineState.socket.readyState === WebSocket.OPEN) {
    onOpenAction();
    return;
  }
  if (onlineState.connecting) return;

  onlineState.connecting = true;
  updateOnlineStatus('Connecting to multiplayer server...');

  const socket = new WebSocket(url);
  onlineState.socket = socket;

  socket.addEventListener('open', () => {
    onlineState.connecting = false;
    onlineState.connected = true;
    onOpenAction();
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    handleSocketMessage(message);
  });

  socket.addEventListener('close', () => {
    const hadRoom = !!onlineState.roomCode;
    onlineState.socket = null;
    onlineState.connected = false;
    onlineState.connecting = false;
    onlineState.roomCode = '';
    onlineState.isHost = false;
    onlineState.playerNumber = null;
    onlineState.guestConnected = false;
    if (isOnlineMode()) {
      updateOnlineStatus(hadRoom ? 'Disconnected from room.' : 'Online mode is ready.');
      updateModeUI();
    }
  });

  socket.addEventListener('error', () => {
    updateOnlineStatus('Could not connect to the multiplayer server.');
  });
}

function handleSocketMessage(message) {
  const { type, payload } = message;

  switch (type) {
    case 'room_created':
      onlineState.roomCode = payload.roomCode;
      onlineState.isHost = true;
      onlineState.playerNumber = PLAYER_ONE;
      onlineState.guestConnected = false;
      state.p1 = payload.playerName;
      state.p2 = 'Waiting for player';
      persistSettings();
      syncSetupFieldsForMode();
      updateOnlineStatus(`Room created. Share code ${payload.roomCode}.`);
      updateStartButtonState();
      maybeSendLobbyUpdate();
      break;

    case 'room_joined':
      onlineState.roomCode = payload.roomCode;
      onlineState.isHost = false;
      onlineState.playerNumber = PLAYER_TWO;
      onlineState.guestConnected = true;
      state.p1 = payload.hostName;
      state.p2 = payload.playerName;
      persistSettings();
      syncSetupFieldsForMode();
      updateOnlineStatus(`Joined room ${payload.roomCode}. Waiting for the host.`);
      updateStartButtonState();
      break;

    case 'peer_joined':
      onlineState.guestConnected = true;
      state.p2 = payload.guestName;
      persistSettings();
      syncSetupFieldsForMode();
      updateOnlineStatus(`Player joined. Room ${onlineState.roomCode} is ready.`);
      updateStartButtonState();
      maybeSendLobbyUpdate();
      break;

    case 'peer_left':
      if (onlineState.isHost) {
        onlineState.guestConnected = false;
        state.p2 = 'Waiting for player';
        updateOnlineStatus('Guest disconnected. Waiting for a new player.');
        originalShowScreen('screen-title');
        maybeSendLobbyUpdate();
      } else {
        updateOnlineStatus('Host disconnected. Room closed.');
        showToast('The host left the match.');
        leaveOnlineRoom(false);
      }
      syncSetupFieldsForMode();
      updateStartButtonState();
      break;

    case 'lobby_update':
      if (!onlineState.isHost) {
        state.p1 = payload.hostName;
        state.p2 = payload.guestName || state.p2;
        state.totalRounds = payload.totalRounds;
        state.selectedCats = payload.selectedCats;
        state.safeMode = payload.safeMode;
        state.ageConfirmed = payload.ageConfirmed;
        syncRoundsUI();
        syncCategoryUI();
        syncContentModePill();
        syncSetupFieldsForMode();
        updateStartButtonState();
      }
      break;

    case 'host_sync':
      applyRemoteSnapshot(payload);
      break;

    case 'guest_action':
      if (onlineState.isHost) handleGuestAction(payload);
      break;

    case 'error':
      showToast(payload.message);
      updateOnlineStatus(payload.message);
      break;

    default:
      break;
  }
}

function applyRemoteSnapshot(snapshot) {
  onlineState.applyingRemote = true;
  applyClonedState(snapshot.state);

  if (snapshot.ui.screen === 'screen-game') {
    originalShowScreen('screen-game');
    updateHeader();
    renderRound(state.currentQ, state.currentCardType);
    if (state.currentChoices[PLAYER_ONE] && state.currentChoices[PLAYER_TWO]) showResultArea();
  } else if (snapshot.ui.screen === 'screen-end') {
    originalEndGame();
  } else {
    originalShowScreen(snapshot.ui.screen);
    syncRoundsUI();
    syncCategoryUI();
    syncContentModePill();
    syncSetupFieldsForMode();
  }

  applyOverlaySnapshot(snapshot.ui.overlays);
  syncOnlineDomState();
  onlineState.applyingRemote = false;
}

function applyOverlaySnapshot(overlays) {
  const bonus = document.getElementById('bonusOverlay');
  const punish = document.getElementById('punishOverlay');
  const spinner = document.getElementById('spinnerOverlay');

  bonus.classList.toggle('show', !!overlays.bonus);

  punish.classList.toggle('show', !!overlays.punishment.show);
  document.getElementById('punishIcon').textContent = overlays.punishment.icon || '💀';
  document.getElementById('punishPlayer').textContent = overlays.punishment.player || '';
  document.getElementById('punishText').textContent = overlays.punishment.text || '';

  spinner.classList.toggle('show', !!overlays.spinner.show);
  document.getElementById('spinResult').innerHTML = overlays.spinner.resultHtml || '';
  document.getElementById('spinResult').classList.toggle('show', !!overlays.spinner.resultHtml);
  document.getElementById('closeSpinner').style.display = overlays.spinner.closeVisible || 'none';
}

function handleGuestAction(payload) {
  switch (payload.action) {
    case 'choose':
      originalChoose(PLAYER_TWO, payload.side);
      maybeSendHostSnapshot();
      break;
    default:
      break;
  }
}

function createOnlineRoom() {
  const name = getOwnOnlineName();
  if (!name) {
    showToast('Enter your online name first.');
    return;
  }

  connectSocket(() => {
    sendSocketMessage('create_room', { playerName: name });
  });
}

function joinOnlineRoom() {
  const name = getOwnOnlineName();
  const roomCode = normalizeRoomCode(getRoomCodeInput().value);
  if (!name) {
    showToast('Enter your online name first.');
    return;
  }
  if (!roomCode) {
    showToast('Enter a room code.');
    return;
  }

  connectSocket(() => {
    sendSocketMessage('join_room', { playerName: name, roomCode });
  });
}

function leaveOnlineRoom(closeSocket = true) {
  if (onlineState.socket && onlineState.socket.readyState === WebSocket.OPEN) {
    sendSocketMessage('leave_room');
  }
  if (closeSocket && onlineState.socket) {
    onlineState.socket.close();
  }

  onlineState.connected = false;
  onlineState.connecting = false;
  onlineState.roomCode = '';
  onlineState.isHost = false;
  onlineState.playerNumber = null;
  onlineState.guestConnected = false;
  updateOnlineStatus('Online mode is ready.');
  updateModeUI();
}

function setPlayMode(mode) {
  if (mode === onlineState.mode) return;

  if (mode === 'local' && isConnectedOnline()) {
    leaveOnlineRoom();
  }

  onlineState.mode = mode;
  if (mode === 'online') {
    updateOnlineStatus('Enter your name and create or join a room.');
  }
  updateModeUI();
}

showScreen = function patchedShowScreen(id) {
  originalShowScreen(id);
  syncOnlineDomState();
};

toggleCat = function patchedToggleCat(button) {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can change categories.');
    return;
  }
  originalToggleCat(button);
  maybeSendLobbyUpdate();
};

selectRounds = function patchedSelectRounds(button) {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can change round count.');
    return;
  }
  originalSelectRounds(button);
  maybeSendLobbyUpdate();
};

confirmAge = function patchedConfirmAge() {
  originalConfirmAge();
  maybeSendLobbyUpdate();
};

denyAge = function patchedDenyAge() {
  originalDenyAge();
  maybeSendLobbyUpdate();
};

setCategoryPreset = function patchedSetCategoryPreset(preset) {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can change presets.');
    return;
  }
  originalSetCategoryPreset(preset);
  maybeSendLobbyUpdate();
};

handleContentModeAction = function patchedHandleContentModeAction() {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can change content mode.');
    return;
  }
  originalHandleContentModeAction();
  maybeSendLobbyUpdate();
};

startGame = function patchedStartGame() {
  if (!isOnlineMode()) {
    originalStartGame();
    return;
  }

  if (!isConnectedOnline()) {
    showToast('Create or join a room first.');
    return;
  }

  if (!onlineState.isHost) {
    showToast('Only the host can start the match.');
    return;
  }

  if (!onlineState.guestConnected) {
    showToast('Wait for another player to join the room.');
    return;
  }

  syncSetupFieldsForMode();
  originalStartGame();
  maybeSendHostSnapshot();
};

choose = function patchedChoose(player, side) {
  if (!isConnectedOnline()) {
    originalChoose(player, side);
    syncOnlineDomState();
    return;
  }

  if (player !== onlineState.playerNumber) {
    showToast('You can only choose for yourself.');
    return;
  }

  if (onlineState.isHost) {
    originalChoose(player, side);
    maybeSendHostSnapshot();
  } else {
    sendSocketMessage('guest_action', { action: 'choose', side });
    showToast('Choice sent to host.');
  }
  syncOnlineDomState();
};

rerollCurrentQuestion = function patchedRerollCurrentQuestion() {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can reroll the question.');
    return;
  }
  originalRerollCurrentQuestion();
  maybeSendHostSnapshot();
};

revealBonus = function patchedRevealBonus() {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can reveal bonus cards.');
    return;
  }
  originalRevealBonus();
  maybeSendHostSnapshot();
};

triggerPunishment = function patchedTriggerPunishment(player, txt, icon) {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can assign punishments.');
    return;
  }
  originalTriggerPunishment(player, txt, icon);
  maybeSendHostSnapshot();
};

awardPoint = function patchedAwardPoint(player) {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can award the round.');
    return;
  }
  originalAwardPoint(player);
  maybeSendHostSnapshot();
};

openSpinner = function patchedOpenSpinner() {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can use the wheel.');
    return;
  }
  originalOpenSpinner();
  maybeSendHostSnapshot();
};

closeSpinner = function patchedCloseSpinner() {
  originalCloseSpinner();
  maybeSendHostSnapshot();
};

spinWheel = function patchedSpinWheel() {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can spin the wheel.');
    return;
  }
  originalSpinWheel();
};

closeBonusCard = function patchedCloseBonusCard() {
  originalCloseBonusCard();
  maybeSendHostSnapshot();
};

closePunishment = function patchedClosePunishment() {
  originalClosePunishment();
  maybeSendHostSnapshot();
};

applyWheelResult = function patchedApplyWheelResult(result, player) {
  originalApplyWheelResult(result, player);
  maybeSendHostSnapshot();
};

nextRound = function patchedNextRound() {
  originalNextRound();
  maybeSendHostSnapshot();
};

endGame = function patchedEndGame() {
  originalEndGame();
  maybeSendHostSnapshot();
};

(function initOnlineMode() {
  const onlineName = getOnlineNameInput();
  const roomCode = getRoomCodeInput();

  onlineName.addEventListener('input', () => {
    if (!isConnectedOnline()) return;
    if (onlineState.isHost) {
      state.p1 = onlineName.value.trim() || 'Host';
      syncSetupFieldsForMode();
      maybeSendLobbyUpdate();
    }
  });

  roomCode.addEventListener('input', () => {
    roomCode.value = normalizeRoomCode(roomCode.value);
  });

  updateModeUI();
})();
