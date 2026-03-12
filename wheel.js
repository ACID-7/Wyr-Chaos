/* ============================================================
   wheel.js - animated chaos wheel
   ============================================================ */

let wheelAngle = 0;
let isSpinning = false;
const WHEEL_TAU = Math.PI * 2;

function drawWheel(angle) {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const cx = 160;
  const cy = 160;
  const r = 152;
  const seg = WHEEL_SEGMENTS.length;
  const arc = WHEEL_TAU / seg;

  ctx.clearRect(0, 0, 320, 320);

  for (let i = 0; i < seg; i++) {
    const start = angle + i * arc;
    const end = start + arc;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = WHEEL_SEGMENTS[i].color;
    ctx.fill();

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, 'rgba(255,255,255,0.10)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.00)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'bold 13px Nunito, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 4;
    ctx.fillText(WHEEL_SEGMENTS[i].label, r - 10, 5);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, WHEEL_TAU);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function openSpinner() {
  if (typeof state !== 'undefined') {
    if (state.round === 0 || state.currentRoundResolved) {
      showToast('Open the wheel during an active round.');
      return;
    }
    if (state.wheelUsedThisRound) {
      showToast('The Chaos Wheel can only be used once per round.');
      return;
    }
  }

  const overlay = document.getElementById('spinnerOverlay');
  overlay.classList.add('show');
  document.getElementById('spinResult').classList.remove('show');
  document.getElementById('spinResult').innerHTML = '';
  document.getElementById('closeSpinner').style.display = 'none';
  document.getElementById('spinBtn').disabled = false;

  if (typeof updateWheelSelectorUI === 'function') updateWheelSelectorUI();

  drawWheel(wheelAngle);
}

function closeSpinner() {
  document.getElementById('spinnerOverlay').classList.remove('show');
}

function spinWheel() {
  if (isSpinning) return;

  isSpinning = true;
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('spinResult').classList.remove('show');

  if (typeof state !== 'undefined') state.wheelUsedThisRound = true;

  const totalSpin = WHEEL_TAU * (10 + Math.random() * 10);
  const duration = 4500;
  const startTime = performance.now();
  const startAngle = wheelAngle;

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);

    wheelAngle = startAngle + totalSpin * ease;
    drawWheel(wheelAngle);

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      isSpinning = false;
      landWheel();
    }
  }

  requestAnimationFrame(frame);
}

function landWheel() {
  const seg = WHEEL_SEGMENTS.length;
  const arc = WHEEL_TAU / seg;
  const pointerAngle = Math.PI * 1.5;
  const normalized = (((pointerAngle - wheelAngle) % WHEEL_TAU) + WHEEL_TAU) % WHEEL_TAU;
  const idx = Math.floor(normalized / arc) % seg;
  const result = WHEEL_SEGMENTS[idx];

  const el = document.getElementById('spinResult');
  el.innerHTML = `
    <div class="spin-result-label">${result.label}</div>
    <div style="font-size:14px;font-weight:700;color:rgba(245,245,247,0.75);line-height:1.6;">${result.punishment}</div>
  `;
  el.classList.add('show');

  document.getElementById('closeSpinner').style.display = 'inline-block';

  if (typeof applyWheelResult === 'function' && typeof state !== 'undefined') {
    applyWheelResult(result, state.selectedWheelPlayer);
  }
}
