/* ============================================================
   game.js — core game logic for Would You Rather: Chaos Edition
   ============================================================ */

// ── State ────────────────────────────────────────────────────
const state = {
  p1: 'Player 1', p2: 'Player 2',
  score1: 0, score2: 0,
  round: 0, totalRounds: 10,
  questions: [],
  currentQ: null,
  answered: false,
  chaosLog: [],
  selectedCats: ['couple','spicy','silly','deep','chaos','dare','naughty','horny'],
  statsRoundsPlayed: 0,
  statsBonusCards: 0,
  statsPunishments: 0,
  ageConfirmed: false,
};

// ── Age Gate ────────────────────────────────────────────────
function confirmAge() {
  state.ageConfirmed = true;
  showScreen('screen-title');
}
function denyAge() {
  document.getElementById('screen-agegate').innerHTML = `
    <div style="text-align:center;padding:60px 20px;">
      <div style="font-size:64px;margin-bottom:20px;">🧒</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:3px;margin-bottom:16px;">COME BACK LATER!</div>
      <p style="font-size:16px;font-weight:700;color:var(--muted);">This game is for adults only. Go play outside.</p>
    </div>
  `;
}

// ── Category & Rounds selection ──────────────────────────────
function toggleCat(btn) {
  btn.classList.toggle('selected');
  const cat = btn.dataset.cat;
  if (btn.classList.contains('selected')) {
    if (!state.selectedCats.includes(cat)) state.selectedCats.push(cat);
  } else {
    state.selectedCats = state.selectedCats.filter(c => c !== cat);
  }
}
function selectRounds(btn) {
  document.querySelectorAll('[data-rounds]').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.totalRounds = parseInt(btn.dataset.rounds);
}

