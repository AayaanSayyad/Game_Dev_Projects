(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H / 2 + 8;

  const ui = {
    overlay: document.getElementById("overlay"),
    pick: document.getElementById("pick"),
    infoKind: document.getElementById("infoKind"),
    infoIcon: document.getElementById("infoIcon"),
    infoName: document.getElementById("infoName"),
    infoDesc: document.getElementById("infoDesc"),
    infoHint: document.getElementById("infoHint"),
    infoOk: document.getElementById("infoOk"),
    endScreen: document.getElementById("endScreen"),
    endTitle: document.getElementById("endTitle"),
    endTag: document.getElementById("endTag"),
    endMenu: document.getElementById("endMenu"),
    hud: document.getElementById("hud"),
    levelLabel: document.getElementById("levelLabel"),
    modeLabel: document.getElementById("modeLabel"),
    timer: document.getElementById("timer"),
    timerFill: document.getElementById("timerFill"),
    lives: document.getElementById("lives"),
    debtLabel: document.getElementById("debtLabel"),
    escalation: document.getElementById("escalation"),
    slot0: document.getElementById("slot0"),
    slot1: document.getElementById("slot1"),
    toast: document.getElementById("toast"),
    btnCampaign: document.getElementById("btnCampaign"),
    btnEndless: document.getElementById("btnEndless"),
    previewBanner: document.getElementById("previewBanner"),
  };

  // Dual vibes — Cotton (pastel) vs Crimson (hardcore)
  let vibe = "pastel";
  const PALETTES = {
    pastel: {
      skyTop: "#fff0f8",
      skyBot: "#e8f7ff",
      mint: "#7dffc8",
      mintDeep: "#3ed9a0",
      pink: "#ff8fc4",
      pinkDeep: "#ff5ea0",
      lilac: "#c9a8ff",
      lilacDeep: "#9b6dff",
      peach: "#ffb48a",
      butter: "#ffe27a",
      aqua: "#7ee9ff",
      coral: "#ff7b8a",
      cream: "#fffaf2",
      ink: "#3a2a55",
      blush: "#ffc1d8",
      white: "#ffffff",
      hazePink: "rgba(255,158,200,0.28)",
      hazeAqua: "rgba(154,239,255,0.25)",
      hazeLilac: "rgba(201,168,255,0.18)",
      playerGlow: "rgba(125,255,200,0.2)",
    },
    crimson: {
      skyTop: "#220814",
      skyBot: "#0c0414",
      mint: "#ff4d8d",
      mintDeep: "#c2185b",
      pink: "#ff2d55",
      pinkDeep: "#b71c3a",
      lilac: "#b44dff",
      lilacDeep: "#6a1b9a",
      peach: "#ff6b4a",
      butter: "#ffc107",
      aqua: "#e040fb",
      coral: "#ff1744",
      cream: "#ffe6f0",
      ink: "#1a050c",
      blush: "#ff1744",
      white: "#fff5f8",
      hazePink: "rgba(255,45,85,0.28)",
      hazeAqua: "rgba(180,77,255,0.22)",
      hazeLilac: "rgba(120,20,80,0.35)",
      playerGlow: "rgba(255,45,85,0.22)",
    },
  };
  const C = Object.assign({}, PALETTES.pastel);

  function applyVibe(v) {
    vibe = v === "crimson" ? "crimson" : "pastel";
    Object.assign(C, PALETTES[vibe]);
    document.documentElement.setAttribute("data-vibe", vibe);
    const tag = document.getElementById("menuTag");
    if (tag) {
      tag.textContent =
        vibe === "crimson"
          ? "Crimson void. Poison candies. Your clones never leave."
          : "Pastel chaos. Candy powerups. Your clones never leave.";
    }
  }


  // ---------- CHARACTERS ----------
  let selectedSkin = "marshmallow";
  const SKINS = [
    { id: "marshmallow", name: "COTTON", desc: "Mint marshmallow mascot" },
    { id: "skull", name: "CINDER", desc: "Toasty bonehead" },
    { id: "wingball", name: "SKY PIP", desc: "Tiny sky dumpling" },
    { id: "starcat", name: "LUNA", desc: "Nightshift kitty" },
    { id: "chili", name: "PEPPER", desc: "Too spicy to touch" },
    { id: "crescent", name: "CRESC", desc: "Sleepy moon bean" },
    { id: "berry", name: "BRAMBLE", desc: "Berry with attitude" },
    { id: "bee", name: "BUZZ", desc: "Striped sugar bee" },
    { id: "robot", name: "BIT", desc: "Candy tin robot" },
    { id: "fish", name: "FINN", desc: "Orbit goldfish" },
    { id: "ghost", name: "BOO", desc: "Shy soda ghost" },
    { id: "knight", name: "NIB", desc: "Foil-wrapped hero" },
  ];

  // ---------- AUDIO (mellow layered pastel track) ----------
  const audio = {
    ctx: null,
    master: null,
    musicGain: null,
    sfxGain: null,
    wet: null,
    theme: "none",
    step: 0,
    acc: 0,
    barAcc: 0,
    chordIdx: 0,
    nodes: [],
  };

  // Bright candy-pop scales (C major-ish / A minor hops)
  const SCALE = {
    menu: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 523.25, 587.33],
    // Gameplay: darker candy-garage (D minor) — not the menu C-major loop
    play: [293.66, 349.23, 392.0, 440.0, 466.16, 523.25, 587.33, 698.46],
    pick: [329.63, 392.0, 440.0, 523.25, 659.25],
    dead: [146.83, 174.61, 196.0, 220.0, 246.94],
    win: [392.0, 493.88, 523.25, 659.25, 783.99, 987.77],
  };

  const THEMES = {
    menu: {
      bpm: 108,
      // I – V – vi – IV candy loop
      chords: [[0, 2, 4], [4, 6, 1], [5, 0, 2], [3, 5, 0]],
      lead: [0, 2, 4, 5, 4, 2, 0, 4, 5, 7, 5, 4, 2, 4, 5, 7],
      bass: [0, , 0, 0, 4, , 4, , 5, , 5, 5, 3, , 3, 0],
      kick: [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
      hat:  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    },
    play: {
      // Syncopated neon groove — different DNA from menu
      bpm: 118,
      chords: [[0, 2, 4], [4, 6, 1], [3, 5, 0], [5, 0, 2], [0, 3, 5], [2, 4, 6], [4, 0, 2], [5, 2, 4]],
      lead: [0, , 2, , 3, 5, , 3, 2, , 0, , 5, , 3, 2, 0, 2, 3, 5, 7, 5, 3, , 2, 3, 5, , 3, 2, 0, ,],
      bass: [0, , , 0, 3, , 0, , 5, , , 5, 3, , 2, , 0, , 0, 3, , 3, 5, , 4, , 4, 2, 0, , 5, 3],
      kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
      hat:  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    },
    pick: {
      bpm: 100,
      chords: [[0, 2, 4], [5, 0, 2]],
      lead: [0, 2, 4, 5, 4, 2],
      bass: [0, , , , 5, , , ,],
      kick: [1, 0, 0, 0, 1, 0, 0, 0],
      hat: [1, 0, 1, 0, 1, 0, 1, 0],
      clap: [0, 0, 0, 0, 1, 0, 0, 0],
    },
    dead: {
      bpm: 70,
      chords: [[0, 2, 3], [1, 2, 4]],
      lead: [0, , 1, , 2, , 0, ,],
      bass: [0, , , , 1, , , ,],
      kick: [1, 0, 0, 0, 1, 0, 0, 0],
      hat: [0, 0, 1, 0, 0, 0, 1, 0],
      clap: [0, 0, 0, 0, 0, 0, 0, 0],
    },
    win: {
      bpm: 120,
      chords: [[0, 2, 4], [1, 3, 5], [0, 2, 5], [2, 4, 5]],
      lead: [0, 2, 4, 5, 4, 2, 5, 4],
      bass: [0, , 2, , 0, , 1, ,],
      kick: [1, 0, 0, 0, 1, 0, 1, 0],
      hat: [1, 1, 1, 1, 1, 1, 1, 1],
      clap: [0, 0, 0, 0, 1, 0, 0, 0],
    },
  };

  function ensureAudio() {
    if (!audio.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ac = new AC();
      audio.ctx = ac;

      audio.master = ac.createGain();
      audio.master.gain.value = 0.9;
      audio.master.connect(ac.destination);

      audio.musicGain = ac.createGain();
      audio.musicGain.gain.value = 0.2;

      // Bright enough to pop, still polished
      const filter = ac.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 5200;
      filter.Q.value = 0.6;
      audio.filter = filter;

      const delay = ac.createDelay(1);
      delay.delayTime.value = 0.22;
      const fb = ac.createGain();
      fb.gain.value = 0.16;
      const wet = ac.createGain();
      wet.gain.value = 0.14;
      audio.wet = wet;

      // Lightweight "sidechain" duck bus — kicks momentarily dip music
      audio.duck = ac.createGain();
      audio.duck.gain.value = 1;
      audio.musicGain.connect(audio.duck);
      audio.duck.connect(filter);
      filter.connect(audio.master);
      filter.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(audio.master);

      audio.sfxGain = ac.createGain();
      audio.sfxGain.gain.value = 0.2;
      audio.sfxGain.connect(audio.master);
    }
    if (audio.ctx.state === "suspended") audio.ctx.resume();
    return audio.ctx;
  }

  function stopMusicNodes() {
    for (const n of audio.nodes) {
      try { n.stop(); } catch (_) {}
    }
    audio.nodes = [];
  }

  function silenceMusic() {
    const ac = audio.ctx;
    stopMusicNodes();
    if (ac && audio.musicGain) {
      try {
        audio.musicGain.gain.cancelScheduledValues(ac.currentTime);
        audio.musicGain.gain.setValueAtTime(0.0001, ac.currentTime);
      } catch (_) {}
    }
    if (ac && audio.duck) {
      try {
        audio.duck.gain.cancelScheduledValues(ac.currentTime);
        audio.duck.gain.setValueAtTime(1, ac.currentTime);
      } catch (_) {}
    }
    audio.theme = "none";
    audio.step = 0;
    audio.acc = 0;
    audio.barAcc = 0;
    audio.chordIdx = 0;
  }

  /** Hard switch — kills prior track completely before starting the next. */
  function setTheme(theme) {
    if (audio.theme === theme) return;
    silenceMusic();
    if (theme === "none") return;
    const ac = ensureAudio();
    if (!ac) return;
    audio.theme = theme;
    audio.step = 0;
    audio.acc = 0;
    audio.barAcc = 0;
    audio.chordIdx = 0;
    const vol = theme === "menu" ? 0.2 : theme === "play" ? 0.24 : 0.16;
    audio.musicGain.gain.cancelScheduledValues(ac.currentTime);
    audio.musicGain.gain.setValueAtTime(0.0001, ac.currentTime);
    audio.musicGain.gain.linearRampToValueAtTime(vol, ac.currentTime + 0.08);
  }

  function envTone(freq, dur, type, peak, dest, attack, detune) {
    const ac = ensureAudio();
    if (!ac || !freq) return;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const o2 = ac.createOscillator();
    const g = ac.createGain();
    o.type = type || "sine";
    o2.type = type || "triangle";
    o.frequency.value = freq;
    o2.frequency.value = freq * (1 + (detune || 0.004));
    const a = Math.max(0.005, attack ?? 0.02);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + a);
    g.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(a + 0.02, dur));
    o.connect(g);
    o2.connect(g);
    g.connect(dest || audio.sfxGain);
    o.start(now);
    o2.start(now);
    o.stop(now + dur + 0.02);
    o2.stop(now + dur + 0.02);
    if (dest === audio.musicGain) audio.nodes.push(o, o2);
  }

  function tone(freq, dur, type, gain, dest) {
    envTone(freq, dur, type, gain, dest, 0.01, 0.002);
  }

  function playKick() {
    const ac = ensureAudio();
    if (!ac) return;
    const now = ac.currentTime;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(160, now);
    o.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.55, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o.connect(g);
    g.connect(audio.musicGain);
    o.start(now);
    o.stop(now + 0.2);
    audio.nodes.push(o);
    // duck the music bus a hair
    if (audio.duck) {
      audio.duck.gain.cancelScheduledValues(now);
      audio.duck.gain.setValueAtTime(0.55, now);
      audio.duck.gain.exponentialRampToValueAtTime(1, now + 0.14);
    }
  }

  function playHat(open) {
    const ac = ensureAudio();
    if (!ac) return;
    const now = ac.currentTime;
    const bufferSize = Math.floor(ac.sampleRate * (open ? 0.08 : 0.03));
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const bp = ac.createBiquadFilter();
    bp.type = "highpass";
    bp.frequency.value = 7000;
    const g = ac.createGain();
    g.gain.setValueAtTime(open ? 0.045 : 0.03, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (open ? 0.08 : 0.03));
    src.connect(bp);
    bp.connect(g);
    g.connect(audio.musicGain);
    src.start(now);
    src.stop(now + 0.1);
    audio.nodes.push(src);
  }

  function playClap() {
    const ac = ensureAudio();
    if (!ac) return;
    const now = ac.currentTime;
    for (let n = 0; n < 3; n++) {
      const t0 = now + n * 0.012;
      const bufferSize = Math.floor(ac.sampleRate * 0.05);
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      const src = ac.createBufferSource();
      src.buffer = buffer;
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1800;
      bp.Q.value = 0.8;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);
      src.connect(bp);
      bp.connect(g);
      g.connect(audio.musicGain);
      src.start(t0);
      src.stop(t0 + 0.1);
      audio.nodes.push(src);
    }
  }

  function playStab(scale, degrees) {
    for (const d of degrees) {
      const f = scale[d % scale.length];
      if (!f) continue;
      envTone(f, 0.22, "triangle", 0.05, audio.musicGain, 0.01, 0.003);
      envTone(f * 2, 0.16, "sine", 0.02, audio.musicGain, 0.01, 0.004);
    }
  }

  function playSnare() {
    const ac = ensureAudio();
    if (!ac) return;
    const now = ac.currentTime;
    const bufferSize = Math.floor(ac.sampleRate * 0.1);
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1200;
    bp.Q.value = 0.6;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    src.connect(bp);
    bp.connect(g);
    g.connect(audio.musicGain);
    src.start(now);
    src.stop(now + 0.13);
    audio.nodes.push(src);
    envTone(180, 0.08, "triangle", 0.04, audio.musicGain, 0.005, 0.001);
  }

  function tickMusic(dt) {
    const ac = ensureAudio();
    if (!ac || audio.theme === "none") return;
    const t = THEMES[audio.theme];
    const scale = SCALE[audio.theme];
    if (!t || !scale) return;

    let bpm = t.bpm;
    // Gameplay urgency: climb as the level timer drains
    if (audio.theme === "play" && state && (state.mode === "play" || state.mode === "preview") && state.duration > 0) {
      const urgency = 1 - Math.max(0, Math.min(1, state.timeLeft / state.duration));
      bpm = t.bpm * (1 + urgency * 0.6);
    }

    const stepDur = 60 / bpm / 4; // 16th notes
    audio.acc += dt;

    while (audio.acc >= stepDur) {
      audio.acc -= stepDur;
      const i = audio.step;
      const barStep = i % 16;

      if (t.kick[barStep]) playKick();
      if (t.hat[barStep]) playHat(audio.theme === "play" ? barStep % 4 === 3 : barStep % 8 === 6);
      if (t.clap && t.clap[barStep]) playClap();
      if (t.snare && t.snare[barStep]) playSnare();

      if (barStep === 0 || (audio.theme === "play" ? barStep === 6 : barStep === 8)) {
        const chord = t.chords[audio.chordIdx % t.chords.length];
        playStab(scale, chord);
        if (barStep === 0) audio.chordIdx++;
      }

      const leadIdx = t.lead[i % t.lead.length];
      if (leadIdx != null && leadIdx !== undefined) {
        const f = scale[leadIdx % scale.length];
        if (audio.theme === "play") {
          // Airy saw-ish lead (not the menu square pluck)
          envTone(f, stepDur * 2.1, "sawtooth", 0.022, audio.musicGain, 0.02, 0.006);
          envTone(f * 1.5, stepDur * 1.4, "sine", 0.014, audio.musicGain, 0.03, 0.004);
        } else {
          envTone(f, stepDur * 1.6, "square", 0.028, audio.musicGain, 0.008, 0.002);
          envTone(f * 2, stepDur * 0.9, "sine", 0.012, audio.musicGain, 0.008, 0.003);
        }
      }

      const b = t.bass[i % t.bass.length];
      if (b != null && b !== undefined) {
        const bf = scale[b % scale.length] * 0.5;
        if (audio.theme === "play") {
          envTone(bf, stepDur * 2.8, "sine", 0.09, audio.musicGain, 0.015, 0.001);
          envTone(bf * 2, stepDur * 1.2, "triangle", 0.03, audio.musicGain, 0.01, 0.002);
        } else {
          envTone(bf, stepDur * 2.4, "triangle", 0.08, audio.musicGain, 0.01, 0.001);
          envTone(bf * 0.5, stepDur * 2.2, "sine", 0.05, audio.musicGain, 0.012, 0.001);
        }
      }

      audio.step++;
    }
  }

  const sfx = {
    flip: () => tone(620, 0.06, "sine", 0.035),
    hop: () => {
      tone(300, 0.07, "sine", 0.035);
      setTimeout(() => tone(420, 0.08, "sine", 0.028), 55);
    },
    hit: () => {
      tone(190, 0.12, "triangle", 0.05);
      setTimeout(() => tone(140, 0.16, "sine", 0.04), 45);
    },
    clear: () => {
      tone(392, 0.1, "sine", 0.04);
      setTimeout(() => tone(523, 0.12, "sine", 0.035), 90);
      setTimeout(() => tone(659, 0.16, "sine", 0.03), 180);
    },
    pick: () => {
      tone(523, 0.08, "sine", 0.045);
      setTimeout(() => tone(659, 0.1, "sine", 0.04), 70);
      setTimeout(() => tone(784, 0.14, "sine", 0.03), 140);
    },
    laser: () => tone(240, 0.09, "sine", 0.018),
  };

  // ---------- POWERUPS (lots) ----------
  // Equal pools: 12 hold / 12 consume / 12 debuff — rollCandy picks category 1/3 each
  const HOLD = {
    stutter: {
      id: "stutter",
      name: "STUTTER",
      kind: "hold",
      desc: "Freezes every clone in place for 4 seconds. Dodge and collect while they're stuck.",
      icon: "stutter",
      tint: C.aqua,
      use(s) {
        s.stutterT = 4;
        toast("Clones frozen");
        return true;
      },
    },
    chrono: {
      id: "chrono",
      name: "CHRONO",
      kind: "hold",
      desc: "Slows the whole universe to 45% speed for 5 seconds — you keep full control.",
      icon: "chrono",
      tint: C.lilac,
      use(s) {
        s.chronoT = 5;
        toast("Time gets syrupy");
        return true;
      },
    },
    hollow: {
      id: "hollow",
      name: "HOLLOW",
      kind: "hold",
      desc: "Arms a bubble shell. Your next lethal hit is absorbed instead of costing a life.",
      icon: "hollow",
      tint: C.mint,
      use(s) {
        s.hollowCharges = Math.max(s.hollowCharges, 1);
        toast("Bubble shell ready");
        return true;
      },
    },
    ledger: {
      id: "ledger",
      name: "LEDGER",
      kind: "hold",
      desc: "Swap places with a random clone on your current ring. Panic button.",
      icon: "ledger",
      tint: C.butter,
      use(s) {
        const mates = s.enemies.filter((e) => e.orbit === s.player.orbit);
        if (!mates.length) {
          toast("No clone here");
          return false;
        }
        const e = mates[(Math.random() * mates.length) | 0];
        const pa = s.player.angle;
        s.player.angle = e.angle;
        e.angle = pa;
        s.flash = 0.2;
        toast("Swapped seats!");
        return true;
      },
    },
    magnet: {
      id: "magnet",
      name: "MAGNET",
      kind: "hold",
      desc: "Pulls nearby asteroid fragments into dust for 3 seconds.",
      icon: "magnet",
      tint: C.coral,
      use(s) {
        s.magnetT = 3;
        toast("Sweet magnet");
        return true;
      },
    },
    sugar: {
      id: "sugar",
      name: "SUGAR",
      kind: "hold",
      desc: "Sugar rush! You orbit 60% faster for 4 seconds.",
      icon: "sugar",
      tint: C.pink,
      use(s) {
        s.sugarT = 4;
        toast("Sugar rush!");
        return true;
      },
    },
    jelly: {
      id: "jelly",
      name: "JELLY",
      kind: "hold",
      desc: "Jelly coat for 5 seconds — asteroids and debris bounce off harmlessly.",
      icon: "jelly",
      tint: C.mint,
      use(s) {
        s.jellyT = 5;
        toast("Jelly coat!");
        return true;
      },
    },
    warp: {
      id: "warp",
      name: "WARP",
      kind: "hold",
      desc: "Teleport to the opposite side of your ring with a short invuln glow.",
      icon: "warp",
      tint: C.lilacDeep,
      use(s) {
        s.player.angle = wrapAngle(s.player.angle + Math.PI);
        s.player.invuln = Math.max(s.player.invuln, 0.8);
        s.flash = 0.2;
        toast("Warped!");
        return true;
      },
    },
    zip: {
      id: "zip",
      name: "ZIP",
      kind: "hold",
      desc: "Dash a quarter-turn ahead on your ring. Great panic skip.",
      icon: "zip",
      tint: "#7ee9ff",
      use(s) {
        s.player.angle = wrapAngle(s.player.angle + s.player.dir * (Math.PI / 2));
        s.player.invuln = Math.max(s.player.invuln, 0.45);
        toast("Zipped!");
        return true;
      },
    },
    nova: {
      id: "nova",
      name: "NOVA",
      kind: "hold",
      desc: "Clear debris and freeze clones for 2.5s.",
      icon: "nova",
      tint: "#ffe27a",
      use(s) {
        s.fragments.length = 0;
        s.asteroids.length = 0;
        s.stutterT = Math.max(s.stutterT, 2.5);
        s.burst.push({ x: CX, y: CY, t: 0.4, color: C.butter, r: 55 });
        toast("Nova!");
        return true;
      },
    },
    // formerly instant — now holdable
    redact: {
      id: "redact",
      name: "REDACT",
      kind: "hold",
      desc: "Erase your oldest clone from the board. Save it for a crowded ring.",
      icon: "redact",
      tint: C.lilac,
      use(s) {
        if (!s.enemies.length) {
          toast("Nothing to erase");
          return false;
        }
        s.enemies.shift();
        syncDebt(s);
        toast("Clone erased");
        updateHUD(s);
        return true;
      },
    },
    sprinkle: {
      id: "sprinkle",
      name: "SPRINKLE",
      kind: "hold",
      desc: "Delete every clone on the ring you're standing on.",
      icon: "sprinkle",
      tint: C.peach,
      use(s) {
        const before = s.enemies.length;
        s.enemies = s.enemies.filter((e) => e.orbit !== s.player.orbit);
        syncDebt(s);
        toast(before === s.enemies.length ? "Ring was empty" : "Ring sprinkled clean!");
        updateHUD(s);
        return true;
      },
    },
  };

  const CONSUME = {
    life: {
      id: "life",
      name: "+1 LIFE",
      kind: "consume",
      desc: "Gain +1 life immediately (up to 6).",
      icon: "life",
      tint: C.pink,
      use(s) {
        s.lives = Math.min(6, s.lives + 1);
        toast("+1 life");
        updateHUD(s);
        return true;
      },
    },
    feast: {
      id: "feast",
      name: "FEAST",
      kind: "consume",
      desc: "+1 life and a long invulnerability glow to reposition safely.",
      icon: "feast",
      tint: C.peach,
      use(s) {
        s.lives = Math.min(6, s.lives + 1);
        s.player.invuln = Math.max(s.player.invuln, 2.5);
        s.player.blink = 2.5;
        toast("Feast! Heart + glow");
        updateHUD(s);
        return true;
      },
    },
    pocket: {
      id: "pocket",
      name: "POCKET",
      kind: "consume",
      desc: "Gain an extra hold slot (max 4). Carry more candy.",
      icon: "pocket",
      tint: "#c4b0ff",
      use(s) {
        s.maxSlots = s.maxSlots || 2;
        if (s.maxSlots >= 4) {
          toast("Already at max slots");
          return true;
        }
        s.maxSlots += 1;
        s.held.push(null);
        toast(`New slot! Now ${s.maxSlots}`);
        updateSlots(s);
        return true;
      },
    },
    confetti: {
      id: "confetti",
      name: "CONFETTI",
      kind: "consume",
      desc: "Party-poof two random clones off the board.",
      icon: "confetti",
      tint: C.pink,
      use(s) {
        if (!s.enemies.length) {
          toast("No clones to party-poof");
          return false;
        }
        for (let i = 0; i < 2 && s.enemies.length; i++) {
          s.enemies.splice((Math.random() * s.enemies.length) | 0, 1);
        }
        syncDebt(s);
        toast("Confetti pop!");
        updateHUD(s);
        return true;
      },
    },
    purge: {
      id: "purge",
      name: "PURGE",
      kind: "consume",
      desc: "Wipe every asteroid and fragment from the sky right now.",
      icon: "purge",
      tint: C.butter,
      use(s) {
        s.asteroids.length = 0;
        s.fragments.length = 0;
        s.burst.push({ x: CX, y: CY, t: 0.4, color: C.butter, r: 50 });
        toast("Sky swept!");
        return true;
      },
    },
    invert: {
      id: "invert",
      name: "INVERT",
      kind: "consume",
      desc: "Every clone instantly reverses orbit direction.",
      icon: "invert",
      tint: C.aqua,
      use(s) {
        for (const e of s.enemies) e.dir *= -1;
        toast("Directions flipped");
        return true;
      },
    },
    hush: {
      id: "hush",
      name: "HUSH",
      kind: "consume",
      desc: "No lasers for 5 seconds, and active beams vanish.",
      icon: "hush",
      tint: C.aqua,
      use(s) {
        s.hushT = 5;
        s.lasers.length = 0;
        toast("Planet shushed");
        return true;
      },
    },
    spark: {
      id: "spark",
      name: "SPARK",
      kind: "consume",
      desc: "Quick 2s invulnerability shimmer. Instant panic button.",
      icon: "spark",
      tint: "#ffe082",
      use(s) {
        s.player.invuln = Math.max(s.player.invuln, 2);
        s.player.blink = 2;
        toast("Spark shield!");
        return true;
      },
    },
    stretch: {
      id: "stretch",
      name: "STRETCH",
      kind: "consume",
      desc: "Add +4 seconds to the current timer. More room to breathe.",
      icon: "stretch",
      tint: "#80deea",
      use(s) {
        if (s.gameMode === "campaign") {
          s.timeLeft += 4;
          s.duration += 4;
        } else {
          s.endlessTick += 4;
          s.timeLeft = s.endlessTick;
        }
        toast("+4s stretched!");
        updateHUD(s);
        return true;
      },
    },
    cleanse: {
      id: "cleanse",
      name: "CLEANSE",
      kind: "consume",
      desc: "Wipe active debuff timers (slow, scramble, gravity, barrage, sticky, meteor).",
      icon: "cleanse",
      tint: "#b2ff59",
      use(s) {
        s.molassesT = s.scrambleT = s.gravityT = s.barrageT = s.meteorT = s.stickyT = 0;
        toast("Cleansed!");
        return true;
      },
    },
    siphon: {
      id: "siphon",
      name: "SIPHON",
      kind: "consume",
      desc: "Delete your oldest clone and grant a short invuln glow.",
      icon: "siphon",
      tint: "#ce93d8",
      use(s) {
        if (s.enemies.length) {
          s.enemies.shift();
          syncDebt(s);
        }
        s.player.invuln = Math.max(s.player.invuln, 1.2);
        toast("Siphoned");
        updateHUD(s);
        return true;
      },
    },
    tidy: {
      id: "tidy",
      name: "TIDY",
      kind: "consume",
      desc: "Clear active lasers and fragment debris in one sweep.",
      icon: "tidy",
      tint: "#a5d6a7",
      use(s) {
        s.lasers.length = 0;
        s.fragments.length = 0;
        toast("Tidied up");
        return true;
      },
    },
  };

  const DEBUFF = {
    heartbreak: {
      id: "heartbreak",
      name: "HEARTBREAK",
      kind: "debuff",
      desc: "Poison candy. You lose one life immediately.",
      icon: "heartbreak",
      tint: "#ff1744",
      use(s) {
        s.lives = Math.max(0, s.lives - 1);
        updateHUD(s);
        toast("Heartbreak… −1 life");
        if (s.lives <= 0) {
          s.mode = "dead";
          setTheme("dead");
          setTimeout(() => showEnd(s, false), 400);
        }
        return true;
      },
    },
    molasses: {
      id: "molasses",
      name: "MOLASSES",
      kind: "debuff",
      desc: "You orbit 45% slower for 6 seconds.",
      icon: "molasses",
      tint: "#8d6e63",
      use(s) {
        s.molassesT = 6;
        toast("Molasses legs…");
        return true;
      },
    },
    echotax: {
      id: "echotax",
      name: "ECHO TAX",
      kind: "debuff",
      desc: "Spawn +1 clone on a random ring.",
      icon: "echotax",
      tint: "#9b3dff",
      use(s) {
        s.enemies.push(makeEnemy((Math.random() * s.orbitCount) | 0));
        syncDebt(s);
        updateHUD(s);
        toast("+1 clone tax");
        return true;
      },
    },
    barrage: {
      id: "barrage",
      name: "BARRAGE",
      kind: "debuff",
      desc: "Planet lasers fire much faster for 7 seconds.",
      icon: "barrage",
      tint: "#ff6b4a",
      use(s) {
        s.barrageT = 7;
        toast("Laser barrage!");
        return true;
      },
    },
    gravity: {
      id: "gravity",
      name: "GRAVITY",
      kind: "debuff",
      desc: "Hop is locked for 5 seconds. Stay on the rail.",
      icon: "gravity",
      tint: "#5c6bc0",
      use(s) {
        s.gravityT = 5;
        s.player.hop = 0;
        s.player.radiusBoost = 0;
        toast("Hop locked");
        return true;
      },
    },
    scramble: {
      id: "scramble",
      name: "SCRAMBLE",
      kind: "debuff",
      desc: "Left/Right controls invert for 5 seconds.",
      icon: "scramble",
      tint: "#e040fb",
      use(s) {
        s.scrambleT = 5;
        toast("Controls scrambled!");
        return true;
      },
    },
    meteor: {
      id: "meteor",
      name: "METEOR",
      kind: "debuff",
      desc: "Asteroids spawn aggressively for 8 seconds.",
      icon: "meteor",
      tint: "#ff8a65",
      use(s) {
        s.meteorT = 8;
        s.asteroidTimer = Math.min(s.asteroidTimer, 0.6);
        toast("Meteor shower incoming");
        return true;
      },
    },
    clutter: {
      id: "clutter",
      name: "CLUTTER",
      kind: "debuff",
      desc: "Dump three asteroids into the sky immediately.",
      icon: "clutter",
      tint: "#a1887f",
      use(s) {
        const flags = flagsFor(s);
        const diff = difficultyFor(s);
        for (let i = 0; i < 3; i++) spawnAsteroid(s, flags, diff);
        toast("Sky cluttered!");
        return true;
      },
    },
    freeload: {
      id: "freeload",
      name: "FREELOAD",
      kind: "debuff",
      desc: "Spawn +2 clones on random rings. Debt party.",
      icon: "freeload",
      tint: "#7e57c2",
      use(s) {
        addRandomEnemies(s, 2);
        updateHUD(s);
        toast("+2 freeloaders");
        return true;
      },
    },
    reverse: {
      id: "reverse",
      name: "REVERSE",
      kind: "debuff",
      desc: "Your orbit direction flips instantly.",
      icon: "reverse",
      tint: "#26c6da",
      use(s) {
        s.player.dir *= -1;
        toast("Spun around!");
        return true;
      },
    },
    sticky: {
      id: "sticky",
      name: "STICKY",
      kind: "debuff",
      desc: "Can't change rings for 5 seconds (hop still works on the rim).",
      icon: "sticky",
      tint: "#ffb74d",
      use(s) {
        s.stickyT = 5;
        toast("Sticky rings…");
        return true;
      },
    },
    drain: {
      id: "drain",
      name: "DRAIN",
      kind: "debuff",
      desc: "Strip active buff timers and hollow charges.",
      icon: "drain",
      tint: "#78909c",
      use(s) {
        s.stutterT = s.chronoT = s.magnetT = s.sugarT = s.jellyT = s.glitterT = s.hushT = 0;
        s.rampageT = s.breezeT = 0;
        s.hollowCharges = 0;
        s.cottonCharges = 0;
        toast("Buffs drained…");
        return true;
      },
    },
  };

  const ALL_POWERUPS = [...Object.values(HOLD), ...Object.values(CONSUME), ...Object.values(DEBUFF)];
  const BUFF_POOL = [...Object.values(HOLD), ...Object.values(CONSUME)];
  const DEBUFF_POOL = Object.values(DEBUFF);
  const HOLD_POOL = Object.values(HOLD);
  const CONSUME_POOL = Object.values(CONSUME);


  // ---------- DRAW HELPERS (smooth cartoon) ----------
  function roundRect(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function softCircle(x, y, r, fill, stroke, sw = 3) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = sw;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  function shine(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x - r * 0.35, y - r * 0.35, r * 0.28, r * 0.18, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fill();
  }

  function drawPowerIcon(c, icon, size = 28, tint) {
    const x = c.getContext("2d");
    c.width = size;
    c.height = size;
    x.clearRect(0, 0, size, size);
    x.imageSmoothingEnabled = true;
    const mid = size / 2;
    const R = size * 0.42;
    const col = tint || C.pink;
    const g = x.createRadialGradient(mid - 3, mid - 3, 2, mid, mid, R);
    g.addColorStop(0, C.white);
    g.addColorStop(0.45, col);
    g.addColorStop(1, shade(col, -30));
    x.beginPath();
    x.arc(mid, mid, R, 0, Math.PI * 2);
    x.fillStyle = g;
    x.fill();
    x.lineWidth = 2;
    x.strokeStyle = C.ink;
    x.stroke();
    x.fillStyle = C.ink;
    x.font = `bold ${Math.floor(size * 0.42)}px Outfit`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    const glyph = {
      stutter: "❚❚",
      chrono: "⏱",
      hollow: "○",
      ledger: "⇄",
      magnet: "U",
      sugar: "✦",
      jelly: "◈",
      life: "♥",
      redact: "✕",
      purge: "☀",
      invert: "↻",
      sprinkle: "✶",
      warp: "⇢",
      zip: "»",
      nova: "✺",
      hush: "shh",
      feast: "★",
      confetti: "*",
      pocket: "▣",
      spark: "✦",
      stretch: "⟺",
      cleanse: "✧",
      siphon: "⇓",
      tidy: "✓",
      heartbreak: "†",
      molasses: "⬇",
      echotax: "+",
      barrage: "⚡",
      gravity: "⊗",
      scramble: "↺",
      meteor: "☄",
      clutter: "▮",
      freeload: "++",
      reverse: "↔",
      sticky: "≡",
      drain: "∅",
    }[icon] || "?";
    if (glyph === "shh") {
      x.font = `bold ${Math.floor(size * 0.28)}px Outfit`;
    }
    x.fillText(glyph === "🎉" ? "*" : glyph, mid, mid + 1);
  }

  function shade(hex, amt) {
    const n = hex.replace("#", "");
    const num = parseInt(n.length === 3 ? n.split("").map((c) => c + c).join("") : n, 16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0xff) + amt;
    let b = (num & 0xff) + amt;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }

  // ---------- HELPERS ----------
  function orbitRadius(count, index) {
    const inner = 80;
    const outer = Math.min(268, 80 + Math.max(1, count) * 36);
    if (count <= 1) return (inner + outer) / 2;
    return inner + (outer - inner) * (index / (count - 1));
  }

  function angleToPos(angle, r) {
    return { x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * r };
  }

  function wrapAngle(a) {
    a %= Math.PI * 2;
    if (a < 0) a += Math.PI * 2;
    return a;
  }

  function angDist(a, b) {
    let d = wrapAngle(a) - wrapAngle(b);
    d = ((d + Math.PI) % (Math.PI * 2)) - Math.PI;
    return Math.abs(d);
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function toast(msg) {
    ui.toast.textContent = msg;
    ui.toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => ui.toast.classList.remove("show"), 1400);
  }

  function campaignDuration(level) {
    return Math.max(12, 22 - level * 0.7);
  }

  function campaignOrbitCount(level) {
    return Math.min(8, Math.max(1, level));
  }

  function campaignDiff(level) {
    return Math.pow(1.38, level - 1);
  }

  function endlessOrbitCount(escalation) {
    return Math.min(8, 1 + escalation);
  }

  // ---------- STATE ----------
  function createState(mode) {
    return {
      mode: "title",
      gameMode: mode || "campaign",
      level: 1,
      lives: 3,
      timeLeft: campaignDuration(1),
      duration: campaignDuration(1),
      survived: 0,
      endlessTick: 0,
      escalation: 0,
      orbitCount: 1,
      debtPerOrbit: [0],
      player: {
        orbit: 0,
        angle: -Math.PI / 2,
        dir: 1,
        hop: 0,
        hopSign: 0,
        radiusBoost: 0,
        invuln: 0,
        blink: 0,
      },
      enemies: [],
      lasers: [],
      laserCooldown: 2.2,
      asteroids: [],
      fragments: [],
      asteroidTimer: 999,
      pickups: [],
      pickupsSpawned: 0,
      pendingPower: null,
      molassesT: 0,
      barrageT: 0,
      gravityT: 0,
      scrambleT: 0,
      stickyT: 0,
      meteorT: 0,
      rampageT: 0,
      breezeT: 0,
      previewT: 0,
      planetStyle: 0,
      maxSlots: 2,
      held: [null, null],
      stutterT: 0,
      chronoT: 0,
      magnetT: 0,
      sugarT: 0,
      jellyT: 0,
      glitterT: 0,
      hushT: 0,
      hollowCharges: 0,
      cottonCharges: 0,
      flash: 0,
      rewindT: 0,
      burst: [],
      particles: [],
      nebulaT: 0,
      keys: Object.create(null),
    };
  }

  let state = createState();
  let last = performance.now();
  let menuOrbit = 0;

  function syncDebt(s) {
    const counts = Array(s.orbitCount).fill(0);
    for (const e of s.enemies) {
      if (e.orbit >= s.orbitCount) e.orbit = s.orbitCount - 1;
      if (e.orbit < 0) e.orbit = 0;
      counts[e.orbit]++;
    }
    s.debtPerOrbit = counts;
  }

  function makeEnemy(orbit, angle, dir) {
    return {
      orbit,
      angle: wrapAngle(angle ?? rand(0, Math.PI * 2)),
      dir: dir ?? (Math.random() < 0.5 ? 1 : -1),
      wobble: rand(0, Math.PI * 2),
      blush: Math.random(),
      style: (Math.random() * 4) | 0, // ghost / bat / gel / spike
    };
  }

  function addRandomEnemies(s, count) {
    for (let i = 0; i < count; i++) {
      s.enemies.push(makeEnemy((Math.random() * s.orbitCount) | 0));
    }
    syncDebt(s);
  }

  function rollCandy() {
    const r = Math.random();
    // Equal thirds: hold / consume / debuff (pools are equal size too)
    if (r < 1 / 3) return HOLD_POOL[(Math.random() * HOLD_POOL.length) | 0];
    if (r < 2 / 3) return CONSUME_POOL[(Math.random() * CONSUME_POOL.length) | 0];
    return DEBUFF_POOL[(Math.random() * DEBUFF_POOL.length) | 0];
  }

  function spawnPickup(s, forced) {
    if ((s.pickupsSpawned || 0) >= 2) return;
    s.pickupsSpawned = (s.pickupsSpawned || 0) + 1;
    const power = forced || rollCandy();
    const slot = s.pickupsSpawned;
    const angle = wrapAngle(s.player.angle + (slot === 1 ? rand(0.8, 1.8) : rand(2.4, 4.0)));
    let orbit = (Math.random() * s.orbitCount) | 0;
    // Prefer different rings when possible
    if (s.pickups.length && s.orbitCount > 1) {
      const taken = s.pickups[0].orbit;
      if (orbit === taken) orbit = (taken + 1) % s.orbitCount;
    }
    s.pickups.push({
      power,
      orbit,
      angle,
      bob: rand(0, Math.PI * 2),
      life: 9999,
      spin: 0,
    });
  }

  function spawnLevelCandies(s) {
    s.pickups = [];
    s.pickupsSpawned = 0;
    spawnPickup(s);
    spawnPickup(s);
  }

  function startPreview(s) {
    s.mode = "preview";
    s.previewT = 1.7;
    if (ui.previewBanner) {
      ui.previewBanner.textContent = s.gameMode === "campaign" ? `LEVEL ${s.level}` : `WAVE ${s.escalation + 1}`;
      ui.previewBanner.classList.remove("hidden");
    }
  }

  function showPowerInfo(s, power) {
    s.mode = "powerInfo";
    s.pendingPower = power;
    setTheme("none"); // hard silence — no track overlap under popup
    const panel = ui.pick.querySelector(".info-panel");
    if (panel) panel.classList.toggle("debuff", power.kind === "debuff");
    if (power.kind === "hold") {
      ui.infoKind.textContent = "SAVED TO SLOTS";
      ui.infoHint.textContent = "Press 1–4 later to use it.";
    } else if (power.kind === "debuff") {
      ui.infoKind.textContent = "OH NO…";
      ui.infoHint.textContent = "Applies when you continue.";
    } else {
      ui.infoKind.textContent = "INSTANT";
      ui.infoHint.textContent = "Applies when you continue.";
    }
    ui.infoName.textContent = power.name;
    ui.infoDesc.textContent = power.desc;
    drawPowerIcon(ui.infoIcon, power.icon, 64, power.tint);
    ui.pick.classList.remove("hidden");
  }

  function dismissPowerInfo() {
    const s = state;
    if (s.mode !== "powerInfo") return;
    const power = s.pendingPower;
    s.pendingPower = null;
    ui.pick.classList.add("hidden");
    const panel = ui.pick.querySelector(".info-panel");
    if (panel) panel.classList.remove("debuff");
    s.mode = "play";
    setTheme("play");
    if (power) {
      if (power.kind === "consume" || power.kind === "debuff") power.use(s);
      else addHoldPower(s, power);
    }
    if (s.mode === "play") s.player.invuln = Math.max(s.player.invuln, 0.6);
  }

  function collectPickup(s, pu) {
    sfx.pick();
    const p = pu.power;
    const r = orbitRadius(s.orbitCount, pu.orbit);
    const pos = angleToPos(pu.angle, r);
    for (let i = 0; i < 14; i++) {
      const a = rand(0, Math.PI * 2);
      s.particles.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(a) * rand(40, 140),
        vy: Math.sin(a) * rand(40, 140),
        life: rand(0.35, 0.8),
        color: p.tint || C.pink,
        r: rand(2, 5),
      });
    }
    s.pickups = s.pickups.filter((x) => x !== pu);
    showPowerInfo(s, p);
  }

  function beginCampaignLevel(s, level, fromAdvance) {
    s.mode = "play";
    s.level = level;
    const prevOrbits = s.orbitCount;
    s.orbitCount = campaignOrbitCount(level);
    for (const e of s.enemies) {
      if (e.orbit >= s.orbitCount) e.orbit = s.orbitCount - 1;
    }
    if (level === 1 && !fromAdvance) {
      s.enemies = [];
    } else if (s.orbitCount > prevOrbits) {
      // New orbit arrives with exactly one enemy
      s.enemies.push(makeEnemy(s.orbitCount - 1));
    }

    const diff = campaignDiff(level);
    s.duration = campaignDuration(level);
    s.timeLeft = s.duration;
    s.lasers = [];
    s.asteroids = [];
    s.fragments = [];
    s.pickups = [];
    s.burst = [];
    s.laserCooldown = Math.max(0.45, 2.3 / Math.sqrt(diff));
    s.asteroidTimer = level >= 4 ? Math.max(0.8, 3.2 / diff) : 999;
    s.pickupsSpawned = 0;
    s.pendingPower = null;
    s.stutterT = s.chronoT = s.magnetT = s.sugarT = s.jellyT = s.glitterT = s.hushT = 0;
    s.molassesT = s.barrageT = s.gravityT = s.scrambleT = s.stickyT = s.meteorT = s.rampageT = s.breezeT = 0;
    s.player.orbit = Math.min(s.player.orbit, s.orbitCount - 1);
    if (s.orbitCount > prevOrbits) s.player.orbit = Math.min(s.player.orbit + 1, s.orbitCount - 1);
    s.player.angle = -Math.PI / 2;
    s.player.hop = 0;
    s.player.radiusBoost = 0;
    s.player.invuln = 1.2;
    s.player.blink = 1.2;
    syncDebt(s);

    // Two mystery candies per level
    spawnLevelCandies(s);
    s.planetStyle = Math.floor((level - 1) / 2) % 5;

    ui.pick.classList.add("hidden");
    setTheme("play");
    showHud(true);
    ui.overlay.classList.add("hidden");
    ui.overlay.classList.remove("show");
    ui.endScreen.classList.add("hidden");
    updateHUD(s);
    startPreview(s);
  }


  function beginEndless(s) {
    s.mode = "play";
    s.gameMode = "endless";
    s.level = 1;
    s.escalation = 0;
    s.endlessTick = 15;
    s.orbitCount = 1;
    s.enemies = [];
    s.duration = 15;
    s.timeLeft = 15;
    s.survived = 0;
    s.lasers = [];
    s.asteroids = [];
    s.fragments = [];
    s.pickups = [];
    s.pickupsSpawned = 0;
    s.pendingPower = null;
    s.laserCooldown = 2.2;
    s.asteroidTimer = 999;
    s.player.orbit = 0;
    s.player.angle = -Math.PI / 2;
    s.player.invuln = 1.2;
    s.player.blink = 1.2;
    spawnLevelCandies(s);
    s.planetStyle = 0;
    setTheme("play");
    showHud(true);
    ui.overlay.classList.add("hidden");
    ui.overlay.classList.remove("show");
    ui.endScreen.classList.add("hidden");
    updateHUD(s);
    startPreview(s);
  }

  function escalateEndless(s) {
    s.escalation++;
    s.endlessTick = 15;
    s.timeLeft = 15;
    s.duration = 15;
    const prevOrbits = s.orbitCount;
    s.orbitCount = endlessOrbitCount(s.escalation);
    for (const e of s.enemies) if (e.orbit >= s.orbitCount) e.orbit = s.orbitCount - 1;
    if (s.orbitCount > prevOrbits) {
      s.enemies.push(makeEnemy(s.orbitCount - 1));
    }
    s.laserCooldown = Math.max(0.4, 2.1 - s.escalation * 0.08);
    if (s.escalation >= 2) s.asteroidTimer = Math.max(0.7, 2.8 - s.escalation * 0.12);
    spawnLevelCandies(s);
    s.planetStyle = Math.floor(s.escalation / 2) % 5;
    toast(`Escalation ${s.escalation}`);
    sfx.clear();
    updateHUD(s);
    startPreview(s);
  }

  function addHoldPower(s, p) {
    while (s.held.length < (s.maxSlots || 2)) s.held.push(null);
    const free = s.held.findIndex((x) => !x);
    if (free === -1) {
      toast("Slots full — candy crumbled");
      return false;
    }
    s.held[free] = p;
    toast(`${p.name} → slot ${free + 1}`);
    updateSlots(s);
    return true;
  }

  function showHud(on) {
    ui.hud.classList.toggle("hidden", !on);
  }

  function updateHUD(s) {
    if (s.gameMode === "campaign") {
      ui.modeLabel.textContent = "CAMPAIGN";
      ui.levelLabel.textContent = `LEVEL ${s.level} / 10`;
      const m = Math.floor(s.timeLeft / 60);
      const sec = Math.ceil(s.timeLeft % 60);
      ui.timer.textContent = `${m}:${String(sec).padStart(2, "0")}`;
      ui.timerFill.style.width = `${Math.max(0, (s.timeLeft / s.duration) * 100)}%`;
      ui.escalation.textContent = `HEAT ×${campaignDiff(s.level).toFixed(1)}`;
    } else {
      ui.modeLabel.textContent = "ENDLESS";
      ui.levelLabel.textContent = `ALIVE ${Math.floor(s.survived)}s`;
      ui.timer.textContent = `${Math.ceil(s.endlessTick)}s`;
      ui.timerFill.style.width = `${Math.max(0, (s.endlessTick / 15) * 100)}%`;
      ui.escalation.textContent = `ESCALATION ${s.escalation}`;
    }
    ui.lives.innerHTML = "";
    for (let i = 0; i < s.lives; i++) {
      const pip = document.createElement("div");
      pip.className = "life-pip";
      ui.lives.appendChild(pip);
    }
    ui.debtLabel.textContent = `DEBT ${s.enemies.length}`;
    updateSlots(s);
  }

  function updateSlots(s) {
    const root = document.getElementById("slots");
    if (!root) return;
    const n = s.maxSlots || 2;
    while (s.held.length < n) s.held.push(null);
    if (s.held.length > n) s.held.length = n;
    // Rebuild if slot count changed
    if (root.children.length !== n) {
      root.innerHTML = "";
      for (let i = 0; i < n; i++) {
        const btn = document.createElement("button");
        btn.className = "slot";
        btn.type = "button";
        btn.title = `Slot ${i + 1}`;
        btn.dataset.slot = String(i);
        btn.innerHTML = `<span class="slot-key">${i + 1}</span><canvas class="slot-icon" width="28" height="28"></canvas>`;
        btn.addEventListener("click", () => useSlot(state, i));
        root.appendChild(btn);
      }
    }
    [...root.children].forEach((el, i) => {
      const p = s.held[i];
      el.classList.toggle("filled", !!p);
      const c = el.querySelector("canvas");
      if (p) drawPowerIcon(c, p.icon, 28, p.tint);
      else {
        const x = c.getContext("2d");
        c.width = 28;
        c.height = 28;
        x.clearRect(0, 0, 28, 28);
        x.strokeStyle = "rgba(58,42,85,0.2)";
        x.lineWidth = 2;
        x.beginPath();
        x.arc(14, 14, 9, 0, Math.PI * 2);
        x.stroke();
      }
    });
  }

  function useSlot(s, idx) {
    const p = s.held[idx];
    if (!p || s.mode !== "play") return;
    if (p.use(s)) {
      s.held[idx] = null;
      updateSlots(s);
    }
  }

  function killPlayer(s, reason) {
    if (s.player.invuln > 0 || s.mode !== "play") return;
    if (s.hollowCharges > 0) {
      s.hollowCharges--;
      s.player.invuln = 1;
      const pos = angleToPos(s.player.angle, currentRadius(s));
      s.burst.push({ x: pos.x, y: pos.y, t: 0.35, color: C.mint, r: 30 });
      toast("Bubble popped!");
      return;
    }

    s.lives--;
    s.rewindT = 0.35;
    s.flash = 0.3;
    sfx.hit();
    s.player.invuln = 1.6;
    s.player.blink = 1.6;
    s.player.hop = 0;
    s.player.radiusBoost = 0;
    // Any hit adds one enemy on a random orbit
    s.enemies.push(makeEnemy((Math.random() * s.orbitCount) | 0));
    syncDebt(s);
    s.player.angle = wrapAngle(s.player.angle - s.player.dir * 0.55);
    spawnHitParticles(angleToPos(s.player.angle, currentRadius(s)));
    toast(reason || "Ouch — clone spawned");
    updateHUD(s);

    if (s.lives <= 0) {
      s.mode = "dead";
      setTheme("dead");
      setTimeout(() => showEnd(s, false), 500);
    }
  }

  function showEnd(s, won) {
    s.mode = "title";
    showHud(false);
    if (ui.previewBanner) ui.previewBanner.classList.add("hidden");
    ui.endScreen.classList.remove("hidden");
    if (won) {
      setTheme("win");
      ui.endTitle.textContent = "LEDGER CLOSED";
      ui.endTag.textContent = `Campaign cleared · debt ${s.enemies.length} · ${Math.floor(s.survived)}s`;
    } else {
      setTheme("dead");
      ui.endTitle.textContent = "DEBT DEFAULT";
      ui.endTag.textContent =
        s.gameMode === "endless"
          ? `Survived ${Math.floor(s.survived)}s · esc ${s.escalation} · clones ${s.enemies.length}`
          : `Level ${s.level}/10 · clones ${s.enemies.length}`;
    }
  }

  function clearLevel(s) {
    s.mode = "clear";
    syncDebt(s);
    sfx.clear();
    toast(`Level ${s.level} cleared!`);
    if (s.level >= 10) {
      setTimeout(() => showEnd(s, true), 700);
      return;
    }
    setTimeout(() => beginCampaignLevel(s, s.level + 1, true), 850);
  }

  function currentRadius(s) {
    return orbitRadius(s.orbitCount, s.player.orbit) + s.player.radiusBoost;
  }

  function tryHop(s) {
    const p = s.player;
    if (p.hop > 0) return false;
    if (s.gravityT > 0) {
      toast("Gravity lock…");
      return false;
    }
    const inner = p.orbit === 0;
    const outer = p.orbit === s.orbitCount - 1;
    if (!inner && !outer) {
      toast("Hop only on rim rings");
      return false;
    }
    const big = s.cottonCharges > 0;
    if (big) s.cottonCharges--;
    p.hop = big ? 0.55 : 0.42;
    p.hopSign = outer ? 1 : -1;
    p._hopBoost = big ? 52 : 34;
    if (big) {
      p.invuln = Math.max(p.invuln, 0.55);
      toast("Cotton hop!");
    }
    return true;
  }

  // delta +1 = outer (W/↑), -1 = inner (S/↓). Switch if a ring exists; otherwise hop.
  function tryRingOrHop(s, delta) {
    const next = s.player.orbit + delta;
    if (next >= 0 && next < s.orbitCount) {
      if (s.stickyT > 0) {
        toast("Sticky rings…");
        return;
      }
      s.player.orbit = next;
      sfx.flip();
      return;
    }
    if (tryHop(s)) sfx.hop();
  }

  function spawnHitParticles(pos) {
    for (let i = 0; i < 16; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(50, 170);
      state.particles.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.3, 0.75),
        color: [C.pink, C.lilac, C.mint, C.butter][i % 4],
        r: rand(2, 4.5),
      });
    }
  }

  function difficultyFor(s) {
    if (s.gameMode === "campaign") return campaignDiff(s.level);
    return Math.pow(1.18, s.escalation);
  }

  function playerSpeed(s) {
    let base = 1.5 + (s.gameMode === "campaign" ? s.level * 0.04 : s.escalation * 0.05);
    if (s.sugarT > 0) base *= 1.6;
    if (s.molassesT > 0) base *= 0.55;
    return base;
  }

  function flagsFor(s) {
    const lvl = s.gameMode === "campaign" ? s.level : 1 + s.escalation;
    return {
      lasers: true,
      multiLaser: lvl >= 3,
      fastLaser: lvl >= 6,
      asteroids: lvl >= 4,
      denseAsteroids: lvl >= 8,
      fragmentsHurt: lvl >= 4,
      aggressiveAim: lvl >= 9,
    };
  }

  // ---------- UPDATE ----------
  function update(s, dt) {
    s.nebulaT += dt;
    menuOrbit += dt;
    tickMusic(dt);

    if (s.mode === "title") return;

    if (s.mode === "preview") {
      s.previewT -= dt;
      s.nebulaT += dt;
      tickParticles(s, dt);
      if (s.previewT <= 0) {
        s.previewT = 0;
        s.mode = "play";
        if (ui.previewBanner) ui.previewBanner.classList.add("hidden");
        s.player.invuln = Math.max(s.player.invuln, 0.5);
      }
      return;
    }

    if (s.mode !== "play") {
      if (s.rewindT > 0) s.rewindT = Math.max(0, s.rewindT - dt);
      if (s.flash > 0) s.flash = Math.max(0, s.flash - dt);
      tickParticles(s, dt);
      return;
    }

    const timeScale = s.chronoT > 0 ? 0.45 : 1;
    const gdt = dt * timeScale;

    [
      "chronoT",
      "stutterT",
      "magnetT",
      "sugarT",
      "jellyT",
      "glitterT",
      "hushT",
      "molassesT",
      "barrageT",
      "gravityT",
      "scrambleT",
      "stickyT",
      "meteorT",
      "rampageT",
      "breezeT",
      "flash",
      "rewindT",
    ].forEach((k) => {
      if (s[k] > 0) s[k] = Math.max(0, s[k] - dt);
    });

    const p = s.player;
    p.invuln = Math.max(0, p.invuln - dt);
    p.blink = Math.max(0, p.blink - dt);
    if (s.rampageT > 0) p.invuln = Math.max(p.invuln, 0.05);

    if (p.hop > 0) {
      const maxHop = p._hopBoost > 40 ? 0.55 : 0.42;
      p.hop -= dt;
      const t = 1 - p.hop / maxHop;
      p.radiusBoost = Math.sin(t * Math.PI) * (p._hopBoost || 34) * p.hopSign;
      if (p.hop <= 0) {
        p.hop = 0;
        p.radiusBoost = 0;
      }
    }

    const spd = playerSpeed(s);
    p.angle = wrapAngle(p.angle + p.dir * spd * gdt);

    if (s.stutterT <= 0) {
      for (const e of s.enemies) {
        // Slower clones (esp. readable on outer rings); Breeze slows further
        let eMult = 0.34;
        if (s.breezeT > 0) eMult *= 0.5;
        e.angle = wrapAngle(e.angle + e.dir * (spd * eMult) * gdt);
        e.wobble += gdt * 3.5;
      }
    }

    s.survived += gdt;
    const flags = flagsFor(s);
    const diff = difficultyFor(s);

    if (s.gameMode === "campaign") {
      s.timeLeft -= gdt;
      if (s.timeLeft <= 0) {
        s.timeLeft = 0;
        clearLevel(s);
        updateHUD(s);
        return;
      }
    } else {
      s.endlessTick -= gdt;
      s.timeLeft = s.endlessTick;
      if (s.endlessTick <= 0) escalateEndless(s);
    }

    // Candies bounce on their orbit so they read clearly against the ring
    for (const pu of s.pickups) {
      pu.bob += gdt * 7.5;
      pu.spin += gdt * 2;
      pu.angle += 0.08 * gdt;
    }

    if (s.hushT <= 0) {
      s.laserCooldown -= gdt;
      if (s.laserCooldown <= 0) {
        fireLaser(s, flags);
        const base = flags.fastLaser ? 1.05 : 1.65;
        let cd = Math.max(
          0.4,
          (base - (s.gameMode === "endless" ? s.escalation * 0.05 : s.level * 0.05)) / Math.sqrt(diff)
        );
        if (s.barrageT > 0) cd *= 0.42;
        s.laserCooldown = Math.max(0.22, cd);
      }
    }
    for (const L of s.lasers) L.t += gdt;
    s.lasers = s.lasers.filter((L) => L.t < L.wind + L.hold);

    if (flags.asteroids || s.meteorT > 0) {
      s.asteroidTimer -= gdt;
      if (s.asteroidTimer <= 0) {
        spawnAsteroid(s, flags, diff);
        let at = (flags.denseAsteroids || s.meteorT > 0 ? rand(0.55, 1.2) : rand(1.8, 3.1)) / Math.sqrt(diff);
        if (s.meteorT > 0) at *= 0.65;
        s.asteroidTimer = at;
      }
    }

    for (const a of s.asteroids) {
      a.x += a.vx * gdt;
      a.y += a.vy * gdt;
      a.spin += a.spinV * gdt;
      a.life -= gdt;
    }
    s.asteroids = s.asteroids.filter((a) => a.life > 0 && a.x > -90 && a.x < W + 90 && a.y > -90 && a.y < H + 90);

    for (const f of s.fragments) {
      f.x += f.vx * gdt;
      f.y += f.vy * gdt;
      f.life -= gdt;
      if (s.magnetT > 0) {
        const dx = CX - f.x;
        const dy = CY - f.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 220) {
          f.life -= gdt * 3;
          f.vx += (dx / d) * 40 * gdt;
          f.vy += (dy / d) * 40 * gdt;
        }
      }
    }
    s.fragments = s.fragments.filter((f) => f.life > 0);

    for (const b of s.burst) b.t -= dt;
    s.burst = s.burst.filter((b) => b.t > 0);
    tickParticles(s, gdt);

    if (Math.random() < 0.25) {
      s.particles.push({
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-6, 6),
        vy: rand(-10, -2),
        life: rand(0.5, 1.4),
        color: [C.pink, C.lilac, C.mint, C.aqua, C.butter][(Math.random() * 5) | 0],
        r: rand(1.5, 3),
      });
    }

    collideAll(s, flags);
    updateHUD(s);
  }

  function tickParticles(s, dt) {
    for (const part of s.particles) {
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.life -= dt;
    }
    s.particles = s.particles.filter((part) => part.life > 0);
  }

  function fireLaser(s, flags) {
    const count = flags.multiLaser ? (flags.aggressiveAim ? 3 : 2) : 1;
    for (let i = 0; i < count; i++) {
      const angle =
        flags.aggressiveAim && Math.random() < 0.55
          ? s.player.angle + rand(-0.15, 0.15)
          : rand(0, Math.PI * 2);
      s.lasers.push({
        angle,
        t: 0,
        wind: flags.fastLaser ? 0.42 : 0.68,
        hold: 0.2,
        width: 9 + Math.min(7, s.level + s.escalation),
      });
    }
    sfx.laser();
  }

  function spawnAsteroid(s, flags, diff) {
    const side = (Math.random() * 4) | 0;
    let x, y;
    if (side === 0) {
      x = rand(0, W);
      y = -30;
    } else if (side === 1) {
      x = W + 30;
      y = rand(0, H);
    } else if (side === 2) {
      x = rand(0, W);
      y = H + 30;
    } else {
      x = -30;
      y = rand(0, H);
    }
    const tx = CX + rand(-40, 40);
    const ty = CY + rand(-40, 40);
    const dx = tx - x;
    const dy = ty - y;
    const d = Math.hypot(dx, dy) || 1;
    const speed = ((flags.denseAsteroids ? 95 : 72) + (s.level + s.escalation) * 4) * Math.min(1.6, Math.sqrt(diff));
    s.asteroids.push({
      x,
      y,
      vx: (dx / d) * speed,
      vy: (dy / d) * speed,
      r: rand(14, 22),
      spin: rand(0, Math.PI),
      spinV: rand(-2.5, 2.5),
      life: 10,
      style: (Math.random() * 3) | 0,
    });
  }

  function shatterAsteroid(s, a, intoFragments) {
    const idx = s.asteroids.indexOf(a);
    if (idx >= 0) s.asteroids.splice(idx, 1);
    s.burst.push({ x: a.x, y: a.y, t: 0.28, color: C.peach, r: a.r });
    if (!intoFragments) return;
    const n = 3 + ((Math.random() * 3) | 0);
    for (let i = 0; i < n; i++) {
      const ang = rand(0, Math.PI * 2);
      const sp = rand(40, 120);
      s.fragments.push({
        x: a.x,
        y: a.y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        r: rand(4, 8),
        life: rand(2.5, 4.5),
      });
    }
  }

  function collideAll(s, flags) {
    const pr = currentRadius(s);
    const pp = angleToPos(s.player.angle, pr);
    const playerR = 10;

    // Pickups
    for (const pu of s.pickups.slice()) {
      if (pu.orbit !== s.player.orbit) continue;
      if (Math.abs(s.player.radiusBoost) > 18) continue;
      if (angDist(pu.angle, s.player.angle) < 0.2) {
        collectPickup(s, pu);
      }
    }

    for (let ei = s.enemies.length - 1; ei >= 0; ei--) {
      const e = s.enemies[ei];
      if (e.orbit !== s.player.orbit) continue;
      if (Math.abs(s.player.radiusBoost) > 16) continue;
      if (angDist(e.angle, s.player.angle) < 0.14) {
        if (s.rampageT > 0) {
          const er = orbitRadius(s.orbitCount, e.orbit);
          const ep = angleToPos(e.angle, er);
          s.enemies.splice(ei, 1);
          syncDebt(s);
          s.burst.push({ x: ep.x, y: ep.y, t: 0.3, color: C.pink, r: 26 });
          toast("Clone crushed!");
          continue;
        }
        killPlayer(s, "Bumped a clone!");
        return;
      }
    }

    for (const L of s.lasers) {
      if (L.t < L.wind) continue;
      if (s.glitterT > 0) continue;
      if (angDist(s.player.angle, L.angle) < 0.09 && Math.abs(s.player.radiusBoost) < 22) {
        killPlayer(s, "Lasered!");
        return;
      }
      for (const a of s.asteroids.slice()) {
        const ap = { x: a.x - CX, y: a.y - CY };
        const ang = Math.atan2(ap.y, ap.x);
        const rad = Math.hypot(ap.x, ap.y);
        if (rad < 40 || rad > 320) continue;
        if (angDist(ang, L.angle) < 0.08) shatterAsteroid(s, a, true);
      }
    }

    for (const a of s.asteroids.slice()) {
      if (Math.hypot(a.x - pp.x, a.y - pp.y) < a.r + playerR) {
        if (s.jellyT > 0) {
          shatterAsteroid(s, a, true);
          s.burst.push({ x: a.x, y: a.y, t: 0.2, color: C.mint, r: 24 });
          continue;
        }
        killPlayer(s, "Asteroid!");
        shatterAsteroid(s, a, false);
        return;
      }
      for (const e of s.enemies) {
        const er = orbitRadius(s.orbitCount, e.orbit);
        const ep = angleToPos(e.angle, er);
        if (Math.hypot(a.x - ep.x, a.y - ep.y) < a.r + 8) {
          shatterAsteroid(s, a, true);
          break;
        }
      }
    }

    if (flags.fragmentsHurt) {
      for (const f of s.fragments) {
        if (s.magnetT > 0 || s.jellyT > 0) continue;
        if (Math.hypot(f.x - pp.x, f.y - pp.y) < f.r + playerR) {
          killPlayer(s, "Sprinkle debris!");
          f.life = 0;
          return;
        }
      }
    }
  }

  // ---------- DRAW ----------
  function draw(s) {
    ctx.save();
    if (s.rewindT > 0) {
      const k = s.rewindT / 0.35;
      ctx.translate(rand(-4, 4) * k, rand(-3, 3) * k);
    }

    // Mellow shaded cotton sky — soft, not busy
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#fff7fc");
    g.addColorStop(0.4, "#f3e9ff");
    g.addColorStop(0.75, "#eaf6ff");
    g.addColorStop(1, "#e8fff6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Gentle vignette
    const vig = ctx.createRadialGradient(CX, CY, 80, CX, CY, 420);
    vig.addColorStop(0, "rgba(255,255,255,0)");
    vig.addColorStop(1, "rgba(180,150,210,0.14)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // Slow drifting soft shade bands
    drawBlob(CX - 160 + Math.sin(s.nebulaT * 0.15) * 30, 140, 200, "rgba(255,190,220,0.18)");
    drawBlob(CX + 180, CY + 90, 210, "rgba(180,220,255,0.16)");
    drawBlob(CX - 40, CY + 40, 240, "rgba(210,190,255,0.12)");

    // Sparse pixel dust
    for (let i = 0; i < 28; i++) {
      const seed = i * 97.13;
      const x = ((seed * 13 + s.nebulaT * 4) % W) | 0;
      const y = (seed * 29) % H | 0;
      ctx.globalAlpha = 0.25 + 0.2 * Math.sin(s.nebulaT + i);
      ctx.fillStyle = i % 2 ? C.lilac : C.pink;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;

    if (s.mode === "title" && ui.overlay.classList.contains("show")) {
      drawTitleDecor();
      ctx.restore();
      return;
    }

    drawPlanet(s);
    drawRings(s);
    drawLasers(s);
    drawAsteroids(s);
    drawPickups(s);
    drawEnemies(s);
    drawPlayer(s);
    drawParticles(s);
    drawBursts(s);
    drawStatusPills(s);

    if (s.flash > 0) {
      ctx.fillStyle = `rgba(255,143,196,${s.flash * 0.35})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (s.chronoT > 0) {
      ctx.fillStyle = "rgba(201,168,255,0.08)";
      ctx.fillRect(0, 0, W, H);
    }
    if (s.glitterT > 0) {
      ctx.fillStyle = "rgba(255,226,122,0.07)";
      ctx.fillRect(0, 0, W, H);
    }

    ctx.restore();
  }

  function drawBlob(x, y, r, col) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStatusPills(s) {
    const pills = [];
    if (s.stutterT > 0) pills.push({ t: "STUTTER", c: C.aqua });
    if (s.chronoT > 0) pills.push({ t: "CHRONO", c: C.lilac });
    if (s.sugarT > 0) pills.push({ t: "SUGAR", c: C.pink });
    if (s.jellyT > 0) pills.push({ t: "JELLY", c: C.mint });
    if (s.glitterT > 0) pills.push({ t: "GLITTER", c: C.butter });
    if (s.hushT > 0) pills.push({ t: "HUSH", c: C.aqua });
    if (s.molassesT > 0) pills.push({ t: "SLOW", c: C.coral });
    if (s.barrageT > 0) pills.push({ t: "BARRAGE", c: C.peach });
    if (s.gravityT > 0) pills.push({ t: "NO HOP", c: C.lilac });
    if (s.scrambleT > 0) pills.push({ t: "SCRAMBLE", c: C.aqua });
    if (s.stickyT > 0) pills.push({ t: "STICKY", c: C.peach });
    if (s.meteorT > 0) pills.push({ t: "METEOR", c: C.butter });
    if (s.rampageT > 0) pills.push({ t: "RAMPAGE", c: C.pink });
    if (s.breezeT > 0) pills.push({ t: "BREEZE", c: C.mint });
    if (s.hollowCharges > 0) pills.push({ t: "SHELL", c: C.mint });
    let x = W - 16;
    ctx.font = "bold 11px Outfit";
    ctx.textAlign = "right";
    for (const pill of pills) {
      const w = ctx.measureText(pill.t).width + 16;
      roundRect(x - w, H - 28, w, 18, 9);
      ctx.fillStyle = pill.c;
      ctx.fill();
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = C.ink;
      ctx.fillText(pill.t, x - 8, H - 15);
      x -= w + 6;
    }
  }

  function drawTitleDecor() {
    for (let i = 0; i < 6; i++) {
      const a = menuOrbit * (0.35 + i * 0.07) + i;
      const r = 110 + i * 26;
      const pos = angleToPos(a, r);
      drawChar(pos.x, pos.y, i % 2 ? "clone" : "player", 0.9 + (i % 3) * 0.08, a, i % 2 ? i % 4 : selectedSkin);
    }
    drawPlanet({ nebulaT: menuOrbit });
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(CX, CY, orbitRadius(3, i), 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? "rgba(255,143,196,0.55)" : "rgba(201,168,255,0.4)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  function drawPlanet(s) {
    const t = s.nebulaT || 0;
    const style = (s.planetStyle || 0) % 5;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    const palettes = [
      [C.cream, C.peach, C.pink, C.lilacDeep],
      [C.cream, C.mint, "#5ed9a8", "#2a8f6e"],
      [C.cream, C.lilac, "#b388ff", "#6a3db8"],
      [C.cream, C.butter, "#ffd54a", "#e09120"],
      [C.cream, C.aqua, "#6ad4ff", "#2a7f9e"],
    ];
    const [c0, c1, c2, c3] = palettes[style];
    const ringA = [C.butter, C.mint, C.lilac, C.peach, C.pink][style];
    const ringB = [C.pink, C.aqua, C.butter, C.lilac, C.mint][style];

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(t * 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 62, 18, 0.35, 0, Math.PI * 2);
    ctx.strokeStyle = ringA;
    ctx.globalAlpha = 0.45 + pulse * 0.2;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, 70, 22, -0.6, 0.1, Math.PI + 0.4);
    ctx.strokeStyle = ringB;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(CX, CY + 28, 34, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(58,42,85,0.1)";
    ctx.fill();

    // Pixel-ish shaded body (band layers)
    const R = 40;
    for (let y = -R; y <= R; y += 3) {
      const half = Math.sqrt(Math.max(0, R * R - y * y)) | 0;
      const u = (y + R) / (2 * R);
      let col = c1;
      if (u < 0.25) col = c0;
      else if (u < 0.55) col = c1;
      else if (u < 0.8) col = c2;
      else col = c3;
      ctx.fillStyle = col;
      ctx.fillRect((CX - half) | 0, (CY + y) | 0, half * 2, 3);
    }
    // Outline
    ctx.beginPath();
    ctx.arc(CX, CY, R + 1, 0, Math.PI * 2);
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Face variants
    const ink = C.ink;
    ctx.fillStyle = ink;
    if (style === 0) {
      ctx.fillRect(CX - 12, CY - 6, 5, 5);
      ctx.fillRect(CX + 7, CY - 6, 5, 5);
      ctx.fillStyle = C.white;
      ctx.fillRect(CX - 11, CY - 5, 2, 2);
      ctx.fillRect(CX + 8, CY - 5, 2, 2);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(CX, CY + 8, 9, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,143,196,0.5)";
      ctx.fillRect(CX - 20, CY + 4, 6, 4);
      ctx.fillRect(CX + 14, CY + 4, 6, 4);
    } else if (style === 1) {
      // sleepy dashes
      ctx.fillRect(CX - 14, CY - 4, 8, 3);
      ctx.fillRect(CX + 6, CY - 4, 8, 3);
      ctx.fillRect(CX - 4, CY + 8, 8, 3);
      // leaf freckle
      ctx.fillStyle = C.mint;
      ctx.fillRect(CX + 10, CY + 10, 4, 4);
    } else if (style === 2) {
      // big sparkle eyes
      ctx.fillRect(CX - 14, CY - 8, 6, 6);
      ctx.fillRect(CX + 8, CY - 8, 6, 6);
      ctx.fillStyle = C.white;
      ctx.fillRect(CX - 12, CY - 6, 2, 2);
      ctx.fillRect(CX + 10, CY - 6, 2, 2);
      ctx.fillStyle = ink;
      ctx.fillRect(CX - 5, CY + 6, 10, 3);
    } else if (style === 3) {
      // cat smile
      ctx.fillRect(CX - 11, CY - 5, 4, 4);
      ctx.fillRect(CX + 7, CY - 5, 4, 4);
      ctx.beginPath();
      ctx.moveTo(CX, CY + 2);
      ctx.lineTo(CX - 6, CY + 10);
      ctx.lineTo(CX + 6, CY + 10);
      ctx.closePath();
      ctx.fill();
    } else {
      // wink
      ctx.fillRect(CX - 12, CY - 5, 5, 5);
      ctx.fillRect(CX + 6, CY - 4, 8, 3);
      ctx.fillStyle = C.white;
      ctx.fillRect(CX - 11, CY - 4, 2, 2);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(CX, CY + 9, 8, 0.15, Math.PI - 0.15);
      ctx.stroke();
    }
  }

  function drawRings(s) {
    for (let i = 0; i < s.orbitCount; i++) {
      const r = orbitRadius(s.orbitCount, i);
      const active = i === s.player.orbit;
      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, Math.PI * 2);
      ctx.strokeStyle = active ? C.pink : "rgba(201,168,255,0.45)";
      ctx.lineWidth = active ? 4 : 2.5;
      ctx.setLineDash(active ? [] : [6, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Soft underglow
      if (active) {
        ctx.beginPath();
        ctx.arc(CX, CY, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,143,196,0.25)";
        ctx.lineWidth = 10;
        ctx.stroke();
      }

      const debt = s.debtPerOrbit[i] || 0;
      if (debt > 0) {
        const tip = angleToPos(-0.95, r);
        roundRect(tip.x + 4, tip.y - 10, 28, 16, 8);
        ctx.fillStyle = C.coral;
        ctx.fill();
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = C.white;
        ctx.font = "bold 11px Outfit";
        ctx.textAlign = "center";
        ctx.fillText(`×${debt}`, tip.x + 18, tip.y + 2);
      }
    }
  }


  function polyPath(c, pts, scale) {
    c.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const x = pts[i][0] * scale;
      const y = pts[i][1] * scale;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.closePath();
  }

  function fillPoly(c, pts, scale, fill, stroke, sw) {
    polyPath(c, pts, scale);
    if (fill) {
      c.fillStyle = fill;
      c.fill();
    }
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = sw || 2;
      c.lineJoin = "round";
      c.lineCap = "round";
      c.stroke();
    }
  }

  function shadePoly(c, pts, scale, c0, c1, stroke, sw) {
    polyPath(c, pts, scale);
    const xs = pts.map((p) => p[0] * scale);
    const ys = pts.map((p) => p[1] * scale);
    const g = c.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
    g.addColorStop(0, c0);
    g.addColorStop(1, c1);
    c.fillStyle = g;
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = sw == null ? 2.2 : sw;
      c.lineJoin = "round";
      c.stroke();
    }
  }

  function radShade(c, pts, scale, cx, cy, r, c0, c1, stroke) {
    polyPath(c, pts, scale);
    const g = c.createRadialGradient(cx * scale, cy * scale, 0, cx * scale, cy * scale, r * scale);
    g.addColorStop(0, c0);
    g.addColorStop(1, c1);
    c.fillStyle = g;
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = 2;
      c.lineJoin = "round";
      c.stroke();
    }
  }

  // Sticker / enamel-pin character style — flat cel fills, thick ink, hard shade scoop
  const SKIN_INK = "#1a1228";

  function stickerShadow(c, S) {
    c.save();
    c.globalAlpha = 0.18;
    c.fillStyle = SKIN_INK;
    c.beginPath();
    c.ellipse(0.5 * S, 13 * S, 10 * S, 3.2 * S, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function stickerPoly(c, pts, S, fill, shadeCol, shadePts) {
    fillPoly(c, pts, S, fill, SKIN_INK, 2.7);
    if (shadeCol && shadePts) fillPoly(c, shadePts, S, shadeCol, null, 0);
  }

  function stickerOval(c, x, y, rx, ry, S, fill) {
    c.beginPath();
    c.ellipse(x * S, y * S, rx * S, ry * S, 0, 0, Math.PI * 2);
    c.fillStyle = fill;
    c.fill();
    c.strokeStyle = SKIN_INK;
    c.lineWidth = 2.6;
    c.stroke();
  }

  function stickerEyes(c, S, y, gap, lookX, pupilCol) {
    const lx = -gap + (lookX || 0);
    const rx = gap + (lookX || 0);
    for (const ex of [lx, rx]) {
      stickerOval(c, ex, y, 3.2, 3.6, S, "#fffef8");
      c.beginPath();
      c.ellipse((ex + 0.4) * S, (y + 0.3) * S, 1.55 * S, 1.8 * S, 0, 0, Math.PI * 2);
      c.fillStyle = pupilCol || SKIN_INK;
      c.fill();
      c.beginPath();
      c.ellipse((ex - 0.7) * S, (y - 0.9) * S, 0.7 * S, 0.8 * S, 0, 0, Math.PI * 2);
      c.fillStyle = "#fff";
      c.fill();
    }
  }

  function stickerSmile(c, S, y, w) {
    c.beginPath();
    c.arc(0, y * S, w * S, 0.15, Math.PI - 0.15);
    c.strokeStyle = SKIN_INK;
    c.lineWidth = 2.2;
    c.lineCap = "round";
    c.stroke();
  }

  function stickerBlush(c, S, y) {
    c.fillStyle = "rgba(255,120,160,0.55)";
    c.beginPath();
    c.ellipse(-7.5 * S, y * S, 2.2 * S, 1.3 * S, 0, 0, Math.PI * 2);
    c.ellipse(7.5 * S, y * S, 2.2 * S, 1.3 * S, 0, 0, Math.PI * 2);
    c.fill();
  }

  function drawPlayerSkin(c, skin, S, t) {
    const time = t == null ? performance.now() : t;
    stickerShadow(c, S);
    const draw = SKIN_DRAW[skin] || SKIN_DRAW.marshmallow;
    draw(c, S, time);
  }

  const SKIN_DRAW = {
    marshmallow(c, S, time) {
      const bob = Math.sin(time / 140) * 0.8;
      stickerPoly(
        c,
        [[-10, -8 + bob], [-4, -14 + bob], [5, -13 + bob], [11, -6], [11, 6], [5, 12], [-5, 12], [-11, 5]],
        S,
        "#b8f5e8",
        "#7bd9c4",
        [[-9, 2], [9, 2], [8, 11], [-8, 11]]
      );
      fillPoly(c, [[-6, -10 + bob], [-1, -12 + bob], [1, -7], [-5, -6]], S, "rgba(255,255,255,0.55)", null, 0);
      stickerBlush(c, S, 1);
      stickerEyes(c, S, -2, 4.2, 0, "#0d7377");
      stickerSmile(c, S, 4.5, 3.2);
      // candy drip
      const drip = 2 + Math.sin(time / 90);
      stickerPoly(c, [[-2, 11], [2, 11], [1, 14 + drip], [-1, 14 + drip]], S, "#ff8fb8", "#e85a96", null);
    },
    skull(c, S, time) {
      const f = Math.sin(time / 50);
      fillPoly(c, [[-5, -10], [-9, -18 - f], [-2, -14], [0, -20 - f], [2, -14], [9, -18 + f], [5, -10]], S, "#ff6b3d", SKIN_INK, 2.2);
      fillPoly(c, [[-3, -12], [0, -22 - f * 1.2], [3, -12]], S, "#ffe066", null, 0);
      stickerPoly(
        c,
        [[-11, -3], [-8, -11], [0, -13], [8, -11], [11, -3], [9, 7], [4, 11], [-4, 11], [-9, 7]],
        S,
        "#f4efe6",
        "#d3c6b4",
        [[-8, 3], [8, 3], [7, 10], [-7, 10]]
      );
      stickerOval(c, -4.2, -2, 2.8, 3.2, S, "#1a1228");
      stickerOval(c, 4.2, -2, 2.8, 3.2, S, "#1a1228");
      fillPoly(c, [[-4.5, -2], [-3, -1]], S, "#ff4d6d", null, 0);
      fillPoly(c, [[3, -1], [4.5, -2]], S, "#ff4d6d", null, 0);
      fillPoly(c, [[-5, 5], [5, 5], [4, 9], [-4, 9]], S, "#efe8dc", SKIN_INK, 2);
      for (let i = -2; i <= 2; i++) {
        c.beginPath();
        c.moveTo(i * 2 * S, 5 * S);
        c.lineTo(i * 2 * S, 9 * S);
        c.strokeStyle = SKIN_INK;
        c.lineWidth = 1.6;
        c.stroke();
      }
    },
    wingball(c, S, time) {
      const flap = Math.sin(time / 90) * 3;
      stickerPoly(c, [[-8, -1], [-16, -7 - flap], [-19, 1 - flap], [-12, 5]], S, "#dff3ff", "#9ed4f5", null);
      stickerPoly(c, [[8, -1], [16, -7 + flap], [19, 1 + flap], [12, 5]], S, "#dff3ff", "#9ed4f5", null);
      stickerPoly(
        c,
        [[-10, -9], [-3, -13], [4, -13], [10, -8], [11, 2], [6, 11], [-6, 11], [-11, 2]],
        S,
        "#6ec6ff",
        "#3aa0e8",
        [[-8, 1], [8, 1], [6, 10], [-6, 10]]
      );
      fillPoly(c, [[-5, -9], [0, -11], [2, -6], [-3, -5]], S, "rgba(255,255,255,0.5)", null, 0);
      stickerEyes(c, S, -2, 3.8, 0, "#0b3d66");
      stickerSmile(c, S, 4, 2.8);
      const jet = Math.sin(time / 60) * 1.5;
      stickerPoly(c, [[-3, 10], [3, 10], [0, 16 + jet]], S, "#ffb347", "#ff7a18", null);
    },
    starcat(c, S, time) {
      const tw = Math.sin(time / 120) * 1.2;
      stickerPoly(c, [[-9, -6], [-12, -16], [-3, -9]], S, "#c9a0e8", "#9b6bc9", null);
      stickerPoly(c, [[9, -6], [12, -16], [3, -9]], S, "#c9a0e8", "#9b6bc9", null);
      fillPoly(c, [[-9, -8], [-10, -13], [-5, -9]], S, "#ffc1e3", null, 0);
      fillPoly(c, [[9, -8], [10, -13], [5, -9]], S, "#ffc1e3", null, 0);
      stickerPoly(
        c,
        [[-11, -1], [-6, -11], [0, -13], [6, -11], [11, -1], [9, 8], [3, 12], [-3, 12], [-9, 8]],
        S,
        "#e8d4ff",
        "#c29ae0",
        [[-8, 3], [8, 3], [6, 11], [-6, 11]]
      );
      stickerEyes(c, S, -2.5, 4, 0, "#2a1040");
      // whiskers
      c.strokeStyle = SKIN_INK;
      c.lineWidth = 1.4;
      for (const side of [-1, 1]) {
        c.beginPath();
        c.moveTo(side * 5 * S, 2 * S);
        c.lineTo(side * 13 * S, (1 + tw * 0.2) * S);
        c.moveTo(side * 5 * S, 4 * S);
        c.lineTo(side * 12 * S, (5 + tw * 0.2) * S);
        c.stroke();
      }
      stickerPoly(c, [[-2, 3], [2, 3], [1, 6], [-1, 6]], S, "#ffb7d5", null, null);
      fillPoly(c, [[10 + tw, -8], [13 + tw, -4], [9 + tw, -4]], S, "#ffe066", SKIN_INK, 1.8);
    },
    chili(c, S, time) {
      const wiggle = Math.sin(time / 80) * 1.2;
      stickerPoly(c, [[-2, -14], [3, -12], [4, -8], [0, -9]], S, "#3d8b40", "#2e6b32", null);
      stickerPoly(
        c,
        [[-6 + wiggle, -8], [2, -10], [8, -4], [7, 6], [1, 13], [-7, 8], [-9, 0]],
        S,
        "#ff4d4d",
        "#d62828",
        [[-5, 2], [5, 4], [2, 12], [-6, 7]]
      );
      fillPoly(c, [[-3, -6], [1, -7], [2, -2], [-2, -1]], S, "rgba(255,255,255,0.35)", null, 0);
      stickerEyes(c, S, -1, 3.2, wiggle * 0.15, "#4a0000");
      stickerSmile(c, S, 5, 2.4);
      // sweat drop
      if (Math.sin(time / 100) > 0.2) {
        stickerOval(c, 9, -3, 1.4, 2, S, "#9ed8ff");
      }
    },
    crescent(c, S, time) {
      const bob = Math.sin(time / 160) * 0.6;
      // moon crescent via body minus bite (drawn as thick banana shape)
      stickerPoly(
        c,
        [
          [-4, -12 + bob],
          [6, -11 + bob],
          [11, -4],
          [10, 5],
          [4, 12],
          [-3, 11],
          [2, 4],
          [4, -2],
          [1, -8],
          [-4, -8],
        ],
        S,
        "#ffe9a8",
        "#f0c75e",
        [[2, 2], [8, 4], [4, 11], [-1, 9]]
      );
      stickerEyes(c, S, -2, 3.5, 0.4, "#5c3d10");
      // sleepy lids
      c.strokeStyle = SKIN_INK;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(-6.5 * S, -3.5 * S);
      c.lineTo(-1.5 * S, -4 * S);
      c.moveTo(1.5 * S, -4 * S);
      c.lineTo(6.5 * S, -3.5 * S);
      c.stroke();
      stickerSmile(c, S, 4, 2.2);
      const star = 1 + Math.sin(time / 90) * 0.4;
      fillPoly(c, [[-11, -6], [-11 + star, -9], [-8, -6], [-11 + star, -3]], S, "#fff4c2", SKIN_INK, 1.6);
    },
    berry(c, S, time) {
      const clusters = [
        [0, -8, 5.5],
        [-6, -3, 5],
        [6, -3, 5],
        [-4, 5, 5.2],
        [4, 5, 5.2],
        [0, 2, 4.5],
      ];
      for (const [x, y, r] of clusters) {
        stickerOval(c, x, y, r, r * 0.95, S, "#6b2cff");
        c.beginPath();
        c.ellipse((x - 1.5) * S, (y - 1.5) * S, r * 0.35 * S, r * 0.3 * S, -0.4, 0, Math.PI * 2);
        c.fillStyle = "rgba(255,255,255,0.35)";
        c.fill();
      }
      stickerPoly(c, [[-3, -12], [0, -16], [3, -12], [1, -10], [-1, -10]], S, "#5aad3e", "#3f8a28", null);
      stickerEyes(c, S, -1, 3.6, 0, "#1a0638");
      stickerBlush(c, S, 3);
      stickerSmile(c, S, 6, 2.5);
    },
    bee(c, S, time) {
      const flap = Math.sin(time / 55) * 2.5;
      stickerPoly(c, [[-6, -4], [-14, -9 - flap], [-15, -1 - flap], [-7, 1]], S, "#ffffff", "#ddeeff", null);
      stickerPoly(c, [[6, -4], [14, -9 + flap], [15, -1 + flap], [7, 1]], S, "#ffffff", "#ddeeff", null);
      stickerPoly(
        c,
        [[-9, -7], [0, -11], [9, -7], [10, 4], [4, 11], [-4, 11], [-10, 4]],
        S,
        "#ffe066",
        "#e6b800",
        [[-7, 2], [7, 2], [5, 10], [-5, 10]]
      );
      // stripes
      for (const y of [-2, 3]) {
        fillPoly(c, [[-8, y], [8, y], [7, y + 3], [-7, y + 3]], S, SKIN_INK, null, 0);
      }
      stickerOval(c, 0, -12, 2.2, 2.4, S, "#1a1228");
      stickerEyes(c, S, -4, 3.4, 0, "#3d2a00");
      stickerSmile(c, S, 7, 2.2);
      // stinger
      stickerPoly(c, [[-2, 10], [2, 10], [0, 15]], S, "#1a1228", null, null);
    },
    robot(c, S, time) {
      const blink = Math.sin(time / 200) > 0.92;
      stickerPoly(c, [[-2, -15], [2, -15], [2, -11], [-2, -11]], S, "#9aa4b2", null, null);
      stickerOval(c, 0, -16, 1.8, 1.8, S, "#ff5c8a");
      stickerPoly(
        c,
        [[-10, -9], [10, -9], [11, -2], [9, 9], [-9, 9], [-11, -2]],
        S,
        "#d7dee8",
        "#aeb8c6",
        [[-8, 1], [8, 1], [7, 8], [-7, 8]]
      );
      // visor
      fillPoly(c, [[-7, -6], [7, -6], [7, 0], [-7, 0]], S, "#1b2a4a", SKIN_INK, 2);
      if (!blink) {
        c.fillStyle = "#5ef0ff";
        c.fillRect(-5.5 * S, -4.5 * S, 4 * S, 2.5 * S);
        c.fillRect(1.5 * S, -4.5 * S, 4 * S, 2.5 * S);
      }
      fillPoly(c, [[-3, 3], [3, 3], [2, 6], [-2, 6]], S, "#ff8fab", SKIN_INK, 1.8);
      // antenna spark
      if (Math.sin(time / 70) > 0) {
        fillPoly(c, [[3, -18], [6, -16], [3, -14], [0, -16]], S, "#ffe066", null, 0);
      }
    },
    fish(c, S, time) {
      const flap = Math.sin(time / 100) * 2;
      stickerPoly(c, [[8, -1], [16, -6 + flap], [16, 5 - flap], [8, 3]], S, "#ff8a4c", "#e86a2a", null);
      stickerPoly(
        c,
        [[-10, -2], [-4, -10], [6, -8], [10, 0], [6, 9], [-4, 10], [-10, 2]],
        S,
        "#ff9f43",
        "#e67e22",
        [[-6, 2], [6, 3], [4, 9], [-4, 9]]
      );
      stickerPoly(c, [[-2, -10], [3, -14], [5, -8]], S, "#ff6b6b", null, null);
      stickerPoly(c, [[-2, 9], [3, 13], [5, 7]], S, "#ff6b6b", null, null);
      stickerOval(c, -3, -2, 3.4, 3.6, S, "#fffef8");
      c.beginPath();
      c.arc(-2.5 * S, -1.8 * S, 1.6 * S, 0, Math.PI * 2);
      c.fillStyle = SKIN_INK;
      c.fill();
      c.beginPath();
      c.arc(-3.2 * S, -2.4 * S, 0.55 * S, 0, Math.PI * 2);
      c.fillStyle = "#fff";
      c.fill();
      stickerSmile(c, S, 3.5, 2);
    },
    ghost(c, S, time) {
      const wave = Math.sin(time / 110);
      stickerPoly(
        c,
        [
          [-9, -8],
          [-4, -13],
          [4, -13],
          [9, -8],
          [10, 4],
          [6, 8 + wave],
          [2, 5],
          [0, 9 - wave],
          [-2, 5],
          [-6, 8 + wave],
          [-10, 4],
        ],
        S,
        "#f0f4ff",
        "#c5d0ef",
        [[-7, 0], [7, 0], [6, 6], [-6, 6]]
      );
      stickerEyes(c, S, -3, 3.8, 0, "#2c3e6b");
      // shy mouth
      c.beginPath();
      c.arc(0, 3.5 * S, 2 * S, 0.4, Math.PI - 0.4, true);
      c.strokeStyle = SKIN_INK;
      c.lineWidth = 2;
      c.stroke();
      stickerBlush(c, S, 1);
    },
    knight(c, S, time) {
      const gleam = 0.5 + Math.sin(time / 130) * 0.5;
      stickerPoly(c, [[-8, -12], [0, -16], [8, -12], [9, -4], [-9, -4]], S, "#f2f5f8", "#c5ced8", null);
      stickerPoly(
        c,
        [[-10, -4], [10, -4], [11, 6], [7, 12], [-7, 12], [-11, 6]],
        S,
        "#dfe6ee",
        "#b0bccb",
        [[-8, 3], [8, 3], [6, 11], [-6, 11]]
      );
      // visor slit
      fillPoly(c, [[-6, -1], [6, -1], [5, 3], [-5, 3]], S, "#1a1228", null, 0);
      c.fillStyle = `rgba(94,240,255,${0.35 + gleam * 0.45})`;
      c.fillRect(-5 * S, -0.5 * S, 10 * S, 2.5 * S);
      // plume
      stickerPoly(c, [[2, -15], [8, -20], [6, -12], [3, -12]], S, "#ff5c8a", "#d63b6a", null);
      // chin latch
      stickerPoly(c, [[-3, 8], [3, 8], [2, 12], [-2, 12]], S, "#ffd166", "#e0a800", null);
    },
  };

  function drawEnemySkin(c, style, S, t, seed) {
    const time = t == null ? performance.now() : t;
    const es = style == null ? 0 : style;
    c.save();
    c.globalAlpha = 0.2;
    c.fillStyle = "#12081f";
    c.beginPath();
    c.ellipse(1 * S, 11 * S, 9 * S, 3 * S, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();

    if (es === 1) {
      const flap = Math.sin(time / 80 + seed) * 4;
      shadePoly(c, [[-6, -1], [-15, -10 - flap], [-20, -2 - flap], [-17, 5], [-9, 5]], S, "#d1c4e9", "#4527a0", "#1a237e");
      shadePoly(c, [[-7, 0], [-13, -5 - flap * 0.5], [-14, 3], [-8, 3]], S, "#ede7f6", "#7e57c2", null);
      shadePoly(c, [[6, -1], [15, -10 + flap], [20, -2 + flap], [17, 5], [9, 5]], S, "#d1c4e9", "#4527a0", "#1a237e");
      shadePoly(c, [[7, 0], [13, -5 + flap * 0.5], [14, 3], [8, 3]], S, "#ede7f6", "#7e57c2", null);
      radShade(c, [[-8, -7], [0, -12], [8, -7], [7, 5], [0, 9], [-7, 5]], S, -2, -3, 12, "#e8eaf6", "#5e35b1", "#311b92");
      shadePoly(c, [[-5, -8], [0, -10], [2, -4], [-3, -3]], S, "rgba(255,255,255,0.55)", "rgba(255,255,255,0.05)", null);
      fillPoly(c, [[-4, -2], [-1.5, -3.5], [-1, 1]], S, "#ffeb3b", null, 0);
      fillPoly(c, [[1.5, -3.5], [4, -2], [1, 1]], S, "#ffeb3b", null, 0);
    } else if (es === 2) {
      radShade(
        c,
        [[-10, -7], [-4, -13], [5, -11], [11, -3], [9, 7], [2, 12], [-5, 11], [-11, 2]],
        S,
        -2,
        -3,
        14,
        "#e8f5e9",
        "#00c853",
        "#1b5e20"
      );
      shadePoly(c, [[-6, -9], [0, -11], [3, -5], [-3, -3]], S, "rgba(255,255,255,0.7)", "rgba(255,255,255,0.1)", null);
      shadePoly(c, [[4, -5], [9, 0], [6, 7], [1, 3]], S, "rgba(0,60,20,0.2)", "rgba(0,60,20,0.4)", null);
      fillPoly(c, [[-4, -2], [-1, 1]], S, "#1b5e20", null, 0);
      fillPoly(c, [[2, -2], [4, 1]], S, "#1b5e20", null, 0);
      shadePoly(c, [[-3, 6], [0, 5], [1, 15], [-2, 13]], S, "#b9f6ca", "#00c853", "#1b5e20");
      shadePoly(c, [[2, 5], [5, 6], [6, 13], [3, 11]], S, "#69f0ae", "#00e676", "#1b5e20");
    } else if (es === 3) {
      const spikes = [];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 14 : 6.5;
        spikes.push([Math.cos(a) * r, Math.sin(a) * r]);
      }
      radShade(c, spikes, S, 0, 0, 14, "#ff8a80", "#b71c1c", "#7f0000");
      shadePoly(c, [[-6, -5], [0, -8], [6, -5], [5, 4], [0, 7], [-5, 4]], S, "#ffcdd2", "#e53935", "#b71c1c");
      shadePoly(c, [[-3, -6], [1, -7], [0, -1], [-4, -1]], S, "rgba(255,255,255,0.4)", "rgba(255,255,255,0)", null);
      fillPoly(c, [[-3.5, -2], [-1, 0]], S, "#212121", null, 0);
      fillPoly(c, [[1, -2], [3.5, 0]], S, "#212121", null, 0);
    } else {
      radShade(
        c,
        [[-10, -8], [-4, -14], [4, -13], [11, -6], [12, 2], [7, 11], [-1, 13], [-9, 8], [-13, 0]],
        S,
        -2,
        -4,
        15,
        "#f3e5f5",
        "#7e57c2",
        "#311b92"
      );
      shadePoly(c, [[-6, -10], [0, -12], [3, -6], [-3, -4]], S, "rgba(255,255,255,0.65)", "rgba(255,255,255,0.05)", null);
      shadePoly(c, [[5, -6], [10, 0], [7, 7], [1, 3]], S, "rgba(40,0,80,0.15)", "rgba(40,0,80,0.4)", null);
      fillPoly(c, [[-4, -3], [-1, 0]], S, "#311b92", null, 0);
      fillPoly(c, [[1, -3], [4, 0]], S, "#311b92", null, 0);
      shadePoly(c, [[-3, 4], [3, 4], [2, 8], [-2, 8]], S, "#b39ddb", "#4527a0", "#311b92");
      c.strokeStyle = "rgba(128,222,234,0.9)";
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(0, 0, 14 * S, 5 * S, -0.35, 0, Math.PI * 2);
      c.stroke();
    }
  }

  function drawChar(x, y, kind, scale, angle, style) {
    const S = Math.max(0.9, scale || 1);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.translate(x, y);
    ctx.rotate((angle || 0) + Math.PI / 2);
    if (kind === "player") {
      const skin = style || selectedSkin || "marshmallow";
      drawPlayerSkin(ctx, skin, S, performance.now());
      if (state.rampageT > 0) {
        ctx.strokeStyle = C.pink;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-15 * S, -15 * S, 30 * S, 30 * S);
        ctx.globalAlpha = 1;
      }
    } else {
      drawEnemySkin(ctx, style, S, performance.now(), x + y);
    }
    ctx.restore();
  }

  function drawPlayer(s) {
    const p = s.player;
    if (p.blink > 0 && Math.floor(p.blink * 12) % 2 === 0) return;
    const pos = angleToPos(p.angle, currentRadius(s));
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = C.playerGlow;
    ctx.fill();
    if (s.hollowCharges > 0 || s.glitterT > 0 || s.jellyT > 0) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.strokeStyle = s.glitterT > 0 ? C.butter : s.jellyT > 0 ? C.mint : C.aqua;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.65;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    drawChar(pos.x, pos.y, "player", p.hop > 0 ? 1.18 : 1, p.angle, selectedSkin);
  }

  function drawEnemies(s) {
    for (const e of s.enemies) {
      const r = orbitRadius(s.orbitCount, e.orbit);
      const jitter = Math.sin(e.wobble) * 1.2;
      const pos = angleToPos(e.angle, r + jitter);
      for (let t = 1; t <= 3; t++) {
        const ta = e.angle - e.dir * t * 0.08;
        const tp = angleToPos(ta, r);
        softCircle(tp.x, tp.y, 3.5 - t * 0.5, `rgba(201,168,255,${0.35 - t * 0.08})`, null);
      }
      drawChar(pos.x, pos.y, "clone", 0.95, e.angle, e.style);
    }
  }

  function drawPickups(s) {
    for (const pu of s.pickups) {
      const r = orbitRadius(s.orbitCount, pu.orbit);
      // Bounce radially off the ring so candies read as pickups from any angle
      const bob = Math.sin(pu.bob) * 12;
      const pulse = 1 + Math.sin(pu.bob * 2) * 0.08;
      const base = angleToPos(pu.angle, r);
      const pos = angleToPos(pu.angle, r + bob);
      const x = pos.x;
      const y = pos.y;

      // orbit marker + soft contact shadow so motion is obvious
      ctx.beginPath();
      ctx.arc(base.x, base.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(40,20,60,0.22)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, (20 + Math.sin(pu.bob * 2) * 3) * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,182,220,0.32)";
      ctx.fill();

      const wraps = [C.pink, C.lilac, C.mint, C.butter, C.aqua, C.peach];
      const wrap = wraps[((pu.orbit * 3 + Math.floor(pu.angle * 4)) % wraps.length + wraps.length) % wraps.length];
      const g = ctx.createRadialGradient(x - 4, y - 5, 2, x, y, 13 * pulse);
      g.addColorStop(0, C.white);
      g.addColorStop(0.4, wrap);
      g.addColorStop(1, shade(wrap, -35));
      softCircle(x, y, 13 * pulse, g, C.ink, 3);
      shine(x, y, 12);

      ctx.fillStyle = C.butter;
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 13, y);
      ctx.lineTo(x - 20, y - 5);
      ctx.lineTo(x - 20, y + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 13, y);
      ctx.lineTo(x + 20, y - 5);
      ctx.lineTo(x + 20, y + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  function drawLasers(s) {
    for (const L of s.lasers) {
      const winding = L.t < L.wind;
      const alpha = winding ? 0.25 + 0.4 * (L.t / L.wind) : 0.9;
      const len = 340;
      const x2 = CX + Math.cos(L.angle) * len;
      const y2 = CY + Math.sin(L.angle) * len;
      ctx.strokeStyle = winding ? `rgba(255,226,122,${alpha})` : `rgba(255,123,138,${alpha})`;
      ctx.lineWidth = winding ? 3 : L.width;
      ctx.lineCap = "round";
      ctx.shadowColor = winding ? C.butter : C.coral;
      ctx.shadowBlur = winding ? 8 : 18;
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (!winding) softCircle(x2, y2, 5, C.cream, C.ink, 2);
    }
  }

  function drawAsteroids(s) {
    for (const a of s.asteroids) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.spin);
      const cols = [C.lilac, C.peach, C.mint];
      const fill = cols[a.style % 3];
      const g = ctx.createRadialGradient(-4, -4, 2, 0, 0, a.r);
      g.addColorStop(0, C.cream);
      g.addColorStop(0.55, fill);
      g.addColorStop(1, shade(fill, -35));
      ctx.beginPath();
      const spikes = 7;
      for (let i = 0; i < spikes; i++) {
        const ang = (i / spikes) * Math.PI * 2;
        const rr = a.r * (0.78 + ((i * 17 + a.style) % 5) * 0.05);
        const x = Math.cos(ang) * rr;
        const y = Math.sin(ang) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      softCircle(-3, -3, 3, "rgba(255,255,255,0.65)", null);
      // Cute angry brow dots
      softCircle(-3, 0, 1.6, C.ink, null);
      softCircle(3, 0, 1.6, C.ink, null);
      ctx.restore();
    }
    for (const f of s.fragments) {
      ctx.globalAlpha = Math.min(1, f.life);
      softCircle(f.x, f.y, f.r, C.butter, C.ink, 1.5);
      ctx.globalAlpha = 1;
    }
  }

  function drawParticles(s) {
    for (const p of s.particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
      softCircle(p.x, p.y, p.r, p.color, null);
      ctx.globalAlpha = 1;
    }
  }

  function drawBursts(s) {
    for (const b of s.burst) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * (1.35 - b.t), 0, Math.PI * 2);
      ctx.strokeStyle = b.color;
      ctx.globalAlpha = Math.max(0, b.t * 2);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // ---------- INPUT ----------
  function onKey(e, down) {
    const k = e.key.toLowerCase();
    state.keys[k] = down;
    if (!down) return;
    if (state.mode !== "play") return;

    // Left = anti-clockwise, Right = clockwise
    // W/↑ & S/↓ = switch ring if one exists in that direction, else hop
    if (k === "arrowleft" || k === "a") {
      state.player.dir = state.scrambleT > 0 ? 1 : -1;
      sfx.flip();
    } else if (k === "arrowright" || k === "d") {
      state.player.dir = state.scrambleT > 0 ? -1 : 1;
      sfx.flip();
    } else if (k === "w" || k === "arrowup") {
      e.preventDefault();
      tryRingOrHop(state, 1);
    } else if (k === "s" || k === "arrowdown") {
      e.preventDefault();
      tryRingOrHop(state, -1);
    } else if (k === " " || k === "space") {
      e.preventDefault();
      if (tryHop(state)) sfx.hop();
    } else if (k === "1") useSlot(state, 0);
    else if (k === "2") useSlot(state, 1);
    else if (k === "3") useSlot(state, 2);
    else if (k === "4") useSlot(state, 3);
  }

  window.addEventListener("keydown", (e) => onKey(e, true));
  window.addEventListener("keyup", (e) => onKey(e, false));

  const mainStep = document.getElementById("mainStep");
  const charStep = document.getElementById("charStep");
  const charGrid = document.getElementById("charGrid");
  const btnCharacters = document.getElementById("btnCharacters");
  const btnBackMain = document.getElementById("btnBackMain");

  let charPreviewRaf = 0;
  let charPreviewCanvases = [];

  function renderCharGrid() {
    if (!charGrid) return;
    charGrid.innerHTML = "";
    charPreviewCanvases = [];
    for (const skin of SKINS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "char-card" + (selectedSkin === skin.id ? " selected" : "");
      const c = document.createElement("canvas");
      c.width = 72;
      c.height = 72;
      btn.appendChild(c);
      const name = document.createElement("div");
      name.className = "char-name";
      name.textContent = skin.name;
      const desc = document.createElement("div");
      desc.className = "char-desc";
      desc.textContent = skin.desc;
      btn.appendChild(name);
      btn.appendChild(desc);
      btn.addEventListener("click", () => {
        selectedSkin = skin.id;
        toast(`${skin.name} selected`);
        renderCharGrid();
      });
      charGrid.appendChild(btn);
      charPreviewCanvases.push({ canvas: c, id: skin.id });
    }
    if (!charPreviewRaf) charPreviewRaf = requestAnimationFrame(tickCharPreviews);
  }

  function tickCharPreviews(now) {
    const onChar = charStep && !charStep.classList.contains("hidden");
    if (!onChar || !charPreviewCanvases.length) {
      charPreviewRaf = 0;
      return;
    }
    for (const item of charPreviewCanvases) drawSkinPreview(item.canvas, item.id, now);
    charPreviewRaf = requestAnimationFrame(tickCharPreviews);
  }

  function drawSkinPreview(canvasEl, skinId, now) {
    const x = canvasEl.getContext("2d");
    x.imageSmoothingEnabled = true;
    const g = x.createLinearGradient(0, 0, 72, 72);
    g.addColorStop(0, "#fff8f0");
    g.addColorStop(1, "#e8f6ff");
    x.fillStyle = g;
    x.fillRect(0, 0, 72, 72);
    x.save();
    x.translate(36, 40);
    drawPlayerSkin(x, skinId, 1.5, now == null ? performance.now() : now);
    x.restore();
  }

  function showMainMenu() {
    if (mainStep) mainStep.classList.remove("hidden");
    if (charStep) charStep.classList.add("hidden");
  }

  function showCharMenu() {
    if (mainStep) mainStep.classList.add("hidden");
    if (charStep) charStep.classList.remove("hidden");
    renderCharGrid();
  }

  function startCampaign() {
    ensureAudio();
    applyVibe("pastel");
    setTheme("none");
    state = createState("campaign");
    beginCampaignLevel(state, 1, false);
  }

  function startEndless() {
    ensureAudio();
    applyVibe("pastel");
    setTheme("none");
    state = createState("endless");
    beginEndless(state);
  }

  function backToMenu() {
    state = createState();
    state.mode = "title";
    showHud(false);
    if (ui.previewBanner) ui.previewBanner.classList.add("hidden");
    ui.endScreen.classList.add("hidden");
    ui.pick.classList.add("hidden");
    ui.overlay.classList.remove("hidden");
    ui.overlay.classList.add("show");
    showMainMenu();
    ensureAudio();
    setTheme("menu");
  }

  ui.btnCampaign.addEventListener("click", startCampaign);
  ui.btnEndless.addEventListener("click", startEndless);
  if (btnCharacters) btnCharacters.addEventListener("click", showCharMenu);
  if (btnBackMain) btnBackMain.addEventListener("click", showMainMenu);
  ui.endMenu.addEventListener("click", backToMenu);
  if (ui.infoOk) ui.infoOk.addEventListener("click", dismissPowerInfo);
  ui.pick.addEventListener("click", (e) => {
    if (e.target === ui.pick) dismissPowerInfo();
  });
  // Slot buttons are wired in updateSlots (supports 2–4)

  window.addEventListener("keydown", (e) => {
    if (state.mode !== "powerInfo") return;
    if (e.key === "Enter" || e.key === " " || e.key === "Escape" || e.key === "e" || e.key === "E") {
      e.preventDefault();
      dismissPowerInfo();
    }
  });

  window.addEventListener(
    "pointerdown",
    () => {
      ensureAudio();
      applyVibe("pastel");
      if (state.mode === "title") setTheme("menu");
    },
    { once: true }
  );

  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(state, dt);
    draw(state);
    requestAnimationFrame(frame);
  }

  showHud(false);
  ui.pick.classList.add("hidden");
  setTheme("none");
  requestAnimationFrame(frame);
})();
