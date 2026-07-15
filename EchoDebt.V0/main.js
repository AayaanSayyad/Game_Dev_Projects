import { LEVELS, MAX_LIVES, NODE_COLLECT_RADIUS, PULSE_HIT_RADIUS } from "./levels.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start-btn");
const levelLabel = document.getElementById("level-label");
const livesLabel = document.getElementById("lives-label");
const nodesLabel = document.getElementById("nodes-label");

const TAU = Math.PI * 2;
const CENTER = { x: canvas.width / 2, y: canvas.height / 2 };
const BASE_RADIUS = Math.min(canvas.width, canvas.height) / 2;

const STATE = {
  MENU: "menu",
  PLAYING: "playing",
  LEVEL_COMPLETE: "level_complete",
  GAME_OVER: "game_over",
  WIN: "win",
};

let gameState = STATE.MENU;
let levelIndex = 0;
let lives = MAX_LIVES;
let playerAngle = 0;
let direction = 1;
let nodes = [];
let pulses = [];
let particles = [];
let flashAlpha = 0;
let shakeTime = 0;
let lastTime = 0;
let levelStartTime = 0;

function normalizeAngle(a) {
  return ((a % TAU) + TAU) % TAU;
}

function angleDiff(a, b) {
  let d = normalizeAngle(a - b);
  if (d > Math.PI) d -= TAU;
  return d;
}

function getRingRadiusPx(level) {
  return BASE_RADIUS * level.ringRadius * 0.92;
}

function initLevel() {
  const level = LEVELS[levelIndex];
  playerAngle = -Math.PI / 2;
  direction = 1;
  nodes = level.nodes.map((n) => ({ angle: n.angle, collected: false }));
  pulses = level.pulses.map((p) => ({
    ...p,
    timer: p.interval * 0.5,
    active: [],
  }));
  particles = [];
  flashAlpha = 0;
  levelStartTime = performance.now();
  updateHud();
}

function flipDirection() {
  if (gameState !== STATE.PLAYING) return;
  direction *= -1;
  spawnParticles(playerAngle, 4, "#ffffff", 0.04);
}

function spawnParticles(angle, count, color, speed = 0.06) {
  const ringR = getRingRadiusPx(LEVELS[levelIndex]);
  const px = CENTER.x + Math.cos(angle) * ringR;
  const py = CENTER.y + Math.sin(angle) * ringR;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * TAU;
    const v = speed * (0.5 + Math.random());
    particles.push({
      x: px,
      y: py,
      vx: Math.cos(a) * v * BASE_RADIUS,
      vy: Math.sin(a) * v * BASE_RADIUS,
      life: 1,
      color,
    });
  }
}

function spawnPulse(source, now) {
  source.active.push({
    angle: source.angle,
    dist: 0,
    speed: source.speed,
    width: source.width,
    born: now,
  });
}

function updatePulses(dt, now) {
  const level = LEVELS[levelIndex];
  const ringR = getRingRadiusPx(level);

  for (const source of pulses) {
    source.timer -= dt;
    if (source.timer <= 0) {
      spawnPulse(source, now);
      source.timer = source.interval;
    }

    for (const pulse of source.active) {
      pulse.dist += pulse.speed * dt * BASE_RADIUS;

      if (pulse.dist >= ringR - 4 && pulse.dist <= ringR + 14 && !pulse.checked) {
        pulse.checked = true;
        const diff = Math.abs(angleDiff(playerAngle, pulse.angle));
        if (diff < pulse.width / 2) {
          onPlayerHit();
        }
      }
    }

    source.active = source.active.filter((p) => p.dist < ringR + 40);
  }
}

function updateNodes() {
  const level = LEVELS[levelIndex];
  const ringR = getRingRadiusPx(level);
  let allCollected = true;

  for (const node of nodes) {
    if (node.collected) continue;
    allCollected = false;
    const diff = Math.abs(angleDiff(playerAngle, node.angle));
    if (diff < NODE_COLLECT_RADIUS) {
      node.collected = true;
      spawnParticles(node.angle, 12, "#44ccff", 0.08);
      playTone(520, 0.08, "sine");
    }
  }

  if (allCollected && nodes.length > 0) {
    onLevelComplete();
  }
}

