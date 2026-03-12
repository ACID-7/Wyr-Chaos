/* ============================================================
   game.js - core game logic for Would You Rather: Chaos Edition
   ============================================================ */

const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
const SKIP_CHOICE = 'SKIP';
const TAU = Math.PI * 2;
const SAFE_CATEGORIES = ['couple', 'spicy', 'silly', 'deep', 'chaos', 'dare'];
const ADULT_CATEGORIES = ['naughty', 'horny'];
const DEFAULT_CATEGORIES = [...SAFE_CATEGORIES, ...ADULT_CATEGORIES];
const SETTINGS_KEY = 'wyr_chaos_settings_v1';

const state = {
  p1: 'Player 1',
  p2: 'Player 2',
  score1: 0,
  score2: 0,
  round: 0,
  totalRounds: 10,
  questions: [],
  currentQ: null,
  currentCardType: 'normal',
  currentChoices: { 1: null, 2: null },
  currentRoundResolved: false,
  pendingBonusCard: null,
  wheelUsedThisRound: false,
  selectedWheelPlayer: PLAYER_ONE,
  chaosLog: [],
  selectedCats: [...DEFAULT_CATEGORIES],
  statsRoundsPlayed: 0,
  statsBonusCards: 0,
  statsPunishments: 0,
  ageConfirmed: false,
  safeMode: false,
  rerollUsedThisRound: false,
  effects: createEffectState(),
};

function createEffectState() {
  return {
    immunity: { 1: 0, 2: 0 },
    skips: { 1: 0, 2: 0 },
    doubleOrNothing: { 1: false, 2: false },
    pointMultiplierRounds: 0,
    rocketRounds: 0,
    roleReversalRounds: 0,
    debateShowdownRounds: 0,
    chaosBomb: false,
  };
}

function getPlayerName(player) {
  return player === PLAYER_ONE ? state.p1 : state.p2;
}

function getPlayerScore(player) {
  return player === PLAYER_ONE ? state.score1 : state.score2;
}

function setPlayerScore(player, value) {
  const next = Math.max(0, value);
  if (player === PLAYER_ONE) state.score1 = next;
  else state.score2 = next;
}

function addPoints(player, points) {
  if (!player || !points) return;
  setPlayerScore(player, getPlayerScore(player) + points);
}

function otherPlayer(player) {
  return player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function escapeJsSingleQuoted(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function normalizeText(text, maxLength = 70) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
}

function logChaos(text, round = state.round) {
  state.chaosLog.push({ round, text });
}

function createSettingsSnapshot() {
  return {
    p1: state.p1,
    p2: state.p2,
    totalRounds: state.totalRounds,
    selectedCats: state.selectedCats,
    ageConfirmed: state.ageConfirmed,
    safeMode: state.safeMode,
  };
}

function persistSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(createSettingsSnapshot()));
  } catch (error) {
    // Ignore storage failures in privacy mode.
  }
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
  } catch (error) {
    return null;
  }
}

function availableCategories() {
  return state.safeMode ? [...SAFE_CATEGORIES] : [...DEFAULT_CATEGORIES];
}

function sanitizeSelectedCategories(categories) {
  const allowed = new Set(availableCategories());
  const filtered = (categories || []).filter((category) => allowed.has(category));
  return filtered.length ? filtered : [...availableCategories()];
}

function syncRoundsUI() {
  document.querySelectorAll('[data-rounds]').forEach((node) => {
    node.classList.toggle('selected', Number.parseInt(node.dataset.rounds, 10) === state.totalRounds);
  });
}

function syncContentModePill() {
  const pill = document.getElementById('contentModePill');
  if (!pill) return;

  pill.textContent = state.safeMode ? 'Safe mode active • tap to unlock 18+' : 'Adult mode enabled';
  pill.classList.toggle('safe', state.safeMode);
}

function handleContentModeAction() {
  if (state.safeMode) {
    showScreen('screen-agegate');
    return;
  }
  showToast('Adult mode is already enabled.');
}

function syncCategoryUI() {
  document.querySelectorAll('.cat-btn').forEach((button) => {
    const category = button.dataset.cat;
    const isAdult = ADULT_CATEGORIES.includes(category);
    const disabled = state.safeMode && isAdult;

    button.classList.toggle('selected', state.selectedCats.includes(category));
    button.classList.toggle('disabled', disabled);
    button.disabled = disabled;
    if (disabled) {
      button.setAttribute('aria-disabled', 'true');
      button.title = 'Switch to adult mode to use this category.';
    } else {
      button.removeAttribute('aria-disabled');
      button.removeAttribute('title');
    }
  });
}

function syncSetupInputs() {
  const p1Input = document.getElementById('p1name');
  const p2Input = document.getElementById('p2name');
  if (p1Input) p1Input.value = state.p1 === 'Player 1' ? '' : state.p1;
  if (p2Input) p2Input.value = state.p2 === 'Player 2' ? '' : state.p2;
}