// ── Question pool ────────────────────────────────────────────
function buildPool() {
  let pool = [];
  state.selectedCats.forEach(cat => {
    if (ALL_QUESTIONS[cat]) pool = pool.concat(ALL_QUESTIONS[cat].map(q => ({ ...q, _cat: cat })));
  });
  shuffle(pool);
  return pool;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Start Game ───────────────────────────────────────────────
function startGame() {
  const p1v = document.getElementById('p1name').value.trim();
  const p2v = document.getElementById('p2name').value.trim();
  if (!p1v) { showToast('Enter Player 1 name! 😅'); return; }
  if (!p2v) { showToast('Enter Player 2 name! 😅'); return; }
  if (state.selectedCats.length === 0) { showToast('Pick at least one category! 🎲'); return; }

  state.p1 = p1v; state.p2 = p2v;
  state.score1 = 0; state.score2 = 0;
  state.round = 0;
  state.chaosLog = [];
  state.statsBonusCards = 0;
  state.statsPunishments = 0;
  state.questions = buildPool();

  document.getElementById('hdr-p1').textContent = state.p1;
  document.getElementById('hdr-p2').textContent = state.p2;
  document.getElementById('total-rounds').textContent = state.totalRounds;

  showScreen('screen-game');
  nextRound();
}

// ── Round flow ───────────────────────────────────────────────
function nextRound() {
  state.round++;
  if (state.round > state.totalRounds) { endGame(); return; }

  updateHeader();
  state.answered = false;

  const q = state.questions[(state.round - 1) % state.questions.length];
  state.currentQ = q;

  // Determine card type
  const rng = Math.random();
  let cardType = 'normal';
  if (rng > 0.82)       cardType = 'bonus';
  else if (rng > 0.68)  cardType = 'punishment';

  // Naughty categories get their own banner
  if (q._cat === 'naughty' || q._cat === 'horny') cardType = 'naughty';

  renderRound(q, cardType);
}

function updateHeader() {
  document.getElementById('score-p1').textContent = state.score1;
  document.getElementById('score-p2').textContent = state.score2;
  document.getElementById('cur-round').textContent = state.round;
  const pct = Math.max(0, ((state.round - 1) / state.totalRounds) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
}

// ── Render ───────────────────────────────────────────────────
const CAT_EMOJIS = { couple:'💑', spicy:'🌶️', silly:'🤪', deep:'💭', chaos:'💥', dare:'🎯', naughty:'🔥', horny:'😈' };
const BANNER_LABELS = {
  normal:     '🎲 Would You Rather',
  bonus:      '✦ Bonus Card Available',
  punishment: '💀 Punishment Round',
  naughty:    '🔞 After Dark',
  deep:       '💭 Deep Cut',
};
const CARD_EMOJIS = ['🤔','😱','🫣','💭','🎲','🔥','⚡','💥','🌀','🎭','😬','🥴','🫶','👀','🤯','🧨'];

function renderRound(q, cardType) {
  const gc = document.getElementById('gameContent');
  const emoji = CARD_EMOJIS[Math.floor(Math.random() * CARD_EMOJIS.length)];
  const bannerClass = `banner-${cardType === 'deep' ? 'deep' : cardType}`;
  const bannerTxt = BANNER_LABELS[cardType] || '🎲 Would You Rather';

  gc.innerHTML = `
    <div class="card-type-banner ${bannerClass}">${bannerTxt}</div>
    <div class="wyr-card" id="wyrCard">
      <div class="question-area">
        <span class="q-round-tag">Round ${state.round} of ${state.totalRounds} · ${(CAT_EMOJIS[q._cat] || '🎲')} ${q._cat ? q._cat.toUpperCase() : ''}</span>
        <span class="q-emoji">${emoji}</span>
        <p class="q-text">${q.q}…</p>
      </div>
      <div class="options-wrap">
        <button class="opt-btn opt-a" id="optA" onclick="choose('A','${cardType}')">
          <div class="opt-icon-big">${q.ea}</div>
          <div class="opt-side-label">OPTION A</div>
          <div class="opt-text">${q.a}</div>
        </button>
        <div class="or-col"><div class="or-circle">OR</div></div>
        <button class="opt-btn opt-b" id="optB" onclick="choose('B','${cardType}')">
          <div class="opt-icon-big">${q.eb}</div>
          <div class="opt-side-label">OPTION B</div>
          <div class="opt-text">${q.b}</div>
        </button>
      </div>
    </div>
    <div id="resultArea"></div>
  `;
}

// ── Choice ───────────────────────────────────────────────────
function choose(side, cardType) {
  if (state.answered) return;
  state.answered = true;

  const optA = document.getElementById('optA');
  const optB = document.getElementById('optB');
  if (side === 'A') { optA.classList.add('chosen-a'); }
  else              { optB.classList.add('chosen-b'); }
  optA.onclick = null; optB.onclick = null;

  showResultArea(side, cardType);
}

function showResultArea(side, cardType) {
  const ra = document.getElementById('resultArea');
  const punishment = PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];
  let html = `<div class="result-area">`;

  // Discussion prompt
  html += `
    <div class="result-card">
      <div class="rc-title">💬 Discuss &amp; Decide!</div>
      <div class="rc-body">Both players reveal their choice and argue their case. The most convincing argument wins the point — you decide together who takes it!</div>
    </div>`;

  // Punishment card
  if (cardType === 'punishment') {
    state.statsPunishments++;
    state.chaosLog.push({ round: state.round, text: `Punishment: ${punishment.txt.substring(0,70)}…` });
    html += `
      <div class="result-card punish-card">
        <div class="rc-title" style="color:var(--purple);">${punishment.icon} Punishment!</div>
        <div class="rc-body">Whoever had the <strong>least convincing argument</strong> must: <strong>${punishment.txt}</strong></div>
        <button style="margin-top:12px;background:rgba(191,90,242,.15);border:1px solid rgba(191,90,242,.3);border-radius:10px;padding:8px 20px;color:var(--purple);font-family:Nunito,sans-serif;font-size:13px;font-weight:800;cursor:pointer;" onclick="triggerPunishment('${state.p1}', \`${punishment.txt.replace(/`/g,"'")}\`, '${punishment.icon}')">
          Assign to ${state.p1}
        </button>
        <button style="margin-left:8px;margin-top:12px;background:rgba(191,90,242,.15);border:1px solid rgba(191,90,242,.3);border-radius:10px;padding:8px 20px;color:var(--purple);font-family:Nunito,sans-serif;font-size:13px;font-weight:800;cursor:pointer;" onclick="triggerPunishment('${state.p2}', \`${punishment.txt.replace(/`/g,"'")}\`, '${punishment.icon}')">
          Assign to ${state.p2}
        </button>
      </div>`;
  }

  // Bonus hint
  if (cardType === 'bonus') {
    state.statsBonusCards++;
    html += `
      <div class="result-card bonus-hint">
        <button class="btn-reveal-bonus" onclick="revealBonus()">🃏 Reveal Your Secret Bonus Card</button>
      </div>`;
  }

  // Naughty tip
  if (cardType === 'naughty') {
    html += `
      <div class="result-card naughty-reveal">
        <div class="rc-title" style="color:var(--pink);">🔥 After Dark Rules</div>
        <div class="rc-body">The player whose answer is deemed <strong>most honest</strong> wins the point. No dodging, no deflecting — the bolder answer takes it.</div>
      </div>`;
  }

  // Award buttons
  html += `
    <div class="award-row">
      <button class="award-btn award-p1" onclick="awardPoint(1)">🏅 ${state.p1} wins</button>
      <button class="award-btn award-p2" onclick="awardPoint(2)">🏅 ${state.p2} wins</button>
      <button class="award-btn award-tie" onclick="awardPoint(0)">🤝 Tie — Next</button>
    </div>`;

  html += `</div>`;
  ra.innerHTML = html;
}