function onPlayerHit() {
  lives -= 1;
  flashAlpha = 0.7;
  shakeTime = 0.25;
  spawnParticles(playerAngle, 16, "#ff4466", 0.1);
  playTone(120, 0.2, "sawtooth");

  if (lives <= 0) {
    gameState = STATE.GAME_OVER;
    showOverlay("GAME OVER", `You reached level ${levelIndex + 1}: ${LEVELS[levelIndex].name}`, "Try Again");
  } else {
    initLevel();
  }
  updateHud();
}

function onLevelComplete() {
  playTone(660, 0.1, "sine");
  setTimeout(() => playTone(880, 0.15, "sine"), 100);

  if (levelIndex >= LEVELS.length - 1) {
    gameState = STATE.WIN;
    showOverlay("DEBT CLEARED", "All 5 levels complete.", "Play Again");
  } else {
    gameState = STATE.LEVEL_COMPLETE;
    showOverlay(
      "LEVEL CLEAR",
      `${LEVELS[levelIndex].name} complete.\nPress Enter for next level.`,
      "Continue"
    );
  }
}

function nextLevel() {
  levelIndex += 1;
  initLevel();
  gameState = STATE.PLAYING;
  hideOverlay();
}

function startGame() {
  levelIndex = 0;
  lives = MAX_LIVES;
  initLevel();
  gameState = STATE.PLAYING;
  hideOverlay();
}

function showOverlay(title, message, buttonText) {
  overlay.querySelector("h1").textContent = title;
  overlay.querySelector(".tagline").textContent = message.replace("\n", " — ");
  overlay.querySelector(".instructions").innerHTML = `<p class="overlay-message">${message.replace(/\n/g, "<br>")}</p>
    <p><kbd>Enter</kbd> or click button to continue</p>`;
  startBtn.textContent = buttonText;
  overlay.classList.add("visible");
}

function hideOverlay() {
  overlay.classList.remove("visible");
  overlay.querySelector(".tagline").textContent = "Orbit. Flip. Survive.";
  overlay.querySelector(".instructions").innerHTML = `
    <p><kbd>←</kbd> <kbd>→</kbd> or <kbd>Space</kbd> — reverse direction</p>
    <p>Collect all nodes. Avoid center pulses.</p>`;
  startBtn.textContent = "Start Game";
}

function updateHud() {
  const level = LEVELS[levelIndex];
  const collected = nodes.filter((n) => n.collected).length;
  levelLabel.textContent = `Level ${levelIndex + 1}: ${level.name}`;
  livesLabel.textContent = `Lives: ${lives}`;
  nodesLabel.textContent = `Nodes: ${collected}/${nodes.length}`;
}

function update(dt, now) {
  if (gameState !== STATE.PLAYING) return;

  const level = LEVELS[levelIndex];
  playerAngle = normalizeAngle(playerAngle + direction * level.orbitSpeed * dt);

  updatePulses(dt, now);
  updateNodes();

  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt * 2.5;
  }
  particles = particles.filter((p) => p.life > 0);

  if (flashAlpha > 0) flashAlpha -= dt * 2.5;
  if (shakeTime > 0) shakeTime -= dt;
}

function drawRing(level) {
  const ringR = getRingRadiusPx(level);

  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, ringR, 0, TAU);
  ctx.strokeStyle = "rgba(0, 220, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(0, 220, 255, 0.6)";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, ringR, 0, TAU);
  ctx.strokeStyle = "rgba(0, 220, 255, 0.08)";
  ctx.lineWidth = 8;
  ctx.stroke();
}

function drawNodes(level) {
  const ringR = getRingRadiusPx(level);

  for (const node of nodes) {
    if (node.collected) continue;
    const x = CENTER.x + Math.cos(node.angle) * ringR;
    const y = CENTER.y + Math.sin(node.angle) * ringR;
    const pulse = 0.6 + Math.sin(performance.now() / 200 + node.angle * 3) * 0.4;

    ctx.beginPath();
    ctx.arc(x, y, 10 + pulse * 3, 0, TAU);
    ctx.fillStyle = `rgba(68, 204, 255, ${0.5 + pulse * 0.3})`;
    ctx.shadowColor = "#44ccff";
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, TAU);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }
}