function applySafeMode(enabled) {
  state.safeMode = enabled;
  if (enabled) {
    state.selectedCats = state.selectedCats.filter((category) => !ADULT_CATEGORIES.includes(category));
    if (state.selectedCats.length === 0) state.selectedCats = [...SAFE_CATEGORIES];
  } else if (!state.selectedCats.some((category) => ADULT_CATEGORIES.includes(category))) {
    state.selectedCats = sanitizeSelectedCategories([...state.selectedCats, ...ADULT_CATEGORIES]);
  }

  syncContentModePill();
  syncCategoryUI();
  persistSettings();
}

function hydrateSetupFromSettings() {
  const saved = loadSettings();
  if (!saved) {
    syncSetupInputs();
    syncRoundsUI();
    syncContentModePill();
    syncCategoryUI();
    return;
  }

  state.p1 = typeof saved.p1 === 'string' && saved.p1.trim() ? saved.p1.trim() : state.p1;
  state.p2 = typeof saved.p2 === 'string' && saved.p2.trim() ? saved.p2.trim() : state.p2;
  state.totalRounds = [10, 20, 30, 50].includes(saved.totalRounds) ? saved.totalRounds : state.totalRounds;
  state.ageConfirmed = saved.ageConfirmed === true;
  state.safeMode = saved.safeMode === true;
  state.selectedCats = sanitizeSelectedCategories(saved.selectedCats);

  syncSetupInputs();
  syncRoundsUI();
  syncContentModePill();
  syncCategoryUI();

  if (state.ageConfirmed || state.safeMode) {
    showScreen('screen-title');
  }
}

function createPlayerPickButtons(player, q) {
  const skipCount = state.effects.skips[player];
  return `
    <div class="pick-actions">
      <button class="opt-btn opt-a" type="button" data-choice="A" onclick="choose(${player}, 'A')">
        <div class="opt-icon-big">${q.ea}</div>
        <div class="opt-side-label">OPTION A</div>
        <div class="opt-text">${q.a}</div>
      </button>
      <button class="opt-btn opt-b" type="button" data-choice="B" onclick="choose(${player}, 'B')">
        <div class="opt-icon-big">${q.eb}</div>
        <div class="opt-side-label">OPTION B</div>
        <div class="opt-text">${q.b}</div>
      </button>
      ${skipCount > 0 ? `
        <button class="skip-btn" type="button" data-choice="${SKIP_CHOICE}" onclick="choose(${player}, '${SKIP_CHOICE}')">
          Use Skip (${skipCount})
        </button>
      ` : ''}
    </div>
  `;
}

function choiceLabel(choice, q) {
  if (choice === 'A') return q.a;
  if (choice === 'B') return q.b;
  if (choice === SKIP_CHOICE) return 'used a skip';
  return 'waiting...';
}

function describeRoundChoices(q) {
  const c1 = state.currentChoices[PLAYER_ONE];
  const c2 = state.currentChoices[PLAYER_TWO];

  if (c1 === SKIP_CHOICE && c2 === SKIP_CHOICE) {
    return 'Both players burned a skip. No one wanted that question.';
  }
  if (c1 === SKIP_CHOICE || c2 === SKIP_CHOICE) {
    const skipper = c1 === SKIP_CHOICE ? state.p1 : state.p2;
    return `${skipper} skipped the question. Score the round based on who handled the chaos better.`;
  }
  if (c1 === c2) {
    return 'Both players picked the same side. Award the point for the better explanation, honesty, or commitment.';
  }
  return 'Different choices locked in. Debate the split and award the point to the better case.';
}

function getEffectNotices() {
  const notes = [];
  if (state.effects.pointMultiplierRounds > 0) {
    notes.push(`Chaos Multiplier active: wins are worth 2 points for ${state.effects.pointMultiplierRounds} more round${state.effects.pointMultiplierRounds === 1 ? '' : 's'}.`);
  }
  if (state.effects.rocketRounds > 0) {
    notes.push(`Rocket Round active: answer fast for ${state.effects.rocketRounds} more round${state.effects.rocketRounds === 1 ? '' : 's'}.`);
  }
  if (state.effects.roleReversalRounds > 0) {
    notes.push(`Role Reversal active for ${state.effects.roleReversalRounds} more round${state.effects.roleReversalRounds === 1 ? '' : 's'}.`);
  }
  if (state.effects.debateShowdownRounds > 0) {
    notes.push(`Debate Showdown active: make this round a timed face-off.`);
  }
  if (state.effects.chaosBomb) {
    notes.push('Chaos Bomb active: the next punishment hits both players.');
  }
  return notes;
}