// ── Bonus Card ───────────────────────────────────────────────
function revealBonus() {
  const card = BONUS_CARDS[Math.floor(Math.random() * BONUS_CARDS.length)];
  document.getElementById('bonusIcon').textContent = card.icon;
  document.getElementById('bonusName').textContent = card.name;
  document.getElementById('bonusDesc').textContent = card.desc;
  document.getElementById('bonusOverlay').classList.add('show');
  state.chaosLog.push({ round: state.round, text: `Bonus Card: ${card.name} — ${card.desc.substring(0,60)}…` });
}
function closeBonusCard() { document.getElementById('bonusOverlay').classList.remove('show'); }

// ── Punishment Trigger ───────────────────────────────────────
function triggerPunishment(playerName, txt, icon) {
  document.getElementById('punishIcon').textContent = icon;
  document.getElementById('punishPlayer').textContent = playerName + ' must…';
  document.getElementById('punishText').textContent = txt;
  // Animate timer bar
  const bar = document.getElementById('punishTimerFill');
  bar.style.width = '100%';
  bar.style.transition = 'none';
  setTimeout(() => {
    bar.style.transition = 'width 30s linear';
    bar.style.width = '0%';
  }, 50);
  document.getElementById('punishOverlay').classList.add('show');
}
function closePunishment() { document.getElementById('punishOverlay').classList.remove('show'); }

// ── Award Point ──────────────────────────────────────────────
function awardPoint(player) {
  if (player === 1) {
    state.score1++;
    showToast(`🏅 Point to ${state.p1}!`);
    document.getElementById('scoreCard1').classList.add('score-pulse');
    setTimeout(() => document.getElementById('scoreCard1').classList.remove('score-pulse'), 700);
  } else if (player === 2) {
    state.score2++;
    showToast(`🏅 Point to ${state.p2}!`);
    document.getElementById('scoreCard2').classList.add('score-pulse');
    setTimeout(() => document.getElementById('scoreCard2').classList.remove('score-pulse'), 700);
  } else {
    showToast('🤝 Tie — no point!');
  }
  updateHeader();
  setTimeout(() => nextRound(), 500);
}