function drawPulses(level) {
  const ringR = getRingRadiusPx(level);

  for (const source of pulses) {
    for (const pulse of source.active) {
      const x = CENTER.x + Math.cos(pulse.angle) * pulse.dist;
      const y = CENTER.y + Math.sin(pulse.angle) * pulse.dist;
      const alpha = 1 - pulse.dist / (ringR + 40);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(pulse.angle);

      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(pulse.dist * 0.15, 0);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 60, 80, ${alpha * 0.9})`;
      ctx.shadowColor = "#ff3355";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, TAU);
      ctx.fillStyle = `rgba(255, 200, 200, ${alpha})`;
      ctx.fill();

      ctx.restore();
    }
  }

  // Center emitter
  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, 8, 0, TAU);
  ctx.fillStyle = "rgba(255, 80, 100, 0.8)";
  ctx.shadowColor = "#ff4466";
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawPlayer(level) {
  const ringR = getRingRadiusPx(level);
  const x = CENTER.x + Math.cos(playerAngle) * ringR;
  const y = CENTER.y + Math.sin(playerAngle) * ringR;

  // Trail
  const trailLen = 0.35;
  ctx.beginPath();
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const a = playerAngle - direction * trailLen * t;
    const tx = CENTER.x + Math.cos(a) * ringR;
    const ty = CENTER.y + Math.sin(a) * ringR;
    if (i === 0) ctx.moveTo(tx, ty);
    else ctx.lineTo(tx, ty);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 9, 0, TAU);
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawWindupIndicators(level, now) {
  const ringR = getRingRadiusPx(level);

  for (const source of pulses) {
    const progress = 1 - source.timer / source.interval;
    if (progress < 0.55) continue;

    const intensity = (progress - 0.55) / 0.45;
    const x = CENTER.x + Math.cos(source.angle) * 20;
    const y = CENTER.y + Math.sin(source.angle) * 20;
    const tx = CENTER.x + Math.cos(source.angle) * ringR;
    const ty = CENTER.y + Math.sin(source.angle) * ringR;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = `rgba(255, 80, 100, ${intensity * 0.25})`;
    ctx.lineWidth = 1 + intensity * 2;
    ctx.stroke();
  }
}

function render(now) {
  ctx.save();

  if (shakeTime > 0) {
    const s = shakeTime * 8;
    ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === STATE.PLAYING || gameState === STATE.LEVEL_COMPLETE) {
    const level = LEVELS[levelIndex];
    drawRing(level);
    drawWindupIndicators(level, now);
    drawPulses(level);
    drawNodes(level);
    drawPlayer(level);
  }

  if (flashAlpha > 0) {
    ctx.fillStyle = `rgba(255, 60, 80, ${flashAlpha * 0.35})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 * p.life, 0, TAU);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt, now);
  render(now);
  requestAnimationFrame(loop);
}

// --- Audio (Web Audio API, no external files) ---
let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, duration, type = "sine") {
  try {
    const ac = getAudio();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch {
    // Audio optional
  }
}

// --- Input ---
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
    e.preventDefault();
    if (gameState === STATE.PLAYING) flipDirection();
  }

  if (e.code === "Enter") {
    if (gameState === STATE.MENU) startGame();
    else if (gameState === STATE.LEVEL_COMPLETE) nextLevel();
    else if (gameState === STATE.GAME_OVER || gameState === STATE.WIN) startGame();
  }
});

startBtn.addEventListener("click", () => {
  if (gameState === STATE.MENU || gameState === STATE.GAME_OVER || gameState === STATE.WIN) {
    startGame();
  } else if (gameState === STATE.LEVEL_COMPLETE) {
    nextLevel();
  }
});

// Resume audio context on first interaction
canvas.addEventListener("click", () => {
  if (audioCtx?.state === "suspended") audioCtx.resume();
});

requestAnimationFrame(loop);