function decrementRoundEffects() {
  if (state.effects.pointMultiplierRounds > 0) state.effects.pointMultiplierRounds--;
  if (state.effects.rocketRounds > 0) state.effects.rocketRounds--;
  if (state.effects.roleReversalRounds > 0) state.effects.roleReversalRounds--;
  if (state.effects.debateShowdownRounds > 0) state.effects.debateShowdownRounds--;
}

function resolveDoubleOrNothing(winner) {
  [PLAYER_ONE, PLAYER_TWO].forEach((player) => {
    if (!state.effects.doubleOrNothing[player]) return;
    if (winner && winner !== player) {
      addPoints(player, -1);
      showToast(`${getPlayerName(player)} lost their Double or Nothing bonus.`);
      logChaos(`${getPlayerName(player)} lost 1 point from Double or Nothing.`, state.round);
    }
    state.effects.doubleOrNothing[player] = false;
  });
}

function applyRoundBasePoints(player) {
  if (!player) return 0;
  const base = state.effects.pointMultiplierRounds > 0 ? 2 : 1;
  addPoints(player, base);
  return base;
}

function pulseScoreCard(player) {
  const id = player === PLAYER_ONE ? 'scoreCard1' : 'scoreCard2';
  const el = document.getElementById(id);
  el.classList.add('score-pulse');
  setTimeout(() => el.classList.remove('score-pulse'), 700);
}