// ── End Game ─────────────────────────────────────────────────
function endGame() {
  showScreen('screen-end');
  saveToHistory(state.p1, state.score1, state.p2, state.score2);
  launchConfetti();

  let winner = null, trophy = '🤝';
  if (state.score1 > state.score2)      { winner = state.p1; trophy = '🏆'; }
  else if (state.score2 > state.score1) { winner = state.p2; trophy = '🏆'; }

  document.getElementById('end-trophy').textContent = trophy;
  document.getElementById('end-title').textContent = winner ? `${winner.toUpperCase()} WINS!` : "IT'S A TIE!";
  document.getElementById('end-sub').textContent   = winner
    ? `${winner} reigned supreme through all the chaos. Respect.`
    : 'Equal chaos. Equal skill. True partners in crime.';

  // Final scores
  document.getElementById('final-scores').innerHTML = `
    <div class="fsc fsc-p1 ${state.score1 >= state.score2 && state.score1 > 0 ? 'winner' : ''}">
      ${state.score1 > state.score2 ? '<span class="win-badge">👑 WINNER</span>' : ''}
      <div class="pl-name">${state.p1}</div>
      <div class="big-sc">${state.score1}</div>
      <div class="sc-label">points</div>
    </div>
    <div class="fsc fsc-p2 ${state.score2 > state.score1 ? 'winner' : ''}">
      ${state.score2 > state.score1 ? '<span class="win-badge">👑 WINNER</span>' : ''}
      <div class="pl-name">${state.p2}</div>
      <div class="big-sc">${state.score2}</div>
      <div class="sc-label">points</div>
    </div>
  `;

  // Stats
  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-tile"><div class="stat-num">${state.totalRounds}</div><div class="stat-label">Rounds Played</div></div>
    <div class="stat-tile"><div class="stat-num">${state.statsBonusCards}</div><div class="stat-label">Bonus Cards</div></div>
    <div class="stat-tile"><div class="stat-num">${state.statsPunishments}</div><div class="stat-label">Punishments</div></div>
  `;

  // Chaos log
  const logEl = document.getElementById('chaos-log-items');
  if (state.chaosLog.length === 0) {
    logEl.innerHTML = '<div class="log-item"><span>😇</span><span>Not a single chaos event. Suspiciously wholesome.</span></div>';
  } else {
    logEl.innerHTML = state.chaosLog.map(e =>
      `<div class="log-item"><span>💥</span><span><strong>R${e.round}:</strong> ${e.text}</span></div>`
    ).join('');
  }
}

// ── Leaderboard ──────────────────────────────────────────────
function openLeaderboard() {
  const hist = loadHistory();
  const el   = document.getElementById('lb-entries');
  if (hist.length === 0) {
    el.innerHTML = '<div class="lb-empty">No game history yet — play more rounds!</div>';
  } else {
    // Build winner-based leaderboard
    const wins = {};
    hist.forEach(h => {
      const w = h.s1 > h.s2 ? h.p1 : h.s2 > h.s1 ? h.p2 : null;
      if (w) wins[w] = (wins[w] || 0) + 1;
    });
    const sorted = Object.entries(wins).sort((a,b) => b[1] - a[1]).slice(0,5);
    const rankLabels = ['gold','silver','bronze','',''];
    el.innerHTML = sorted.length === 0
      ? '<div class="lb-empty">All ties! Play more rounds.</div>'
      : sorted.map(([name,w],i) => `
          <div class="lb-row">
            <div class="lb-rank ${rankLabels[i]}">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
            <div class="lb-name">${name}</div>
            <div class="lb-score">${w} win${w!==1?'s':''}</div>
          </div>`).join('');
  }
  document.getElementById('leaderboardOverlay').classList.add('show');
}
function closeLeaderboard() { document.getElementById('leaderboardOverlay').classList.remove('show'); }

// ── Utilities ────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function launchConfetti() {
  const colors = ['#FF2D55','#0A84FF','#FFD60A','#30D158','#BF5AF2','#FF9F0A','#FF6B9D','#5AC8FA'];
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'confetti-p';
      const size = Math.random() * 12 + 6;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%; top:-20px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > .5 ? '50%' : '2px'};
        animation-duration:${1.5 + Math.random() * 2.5}s;
        animation-delay:${Math.random() * .8}s;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }, i * 30);
  }
}

// ── Particles ────────────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#FF2D55','#0A84FF','#FFD60A','#30D158','#BF5AF2','#FF9F0A','#FF6B9D'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 5;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${15 + Math.random() * 20}s;
      animation-delay:${Math.random() * 20}s;
    `;
    container.appendChild(p);
  }
})();

// ── Custom cursor ────────────────────────────────────────────
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mousedown', () => { glow.style.width = '44px'; glow.style.height = '44px'; });
  document.addEventListener('mouseup',   () => { glow.style.width = '28px'; glow.style.height = '28px'; });
})();

// Init wheel
drawWheel(0);
