/* ============================================================
   online.js - Firebase room-based online multiplayer
   ============================================================ */

const onlineState = {
  mode: 'local',
  firebaseReady: false,
  db: null,
  roomRef: null,
  roomListener: null,
  actionsListener: null,
  roomCode: '',
  isHost: false,
  playerNumber: null,
  clientId: `client_${Math.random().toString(36).slice(2, 10)}`,
  guestConnected: false,
  applyingRemote: false,
  lastAppliedHostSyncVersion: 0,
  status: 'Online mode is off.',
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
const originalSelectGameMode = selectGameMode;
const originalRandomizeCategories = randomizeCategories;
const originalRematchGame = rematchGame;
const originalHandleContentModeAction = handleContentModeAction;
const originalRerollCurrentQuestion = rerollCurrentQuestion;

function isOnlineMode() {
  return onlineState.mode === 'online';
}

function isConnectedOnline() {
  return isOnlineMode() && !!onlineState.roomCode && !!onlineState.roomRef;
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

function randomRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getOwnOnlineName() {
  return getOnlineNameInput().value.trim();
}

function cloneStateSnapshot() {
  return JSON.parse(JSON.stringify(state));
}

function applyClonedState(snapshotState) {
  const clone = JSON.parse(JSON.stringify(snapshotState));
  Object.keys(state).forEach((key) => {
    if (clone[key] !== undefined) state[key] = clone[key];
  });
}

function getActiveScreenId() {
  const screen = document.querySelector('.screen.active');
  return screen ? screen.id : 'screen-title';
}

function buildUiSnapshot() {
  return {
    screen: getActiveScreenId(),
    overlays: {
      bonus: {
        show: document.getElementById('bonusOverlay').classList.contains('show'),
        icon: document.getElementById('bonusIcon').textContent,
        name: document.getElementById('bonusName').textContent,
        desc: document.getElementById('bonusDesc').textContent,
      },
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

function updateOnlineStatus(message) {
  onlineState.status = message;
  document.getElementById('onlineStatus').textContent = message;
  document.getElementById('roomCodeDisplay').textContent = onlineState.roomCode || '------';
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
    onlineName.disabled = false;
    roomCode.disabled = false;
    syncSetupInputs();
    return;
  }

  p1.readOnly = true;
  p2.readOnly = true;
  p1.disabled = true;
  p2.disabled = true;

  p1.value = state.p1 || '';
  p2.value = state.p2 || '';
  roomCode.value = onlineState.roomCode || roomCode.value;
  onlineName.disabled = isConnectedOnline();
  roomCode.disabled = isConnectedOnline();
}

function updateStartButtonState() {
  const button = document.querySelector('.btn-start');
  const inner = button.querySelector('.btn-start-inner');

  if (!isOnlineMode()) {
    button.disabled = false;
    inner.textContent = '💥 START THE CHAOS';
    return;
  }

  if (!onlineState.firebaseReady) {
    button.disabled = true;
    inner.textContent = 'SET FIREBASE CONFIG';
    return;
  }

  if (!isConnectedOnline()) {
    button.disabled = true;
    inner.textContent = 'CREATE OR JOIN ROOM';
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

  const hostOnlyNodes = [
    ...document.querySelectorAll('.award-btn'),
    ...document.querySelectorAll('.btn-reveal-bonus'),
    ...document.querySelectorAll('.punish-action'),
    ...document.querySelectorAll('.round-tool-btn'),
  ];

  hostOnlyNodes.forEach((node) => {
    if (!isConnectedOnline()) {
      node.disabled = false;
      return;
    }
    node.disabled = !onlineState.isHost;
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

function updateModeUI() {
  document.querySelectorAll('.mode-btn').forEach((button) => {
    button.classList.toggle('selected', button.dataset.mode === onlineState.mode);
  });
  document.getElementById('onlinePanel').classList.toggle('show', isOnlineMode());
  syncSetupFieldsForMode();
  updateOnlineStatus(onlineState.status);
  updateStartButtonState();
  syncOnlineDomState();
}

function ensureFirebaseReady() {
  const cfg = window.WYR_CHAOS_CONFIG?.firebase;
  const required = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
  if (!cfg || required.some((key) => !cfg[key])) {
    updateOnlineStatus('Add your Firebase config in config.js.');
    updateStartButtonState();
    return false;
  }

  if (!firebase.apps.length) firebase.initializeApp(cfg);
  onlineState.db = firebase.database();
  onlineState.firebaseReady = true;
  return true;
}

function roomPath(roomCode) {
  return `rooms/${roomCode}`;
}

function writeRoomData(data) {
  if (!onlineState.roomRef) return Promise.resolve();
  return onlineState.roomRef.update(data);
}

function maybeSendLobbyUpdate() {
  if (!isConnectedOnline() || !onlineState.isHost || onlineState.applyingRemote) return;
  writeRoomData({
    hostName: state.p1,
    guestName: state.p2,
    totalRounds: state.totalRounds,
    gameMode: state.gameMode,
    selectedCats: state.selectedCats,
    safeMode: state.safeMode,
    ageConfirmed: state.ageConfirmed,
    updatedAt: firebase.database.ServerValue.TIMESTAMP,
  });
}

function maybeSendHostSnapshot() {
  if (!isConnectedOnline() || !onlineState.isHost || onlineState.applyingRemote) return;
  writeRoomData({
    hostSync: {
      state: cloneStateSnapshot(),
      ui: buildUiSnapshot(),
      version: Date.now(),
      sessionId: state.gameSessionId,
      roundSequence: state.roundSequence,
    },
    updatedAt: firebase.database.ServerValue.TIMESTAMP,
  });
}

function attachRoomListeners() {
  detachRoomListeners();
  if (!onlineState.roomRef) return;

  onlineState.roomListener = onlineState.roomRef.on('value', (snapshot) => {
    const room = snapshot.val();
    if (!room) {
      updateOnlineStatus('Room closed.');
      leaveOnlineRoom(false);
      return;
    }

    onlineState.guestConnected = !!room.guestId;

    if (onlineState.isHost) {
      state.p1 = room.hostName || state.p1;
      state.p2 = room.guestName || 'Waiting for player';
      syncSetupFieldsForMode();
      updateStartButtonState();
      syncOnlineDomState();
      return;
    }

    state.p1 = room.hostName || state.p1;
    state.p2 = room.guestName || state.p2;
    state.totalRounds = room.totalRounds || state.totalRounds;
    state.gameMode = GAME_MODES[room.gameMode] ? room.gameMode : state.gameMode;
    state.selectedCats = room.selectedCats || state.selectedCats;
    state.safeMode = !!room.safeMode;
    state.ageConfirmed = !!room.ageConfirmed;

    syncRoundsUI();
    syncGameModeUI();
    syncCategoryUI();
    syncContentModePill();
    syncSetupFieldsForMode();
    updateStartButtonState();

    if (room.hostSync && room.hostSync.version) {
      applyRemoteSnapshot(room.hostSync);
    }
  });

  if (onlineState.isHost) {
    onlineState.actionsListener = onlineState.roomRef.child('guestActions').on('child_added', (snapshot) => {
      handleGuestAction(snapshot);
    });
  }
}

function detachRoomListeners() {
  if (onlineState.roomRef && onlineState.roomListener) {
    onlineState.roomRef.off('value', onlineState.roomListener);
    onlineState.roomListener = null;
  }
  if (onlineState.roomRef && onlineState.actionsListener) {
    onlineState.roomRef.child('guestActions').off('child_added', onlineState.actionsListener);
    onlineState.actionsListener = null;
  }
}

function applyRemoteSnapshot(snapshot) {
  if (onlineState.isHost) return;
  if (!snapshot?.version || snapshot.version <= onlineState.lastAppliedHostSyncVersion) return;

  onlineState.applyingRemote = true;
  onlineState.lastAppliedHostSyncVersion = snapshot.version;
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

  const overlays = snapshot.ui.overlays;
  document.getElementById('bonusOverlay').classList.toggle('show', !!overlays.bonus?.show);
  document.getElementById('bonusIcon').textContent = overlays.bonus?.icon || state.pendingBonusCard?.icon || '🃏';
  document.getElementById('bonusName').textContent = overlays.bonus?.name || state.pendingBonusCard?.name || 'MYSTERY';
  document.getElementById('bonusDesc').textContent = overlays.bonus?.desc || state.pendingBonusCard?.desc || '...';
  document.getElementById('punishOverlay').classList.toggle('show', !!overlays.punishment.show);
  document.getElementById('punishIcon').textContent = overlays.punishment.icon || '💀';
  document.getElementById('punishPlayer').textContent = overlays.punishment.player || '';
  document.getElementById('punishText').textContent = overlays.punishment.text || '';
  document.getElementById('spinnerOverlay').classList.toggle('show', !!overlays.spinner.show);
  document.getElementById('spinResult').innerHTML = overlays.spinner.resultHtml || '';
  document.getElementById('spinResult').classList.toggle('show', !!overlays.spinner.resultHtml);
  document.getElementById('closeSpinner').style.display = overlays.spinner.closeVisible || 'none';

  syncOnlineDomState();
  onlineState.applyingRemote = false;
}

function handleGuestAction(snapshot) {
  const action = snapshot?.val();
  if (!onlineState.isHost || !action) return;
  switch (action.type) {
    case 'choose': {
      const player = Number(action.player) === PLAYER_TWO ? PLAYER_TWO : PLAYER_ONE;
      const actionSessionId = action.sessionId || null;
      const isCurrentSession = !actionSessionId || actionSessionId === state.gameSessionId;
      const isCurrentRound = Number(action.roundSequence) === state.roundSequence;

      if (player !== PLAYER_TWO || !isCurrentSession || !isCurrentRound || state.currentRoundResolved || state.currentChoices[player] !== null) {
        snapshot.ref.remove();
        return;
      }

      originalChoose(player, action.side);
      snapshot.ref.remove();
      maybeSendHostSnapshot();
      break;
    }
    default:
      snapshot.ref.remove();
      break;
  }
}

async function createOnlineRoom() {
  if (!ensureFirebaseReady()) return;

  const playerName = getOwnOnlineName();
  if (!playerName) {
    showToast('Enter your online name first.');
    return;
  }

  let roomCode = randomRoomCode();
  let roomSnapshot = await onlineState.db.ref(roomPath(roomCode)).get();
  while (roomSnapshot.exists()) {
    roomCode = randomRoomCode();
    roomSnapshot = await onlineState.db.ref(roomPath(roomCode)).get();
  }

  onlineState.roomCode = roomCode;
  onlineState.isHost = true;
  onlineState.playerNumber = PLAYER_ONE;
  onlineState.guestConnected = false;
  onlineState.lastAppliedHostSyncVersion = 0;
  onlineState.roomRef = onlineState.db.ref(roomPath(roomCode));

  await onlineState.roomRef.set({
    hostId: onlineState.clientId,
    guestId: null,
    hostName: playerName,
    guestName: '',
    totalRounds: state.totalRounds,
    gameMode: state.gameMode,
    selectedCats: state.selectedCats,
    safeMode: state.safeMode,
    ageConfirmed: state.ageConfirmed,
    hostSync: null,
    guestActions: null,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    updatedAt: firebase.database.ServerValue.TIMESTAMP,
  });

  onlineState.roomRef.child('hostId').onDisconnect().remove();
  onlineState.roomRef.onDisconnect().remove();

  state.p1 = playerName;
  state.p2 = 'Waiting for player';
  persistSettings();
  attachRoomListeners();
  updateOnlineStatus(`Room created. Share code ${roomCode}.`);
  updateModeUI();
  maybeSendLobbyUpdate();
}

async function joinOnlineRoom() {
  if (!ensureFirebaseReady()) return;

  const playerName = getOwnOnlineName();
  const roomCode = normalizeRoomCode(getRoomCodeInput().value);
  if (!playerName) {
    showToast('Enter your online name first.');
    return;
  }
  if (!roomCode) {
    showToast('Enter a room code.');
    return;
  }

  const roomRef = onlineState.db.ref(roomPath(roomCode));
  const snapshot = await roomRef.get();
  const room = snapshot.val();

  if (!room) {
    showToast('Room not found.');
    return;
  }
  if (room.guestId && room.guestId !== onlineState.clientId) {
    showToast('Room is already full.');
    return;
  }

  onlineState.roomCode = roomCode;
  onlineState.isHost = false;
  onlineState.playerNumber = PLAYER_TWO;
  onlineState.guestConnected = true;
  onlineState.lastAppliedHostSyncVersion = 0;
  onlineState.roomRef = roomRef;

  await roomRef.update({
    guestId: onlineState.clientId,
    guestName: playerName,
    updatedAt: firebase.database.ServerValue.TIMESTAMP,
  });

  roomRef.child('guestId').onDisconnect().remove();
  roomRef.child('guestName').onDisconnect().set('');

  state.p1 = room.hostName || 'Host';
  state.p2 = playerName;
  persistSettings();
  attachRoomListeners();
  updateOnlineStatus(`Joined room ${roomCode}. Waiting for host.`);
  updateModeUI();
}

function leaveOnlineRoom(resetMode = false) {
  detachRoomListeners();

  if (onlineState.roomRef) {
    if (onlineState.isHost) {
      onlineState.roomRef.remove();
    } else {
      onlineState.roomRef.update({
        guestId: null,
        guestName: '',
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }
  }

  onlineState.roomRef = null;
  onlineState.roomCode = '';
  onlineState.isHost = false;
  onlineState.playerNumber = null;
  onlineState.guestConnected = false;
  onlineState.lastAppliedHostSyncVersion = 0;

  if (resetMode) onlineState.mode = 'local';

  updateOnlineStatus(resetMode ? 'Online mode is off.' : 'Enter your name and create or join a room.');
  updateModeUI();
}

function setPlayMode(mode) {
  if (mode === onlineState.mode) return;
  if (mode === 'local' && isConnectedOnline()) leaveOnlineRoom(true);
  onlineState.mode = mode;
  if (mode === 'online') {
    ensureFirebaseReady();
    updateOnlineStatus(onlineState.firebaseReady ? 'Enter your name and create or join a room.' : 'Add your Firebase config in config.js.');
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

selectGameMode = function patchedSelectGameMode(button) {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can change game mode.');
    return;
  }
  originalSelectGameMode(button);
  maybeSendLobbyUpdate();
};

randomizeCategories = function patchedRandomizeCategories() {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can randomize categories.');
    return;
  }
  originalRandomizeCategories();
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
  if (!onlineState.firebaseReady) {
    showToast('Add your Firebase config first.');
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
    showToast('Wait for another player to join.');
    return;
  }

  state.p1 = getOwnOnlineName() || state.p1;
  onlineState.roomRef.child('guestActions').remove();
  originalStartGame();
  maybeSendHostSnapshot();
};

rematchGame = function patchedRematchGame() {
  if (!isConnectedOnline()) {
    originalRematchGame();
    return;
  }
  if (!onlineState.isHost) {
    showToast('Only the host can start a rematch.');
    return;
  }

  onlineState.roomRef.child('guestActions').remove();
  originalRematchGame();
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

  if (state.currentRoundResolved || state.currentChoices[player] !== null) {
    return;
  }

  if (side === SKIP_CHOICE && state.effects.skips[player] <= 0) {
    showToast(`${getPlayerName(player)} has no skips left.`);
    return;
  }

  if (onlineState.isHost) {
    originalChoose(player, side);
    maybeSendHostSnapshot();
  } else {
    state.currentChoices[player] = side;
    syncChoiceButtons();
    onlineState.roomRef.child('guestActions').push({
      type: 'choose',
      player,
      side,
      sessionId: state.gameSessionId || null,
      roundSequence: state.roundSequence,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    });
    showToast('Choice locked in. Waiting for host.');
  }
  syncOnlineDomState();
};

rerollCurrentQuestion = function patchedRerollCurrentQuestion() {
  if (isConnectedOnline() && !onlineState.isHost) {
    showToast('Only the host can reroll.');
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
  ensureFirebaseReady();

  getOnlineNameInput().addEventListener('input', () => {
    if (!isConnectedOnline()) return;
    if (onlineState.isHost) {
      state.p1 = getOwnOnlineName() || 'Host';
      syncSetupFieldsForMode();
      maybeSendLobbyUpdate();
    }
  });

  getRoomCodeInput().addEventListener('input', () => {
    getRoomCodeInput().value = normalizeRoomCode(getRoomCodeInput().value);
  });

  updateModeUI();
})();