function getRoundCardType(question) {
  const rng = Math.random();
  if (question._cat === 'naughty' || question._cat === 'horny') return 'naughty';
  if (question._cat === 'deep') return 'deep';
  if (rng > 0.82) return 'bonus';
  if (rng > 0.68) return 'punishment';
  return 'normal';
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function renderChoicePanel(player) {
  const choice = state.currentChoices[player];
  const waiting = choice === null;
  const revealed = state.currentChoices[PLAYER_ONE] && state.currentChoices[PLAYER_TWO];
  const label = waiting
    ? 'Waiting for lock-in'
    : revealed
      ? `Picked: ${choiceLabel(choice, state.currentQ)}`
      : 'Choice locked in';

  return `
    <div class="pick-panel ${waiting ? '' : 'locked'}" id="pick-panel-${player}">
      <div class="pick-head">
        <div class="pick-player">${escapeHtml(getPlayerName(player))}</div>
        <div class="pick-status">${escapeHtml(label)}</div>
      </div>
      ${createPlayerPickButtons(player, state.currentQ)}
    </div>
  `;
}

function syncChoiceButtons() {
  [PLAYER_ONE, PLAYER_TWO].forEach((player) => {
    const panel = document.getElementById(`pick-panel-${player}`);
    if (!panel) return;

    const choice = state.currentChoices[player];
    const revealed = state.currentChoices[PLAYER_ONE] && state.currentChoices[PLAYER_TWO];
    const status = panel.querySelector('.pick-status');
    status.textContent = choice === null
      ? 'Waiting for lock-in'
      : revealed
        ? `Picked: ${choiceLabel(choice, state.currentQ)}`
        : 'Choice locked in';

    panel.classList.toggle('locked', choice !== null);

    panel.querySelectorAll('button[data-choice]').forEach((button) => {
      const buttonChoice = button.dataset.choice;
      button.disabled = choice !== null;
      button.classList.toggle('is-selected', choice === buttonChoice);
    });
  });
}

const CAT_EMOJIS = {
  couple: '💑',
  spicy: '🌶️',
  silly: '🤪',
  deep: '💭',
  chaos: '💥',
  dare: '🎯',
  naughty: '🔥',
  horny: '😈',
};

const BANNER_LABELS = {
  normal: '🎲 Would You Rather',
  bonus: '✦ Bonus Card Round',
  punishment: '💀 Punishment Round',
  naughty: '🔞 After Dark',
  deep: '💭 Deep Cut',
};

const CARD_EMOJIS = ['🤔', '😱', '🫣', '💭', '🎲', '🔥', '⚡', '💥', '🌀', '🎭', '😬', '🥴', '🫶', '👀', '🤯', '🧨'];

function confirmAge() {
  state.ageConfirmed = true;
  state.safeMode = false;
  state.selectedCats = sanitizeSelectedCategories(state.selectedCats.length ? state.selectedCats : DEFAULT_CATEGORIES);
  syncContentModePill();
  syncCategoryUI();
  persistSettings();
  showScreen('screen-title');
}

function denyAge() {
  state.ageConfirmed = false;
  applySafeMode(true);
  showScreen('screen-title');
  showToast('Safe mode enabled. Adult categories were removed.');
}

function toggleCat(btn) {
  if (btn.disabled) return;
  btn.classList.toggle('selected');
  const cat = btn.dataset.cat;
  if (btn.classList.contains('selected')) {
    if (!state.selectedCats.includes(cat)) state.selectedCats.push(cat);
  } else {
    state.selectedCats = state.selectedCats.filter((value) => value !== cat);
  }
  persistSettings();
}

function selectRounds(btn) {
  document.querySelectorAll('[data-rounds]').forEach((node) => node.classList.remove('selected'));
  btn.classList.add('selected');
  state.totalRounds = Number.parseInt(btn.dataset.rounds, 10);
  persistSettings();
}

function setCategoryPreset(preset) {
  if (preset === 'safe') {
    applySafeMode(true);
    state.selectedCats = [...SAFE_CATEGORIES];
  } else if (preset === 'all') {
    if (!state.safeMode) {
      state.selectedCats = [...DEFAULT_CATEGORIES];
    } else {
      state.selectedCats = [...SAFE_CATEGORIES];
      showToast('All available safe categories selected.');
    }
  } else {
    state.selectedCats = state.safeMode
      ? [...SAFE_CATEGORIES]
      : ['couple', 'spicy', 'silly', 'deep', 'chaos', 'dare', 'naughty'];
  }

  syncCategoryUI();
  persistSettings();
}

function buildPool() {
  let pool = [];
  state.selectedCats.forEach((cat) => {
    if (ALL_QUESTIONS[cat]) {
      pool = pool.concat(ALL_QUESTIONS[cat].map((question) => ({ ...question, _cat: cat })));
    }
  });
  return shuffle(pool);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resetRunState() {
  state.score1 = 0;
  state.score2 = 0;
  state.round = 0;
  state.currentQ = null;
  state.currentCardType = 'normal';
  state.currentChoices = { 1: null, 2: null };
  state.currentRoundResolved = false;
  state.pendingBonusCard = null;
  state.wheelUsedThisRound = false;
  state.selectedWheelPlayer = PLAYER_ONE;
  state.chaosLog = [];
  state.statsRoundsPlayed = 0;
  state.statsBonusCards = 0;
  state.statsPunishments = 0;
  state.rerollUsedThisRound = false;
  state.effects = createEffectState();
}

function startGame() {
  const p1v = document.getElementById('p1name').value.trim();
  const p2v = document.getElementById('p2name').value.trim();

  if (!p1v) return showToast('Enter Player 1 name.');
  if (!p2v) return showToast('Enter Player 2 name.');
  if (state.selectedCats.length === 0) return showToast('Pick at least one category.');

  state.p1 = p1v;
  state.p2 = p2v;
  resetRunState();
  state.questions = buildPool();
  persistSettings();

  document.getElementById('hdr-p1').textContent = state.p1;
  document.getElementById('hdr-p2').textContent = state.p2;
  document.getElementById('total-rounds').textContent = String(state.totalRounds);

  showScreen('screen-game');
  nextRound();
}

function nextRound() {
  if (state.round >= state.totalRounds) {
    endGame();
    return;
  }

  state.round++;
  state.statsRoundsPlayed = state.round;
  state.currentRoundResolved = false;
  state.currentChoices = { 1: null, 2: null };
  state.pendingBonusCard = null;
  state.wheelUsedThisRound = false;
  state.selectedWheelPlayer = PLAYER_ONE;
  state.rerollUsedThisRound = false;

  updateHeader();

  state.currentQ = state.questions[(state.round - 1) % state.questions.length];
  state.currentCardType = getRoundCardType(state.currentQ);
  renderRound(state.currentQ, state.currentCardType);
}

function updateHeader() {
  document.getElementById('score-p1').textContent = String(state.score1);
  document.getElementById('score-p2').textContent = String(state.score2);
  document.getElementById('cur-round').textContent = String(Math.min(state.round || 1, state.totalRounds));
  const pct = state.totalRounds === 0 ? 0 : Math.min(100, ((Math.max(state.round, 1) - 1) / state.totalRounds) * 100);
  document.getElementById('progress-fill').style.width = `${pct}%`;
}

function renderRound(question, cardType) {
  const gc = document.getElementById('gameContent');
  const emoji = getRandomItem(CARD_EMOJIS);
  const bannerClass = `banner-${cardType}`;
  const notices = getEffectNotices();

  gc.innerHTML = `
    <div class="card-type-banner ${bannerClass}">${BANNER_LABELS[cardType] || BANNER_LABELS.normal}</div>
    ${notices.length ? `
      <div class="effect-notices">
        ${notices.map((notice) => `<div class="effect-note">${escapeHtml(notice)}</div>`).join('')}
      </div>
    ` : ''}
    <div class="round-tools">
      <div class="round-helper">Both players lock in privately. Reveal happens only after both choices are set.</div>
      <button class="round-tool-btn" type="button" onclick="rerollCurrentQuestion()" ${state.rerollUsedThisRound ? 'disabled' : ''}>New Question</button>
    </div>
    <div class="wyr-card" id="wyrCard">
      <div class="question-area">
        <span class="q-round-tag">Round ${state.round} of ${state.totalRounds} · ${(CAT_EMOJIS[question._cat] || '🎲')} ${question._cat.toUpperCase()}</span>
        <span class="q-emoji">${emoji}</span>
        <p class="q-text">${question.q}...</p>
      </div>
      <div class="choice-grid">
        ${renderChoicePanel(PLAYER_ONE)}
        ${renderChoicePanel(PLAYER_TWO)}
      </div>
    </div>
    <div id="resultArea"></div>
  `;

  syncChoiceButtons();
  updateWheelSelectorUI();
}

function rerollCurrentQuestion() {
  if (state.rerollUsedThisRound) {
    showToast('You already used the reroll for this round.');
    return;
  }
  if (state.currentChoices[PLAYER_ONE] || state.currentChoices[PLAYER_TWO]) {
    showToast('Reroll before anyone locks in.');
    return;
  }
  if (state.questions.length < 2) {
    showToast('There is no alternate question available.');
    return;
  }

  let nextQuestion = state.currentQ;
  let guard = 0;
  while (nextQuestion === state.currentQ && guard < 20) {
    nextQuestion = getRandomItem(state.questions);
    guard++;
  }

  if (nextQuestion === state.currentQ) {
    showToast('Could not find a different question.');
    return;
  }

  state.currentQ = nextQuestion;
  state.rerollUsedThisRound = true;
  renderRound(state.currentQ, state.currentCardType);
  showToast('Question rerolled.');
}

function choose(player, side) {
  if (state.currentRoundResolved || state.currentChoices[player] !== null) return;

  if (side === SKIP_CHOICE) {
    if (state.effects.skips[player] <= 0) {
      showToast(`${getPlayerName(player)} has no skips left.`);
      return;
    }
    state.effects.skips[player]--;
  }

  state.currentChoices[player] = side;
  syncChoiceButtons();

  if (state.currentChoices[PLAYER_ONE] && state.currentChoices[PLAYER_TWO]) {
    showResultArea();
  } else {
    showToast(`${getPlayerName(player)} locked in.`);
  }
}

function showResultArea() {
  const question = state.currentQ;
  const punishment = getRandomItem(PUNISHMENTS);
  const punishmentText = escapeJsSingleQuoted(punishment.txt);
  const punishmentIcon = escapeJsSingleQuoted(punishment.icon);
  const resultArea = document.getElementById('resultArea');
  const c1 = state.currentChoices[PLAYER_ONE];
  const c2 = state.currentChoices[PLAYER_TWO];

  let html = `
    <div class="result-area">
      <div class="result-card">
        <div class="rc-title">💬 Lock-ins Revealed</div>
        <div class="choice-summary">
          <div class="choice-summary-row">
            <span class="choice-name">${escapeHtml(state.p1)}</span>
            <span class="choice-value">${escapeHtml(choiceLabel(c1, question))}</span>
          </div>
          <div class="choice-summary-row">
            <span class="choice-name">${escapeHtml(state.p2)}</span>
            <span class="choice-value">${escapeHtml(choiceLabel(c2, question))}</span>
          </div>
        </div>
        <div class="rc-body">${escapeHtml(describeRoundChoices(question))}</div>
      </div>
  `;

  if (state.currentCardType === 'punishment') {
    html += `
      <div class="result-card punish-card">
        <div class="rc-title" style="color:var(--purple);">${punishment.icon} Punishment</div>
        <div class="rc-body">${escapeHtml(punishment.txt)}</div>
        <div class="punish-assign-row">
          <button class="mini-action-btn punish-action" type="button" onclick="triggerPunishment(${PLAYER_ONE}, '${punishmentText}', '${punishmentIcon}')">
            Assign to ${escapeHtml(state.p1)}
          </button>
          <button class="mini-action-btn punish-action" type="button" onclick="triggerPunishment(${PLAYER_TWO}, '${punishmentText}', '${punishmentIcon}')">
            Assign to ${escapeHtml(state.p2)}
          </button>
        </div>
      </div>
    `;
  }

  if (state.currentCardType === 'bonus') {
    html += `
      <div class="result-card bonus-hint">
        <div class="rc-title" style="color:var(--gold);">🃏 Bonus Effect</div>
        <div class="rc-body">${state.pendingBonusCard ? escapeHtml(`${state.pendingBonusCard.name}: ${state.pendingBonusCard.desc}`) : 'Reveal the bonus card, then award the round. The winner receives the effect unless the card says otherwise.'}</div>
        <button class="btn-reveal-bonus" type="button" onclick="revealBonus()">${state.pendingBonusCard ? 'View Revealed Bonus Card' : 'Reveal Bonus Card'}</button>
      </div>
    `;
  }

  if (state.currentCardType === 'naughty') {
    html += `
      <div class="result-card naughty-reveal">
        <div class="rc-title" style="color:var(--pink);">🔥 After Dark Rule</div>
        <div class="rc-body">Give the point to the answer that felt more honest, bolder, or harder to admit.</div>
      </div>
    `;
  }

  html += `
      <div class="award-row">
        <button class="award-btn award-p1" type="button" onclick="awardPoint(${PLAYER_ONE})">🏅 ${escapeHtml(state.p1)} wins</button>
        <button class="award-btn award-p2" type="button" onclick="awardPoint(${PLAYER_TWO})">🏅 ${escapeHtml(state.p2)} wins</button>
        <button class="award-btn award-tie" type="button" onclick="awardPoint(0)">🤝 Tie</button>
      </div>
    </div>
  `;

  resultArea.innerHTML = html;
}

function revealBonus() {
  if (!state.pendingBonusCard) {
    state.pendingBonusCard = getRandomItem(BONUS_CARDS);
    state.statsBonusCards++;
    logChaos(`Bonus Card: ${state.pendingBonusCard.name} - ${normalizeText(state.pendingBonusCard.desc, 60)}`);
  }

  document.getElementById('bonusIcon').textContent = state.pendingBonusCard.icon;
  document.getElementById('bonusName').textContent = state.pendingBonusCard.name;
  document.getElementById('bonusDesc').textContent = state.pendingBonusCard.desc;
  document.getElementById('bonusOverlay').classList.add('show');
  showResultArea();
}

function closeBonusCard() {
  document.getElementById('bonusOverlay').classList.remove('show');
}

function triggerPunishment(player, txt, icon) {
  const target = Number(player);
  const players = state.effects.chaosBomb ? [PLAYER_ONE, PLAYER_TWO] : [target];

  if (state.effects.chaosBomb) {
    state.effects.chaosBomb = false;
    logChaos('Chaos Bomb triggered: both players took the punishment.');
  }

  const blockedPlayers = [];
  const activePlayers = [];

  players.forEach((currentPlayer) => {
    if (state.effects.immunity[currentPlayer] > 0) {
      state.effects.immunity[currentPlayer]--;
      blockedPlayers.push(getPlayerName(currentPlayer));
      logChaos(`${getPlayerName(currentPlayer)} blocked a punishment with Immunity Crown.`);
    } else {
      activePlayers.push(getPlayerName(currentPlayer));
    }
  });

  if (blockedPlayers.length && !activePlayers.length) {
    showToast(`${blockedPlayers.join(' and ')} blocked the punishment.`);
    return;
  }

  state.statsPunishments++;
  logChaos(`Punishment: ${normalizeText(txt)}`);

  document.getElementById('punishIcon').textContent = icon;
  document.getElementById('punishPlayer').textContent = activePlayers.join(' + ');
  document.getElementById('punishText').textContent = txt;

  const bar = document.getElementById('punishTimerFill');
  bar.style.transition = 'none';
  bar.style.width = '100%';
  setTimeout(() => {
    bar.style.transition = 'width 30s linear';
    bar.style.width = '0%';
  }, 50);

  document.getElementById('punishOverlay').classList.add('show');
}

function closePunishment() {
  document.getElementById('punishOverlay').classList.remove('show');
}

function applyBonusCardToWinner(player) {
  if (!state.pendingBonusCard || !player) return;

  const card = state.pendingBonusCard;
  const opponent = otherPlayer(player);
  let summary = `${getPlayerName(player)} claimed ${card.name}.`;

  switch (card.name) {
    case 'DOUBLE OR NOTHING':
      addPoints(player, 1);
      state.effects.doubleOrNothing[player] = true;
      summary = `${getPlayerName(player)} gained +1 now and put Double or Nothing at risk for the next round.`;
      break;
    case 'ROLE REVERSAL':
      state.effects.roleReversalRounds = 3;
      summary = 'Role Reversal is active for the next 3 rounds.';
      break;
    case 'IMMUNITY CROWN':
      state.effects.immunity[player]++;
      summary = `${getPlayerName(player)} gained punishment immunity.`;
      break;
    case 'STEAL A POINT':
      if (getPlayerScore(opponent) > 0) addPoints(opponent, -1);
      addPoints(player, 1);
      summary = `${getPlayerName(player)} stole 1 point from ${getPlayerName(opponent)}.`;
      break;
    case 'LUCKY SKIP':
      state.effects.skips[player]++;
      summary = `${getPlayerName(player)} banked a skip token.`;
      break;
    case 'CHAOS MULTIPLIER':
      state.effects.pointMultiplierRounds = Math.max(state.effects.pointMultiplierRounds, 2);
      summary = 'Chaos Multiplier is active for the next 2 rounds.';
      break;
    case 'SECRET KEEPER':
      summary = 'Secret Keeper revealed. Both players should share one secret before the next round.';
      break;
    case 'DEBATE SHOWDOWN':
      state.effects.debateShowdownRounds = 1;
      summary = 'Debate Showdown is active for the next round.';
      break;
    case 'WILD CARD':
      summary = 'Wild Card revealed. Create one temporary rule together for the next 2 rounds.';
      break;
    case 'GIFT OF CHAOS':
      summary = `${getPlayerName(player)} forced a punishment onto ${getPlayerName(opponent)}.`;
      triggerPunishment(opponent, getRandomItem(PUNISHMENTS).txt, '🃏');
      break;
    case 'ROCKET ROUND':
      state.effects.rocketRounds = Math.max(state.effects.rocketRounds, 3);
      summary = 'Rocket Round is active for the next 3 rounds.';
      break;
    case 'SWAP SCORES': {
      const score1 = state.score1;
      state.score1 = state.score2;
      state.score2 = score1;
      summary = 'Scores were swapped.';
      break;
    }
    case 'FORGIVENESS CARD':
      state.effects.immunity[player]++;
      summary = `${getPlayerName(player)} turned Forgiveness Card into a fresh immunity charge.`;
      break;
    case 'CHAOS BOMB':
      state.effects.chaosBomb = true;
      summary = 'Chaos Bomb primed the next punishment to hit both players.';
      break;
    default:
      break;
  }

  state.pendingBonusCard = null;
  updateHeader();
  logChaos(summary);
  showToast(summary);
}

function awardPoint(player) {
  if (state.currentRoundResolved) return;
  state.currentRoundResolved = true;

  resolveDoubleOrNothing(player);

  let toast = 'Round tied. No points awarded.';
  if (player === PLAYER_ONE || player === PLAYER_TWO) {
    const basePoints = applyRoundBasePoints(player);
    applyBonusCardToWinner(player);
    pulseScoreCard(player);
    toast = `${getPlayerName(player)} takes the round${basePoints > 1 ? ` for ${basePoints} points` : ''}.`;
  } else if (state.pendingBonusCard) {
    logChaos(`Bonus Card ${state.pendingBonusCard.name} expired on a tied round.`);
    state.pendingBonusCard = null;
  }

  updateHeader();
  showToast(toast);
  decrementRoundEffects();

  setTimeout(() => {
    if (state.round >= state.totalRounds) endGame();
    else nextRound();
  }, 650);
}

function endGame() {
  document.getElementById('progress-fill').style.width = '100%';
  showScreen('screen-end');
  saveToHistory(state.p1, state.score1, state.p2, state.score2);
  launchConfetti();

  let winner = null;
  let trophy = '🤝';
  if (state.score1 > state.score2) {
    winner = state.p1;
    trophy = '🏆';
  } else if (state.score2 > state.score1) {
    winner = state.p2;
    trophy = '🏆';
  }

  document.getElementById('end-trophy').textContent = trophy;
  document.getElementById('end-title').textContent = winner ? `${winner.toUpperCase()} WINS!` : "IT'S A TIE!";
  document.getElementById('end-sub').textContent = winner
    ? `${winner} came out on top after ${state.totalRounds} rounds of chaos.`
    : 'Dead even. Nobody flinched.';

  document.getElementById('final-scores').innerHTML = `
    <div class="fsc fsc-p1 ${state.score1 > state.score2 ? 'winner' : ''}">
      ${state.score1 > state.score2 ? '<span class="win-badge">👑 WINNER</span>' : ''}
      <div class="pl-name">${escapeHtml(state.p1)}</div>
      <div class="big-sc">${state.score1}</div>
      <div class="sc-label">points</div>
    </div>
    <div class="fsc fsc-p2 ${state.score2 > state.score1 ? 'winner' : ''}">
      ${state.score2 > state.score1 ? '<span class="win-badge">👑 WINNER</span>' : ''}
      <div class="pl-name">${escapeHtml(state.p2)}</div>
      <div class="big-sc">${state.score2}</div>
      <div class="sc-label">points</div>
    </div>
  `;

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-tile"><div class="stat-num">${state.statsRoundsPlayed}</div><div class="stat-label">Rounds Played</div></div>
    <div class="stat-tile"><div class="stat-num">${state.statsBonusCards}</div><div class="stat-label">Bonus Cards</div></div>
    <div class="stat-tile"><div class="stat-num">${state.statsPunishments}</div><div class="stat-label">Punishments</div></div>
  `;

  const logEl = document.getElementById('chaos-log-items');
  if (state.chaosLog.length === 0) {
    logEl.innerHTML = '<div class="log-item"><span>😇</span><span>No chaos events were recorded.</span></div>';
  } else {
    logEl.innerHTML = state.chaosLog.map((entry) => (
      `<div class="log-item"><span>💥</span><span><strong>R${entry.round}:</strong> ${escapeHtml(entry.text)}</span></div>`
    )).join('');
  }
}

function openLeaderboard() {
  const history = loadHistory();
  const el = document.getElementById('lb-entries');

  if (history.length === 0) {
    el.innerHTML = '<div class="lb-empty">No game history yet.</div>';
  } else {
    const wins = {};
    history.forEach((entry) => {
      const winner = entry.s1 > entry.s2 ? entry.p1 : entry.s2 > entry.s1 ? entry.p2 : null;
      if (winner) wins[winner] = (wins[winner] || 0) + 1;
    });

    const sorted = Object.entries(wins)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5);

    const rankLabels = ['gold', 'silver', 'bronze', '', ''];
    el.innerHTML = sorted.length === 0
      ? '<div class="lb-empty">Every recorded match is a tie so far.</div>'
      : sorted.map(([name, total], index) => `
          <div class="lb-row">
            <div class="lb-rank ${rankLabels[index]}">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</div>
            <div class="lb-name">${escapeHtml(name)}</div>
            <div class="lb-score">${total} win${total === 1 ? '' : 's'}</div>
          </div>
        `).join('');
  }

  document.getElementById('leaderboardOverlay').classList.add('show');
}

function closeLeaderboard() {
  document.getElementById('leaderboardOverlay').classList.remove('show');
}

function setWheelPlayer(player) {
  state.selectedWheelPlayer = Number(player) === PLAYER_TWO ? PLAYER_TWO : PLAYER_ONE;
  updateWheelSelectorUI();
}

function updateWheelSelectorUI() {
  const p1Btn = document.getElementById('wheel-player-1');
  const p2Btn = document.getElementById('wheel-player-2');
  if (!p1Btn || !p2Btn) return;

  p1Btn.textContent = state.p1;
  p2Btn.textContent = state.p2;
  p1Btn.classList.toggle('selected', state.selectedWheelPlayer === PLAYER_ONE);
  p2Btn.classList.toggle('selected', state.selectedWheelPlayer === PLAYER_TWO);
}

function applyWheelResult(result, player) {
  const actor = Number(player) === PLAYER_TWO ? PLAYER_TWO : PLAYER_ONE;
  const targetName = getPlayerName(actor);

  switch (result.label) {
    case '+2 pts!':
      addPoints(actor, 2);
      showToast(`${targetName} gained 2 points from the wheel.`);
      break;
    case '-1 pt!':
      addPoints(actor, -1);
      showToast(`${targetName} lost 1 point from the wheel.`);
      break;
    case 'Truth!':
    case 'Confess!':
    case 'Dance!':
    case 'Roast!':
    case 'Dare!':
    case 'Swap!':
    case 'Song!':
    case 'Kiss!':
      showToast(`Wheel challenge assigned to ${targetName}.`);
      break;
    default:
      break;
  }

  updateHeader();
  logChaos(`Wheel -> ${result.label}: ${normalizeText(result.punishment, 60)}`);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function launchConfetti() {
  const colors = ['#FF2D55', '#0A84FF', '#FFD60A', '#30D158', '#BF5AF2', '#FF9F0A', '#FF6B9D', '#5AC8FA'];
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'confetti-p';
      const size = Math.random() * 12 + 6;
      particle.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${Math.random() * 100}%;
        top:-20px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration:${1.5 + Math.random() * 2.5}s;
        animation-delay:${Math.random() * 0.8}s;
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 5000);
    }, i * 30);
  }
}

(function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#FF2D55', '#0A84FF', '#FFD60A', '#30D158', '#BF5AF2', '#FF9F0A', '#FF6B9D'];
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = 2 + Math.random() * 5;
    particle.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${15 + Math.random() * 20}s;
      animation-delay:${Math.random() * 20}s;
    `;
    container.appendChild(particle);
  }
})();

(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  document.addEventListener('mousemove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
  document.addEventListener('mousedown', () => {
    glow.style.width = '44px';
    glow.style.height = '44px';
  });
  document.addEventListener('mouseup', () => {
    glow.style.width = '28px';
    glow.style.height = '28px';
  });
})();

(function initInteractions() {
  hydrateSetupFromSettings();

  const p1Input = document.getElementById('p1name');
  const p2Input = document.getElementById('p2name');

  [p1Input, p2Input].forEach((input, index) => {
    input.addEventListener('input', () => {
      const value = input.value.trim();
      if (index === 0) state.p1 = value || 'Player 1';
      else state.p2 = value || 'Player 2';
      persistSettings();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSpinner();
      closeBonusCard();
      closeLeaderboard();
      closePunishment();
      return;
    }

    if (event.key === 'Enter' && document.getElementById('screen-title').classList.contains('active')) {
      const activeTag = document.activeElement?.tagName;
      if (activeTag !== 'BUTTON' && activeTag !== 'TEXTAREA') startGame();
    }
  });
})();

drawWheel(0);
