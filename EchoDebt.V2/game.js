(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  let W = canvas.width;
  let H = canvas.height;
  let CX = W / 2;
  let CY = H / 2 + 8;
  const BASE_W = 960;
  const BASE_H = 640;

  function playScale() {
    return Math.min(W / BASE_W, H / BASE_H);
  }

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
    superHud: document.getElementById("superHud"),
    superIcon: document.getElementById("superIcon"),
    superCdRing: document.getElementById("superCdRing"),
    superName: document.getElementById("superName"),
    superCdLabel: document.getElementById("superCdLabel"),
    invPanel: document.getElementById("invPanel"),
    invChar: document.getElementById("invChar"),
    invName: document.getElementById("invName"),
    invHealth: document.getElementById("invHealth"),
    invSuperLine: document.getElementById("invSuperLine"),
    invSlots: document.getElementById("invSlots"),
    invOk: document.getElementById("invOk"),
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
    pauseScreen: document.getElementById("pauseScreen"),
    pauseResume: document.getElementById("pauseResume"),
    pauseMenu: document.getElementById("pauseMenu"),
  };

  // World vibes — Cotton / Moss Grave / Neon Void
  let vibe = "frost";
  // Worlds: frost (ice cyan), ember (golden ruin), neon (synthwave palette)
  const PALETTES = {
    frost: {
      // Pixel teal deep-space (world 1 art)
      skyTop: "#020818",
      skyBot: "#001410",
      skyMid: "#021a22",
      mint: "#5ef0d0",
      mintDeep: "#0a8a78",
      pink: "#7ad8e8",
      pinkDeep: "#2a8098",
      lilac: "#3ec8c0",
      lilacDeep: "#0a4a58",
      peach: "#a8fff0",
      butter: "#e8ffe8",
      aqua: "#40f0e0",
      coral: "#20a8b8",
      cream: "#d0fff8",
      ink: "#c8f8ff",
      blush: "#60d8d0",
      white: "#f0fffc",
      hazePink: "rgba(20,180,160,0.2)",
      hazeAqua: "rgba(40,240,220,0.16)",
      hazeLilac: "rgba(0,40,50,0.45)",
      playerGlow: "rgba(64,240,224,0.3)",
      vig: "rgba(0,20,30,0.5)",
      enemy0: "#3ec8c0",
      enemy1: "#40f0e0",
      enemy2: "#7ad8e8",
      enemy3: "#0a8a78",
      enemyHit: "#ff6bcb",
    },
    ember: {
      skyTop: "#2a1808",
      skyBot: "#120a04",
      skyMid: "#3a220c",
      mint: "#ffc05a",
      mintDeep: "#c47820",
      pink: "#ff9a4a",
      pinkDeep: "#c45a18",
      lilac: "#e8a040",
      lilacDeep: "#8a5018",
      peach: "#ffb060",
      butter: "#ffe08a",
      aqua: "#ffd070",
      coral: "#ff6a40",
      cream: "#fff0d0",
      ink: "#2a1408",
      blush: "#ffb070",
      white: "#fff8e8",
      hazePink: "rgba(255,140,60,0.22)",
      hazeAqua: "rgba(255,200,80,0.18)",
      hazeLilac: "rgba(40,20,8,0.4)",
      playerGlow: "rgba(255,200,80,0.28)",
      vig: "rgba(20,8,0,0.35)",
      enemy0: "#c47820",
      enemy1: "#ff9a4a",
      enemy2: "#e8a040",
      enemy3: "#8a5018",
      enemyHit: "#ff4a2a",
    },
    neon: {
      // Magenta synthscape — world 3 / final boss vibe
      skyTop: "#120028",
      skyBot: "#060010",
      skyMid: "#2a0450",
      mint: "#ff66cc",
      mintDeep: "#c01080",
      pink: "#ff2bd6",
      pinkDeep: "#9b0066",
      lilac: "#b44dff",
      lilacDeep: "#4B0082",
      peach: "#ff80e0",
      butter: "#ffe0ff",
      aqua: "#e040fb",
      coral: "#ff1493",
      cream: "#f8e0ff",
      ink: "#f0e6ff",
      blush: "#ff2bd6",
      white: "#ffffff",
      hazePink: "rgba(255,43,214,0.28)",
      hazeAqua: "rgba(180,80,255,0.2)",
      hazeLilac: "rgba(40,0,80,0.5)",
      playerGlow: "rgba(255,43,214,0.28)",
      vig: "rgba(20,0,40,0.55)",
      enemy0: "#b44dff",
      enemy1: "#ff2bd6",
      enemy2: "#e040fb",
      enemy3: "#4B0082",
      enemyHit: "#00e5ff",
    },
  };
  const C = Object.assign({}, PALETTES.frost);

  const WORLDS = [
    {
      id: 1,
      name: "TEAL RIFT",
      range: "1–10",
      vibe: "frost",
      startLevel: 1,
      endLevel: 10,
      kicker: "DEEP SPACE",
      desc: "Pixel nebulae · growing rings · soft lasers · Boss: Cryo Tyrant",
    },
    {
      id: 2,
      name: "EMBER RING",
      range: "11–20",
      vibe: "ember",
      startLevel: 11,
      endLevel: 20,
      kicker: "DYING SUN",
      desc: "Ruin orbits · amber haze · fighters late · Boss: Ash Halo",
    },
    {
      id: 3,
      name: "MAGENTA RISE",
      range: "21–30",
      vibe: "neon",
      startLevel: 21,
      endLevel: 30,
      kicker: "SYNTHSCAPE",
      desc: "Wireframe peaks · magenta sun · Boss: Pulse Core",
    },
  ];

  function getUnlockedWorld() {
    try {
      const n = parseInt(localStorage.getItem("echoDebtWorld") || "1", 10);
      return Math.max(1, Math.min(3, n || 1));
    } catch (_) {
      return 1;
    }
  }

  function setUnlockedWorld(n) {
    try {
      const next = Math.max(getUnlockedWorld(), Math.min(3, n));
      localStorage.setItem("echoDebtWorld", String(next));
    } catch (_) {}
  }

  function worldOfLevel(level) {
    return Math.max(1, Math.min(3, Math.ceil(level / 10)));
  }

  function levelInWorld(level) {
    return ((level - 1) % 10) + 1;
  }

  function isBossLevel(level) {
    return level === 10 || level === 20 || level === 30;
  }

  function vibeForLevel(level) {
    return WORLDS[worldOfLevel(level) - 1].vibe;
  }

  function applyVibe(v) {
    vibe = PALETTES[v] ? v : "frost";
    Object.assign(C, PALETTES[vibe]);
    document.documentElement.setAttribute("data-vibe", vibe);
  }


  // ---------- CHARACTERS ----------
  function loadSelectedSkin() {
    try {
      const id = localStorage.getItem("echoDebtSkin");
      if (id) return id;
    } catch (_) {}
    return "marshmallow";
  }
  function saveSelectedSkin(id) {
    try {
      localStorage.setItem("echoDebtSkin", id);
    } catch (_) {}
  }
  let selectedSkin = loadSelectedSkin();
  const SKINS = [
    { id: "marshmallow", name: "COTTON", desc: "Starter · no super · no debuff", unlockText: "Starter", check: () => true },
    { id: "skull", name: "CINDER", desc: "Toasty bonehead", unlockText: "Beat Cryo Tyrant (boss 10)", check: (m) => beatBoss(m, 10) },
    { id: "wingball", name: "SKY PIP", desc: "Tiny sky dumpling", unlockText: "Clear level 5", check: (m) => clearedLevel(m, 5) },
    { id: "starcat", name: "LUNA", desc: "Nightshift kitty", unlockText: "Clear level 8", check: (m) => clearedLevel(m, 8) },
    { id: "chili", name: "PEPPER", desc: "Too spicy to touch", unlockText: "Die to a laser", check: (m) => (m.deaths?.laser || 0) >= 1 },
    { id: "crescent", name: "CRESC", desc: "Sleepy moon bean", unlockText: "Die to an asteroid", check: (m) => (m.deaths?.asteroid || 0) >= 1 },
    { id: "berry", name: "BRAMBLE", desc: "Berry with attitude", unlockText: "Use 5 held powerups", check: (m) => (m.powerupsUsed || 0) >= 5 },
    { id: "bee", name: "BUZZ", desc: "Striped sugar bee", unlockText: "Clear level 15", check: (m) => clearedLevel(m, 15) },
    { id: "robot", name: "BIT", desc: "Candy tin robot", unlockText: "Beat Ash Halo (boss 20)", check: (m) => beatBoss(m, 20) },
    { id: "fish", name: "FINN", desc: "Orbit goldfish", unlockText: "Survive 30s in Endless", check: (m) => (m.endlessBest || 0) >= 30 },
    { id: "ghost", name: "BOO", desc: "Shy soda ghost", unlockText: "Die to a clone", check: (m) => (m.deaths?.clone || 0) >= 1 },
    { id: "knight", name: "NIB", desc: "Foil-wrapped hero", unlockText: "Beat Pulse Core (boss 30)", check: (m) => beatBoss(m, 30) },
    { id: "crown", name: "REGENT", desc: "Planet King's crown", unlockText: "Beat the Final Boss (Planet King)", check: (m) => !!m.finalBossBeaten },
  ];
  if (!SKINS.some((x) => x.id === selectedSkin)) selectedSkin = "marshmallow";

  const SKIN_SUPERS = {
    marshmallow: {
      name: "None",
      none: true,
      buff: "No character super",
      debuff: "No tradeoff — pure starter",
      use(s) {
        toast("Cotton has no super");
        return false;
      },
    },
    skull: {
      name: "Cinder Burst",
      buff: "Space: Cinder Burst — incinerate nearest clone on your ring",
      debuff: "Laser beams stay hot 15% longer",
      use(s) {
        let best = -1;
        let bestD = 999;
        for (let i = 0; i < s.enemies.length; i++) {
          const e = s.enemies[i];
          if (e.orbit !== s.player.orbit) continue;
          const d = angDist(e.angle, s.player.angle);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        if (best < 0) {
          toast("No clone on your ring");
          return false;
        }
        destroyEnemyAt(s, best, C.coral);
        toast("Cinder Burst!");
        return true;
      },
    },
    wingball: {
      name: "Sky Hop",
      buff: "Space: Sky Hop — big rim hop with i-frames",
      debuff: "Hop i-frames last 25% shorter",
      use(s) {
        const p = s.player;
        if (p.hop > 0) return false;
        p.hop = 0.55;
        p.hopSign = p.orbit === s.orbitCount - 1 ? 1 : -1;
        p._hopBoost = 52;
        p.hopInvuln = 0.42;
        p.invuln = Math.max(p.invuln, 0.42);
        toast("Sky Hop!");
        return true;
      },
    },
    starcat: {
      name: "Glitter Veil",
      buff: "Space: Glitter Veil — ignore lasers briefly",
      debuff: "Super cooldown +4s",
      use(s) {
        s.glitterT = 3.5;
        toast("Glitter Veil!");
        return true;
      },
    },
    chili: {
      name: "Rampage",
      buff: "Space: Rampage — crush clones on contact",
      debuff: "Asteroids spawn a little sooner",
      use(s) {
        s.rampageT = 4;
        toast("Rampage!");
        return true;
      },
    },
    crescent: {
      name: "Chrono Slow",
      buff: "Space: Chrono Slow — world runs at 45% for 5s",
      debuff: "Your base orbit speed is 8% slower",
      use(s) {
        s.chronoT = 5;
        toast("Chrono Slow!");
        return true;
      },
    },
    berry: {
      name: "Sprinkle Burst",
      buff: "Space: Sprinkle Burst — clear every clone on your ring",
      debuff: "Pickup grab range is smaller",
      use(s) {
        let hit = false;
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          if (s.enemies[i].orbit !== s.player.orbit) continue;
          destroyEnemyAt(s, i, C.butter);
          hit = true;
        }
        if (!hit) toast("Ring already clear");
        else toast("Sprinkle Burst!");
        return hit;
      },
    },
    bee: {
      name: "Magnet Pull",
      buff: "Space: Magnet Pull — shred debris for 3s",
      debuff: "Debris hurts you more often (always fragment risk)",
      use(s) {
        s.magnetT = 3;
        toast("Magnet Pull!");
        return true;
      },
    },
    robot: {
      name: "Laser Ping",
      buff: "Space: Laser Ping — hush lasers for 3s",
      debuff: "Lasers fire a bit more often",
      use(s) {
        s.hushT = 3;
        toast("Laser Ping!");
        return true;
      },
    },
    fish: {
      name: "Warp Flip",
      buff: "Space: Warp Flip — teleport halfway around the ring",
      debuff: "Getting hit flips your spin direction",
      use(s) {
        s.player.angle = wrapAngle(s.player.angle + Math.PI);
        s.player.invuln = Math.max(s.player.invuln, 0.35);
        toast("Warp Flip!");
        return true;
      },
    },
    ghost: {
      name: "Hollow Shell",
      buff: "Space: Hollow Shell — store a bubble absorb charge",
      debuff: "You start each level with one fewer life (min 1)",
      use(s) {
        s.hollowCharges = Math.min(3, (s.hollowCharges || 0) + 1);
        toast("Hollow Shell!");
        return true;
      },
    },
    knight: {
      name: "Nova",
      buff: "Space: Nova — clear nearby clones + debris",
      debuff: "Super cooldown is 26s instead of 20s",
      use(s) {
        s.fragments = [];
        s.chronoT = Math.max(s.chronoT, 2.5);
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i];
          if (angDist(e.angle, s.player.angle) < 0.85) destroyEnemyAt(s, i, C.aqua);
        }
        toast("Nova!");
        return true;
      },
    },
    crown: {
      name: "Royal Decree",
      oncePerRun: true,
      buff: "Space: Blank Slate — only once per run",
      debuff: "No refill — decree is spent for the whole run",
      use(s) {
        if (s.superUsedOnce) {
          toast("Decree already spent");
          return false;
        }
        // Same effect as Blank Slate candy
        s.enemies = [];
        s.lasers = [];
        s.asteroids = [];
        s.fragments = [];
        s.fighters = [];
        s.shots = [];
        s.hail = [];
        s.weather = null;
        syncDebt(s);
        s.flash = 0.35;
        s.burst.push({ x: CX, y: CY, t: 0.55, color: "#ffe060", r: 120 });
        toast("Royal Decree — Blank Slate!");
        updateHUD(s);
        return true;
      },
    },
  };

  function tryUseSuper(s) {
    if (s.mode !== "play") return false;
    const def = SKIN_SUPERS[selectedSkin] || SKIN_SUPERS.marshmallow;
    if (def.none) {
      toast("No super for this character");
      return false;
    }
    if (def.oncePerRun && s.superUsedOnce) {
      toast("Already used this run");
      return false;
    }
    if (s.superCd > 0) {
      toast(def.oncePerRun ? "Decree spent" : `Super ${Math.ceil(s.superCd)}s`);
      return false;
    }
    if (!def.use(s)) return false;
    if (def.oncePerRun) {
      s.superUsedOnce = true;
      s.superCd = 99999;
      updateSuperHud(s);
      return true;
    }
    let cd = SUPER_CD;
    if (selectedSkin === "starcat") cd += 4;
    if (selectedSkin === "knight") cd = 26;
    s.superCd = cd;
    sfx.clear();
    return true;
  }

  function loadMeta() {
    try {
      return JSON.parse(localStorage.getItem("echoDebtMeta") || "{}") || {};
    } catch (_) {
      return {};
    }
  }
  function saveMeta(m) {
    try {
      localStorage.setItem("echoDebtMeta", JSON.stringify(m));
    } catch (_) {}
  }
  function migrateMeta(m) {
    m = m || {};
    m.levelsCleared = m.levelsCleared || {};
    m.unlockedSkins = m.unlockedSkins || ["marshmallow"];
    m.bossesBeaten = (m.bossesBeaten || []).map((x) => +x);
    m.deaths = m.deaths || {};
    // Rebuild maxLevel from cleared keys
    let maxL = m.maxLevel || 0;
    for (const k of Object.keys(m.levelsCleared)) {
      const n = parseInt(k, 10);
      if (!Number.isNaN(n)) maxL = Math.max(maxL, n);
    }
    m.maxLevel = maxL;
    if (!m.unlockedSkins.includes("marshmallow")) m.unlockedSkins.unshift("marshmallow");
    return m;
  }
  function clearedLevel(m, n) {
    m = migrateMeta(m);
    const c = m.levelsCleared || {};
    if (c[n] || c[String(n)]) return true;
    return (m.maxLevel || 0) >= n;
  }
  function beatBoss(m, n) {
    m = migrateMeta(m);
    return (m.bossesBeaten || []).some((x) => +x === +n);
  }
  function isFinalBossUnlocked() {
    return beatBoss(migrateMeta(loadMeta()), 30);
  }
  function noteFinalBossBeat() {
    const m = migrateMeta(loadMeta());
    m.finalBossBeaten = true;
    saveMeta(m);
    return tryUnlockSkins(true);
  }
  function isSkinUnlocked(id) {
    const skin = SKINS.find((x) => x.id === id);
    if (!skin) return false;
    const m = migrateMeta(loadMeta());
    if ((m.unlockedSkins || []).includes(id)) return true;
    return !!skin.check(m);
  }
  function ensureSelectedSkinValid() {
    if (!isSkinUnlocked(selectedSkin)) {
      selectedSkin = "marshmallow";
      saveSelectedSkin(selectedSkin);
    }
  }
  function tryUnlockSkins(announce) {
    const m = migrateMeta(loadMeta());
    const newly = [];
    for (const skin of SKINS) {
      if (!skin.check(m)) continue;
      if (!m.unlockedSkins.includes(skin.id)) {
        m.unlockedSkins.push(skin.id);
        newly.push(skin);
      }
    }
    saveMeta(m);
    if (announce && newly.length) {
      setTimeout(() => toast(`Unlocked: ${newly.map((s) => s.name).join(", ")}`, 2800), 400);
    }
    return newly;
  }
  function noteLevelClear(level) {
    const m = migrateMeta(loadMeta());
    m.levelsCleared[String(level)] = true;
    m.maxLevel = Math.max(m.maxLevel || 0, level);
    saveMeta(m);
    return tryUnlockSkins(true);
  }
  function noteBossBeat(level) {
    const m = migrateMeta(loadMeta());
    const lvl = +level;
    if (!m.bossesBeaten.some((x) => +x === lvl)) m.bossesBeaten.push(lvl);
    m.levelsCleared[String(lvl)] = true;
    m.maxLevel = Math.max(m.maxLevel || 0, lvl);
    saveMeta(m);
    return tryUnlockSkins(true);
  }
  function noteDeath(kind) {
    const m = migrateMeta(loadMeta());
    const k = kind || "other";
    m.deaths[k] = (m.deaths[k] || 0) + 1;
    saveMeta(m);
    return tryUnlockSkins(true);
  }
  function notePowerUse() {
    const m = migrateMeta(loadMeta());
    m.powerupsUsed = (m.powerupsUsed || 0) + 1;
    saveMeta(m);
    return tryUnlockSkins(true);
  }
  function noteEndless(survived) {
    const m = migrateMeta(loadMeta());
    m.endlessBest = Math.max(m.endlessBest || 0, Math.floor(survived));
    saveMeta(m);
    return tryUnlockSkins(true);
  }
  tryUnlockSkins(false);
  ensureSelectedSkinValid();

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

  // Bright candy-pop scales — one play scale per world
  const SCALE = {
    // A dreamwave / cosmic pad scale (A minor · ethereal fifths)
    menu: [220.0, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 523.25],
    play: [293.66, 349.23, 392.0, 440.0, 466.16, 523.25, 587.33, 698.46], // cotton D-min
    playEarth: [196.0, 233.08, 261.63, 293.66, 311.13, 349.23, 392.0, 466.16], // moss low
    playNeon: [277.18, 329.63, 369.99, 415.3, 466.16, 554.37, 659.25, 739.99], // neon bright
    // Planet King — harsh violet (low menace + screaming highs)
    playFinal: [155.56, 185.0, 207.65, 233.08, 311.13, 369.99, 466.16, 622.25],
    pick: [329.63, 392.0, 440.0, 523.25, 659.25],
    dead: [146.83, 174.61, 196.0, 220.0, 246.94],
    win: [392.0, 493.88, 523.25, 659.25, 783.99, 987.77],
  };

  const THEMES = {
    menu: {
      // Expansive dreamwave: slow pulse, glassy lead, sparse kicks
      bpm: 72,
      ambient: true,
      chords: [[0, 2, 4], [5, 0, 2], [3, 5, 0], [4, 6, 1], [0, 3, 5], [2, 4, 6]],
      lead: [4, , , 5, , 7, , 5, , 4, , 2, , 0, , 2, 4, , 5, , 7, , 5, , 4, , 2, , 0, , , ,],
      bass: [0, , , , 0, , , , 5, , , , 5, , , , 3, , , , 3, , , , 4, , , , 0, , , ,],
      kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      hat:  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      clap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      sparkle: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 7, 0],
    },
    play: {
      bpm: 118,
      chords: [[0, 2, 4], [4, 6, 1], [3, 5, 0], [5, 0, 2], [0, 3, 5], [2, 4, 6], [4, 0, 2], [5, 2, 4]],
      lead: [0, , 2, , 3, 5, , 3, 2, , 0, , 5, , 3, 2, 0, 2, 3, 5, 7, 5, 3, , 2, 3, 5, , 3, 2, 0, ,],
      bass: [0, , , 0, 3, , 0, , 5, , , 5, 3, , 2, , 0, , 0, 3, , 3, 5, , 4, , 4, 2, 0, , 5, 3],
      kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
      hat:  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    },
    // World 2 — slower, earthy pulse
    playEarth: {
      bpm: 96,
      chords: [[0, 2, 4], [0, 3, 5], [1, 3, 5], [2, 4, 6], [0, 2, 5], [3, 5, 0], [1, 4, 6], [0, 2, 4]],
      lead: [0, , , 2, , 3, , 0, 5, , 3, , 2, , , 0, , 2, 3, , 5, , 3, 2, 0, , 1, , 3, , 2, ,],
      bass: [0, , 0, , 0, , 3, , 5, , 5, , 3, , 2, , 0, , , 0, 3, , , 3, 1, , 1, , 0, , 5, ,],
      kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
      hat:  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    },
    // World 3 — fast neon arps
    playNeon: {
      bpm: 132,
      chords: [[0, 2, 4], [5, 0, 2], [3, 5, 0], [4, 6, 1], [0, 4, 6], [2, 5, 0], [5, 2, 4], [3, 0, 2]],
      lead: [0, 2, 4, 7, 5, 4, 2, 0, 5, 7, 5, 4, 3, 2, 0, 2, 4, 5, 7, 5, 4, 2, 5, 7, 4, 2, 0, 5, 4, 2, 0, 7],
      bass: [0, , 0, 0, 5, , 5, , 3, , 3, 3, 4, , 4, 0, 0, , 0, 5, , 5, 3, , 4, , 2, 2, 0, , 5, 3],
      kick: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1],
      hat:  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      clap: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
      snare: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    },
    // Planet King — builds across phases, peaks in phase 3
    playFinal: {
      bpm: 118,
      intense: true,
      chords: [[0, 2, 4], [5, 0, 2], [3, 5, 0], [4, 6, 1], [0, 3, 5], [2, 5, 7], [5, 2, 4], [0, 4, 7]],
      lead: [
        0, , 2, , 4, , 5, , 4, , 2, , 0, , 5, ,
        0, 2, 4, 5, 7, 5, 4, 2, 5, 7, 5, 4, 3, 2, 0, 2,
      ],
      bass: [
        0, , , 0, 3, , , 3, 5, , , 5, 3, , 2, ,
        0, 0, , 0, 5, 5, , 3, 4, , 2, 2, 0, , 5, 3,
      ],
      kick:  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
      hat:   [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      clap:  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      sparkle: [0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 7],
      // denser overlays unlocked as phases escalate (see tickMusic)
      kickHot:  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      hatHot:   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      snareHot: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0],
      clapHot:  [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      leadHot: [
        0, 2, 4, 5, 7, 5, 4, 2, 5, 7, 5, 4, 3, 2, 0, 2,
        4, 5, 7, 5, 4, 2, 5, 7, 4, 5, 7, 5, 4, 2, 0, 7,
      ],
      sparkleHot: [0, 0, 7, 0, 0, 0, 5, 0, 0, 7, 0, 5, 0, 7, 0, 7],
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

  function isPlayTheme(theme) {
    return theme === "play" || theme === "playEarth" || theme === "playNeon" || theme === "playFinal";
  }

  function themeForState(s) {
    if (!s) return "menu";
    if (s.gameMode === "finalBoss") return "playFinal";
    if (s.gameMode === "endless") return "play";
    if (s.gameMode === "tutorial") return "play";
    if (s.gameMode === "campaign") return playThemeForLevel(s.level);
    return "menu";
  }

  function isFinalBoss(s) {
    return !!(s && (s.gameMode === "finalBoss" || (s.boss && s.bossId === 4)));
  }

  function setBossImmersive(on) {
    document.documentElement.classList.toggle("boss-immersive", !!on);
    document.body.classList.toggle("boss-immersive", !!on);
    // legacy alias class kept so older CSS still matches if cached
    document.documentElement.classList.toggle("final-immersive", !!on);
    document.body.classList.toggle("final-immersive", !!on);
    const frame = document.getElementById("frame");
    if (frame) {
      frame.classList.toggle("boss-immersive", !!on);
      frame.classList.toggle("final-immersive", !!on);
    }
    syncBossCanvas(!!on);
  }
  // alias used by older call sites
  function setFinalImmersive(on) {
    setBossImmersive(on);
  }

  function syncBossCanvas(immersive) {
    // Canvas buffer may go fullscreen, but LOGICAL game space stays 960×640.
    if (immersive) {
      const w = Math.max(640, window.innerWidth | 0);
      const h = Math.max(400, window.innerHeight | 0);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = w;
      canvas.height = h;
    } else {
      canvas.style.width = "";
      canvas.style.height = "";
      canvas.width = BASE_W;
      canvas.height = BASE_H;
    }
    W = BASE_W;
    H = BASE_H;
    CX = W / 2;
    CY = H / 2 + 8;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  function isBossImmersiveView() {
    return (
      document.body.classList.contains("boss-immersive") ||
      document.body.classList.contains("final-immersive")
    );
  }

  function playfieldView() {
    const s = Math.min(canvas.width / BASE_W, canvas.height / BASE_H);
    const ox = (canvas.width - BASE_W * s) / 2;
    const oy = (canvas.height - BASE_H * s) / 2;
    return { s, ox, oy };
  }

  function beginPlayfieldClip() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!isBossImmersiveView()) return false;
    // Static void outside the playfield — never receives gameplay drawing
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const { s, ox, oy } = playfieldView();
    ctx.translate(ox, oy);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.rect(0, 0, BASE_W, BASE_H);
    ctx.clip();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, BASE_W, BASE_H);
    return true;
  }

  function strokePlayfieldBorder() {
    if (!isBossImmersiveView()) return;
    const { s, ox, oy } = playfieldView();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    ctx.strokeRect(ox + 1, oy + 1, BASE_W * s - 2, BASE_H * s - 2);
  }

  function sealPlayfieldLetterbox() {
    if (!isBossImmersiveView()) return;
    const { s, ox, oy } = playfieldView();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, Math.max(0, oy));
    ctx.fillRect(0, oy + BASE_H * s, canvas.width, Math.max(0, canvas.height - (oy + BASE_H * s)));
    ctx.fillRect(0, oy, Math.max(0, ox), BASE_H * s);
    ctx.fillRect(ox + BASE_W * s, oy, Math.max(0, canvas.width - (ox + BASE_W * s)), BASE_H * s);
    strokePlayfieldBorder();
  }

  window.addEventListener("resize", () => {
    if (document.body.classList.contains("boss-immersive") || document.body.classList.contains("final-immersive")) {
      syncBossCanvas(true);
    }
  });

  /** Fit boss rings inside the viewport with HUD breathing room */
  function bossOrbitFit(orbits, idx) {
    const n = Math.max(1, orbits);
    const i = Math.max(0, Math.min(n - 1, idx | 0));
    const maxOuter = Math.min(BASE_W, BASE_H) * 0.36;
    if (n <= 1) return maxOuter * 0.92;
    const inner = maxOuter * (isFinalBoss(state) ? 0.4 : 0.55);
    const outer = maxOuter;
    return inner + (outer - inner) * (i / (n - 1));
  }

  function finalBossElapsed(s) {
    return Math.max(0, (s.duration || 180) - (s.timeLeft || 0));
  }

  function finalBossPhase(s) {
    const e = finalBossElapsed(s);
    if (e < 60) return 1;
    if (e < 120) return 2;
    return 3;
  }

  function playThemeForLevel(level) {
    return ["play", "playEarth", "playNeon"][worldOfLevel(level) - 1] || "play";
  }

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
    const vol =
      theme === "menu" ? 0.26 : theme === "playFinal" ? 0.26 : isPlayTheme(theme) ? 0.24 : 0.16;
    audio.musicGain.gain.cancelScheduledValues(ac.currentTime);
    audio.musicGain.gain.setValueAtTime(0.0001, ac.currentTime);
    audio.musicGain.gain.linearRampToValueAtTime(vol, ac.currentTime + (theme === "menu" ? 0.45 : 0.08));
    if (audio.wet) {
      audio.wet.gain.cancelScheduledValues(ac.currentTime);
      audio.wet.gain.linearRampToValueAtTime(
        theme === "menu" ? 0.28 : theme === "playFinal" ? 0.2 : 0.14,
        ac.currentTime + 0.2
      );
    }
    if (audio.filter) {
      audio.filter.frequency.cancelScheduledValues(ac.currentTime);
      audio.filter.frequency.linearRampToValueAtTime(
        theme === "menu" ? 3800 : theme === "playFinal" ? 7200 : 5200,
        ac.currentTime + 0.3
      );
    }
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

  function playPad(scale, degrees, dur) {
    for (const d of degrees) {
      const f = scale[d % scale.length];
      if (!f) continue;
      envTone(f, dur, "sine", 0.035, audio.musicGain, 0.25, 0.003);
      envTone(f * 0.5, dur * 1.1, "triangle", 0.04, audio.musicGain, 0.3, 0.002);
      envTone(f * 2, dur * 0.85, "sine", 0.012, audio.musicGain, 0.35, 0.004);
    }
  }

  function playSparkle(freq) {
    if (!freq) return;
    envTone(freq * 2, 0.55, "sine", 0.03, audio.musicGain, 0.01, 0.005);
    envTone(freq * 3, 0.4, "triangle", 0.012, audio.musicGain, 0.02, 0.006);
  }

  function tickMusic(dt) {
    const ac = ensureAudio();
    if (!ac || audio.theme === "none") return;
    const t = THEMES[audio.theme];
    const scale = SCALE[audio.theme];
    if (!t || !scale) return;
    const playing = isPlayTheme(audio.theme);
    const ambient = !!t.ambient || audio.theme === "menu";

    let bpm = t.bpm;
    if (playing && state && (state.mode === "play" || state.mode === "preview") && state.duration > 0) {
      if (audio.theme === "playFinal" && typeof finalBossPhase === "function") {
        const ph = finalBossPhase(state);
        // Build: 118 → ~136 → ~168 peak in final minute
        bpm = t.bpm * (ph === 1 ? 1.0 : ph === 2 ? 1.15 : 1.42);
        const phaseT =
          ph === 1 ? 1 - Math.max(0, Math.min(1, (state.timeLeft - 120) / 60))
          : ph === 2 ? 1 - Math.max(0, Math.min(1, (state.timeLeft - 60) / 60))
          : 1 - Math.max(0, Math.min(1, state.timeLeft / 60));
        bpm *= 1 + phaseT * (ph === 3 ? 0.12 : 0.06);
      } else {
        const urgency = 1 - Math.max(0, Math.min(1, state.timeLeft / state.duration));
        bpm = t.bpm * (1 + urgency * 0.55);
      }
    }

    const stepDur = 60 / bpm / 4;
    audio.acc += dt;

    // Final-boss arrangement intensity (1 calm build · 2 drive · 3 peak)
    let finalPh = 0;
    if (audio.theme === "playFinal" && state && typeof finalBossPhase === "function") {
      finalPh = finalBossPhase(state);
      if (audio.musicGain && ac) {
        const target = finalPh === 1 ? 0.24 : finalPh === 2 ? 0.3 : 0.36;
        const cur = audio.musicGain.gain.value;
        if (Math.abs(cur - target) > 0.01) {
          audio.musicGain.gain.cancelScheduledValues(ac.currentTime);
          audio.musicGain.gain.linearRampToValueAtTime(target, ac.currentTime + 0.6);
        }
      }
    }
    const kickPat = finalPh >= 2 && t.kickHot ? t.kickHot : t.kick;
    const hatPat = finalPh >= 2 && t.hatHot ? t.hatHot : t.hat;
    const snarePat = finalPh >= 3 && t.snareHot ? t.snareHot : t.snare;
    const clapPat = finalPh >= 3 && t.clapHot ? t.clapHot : t.clap;
    const leadPat = finalPh >= 3 && t.leadHot ? t.leadHot : t.lead;
    const sparklePat = finalPh >= 3 && t.sparkleHot ? t.sparkleHot : t.sparkle;

    while (audio.acc >= stepDur) {
      audio.acc -= stepDur;
      const i = audio.step;
      const barStep = i % 16;

      if (kickPat[barStep]) {
        if (ambient) {
          // soft low pulse instead of hard kick
          envTone(55, 0.35, "sine", 0.07, audio.musicGain, 0.04, 0.001);
        } else playKick();
      }
      if (hatPat[barStep]) playHat(ambient ? true : playing ? barStep % 4 === 3 : barStep % 8 === 6);
      if (!ambient && clapPat && clapPat[barStep]) playClap();
      if (!ambient && snarePat && snarePat[barStep]) playSnare();

      if (barStep === 0 || (!ambient && (playing ? barStep === 6 : barStep === 8))) {
        const chord = t.chords[audio.chordIdx % t.chords.length];
        if (ambient) playPad(scale, chord, stepDur * 14);
        else if (t.intense || audio.theme === "playFinal") {
          // Power stab — octave double for throne raid bite
          playStab(scale, chord);
          for (const d of chord) {
            const f = scale[d % scale.length];
            if (!f) continue;
            envTone(f * 0.5, 0.32, "sawtooth", 0.055, audio.musicGain, 0.01, 0.004);
            envTone(f * 2, 0.18, "square", 0.028, audio.musicGain, 0.008, 0.005);
          }
        } else playStab(scale, chord);
        if (barStep === 0) audio.chordIdx++;
      }

      if (sparklePat && sparklePat[barStep]) {
        const si = sparklePat[barStep];
        const sf = scale[(typeof si === "number" ? si : 7) % scale.length];
        if (t.intense || audio.theme === "playFinal") {
          const shrill = finalPh >= 3 ? 1 : finalPh >= 2 ? 0.65 : 0.35;
          envTone(sf * 2, 0.12, "square", 0.045 * shrill, audio.musicGain, 0.005, 0.008);
          if (finalPh >= 2) envTone(sf * 3, 0.09, "sawtooth", 0.02 * shrill, audio.musicGain, 0.005, 0.01);
        } else playSparkle(sf);
      }

      const leadIdx = leadPat[i % leadPat.length];
      if (leadIdx != null && leadIdx !== undefined) {
        const f = scale[leadIdx % scale.length];
        if (ambient) {
          envTone(f, stepDur * 4.5, "sine", 0.03, audio.musicGain, 0.08, 0.004);
          envTone(f * 2, stepDur * 2.2, "triangle", 0.012, audio.musicGain, 0.1, 0.005);
        } else if (t.intense || audio.theme === "playFinal") {
          const lean = finalPh >= 3 ? 1 : finalPh >= 2 ? 0.72 : 0.45;
          envTone(f, stepDur * 1.7, "sawtooth", 0.04 * lean, audio.musicGain, 0.01, 0.008);
          if (finalPh >= 2) envTone(f * 2, stepDur * 1.1, "square", 0.022 * lean, audio.musicGain, 0.008, 0.01);
          if (finalPh >= 3) envTone(f * 1.5, stepDur * 0.9, "triangle", 0.018, audio.musicGain, 0.01, 0.006);
        } else if (playing) {
          const typ =
            audio.theme === "playEarth"
              ? "triangle"
              : audio.theme === "playNeon"
                ? "square"
                : "sawtooth";
          envTone(f, stepDur * 2.1, typ, 0.022, audio.musicGain, 0.02, 0.006);
          envTone(f * 1.5, stepDur * 1.4, "sine", 0.014, audio.musicGain, 0.03, 0.004);
        } else {
          envTone(f, stepDur * 1.6, "square", 0.028, audio.musicGain, 0.008, 0.002);
          envTone(f * 2, stepDur * 0.9, "sine", 0.012, audio.musicGain, 0.008, 0.003);
        }
      }

      const b = t.bass[i % t.bass.length];
      if (b != null && b !== undefined) {
        const bf = scale[b % scale.length] * 0.5;
        if (ambient) {
          envTone(bf, stepDur * 5, "sine", 0.07, audio.musicGain, 0.12, 0.001);
          envTone(bf * 0.5, stepDur * 5.2, "triangle", 0.035, audio.musicGain, 0.15, 0.001);
        } else if (t.intense || audio.theme === "playFinal") {
          envTone(bf, stepDur * 2.2, "sawtooth", 0.12, audio.musicGain, 0.008, 0.002);
          envTone(bf * 0.5, stepDur * 2.4, "sine", 0.08, audio.musicGain, 0.01, 0.001);
          envTone(bf * 2, stepDur * 0.7, "square", 0.035, audio.musicGain, 0.005, 0.003);
        } else if (playing) {
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
    breeze: {
      id: "breeze",
      name: "SOFT BREEZE",
      kind: "hold",
      desc: "Use: clones crawl at half speed for 7 seconds.",
      icon: "breeze",
      tint: "#80cbc4",
      use(s) {
        s.breezeT = 7;
        toast("Soft Breeze!");
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
    clearskies: {
      id: "clearskies",
      name: "CLEAR SKIES",
      kind: "consume",
      desc: "Erase every laser on the board instantly.",
      icon: "clearskies",
      tint: "#90caf9",
      use(s) {
        s.lasers = [];
        s.flash = 0.18;
        s.burst.push({ x: CX, y: CY, t: 0.35, color: C.aqua, r: 70 });
        toast("Clear Skies!");
        updateHUD(s);
        return true;
      },
    },
    shardguard: {
      id: "shardguard",
      name: "SHARD GUARD",
      kind: "consume",
      desc: "Shatter all asteroids & debris. Brief invulnerability.",
      icon: "shardguard",
      tint: "#ce93d8",
      use(s) {
        s.asteroids = [];
        s.fragments = [];
        s.player.invuln = Math.max(s.player.invuln, 1.25);
        s.player.blink = Math.max(s.player.blink, 1.25);
        s.burst.push({ x: CX, y: CY, t: 0.4, color: C.lilac, r: 90 });
        toast("Shard Guard!");
        updateHUD(s);
        return true;
      },
    },
    wipe: {
      id: "wipe",
      name: "BLANK SLATE",
      kind: "consume",
      rare: true,
      desc: "Nuke the board — wipe clones, lasers, asteroids, debris, fighters, and weather.",
      icon: "wipe",
      tint: "#fff59d",
      use(s) {
        s.enemies = [];
        s.lasers = [];
        s.asteroids = [];
        s.fragments = [];
        s.fighters = [];
        s.shots = [];
        s.hail = [];
        s.weather = null;
        syncDebt(s);
        s.flash = 0.35;
        s.burst.push({ x: CX, y: CY, t: 0.55, color: C.butter, r: 120 });
        toast("Blank Slate — board cleared!");
        updateHUD(s);
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
    twin: {
      id: "twin",
      name: "TWIN DEBT",
      kind: "debuff",
      rare: true,
      desc: "Oh no — every clone doubles. Hit debt doubles too.",
      icon: "twin",
      tint: "#e040fb",
      use(s) {
        const copy = s.enemies.map((e) =>
          makeEnemy(e.orbit, e.angle + 0.35, -e.dir, e.fromHit)
        );
        for (const e of copy) s.enemies.push(e);
        syncDebt(s);
        updateHUD(s);
        toast("Twin Debt! Clones doubled");
        return true;
      },
    },
  };

  const ALL_POWERUPS = [...Object.values(HOLD), ...Object.values(CONSUME), ...Object.values(DEBUFF)];
  const BUFF_POOL = [...Object.values(HOLD), ...Object.values(CONSUME)];
  const DEBUFF_POOL = Object.values(DEBUFF).filter((p) => !p.rare);
  const HOLD_POOL = Object.values(HOLD).filter((p) => !p.rare);
  const CONSUME_POOL = Object.values(CONSUME).filter((p) => !p.rare);
  const RARE_TWIN = DEBUFF.twin;
  const RARE_WIPE = CONSUME.wipe;


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
      wipe: "☀",
      clearskies: "☁",
      shardguard: "▮",
      breeze: "≈",
      twin: "⧉",
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
    if (state && state.boss) {
      const orbits = Math.max(1, count || state.orbitCount || 1);
      const idx = Math.max(0, Math.min(orbits - 1, index | 0));
      // All bosses: fit rings to the current (often fullscreen) viewport
      return bossOrbitFit(orbits, idx);
    }
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

  function toast(msg, ms) {
    ui.toast.textContent = msg;
    ui.toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => ui.toast.classList.remove("show"), ms || 1800);
  }

  function campaignDuration(level) {
    if (isBossLevel(level)) return [0, 28, 32, 36][worldOfLevel(level)] || 30;
    const liw = levelInWorld(level);
    return Math.max(16, 26 - liw * 0.45);
  }

  function campaignOrbitCount(level) {
    if (isBossLevel(level)) return worldOfLevel(level); // boss 10→1, 20→2, 30→3 orbit
    const w = worldOfLevel(level);
    const liw = levelInWorld(level);
    if (w === 1) return Math.min(6, Math.max(1, Math.ceil(liw / 2)));
    if (w === 2) return 5;
    return 6;
  }

  function campaignDiff(level) {
    const liw = levelInWorld(level);
    const worldBoost = 1 + (worldOfLevel(level) - 1) * 0.18;
    return Math.pow(1.12, liw - 1) * worldBoost * (isBossLevel(level) ? 1.05 + worldOfLevel(level) * 0.04 : 1);
  }

  function endlessOrbitCount(escalation) {
    return Math.min(8, 1 + escalation);
  }

  const ENDLESS_PHASES = [
    {
      id: "sleep",
      name: "DREAMING",
      toast: "Mood: Dreaming…",
      sky: ["#061428", "#0a2a48", "#0e3a5c"],
      haze: "rgba(100,180,255,0.14)",
      ringA: "#7ec8ff",
      ringB: "#b8e0ff",
      pals: ["#c8e8ff", "#6ab0e8", "#2a6a9a", "#0a2438"],
    },
    {
      id: "awake",
      name: "AWAKE",
      toast: "Mood: Awake!",
      sky: ["#041810", "#0a3020", "#124028"],
      haze: "rgba(80,255,140,0.14)",
      ringA: "#6aff9a",
      ringB: "#b8ffd0",
      pals: ["#d0ffe0", "#40e880", "#148848", "#062818"],
    },
    {
      id: "angry",
      name: "ANGRY",
      toast: "Mood: ANGRY",
      sky: ["#1a0608", "#401010", "#5a1810"],
      haze: "rgba(255,60,40,0.16)",
      ringA: "#ff6040",
      ringB: "#ffb070",
      pals: ["#ffd0b0", "#ff6040", "#a02018", "#280808"],
    },
    {
      id: "evil",
      name: "CORRUPT",
      toast: "Mood: CORRUPT",
      sky: ["#100818", "#280840", "#3a1060"],
      haze: "rgba(200,80,255,0.18)",
      ringA: "#d060ff",
      ringB: "#ff80e0",
      pals: ["#e8c0ff", "#a040e8", "#501080", "#140820"],
    },
  ];

  function endlessPhaseDuration(cycles) {
    // Ramp 45s → 30s as endless escalates through phase cycles
    const t = Math.min(1, (cycles || 0) / 8);
    return 45 - 15 * t;
  }

  function endlessPhaseInfo(s) {
    return ENDLESS_PHASES[(s.endlessPhase || 0) % ENDLESS_PHASES.length];
  }

  function setEndlessPhase(s, phase, announce) {
    s.endlessPhase = ((phase % ENDLESS_PHASES.length) + ENDLESS_PHASES.length) % ENDLESS_PHASES.length;
    s.phaseDur = endlessPhaseDuration(s.phaseCycles || 0);
    s.phaseT = s.phaseDur;
    s.phaseFlash = 0.65;
    s.planetStyle = 200; // mark endless custom planet
    const info = endlessPhaseInfo(s);
    if (announce) {
      toast(info.toast);
      sfx.clear();
    }
  }

  function tickEndlessPhase(s, dt) {
    if (s.gameMode !== "endless" || (s.mode !== "play" && s.mode !== "preview")) return;
    if (s.phaseFlash > 0) s.phaseFlash = Math.max(0, s.phaseFlash - dt);
    // Only advance while playing
    if (s.mode !== "play") return;
    s.phaseT -= dt;
    // Light confusion shakes during hotter moods
    const ph = s.endlessPhase | 0;
    if (ph === 2 && Math.random() < dt * 1.8) s.shakeT = Math.max(s.shakeT || 0, 0.12);
    if (ph === 3 && Math.random() < dt * 2.4) {
      s.shakeT = Math.max(s.shakeT || 0, 0.2);
      if (Math.random() < 0.2) s.flash = Math.max(s.flash || 0, 0.08);
    }
    if (s.phaseT <= 0) {
      s.phaseCycles = (s.phaseCycles || 0) + 1;
      setEndlessPhase(s, (s.endlessPhase | 0) + 1, true);
      updateHUD(s);
    }
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
      boss: false,
      bossId: 0,
      camZoom: 1,
      shakeT: 0,
      worldStart: 1,
      bossTest: false,
      fighters: [],
      shots: [],
      hail: [],
      weather: null,
      weatherTimer: 10,
      candyTimer: 4,
      fighterTimer: 6,
      player: {
        orbit: 0,
        angle: -Math.PI / 2,
        dir: 1,
        hop: 0,
        hopSign: 0,
        radiusBoost: 0,
        hopInvuln: 0,
        trail: [],
        invuln: 0,
        blink: 0,
      },
      superCd: 0,
      superUsedOnce: false,
      bossWarmup: 0,
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
      endlessPhase: 0,
      phaseT: 45,
      phaseDur: 45,
      phaseCycles: 0,
      phaseFlash: 0,
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

  const MIN_ENEMY_GAP = 0.38;
  const SUPER_CD = 20;

  function orbitHasRoom(s, orbit, angle, gap) {
    gap = gap == null ? MIN_ENEMY_GAP : gap;
    for (const e of s.enemies) {
      if (e.orbit !== orbit) continue;
      if (angDist(e.angle, angle) < gap) return false;
    }
    return true;
  }

  function freeAngleOnOrbit(s, orbit, preferred) {
    if (orbitHasRoom(s, orbit, preferred)) return wrapAngle(preferred);
    for (let k = 1; k <= 20; k++) {
      const a = wrapAngle(preferred + k * ((Math.PI * 2) / 20));
      if (orbitHasRoom(s, orbit, a)) return a;
    }
    return wrapAngle(preferred);
  }

  function baseDebtCount(s) {
    const L = s.level | 0;
    // Soft curve so late boards stay readable (skill > clone soup)
    if (L <= 8) return L;
    if (L <= 18) return 8 + Math.round((L - 8) * 0.75); // 18 → 16
    return 16 + Math.round((L - 18) * 0.5); // 30 → 22
  }

  function hitDebtCount(s) {
    return s.enemies.filter((e) => e.fromHit).length;
  }

  function pickOrbitForDebtIndex(s, i, total) {
    const orbits = s.orbitCount;
    if (s.boss) return (Math.random() * orbits) | 0; // random across boss rings
    const w = worldOfLevel(s.level);
    if (w === 1) return Math.min(orbits - 1, Math.floor((i / Math.max(1, total)) * orbits));
    return i % orbits;
  }

  function spreadHitEnemies(s) {
    for (const e of s.enemies) {
      if (!e.fromHit) continue;
      if (s.boss) e.orbit = (Math.random() * s.orbitCount) | 0;
      else if (e.orbit >= s.orbitCount) e.orbit = s.orbitCount - 1;
      e.angle = freeAngleOnOrbit(s, e.orbit, e.angle);
    }
  }

  function rebuildLevelDebt(s) {
    s.enemies = s.enemies.filter((e) => e.fromHit);
    const HIT_CAP = 6;
    if (s.enemies.length > HIT_CAP) s.enemies = s.enemies.slice(-HIT_CAP);
    const n = baseDebtCount(s);
    for (let i = 0; i < n; i++) {
      const orbit = pickOrbitForDebtIndex(s, i, n);
      const angle = freeAngleOnOrbit(s, orbit, -Math.PI / 2 + (i / Math.max(1, n)) * Math.PI * 2);
      s.enemies.push(makeEnemy(orbit, angle, i % 2 === 0 ? 1 : -1, false));
    }
    spreadHitEnemies(s);
    syncDebt(s);
  }

  function spawnHitEnemy(s) {
    const n = isFinalBoss(s) ? 3 : 1;
    const ring = (Math.random() * s.orbitCount) | 0;
    for (let i = 0; i < n; i++) {
      const orbit = isFinalBoss(s) ? ring : (Math.random() * s.orbitCount) | 0;
      const angle = freeAngleOnOrbit(s, orbit, s.player.angle + Math.PI + i * 0.55);
      s.enemies.push(makeEnemy(orbit, angle, Math.random() < 0.5 ? 1 : -1, true));
    }
    syncDebt(s);
  }

  function destroyEnemyAt(s, ei, color) {
    if (ei < 0 || ei >= s.enemies.length) return;
    const e = s.enemies[ei];
    const er = orbitRadius(s.orbitCount, e.orbit);
    const ep = angleToPos(e.angle, er);
    s.enemies.splice(ei, 1);
    syncDebt(s);
    s.burst.push({ x: ep.x, y: ep.y, t: 0.32, color: color || C.lilac, r: 22 });
  }

  function resolveEnemyCollisions(s) {
    // Intentionally no-op — clones no longer destroy each other on contact
    void s;
  }

  function resolveEnemyHazards(s) {
    for (let ei = s.enemies.length - 1; ei >= 0; ei--) {
      const e = s.enemies[ei];
      const er = orbitRadius(s.orbitCount, e.orbit);
      const ep = angleToPos(e.angle, er);
      let dead = false;
      for (const L of s.lasers) {
        if (L.t < L.wind) continue;
        if (L.type === "ring") {
          if (!L._ringCleared && e.orbit === L.orbit) {
            destroyEnemyAt(s, ei, C.coral);
            dead = true;
            break;
          }
          continue;
        }
        const ap = { x: ep.x - CX, y: ep.y - CY };
        const ang = Math.atan2(ap.y, ap.x);
        const rad = Math.hypot(ap.x, ap.y);
        if (rad < 36 || rad > 380) continue;
        if (angDist(ang, L.angle) < 0.09) {
          destroyEnemyAt(s, ei, C.coral);
          dead = true;
          break;
        }
      }
      if (dead || ei >= s.enemies.length) continue;
      for (const a of s.asteroids) {
        if (Math.hypot(a.x - ep.x, a.y - ep.y) < a.r + 9) {
          destroyEnemyAt(s, ei, C.peach);
          shatterAsteroid(s, a, true);
          dead = true;
          break;
        }
      }
      if (dead || ei >= s.enemies.length) continue;
      for (const f of s.fragments) {
        if (Math.hypot(f.x - ep.x, f.y - ep.y) < f.r + 8) {
          destroyEnemyAt(s, ei, C.butter);
          f.life = 0;
          dead = true;
          break;
        }
      }
      if (dead || ei >= s.enemies.length) continue;
      for (const sh of s.shots) {
        if (Math.hypot(sh.x - ep.x, sh.y - ep.y) < sh.r + 8) {
          destroyEnemyAt(s, ei, C.coral);
          sh.life = 0;
          break;
        }
      }
    }
  }

  function makeEnemy(orbit, angle, dir, fromHit) {
    return {
      orbit,
      angle: wrapAngle(angle ?? rand(0, Math.PI * 2)),
      dir: dir ?? (Math.random() < 0.5 ? 1 : -1),
      wobble: rand(0, Math.PI * 2),
      blush: Math.random(),
      style: fromHit ? 4 : ((Math.random() * 4) | 0), // 0-3 base colors, 4 = hit debt
      fromHit: !!fromHit,
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
    // 10% Twin Debt · 3% Blank Slate · remaining equal hold/consume/debuff
    if (r < 0.1) return RARE_TWIN;
    if (r < 0.13) return RARE_WIPE;
    const u = (r - 0.13) / 0.87;
    if (u < 1 / 3) return HOLD_POOL[(Math.random() * HOLD_POOL.length) | 0];
    if (u < 2 / 3) return CONSUME_POOL[(Math.random() * CONSUME_POOL.length) | 0];
    return DEBUFF_POOL[(Math.random() * DEBUFF_POOL.length) | 0];
  }

  function spawnPickup(s, forced, allowExtra) {
    const max = s.boss || allowExtra ? 5 : 2;
    if (s.pickups.length >= max) return;
    if (!s.boss && !allowExtra && (s.pickupsSpawned || 0) >= 2) return;
    s.pickupsSpawned = (s.pickupsSpawned || 0) + 1;
    const power = forced || rollCandy();
    const angle = wrapAngle(s.player.angle + rand(0.6, Math.PI * 1.8) * (Math.random() < 0.5 ? 1 : -1));
    let orbit = (Math.random() * s.orbitCount) | 0;
    if (s.pickups.length && s.orbitCount > 1) {
      const taken = new Set(s.pickups.map((p) => p.orbit));
      if (taken.has(orbit)) orbit = (orbit + 1 + ((Math.random() * (s.orbitCount - 1)) | 0)) % s.orbitCount;
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
    if (s.boss) {
      spawnPickup(s, null, true);
    }
  }

  function startPreview(s) {
    s.mode = "preview";
    s.previewT = s.boss ? 2.8 : 1.7;
    if (ui.previewBanner) {
      if (s.gameMode === "finalBoss") {
        ui.previewBanner.textContent = "FINAL · PLANET KING";
      } else if (s.gameMode === "tutorial") {
        ui.previewBanner.textContent = "TUTORIAL · PRACTICE";
      } else if (s.gameMode === "campaign") {
        const names = ["", "CRYO TYRANT", "ASH HALO", "PULSE CORE"];
        ui.previewBanner.textContent = s.boss ? `BOSS · ${names[s.bossId]}` : `LEVEL ${s.level}`;
      } else {
        ui.previewBanner.textContent = `WAVE ${s.escalation + 1}`;
      }
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
    if (s._heldInfo) {
      dismissInventory();
      return;
    }
    const power = s.pendingPower;
    s.pendingPower = null;
    ui.pick.classList.add("hidden");
    if (ui.invPanel) ui.invPanel.classList.add("hidden");
    const panel = ui.pick.querySelector(".info-panel");
    if (panel) panel.classList.remove("debuff");
    s.mode = "play";
    setTheme(themeForState(s));
    if (power) {
      if (power.kind === "consume" || power.kind === "debuff") power.use(s);
      else addHoldPower(s, power);
    }
    if (s.mode === "play") s.player.invuln = Math.max(s.player.invuln, 0.6);
  }

  function dismissInventory() {
    const s = state;
    if (!s._heldInfo) return;
    s._heldInfo = false;
    if (ui.invPanel) ui.invPanel.classList.add("hidden");
    if (s.mode === "powerInfo") {
      s.mode = "play";
      setTheme("play");
      s.player.invuln = Math.max(s.player.invuln, 0.35);
    }
  }

  function showHeldPowers(s) {
    if (s.mode !== "play" || !ui.invPanel) return;
    const n = s.maxSlots || 2;
    while (s.held.length < n) s.held.push(null);
    s.mode = "powerInfo";
    s.pendingPower = null;
    s._heldInfo = true;
    setTheme("none");

    const skin = SKINS.find((x) => x.id === selectedSkin) || SKINS[0];
    const def = SKIN_SUPERS[selectedSkin] || SKIN_SUPERS.marshmallow;
    if (ui.invName) ui.invName.textContent = skin.name;
    if (ui.invSuperLine) {
      ui.invSuperLine.textContent = def.none
        ? "Super: none"
        : `Super: ${def.name}` + (s.superCd > 0 ? ` · ${Math.ceil(s.superCd)}s` : " · ready");
    }
    if (ui.invHealth) {
      ui.invHealth.innerHTML = "";
      for (let i = 0; i < s.lives; i++) {
        const pip = document.createElement("div");
        pip.className = "pip";
        ui.invHealth.appendChild(pip);
      }
      if (!s.lives) ui.invHealth.textContent = "No lives";
    }
    if (ui.invChar) drawSkinPreview(ui.invChar, selectedSkin, performance.now());

    if (ui.invSlots) {
      ui.invSlots.innerHTML = "";
      for (let i = 0; i < n; i++) {
        const p = s.held[i];
        const row = document.createElement("div");
        row.className = "inv-slot" + (p ? "" : " empty");
        const canvas = document.createElement("canvas");
        canvas.width = 48;
        canvas.height = 48;
        const box = document.createElement("div");
        box.innerHTML =
          `<div class="inv-slot-label">SLOT ${i + 1}</div>` +
          `<div class="inv-slot-title">${p ? p.name : "Empty"}</div>` +
          `<div class="inv-slot-desc">${p ? p.desc : "No candy stored — pick one up on the rings."}</div>`;
        row.appendChild(canvas);
        row.appendChild(box);
        ui.invSlots.appendChild(row);
        if (p) drawPowerIcon(canvas, p.icon, 48, p.tint);
        else {
          const x = canvas.getContext("2d");
          x.clearRect(0, 0, 48, 48);
          x.strokeStyle = "rgba(80,50,120,0.25)";
          x.lineWidth = 2;
          x.beginPath();
          x.arc(24, 24, 14, 0, Math.PI * 2);
          x.stroke();
        }
      }
    }
    ui.invPanel.classList.remove("hidden");
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
    applyVibe(vibeForLevel(level));

    const boss = isBossLevel(level);
    const world = worldOfLevel(level);
    const liw = levelInWorld(level);
    s.boss = boss;
    s.bossId = boss ? world : 0;
    // Fullscreen immersion for Cryo / Ash / Pulse (same as Planet King)
    setBossImmersive(!!boss);
    // Light zoom-out so outermost ring clears HUD / edges
    s.camZoom = boss ? 0.85 : 1;
    s.shakeT = boss ? 999 : 0;

    const prevOrbits = s.orbitCount;
    s.orbitCount = campaignOrbitCount(level);

    if (!fromAdvance && !s.bossTest) {
      s.enemies = [];
    }
    rebuildLevelDebt(s);
    s.player.orbit = Math.min(s.player.orbit, s.orbitCount - 1);
    if (boss) s.bossWarmup = 5.5;
    else s.bossWarmup = 0;

    const diff = campaignDiff(level);
    const flags = flagsFor({ ...s, level, boss, bossId: s.bossId, gameMode: "campaign", escalation: 0 });
    s.duration = campaignDuration(level);
    s.timeLeft = s.duration;
    s.lasers = [];
    s.asteroids = [];
    s.fragments = [];
    s.fighters = [];
    s.shots = [];
    s.hail = [];
    s.weather = null;
    s.weatherTimer = world >= 3 || (boss && world >= 3) ? rand(6, 10) : 999;
    s.fighterTimer = flags.fighters ? rand(3, 6) : 999;
    s.candyTimer = boss ? rand(3.5, 5.5) : 999;
    s.pickups = [];
    s.burst = [];
    s.laserCooldown = boss ? [0, 2.2, 1.9, 1.65][world] : Math.max(0.7, (flags.multiLaser ? 1.85 : 2.7) / Math.sqrt(diff));
    s.asteroidTimer = flags.asteroids ? Math.max(0.9, (flags.denseAsteroids ? 1.6 : 3.8) / Math.sqrt(diff)) : 999;
    if (boss) s.asteroidTimer = [0, 3.2, 2.6, 2.1][world];
    s.pickupsSpawned = 0;
    s.pendingPower = null;
    s.stutterT = s.chronoT = s.magnetT = s.sugarT = s.jellyT = s.glitterT = s.hushT = 0;
    s.molassesT = s.barrageT = s.gravityT = s.scrambleT = s.stickyT = s.meteorT = s.rampageT = s.breezeT = 0;
    s.player.angle = -Math.PI / 2;
    s.player.hop = 0;
    s.player.radiusBoost = 0;
    s.player.invuln = boss ? 2 : 1.2;
    s.player.blink = s.player.invuln;
    if (!fromAdvance) {
      s.superUsedOnce = false;
      s.superCd = 0;
    }
    if (!fromAdvance && selectedSkin === "ghost") {
      s.lives = Math.max(1, Math.min(s.lives, 2));
    }
    syncDebt(s);

    spawnLevelCandies(s);
    s.planetStyle = boss ? 100 + s.bossId : Math.floor((liw - 1) / 2) % 5;

    ui.pick.classList.add("hidden");
    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
    setTheme(playThemeForLevel(level));
    showHud(true);
    ui.overlay.classList.add("hidden");
    ui.overlay.classList.remove("show");
    ui.endScreen.classList.add("hidden");
    updateHUD(s);
    startPreview(s);
  }

  function beginTutorial(s) {
    setBossImmersive(false);
    s.mode = "play";
    s.gameMode = "tutorial";
    s.level = 0;
    s.boss = false;
    s.bossId = 0;
    s.bossTest = false;
    s.escalation = 0;
    s.camZoom = 1;
    s.shakeT = 0;
    s.orbitCount = 2;
    s.enemies = [];
    s.enemies.push(makeEnemy(1, 0.4, 1, false));
    s.enemies.push(makeEnemy(1, Math.PI + 0.2, -1, false));
    s.enemies.push(makeEnemy(0, Math.PI * 0.5, 1, false));
    syncDebt(s);
    s.player.orbit = 1;
    s.player.angle = -Math.PI / 2;
    s.player.hop = 0;
    s.player.radiusBoost = 0;
    s.player.dir = 1;
    s.player.invuln = 1.8;
    s.player.blink = 1.8;
    s.lives = 5;
    s.duration = 45;
    s.timeLeft = 45;
    s.survived = 0;
    s.tutorialHint = 0;
    s.lasers = [];
    s.asteroids = [];
    s.fragments = [];
    s.fighters = [];
    s.shots = [];
    s.hail = [];
    s.weather = null;
    s.weatherTimer = 999;
    s.fighterTimer = 999;
    s.candyTimer = 999;
    s.asteroidTimer = 999;
    s.laserCooldown = 9;
    s.pickups = [];
    s.pickupsSpawned = 0;
    s.pendingPower = null;
    s.burst = [];
    s.stutterT = s.chronoT = s.magnetT = s.sugarT = s.jellyT = s.glitterT = s.hushT = 0;
    s.molassesT = s.barrageT = s.gravityT = s.scrambleT = s.stickyT = s.meteorT = s.rampageT = s.breezeT = 0;
    s.superUsedOnce = false;
    s.superCd = 0;
    s.held = [null, null];
    s.maxSlots = 2;
    s.hollowCharges = 0;
    s.planetStyle = 0;
    applyVibe("frost");
    spawnPickup(s, CONSUME.life, true);
    ui.pick.classList.add("hidden");
    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
    setTheme("play");
    showHud(true);
    ui.overlay.classList.add("hidden");
    ui.overlay.classList.remove("show");
    ui.endScreen.classList.add("hidden");
    updateHUD(s);
    startPreview(s);
  }

  function tickTutorialHints(s) {
    if (s.gameMode !== "tutorial") return;
    const beats = [
      [0.4, "A/D or ←→ — spin around the ring"],
      [7, "W/S or ↑↓ — switch rings · hop on the rim"],
      [15, "Lasers telegraph first — move off the line!"],
      [24, "Grab the candy — then press 1 if it goes to a slot"],
      [32, "Survive until the timer ends!"],
    ];
    while (s.tutorialHint < beats.length && s.survived >= beats[s.tutorialHint][0]) {
      toast(beats[s.tutorialHint][1], 2800);
      s.tutorialHint++;
    }
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
    s.superUsedOnce = false;
    s.superCd = 0;
    spawnLevelCandies(s);
    s.phaseCycles = 0;
    setEndlessPhase(s, 0, false);
    applyVibe("frost");
    setTheme("play");
    showHud(true);
    ui.overlay.classList.add("hidden");
    ui.overlay.classList.remove("show");
    ui.endScreen.classList.add("hidden");
    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
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
    s.planetStyle = 200;
    toast(`Escalation ${s.escalation}`);
    sfx.clear();
    updateHUD(s);
    startPreview(s);
  }

  function countEnemiesOnOrbit(s, orbit) {
    let n = 0;
    for (const e of s.enemies) if (e.orbit === orbit) n++;
    return n;
  }

  function spawnFinalBossSeed(s) {
    // Light opening presence — one clone per ring
    s.enemies = [];
    for (let orbit = 0; orbit < s.orbitCount; orbit++) {
      const angle = freeAngleOnOrbit(s, orbit, -Math.PI / 2 + orbit * 0.9);
      s.enemies.push(makeEnemy(orbit, angle, orbit % 2 === 0 ? 1 : -1, false));
    }
    syncDebt(s);
  }

  function spawnFinalBossClone(s) {
    const cap = 10; // max per ring
    const under = [];
    for (let o = 0; o < s.orbitCount; o++) {
      if (countEnemiesOnOrbit(s, o) < cap) under.push(o);
    }
    if (!under.length) return false;
    const orbit = under[(Math.random() * under.length) | 0];
    const angle = freeAngleOnOrbit(s, orbit, s.player.angle + Math.PI + rand(-0.8, 0.8));
    s.enemies.push(makeEnemy(orbit, angle, Math.random() < 0.5 ? 1 : -1, false));
    syncDebt(s);
    return true;
  }

  function beginFinalBoss(s) {
    setFinalImmersive(true);
    s.mode = "play";
    s.gameMode = "finalBoss";
    s.level = 30;
    s.boss = true;
    s.bossId = 4;
    s.bossTest = false;
    s.escalation = 0;
    s.camZoom = 0.8; // keep outermost ring inside clipped playfield
    s.shakeT = 999;
    s.orbitCount = 5;
    s.finalPhase = 1;
    s.ringLaserTimer = 5.5;
    s.bossWarmup = 4.5;
    s.debtSpawnTimer = 2.2;
    applyVibe("frost"); // keep UI calm; fight art is custom holy palette
    s.enemies = [];
    spawnFinalBossSeed(s);
    s.player.orbit = 2;
    s.player.angle = -Math.PI / 2;
    s.player.hop = 0;
    s.player.radiusBoost = 0;
    s.player.invuln = 2.2;
    s.player.blink = 2.2;
    s.superUsedOnce = false;
    s.superCd = 0;
    s.duration = 180;
    s.timeLeft = 180;
    s.survived = 0;
    s.lasers = [];
    s.asteroids = [];
    s.fragments = [];
    s.fighters = [];
    s.shots = [];
    s.hail = [];
    s.weather = null;
    s.weatherTimer = 999;
    s.fighterTimer = 4.5;
    s.candyTimer = 10;
    s.pickups = [];
    s.burst = [];
    s.laserCooldown = 1.35;
    s.asteroidTimer = 2.6;
    s.pickupsSpawned = 0;
    s.pendingPower = null;
    s.stutterT = s.chronoT = s.magnetT = s.sugarT = s.jellyT = s.glitterT = s.hushT = 0;
    s.molassesT = s.barrageT = s.gravityT = s.scrambleT = s.stickyT = s.meteorT = s.rampageT = s.breezeT = 0;
    s.planetStyle = 104;
    spawnLevelCandies(s);
    ui.pick.classList.add("hidden");
    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
    setTheme("playFinal");
    showHud(true);
    ui.overlay.classList.add("hidden");
    ui.overlay.classList.remove("show");
    ui.endScreen.classList.add("hidden");
    updateHUD(s);
    startPreview(s);
    toast("Phase 1 — Throne Rising");
  }

  function tickFinalBoss(s, gdt, laserDt, flags, diff) {
    const phase = finalBossPhase(s);
    if (phase !== (s.finalPhase || 1)) {
      s.finalPhase = phase;
      if (phase === 2) {
        toast("Phase 2 — NO candy · pressure up");
        s.candyTimer = 9999;
        s.pickups = [];
        sfx.clear();
      } else if (phase === 3) {
        toast("Phase 3 — RING LASERS · hold 60s");
        s.candyTimer = 15;
        s.ringLaserTimer = 3.2;
        sfx.clear();
      }
      updateHUD(s);
    }

    // Gradual debt — clones drip in instead of a full board dump
    s.debtSpawnTimer = (s.debtSpawnTimer ?? 2) - gdt;
    if (s.debtSpawnTimer <= 0 && (s.bossWarmup || 0) <= 0) {
      const interval = phase === 1 ? 2.3 : phase === 2 ? 1.45 : 1.05;
      const burst = phase === 1 ? 1 : phase === 2 ? 2 : 2;
      for (let i = 0; i < burst; i++) spawnFinalBossClone(s);
      s.debtSpawnTimer = interval;
      updateHUD(s);
    }

    // Candies by phase
    if (phase === 1) {
      s.candyTimer -= gdt;
      if (s.candyTimer <= 0 && s.pickups.length < 4) {
        spawnPickup(s, null, true);
        s.candyTimer = 10;
      }
    } else if (phase === 3) {
      s.candyTimer -= gdt;
      if (s.candyTimer <= 0 && s.pickups.length < 3) {
        spawnPickup(s, null, true);
        s.candyTimer = 15;
      }
    }

    // Ring-orbit lasers (phase 3 only)
    if (phase >= 3 && (s.bossWarmup || 0) <= 0) {
      s.ringLaserTimer -= laserDt;
      if (s.ringLaserTimer <= 0) {
        const orbit = (Math.random() * s.orbitCount) | 0;
        s.lasers.push({
          type: "ring",
          orbit,
          t: 0,
          wind: 0.85,
          hold: 0.55,
          width: 16,
        });
        s.ringLaserTimer = rand(3.4, 4.6);
        toast(`RING ${orbit + 1} OVERLOAD`, 900);
        sfx.laser();
      }
    }
  }

  function finalBossLaserCooldown(s) {
    const e = finalBossElapsed(s);
    const phase = finalBossPhase(s);
    if (phase === 1) {
      // incremental 1.35 → 0.95 across minute 1
      const t = Math.min(1, e / 60);
      return 1.35 - 0.4 * t;
    }
    if (phase === 2) {
      // exponential-ish squeeze 0.85 → 0.55
      const t = Math.min(1, (e - 60) / 60);
      return 0.85 * Math.pow(0.65, t);
    }
    // phase 3 frequent but readable with ring lasers
    const t = Math.min(1, (e - 120) / 60);
    return 0.72 - 0.12 * t;
  }

  function finalBossAsteroidCooldown(s) {
    const e = finalBossElapsed(s);
    const phase = finalBossPhase(s);
    if (phase === 1) return 2.6 - 0.9 * Math.min(1, e / 60);
    if (phase === 2) {
      const t = Math.min(1, (e - 60) / 60);
      return 1.35 * Math.pow(0.55, t);
    }
    return 0.85 - 0.15 * Math.min(1, (e - 120) / 60);
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
    if (ui.superHud) ui.superHud.classList.toggle("hidden", !on);
    if (on) updateSuperHud(state);
  }

  function updateSuperHud(s) {
    if (!ui.superHud || !ui.superIcon) return;
    const def = SKIN_SUPERS[selectedSkin] || SKIN_SUPERS.marshmallow;
    const none = !!def.none;
    ui.superHud.classList.toggle("none", none);
    if (ui.superName) ui.superName.textContent = none ? "NO SUPER" : def.name;
    const once = !!def.oncePerRun;
    const maxCd =
      selectedSkin === "knight" ? 26 : selectedSkin === "starcat" ? SUPER_CD + 4 : once ? 1 : SUPER_CD;
    const cd = s.superCd || 0;
    if (ui.superCdLabel) {
      if (none) ui.superCdLabel.textContent = "—";
      else if (once) ui.superCdLabel.textContent = s.superUsedOnce ? "USED" : "READY";
      else ui.superCdLabel.textContent = cd > 0 ? `${Math.ceil(cd)}s` : "READY";
    }
    const pct = none ? 0 : once ? (s.superUsedOnce ? 100 : 0) : cd > 0 ? (cd / maxCd) * 100 : 0;
    if (ui.superCdRing) ui.superCdRing.style.setProperty("--cd", `${pct}%`);
    drawSkinPreview(ui.superIcon, selectedSkin, performance.now());
  }

  function updateHUD(s) {
    if (s.gameMode === "tutorial") {
      ui.modeLabel.textContent = "TUTORIAL";
      ui.levelLabel.textContent = "PRACTICE BEAT";
      const m = Math.floor(s.timeLeft / 60);
      const sec = Math.ceil(s.timeLeft % 60);
      ui.timer.textContent = `${m}:${String(sec).padStart(2, "0")}`;
      ui.timerFill.style.width = `${Math.max(0, (s.timeLeft / Math.max(1, s.duration)) * 100)}%`;
      ui.escalation.textContent = "LEARN THE ROPES";
      ui.debtLabel.textContent = `DEBT ${s.enemies.length}`;
    } else if (s.gameMode === "finalBoss") {
      const ph = finalBossPhase(s);
      const names = ["", "THRONE", "PRESSURE", "OVERLOAD"];
      ui.modeLabel.textContent = "PLANET KING";
      ui.levelLabel.textContent = `PHASE ${ph} · ${names[ph]}`;
      const m = Math.floor(s.timeLeft / 60);
      const sec = Math.ceil(s.timeLeft % 60);
      ui.timer.textContent = `${m}:${String(sec).padStart(2, "0")}`;
      ui.timerFill.style.width = `${Math.max(0, (s.timeLeft / s.duration) * 100)}%`;
      ui.escalation.textContent = `SURVIVE ${Math.ceil(s.timeLeft)}s · HIT +3`;
      ui.debtLabel.textContent = `DEBT ${s.enemies.length}`;
    } else if (s.gameMode === "campaign") {
      ui.modeLabel.textContent = s.boss
        ? ["", "CRYO TYRANT", "ASH HALO", "PULSE CORE"][s.bossId] || "BOSS"
        : `WORLD ${worldOfLevel(s.level)}`;
      ui.levelLabel.textContent = s.boss
        ? `BOSS ${s.level}`
        : `LEVEL ${s.level} / 30`;
      const m = Math.floor(s.timeLeft / 60);
      const sec = Math.ceil(s.timeLeft % 60);
      ui.timer.textContent = `${m}:${String(sec).padStart(2, "0")}`;
      ui.timerFill.style.width = `${Math.max(0, (s.timeLeft / s.duration) * 100)}%`;

    } else {
      const ph = endlessPhaseInfo(s);
      ui.modeLabel.textContent = `ENDLESS · ${ph.name}`;
      ui.levelLabel.textContent = `ALIVE ${Math.floor(s.survived)}s`;
      ui.timer.textContent = `${Math.ceil(s.endlessTick)}s`;
      ui.timerFill.style.width = `${Math.max(0, (s.endlessTick / 15) * 100)}%`;
      const phasePct = s.phaseDur > 0 ? Math.max(0, s.phaseT / s.phaseDur) : 0;
      ui.escalation.textContent = `ESCALATION ${s.escalation} · ${ph.name} ${Math.ceil(Math.max(0, s.phaseT))}s`;
      // reuse timer fill to also hint phase via CSS var if present
      if (ui.timerFill) ui.timerFill.style.setProperty("--phase", String(phasePct));
    }
    ui.lives.innerHTML = "";
    for (let i = 0; i < s.lives; i++) {
      const pip = document.createElement("div");
      pip.className = "life-pip";
      ui.lives.appendChild(pip);
    }
    if (s.gameMode !== "finalBoss" && s.gameMode !== "tutorial") {
      const base = s.gameMode === "campaign" ? baseDebtCount(s) : s.enemies.length;
      const hit = hitDebtCount(s);
      ui.debtLabel.textContent = s.gameMode === "campaign" ? `DEBT ${base}+${hit}` : `DEBT ${s.enemies.length}`;
      if (s.gameMode === "campaign") {
        ui.escalation.textContent = `HEAT ×${campaignDiff(s.level).toFixed(1)}`;
      }
    }
    updateSlots(s);
    updateSuperHud(s);
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
      notePowerUse();
      updateSlots(s);
      updateHUD(s);
    }
  }

  function killPlayer(s, reason, kind) {
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
    s.player.hopInvuln = 0;
    s.player.radiusBoost = 0;
    spawnHitEnemy(s);
    if (s.gameMode !== "tutorial") noteDeath(kind || "other");
    if (selectedSkin === "fish") s.player.dir *= -1;
    s.player.angle = wrapAngle(s.player.angle - s.player.dir * 0.55);
    spawnHitParticles(angleToPos(s.player.angle, currentRadius(s)));
    toast(
      reason ||
        (isFinalBoss(s) ? "Ouch — hit debt +3" : s.gameMode === "tutorial" ? "Ouch — that's a hit" : "Ouch — hit debt +1")
    );
    updateHUD(s);

    if (s.lives <= 0) {
      s.mode = "dead";
      setTheme("dead");
      setTimeout(() => showEnd(s, false), 500);
    }
  }

  function showEnd(s, won) {
    if (s.gameMode === "endless") noteEndless(s.survived);
    setFinalImmersive(false);
    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
    s._endGoWorlds = s.gameMode === "tutorial";
    s.mode = "title";
    s.boss = false;
    s.camZoom = 1;
    s.shakeT = 0;
    showHud(false);
    if (ui.previewBanner) ui.previewBanner.classList.add("hidden");
    ui.endScreen.classList.remove("hidden");
    if (s.gameMode === "tutorial") {
      setTheme(won ? "win" : "dead");
      ui.endTitle.textContent = won ? "NICE!" : "TRY AGAIN";
      ui.endTag.textContent = won
        ? "You've got the basics — pick a world when you're ready."
        : "No stress — open Tutorial again anytime.";
      if (ui.endMenu) ui.endMenu.textContent = "BACK TO WORLDS";
      return;
    }
    if (ui.endMenu) ui.endMenu.textContent = "MAIN MENU";
    if (won) {
      setTheme("win");
      const world = worldOfLevel(s.level);
      if (isFinalBoss(s)) {
        ui.endTitle.textContent = "LEDGER CLOSED";
        ui.endTag.textContent = `Planet King dethroned · ${Math.floor(s.survived)}s · debt ${s.enemies.length}`;
      } else if (s.level >= 30) {
        ui.endTitle.textContent = "CAMPAIGN CLEAR";
        ui.endTag.textContent = `All 30 levels · FINAL BOSS unlocked · debt ${s.enemies.length}`;
      } else if (isBossLevel(s.level)) {
        ui.endTitle.textContent = `${WORLDS[world - 1].name} CLEARED`;
        ui.endTag.textContent = `Boss down · world ${world + 1} unlocked · debt ${s.enemies.length}`;
      } else {
        ui.endTitle.textContent = "WORLD CLEARED";
        ui.endTag.textContent = `Level ${s.level} · debt ${s.enemies.length}`;
      }
    } else {
      setTheme("dead");
      ui.endTitle.textContent = "DEBT DEFAULT";
      ui.endTag.textContent =
        s.gameMode === "endless"
          ? `Survived ${Math.floor(s.survived)}s · esc ${s.escalation} · clones ${s.enemies.length}`
          : isFinalBoss(s)
            ? `Planet King · phase ${finalBossPhase(s)} · ${Math.floor(s.survived)}s · clones ${s.enemies.length}`
            : `Level ${s.level}/30 · clones ${s.enemies.length}`;
    }
  }

  function clearLevel(s) {
    s.mode = "clear";
    syncDebt(s);
    sfx.clear();
    if (s.gameMode === "tutorial") {
      toast("Tutorial complete!");
      setTimeout(() => showEnd(s, true), 700);
      return;
    }
    if (isFinalBoss(s)) {
      noteFinalBossBeat();
      toast("Planet King fallen — ledger closed");
      setTimeout(() => showEnd(s, true), 1000);
      return;
    }
    if (isBossLevel(s.level)) {
      const world = worldOfLevel(s.level);
      noteBossBeat(s.level);
      if (world < 3) setUnlockedWorld(world + 1);
      toast(s.level >= 30 ? "Campaign clear — FINAL BOSS unlocked!" : `Boss cleared! World ${world + 1} unlocked`);
      setTimeout(() => showEnd(s, true), 900);
      return;
    }
    const unlocked = noteLevelClear(s.level) || [];
    if (unlocked.length) toast(`Level ${s.level} · unlocked ${unlocked.map((x) => x.name).join(", ")}`, 2800);
    else toast(`Level ${s.level} cleared!`);
    setTimeout(() => beginCampaignLevel(s, s.level + 1, true), unlocked.length ? 1200 : 850);
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
    p.hopInvuln = (big ? 0.55 : 0.42) * (selectedSkin === "wingball" ? 0.75 : 1);
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
    if (s.gameMode === "tutorial") return 0.65;
    if (s.gameMode === "finalBoss") {
      const ph = finalBossPhase(s);
      const e = finalBossElapsed(s);
      // Incremental in phase 1, then sharper climb
      if (ph === 1) return 1.25 + (e / 60) * 0.35;
      if (ph === 2) return 1.7 + Math.pow(e - 60, 1.35) * 0.012;
      return 2.4 + (e - 120) * 0.018;
    }
    if (s.gameMode === "campaign") return campaignDiff(s.level);
    return Math.pow(1.18, s.escalation);
  }

  function playerSpeed(s) {
    let base =
      1.5 +
      (s.gameMode === "finalBoss"
        ? 0.18 + finalBossPhase(s) * 0.04
        : s.gameMode === "campaign"
          ? levelInWorld(s.level) * 0.05 + (worldOfLevel(s.level) - 1) * 0.08
          : s.escalation * 0.05);
    if (selectedSkin === "crescent") base *= 0.92;
    if (s.boss) base *= 0.78; // easier navigation on bosses
    if (s.sugarT > 0) base *= 1.6;
    if (s.molassesT > 0) base *= 0.55;
    if (s.weather && s.weather.type === "wind" && s.weather.warnT <= 0 && s.weather.t > 0) {
      // Tangent of orbit motion vs wind direction
      const moveA = s.player.angle + (s.player.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      const align = Math.cos(moveA - s.weather.dir);
      if (align > 0.25) base *= 1.5;
      else if (align < -0.25) base *= 0.52;
    }
    return base;
  }

  function flagsFor(s) {
    if (s.gameMode === "tutorial") {
      return {
        lasers: true,
        laserCount: 1,
        multiLaser: false,
        fastLaser: false,
        asteroids: false,
        denseAsteroids: false,
        fragmentsHurt: false,
        aggressiveAim: false,
        fighters: false,
        weather: false,
      };
    }
    if (isFinalBoss(s)) {
      const warm = (s.bossWarmup || 0) > 0;
      const phase = finalBossPhase(s);
      return {
        lasers: !warm,
        laserCount: 5,
        multiLaser: true,
        fastLaser: !warm,
        asteroids: !warm,
        denseAsteroids: phase >= 2 && !warm,
        planetoids: !warm,
        fragmentsHurt: true,
        aggressiveAim: phase >= 2 && !warm,
        fighters: !warm,
        weather: false,
        finalPhase: phase,
      };
    }
    if (s.gameMode === "endless") {
      const lvl = 1 + s.escalation;
      return {
        lasers: true,
        laserCount: lvl >= 4 ? 2 : 1,
        multiLaser: lvl >= 3,
        fastLaser: lvl >= 6,
        asteroids: lvl >= 3,
        denseAsteroids: lvl >= 7,
        fragmentsHurt: lvl >= 3,
        aggressiveAim: lvl >= 5,
        fighters: lvl >= 5,
        weather: lvl >= 8,
      };
    }
    const world = worldOfLevel(s.level);
    const liw = levelInWorld(s.level);
    if (s.boss) {
      const warm = (s.bossWarmup || 0) > 0;
      return {
        lasers: !warm,
        laserCount: s.bossId === 1 ? 2 : 3,
        multiLaser: s.bossId >= 2,
        fastLaser: s.bossId >= 3 && !warm,
        asteroids: s.bossId >= 2 && !warm,
        denseAsteroids: s.bossId >= 3 && !warm,
        fragmentsHurt: s.bossId >= 2,
        aggressiveAim: s.bossId >= 2 && !warm,
        fighters: s.bossId >= 2 && !warm,
        weather: s.bossId >= 3 && !warm,
      };
    }
    if (world === 1) {
      return {
        lasers: true,
        laserCount: liw >= 8 ? 2 : 1,
        multiLaser: liw >= 8,
        fastLaser: false,
        asteroids: liw >= 10,
        denseAsteroids: false,
        fragmentsHurt: false,
        aggressiveAim: false,
        fighters: false,
        weather: false,
      };
    }
    if (world === 2) {
      return {
        lasers: true,
        laserCount: liw >= 6 ? 2 : 1,
        multiLaser: liw >= 6,
        fastLaser: liw >= 8,
        asteroids: liw >= 3,
        denseAsteroids: liw >= 8,
        fragmentsHurt: liw >= 5,
        aggressiveAim: liw >= 7,
        fighters: liw >= 8,
        weather: false,
      };
    }
    // World 3
    return {
      lasers: true,
      laserCount: liw >= 5 ? 2 : 2,
      multiLaser: true,
      fastLaser: liw >= 4,
      asteroids: true,
      denseAsteroids: liw >= 6,
      fragmentsHurt: true,
      aggressiveAim: liw >= 3,
      fighters: liw >= 3,
      weather: liw >= 5,
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
      if (s.phaseFlash > 0) s.phaseFlash = Math.max(0, s.phaseFlash - dt);
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
    // Cold weather slows most simulation, but not lasers
    const cold = s.weather && s.weather.type === "cold" && s.weather.t > 0;
    const gdt = dt * timeScale * (cold ? 0.55 : 1);
    const laserDt = dt * timeScale;

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
      "shakeT",
    ].forEach((k) => {
      if (s[k] > 0) s[k] = Math.max(0, s[k] - dt);
    });

    const p = s.player;
    p.invuln = Math.max(0, p.invuln - dt);
    p.blink = Math.max(0, p.blink - dt);
    p.hopInvuln = Math.max(0, p.hopInvuln - dt);
    if (s.superCd > 0) s.superCd = Math.max(0, s.superCd - dt);
    if (s.bossWarmup > 0) s.bossWarmup = Math.max(0, s.bossWarmup - gdt);
    if ((s._superHudAcc = (s._superHudAcc || 0) + dt) > 0.12) {
      s._superHudAcc = 0;
      updateSuperHud(s);
      if (s.gameMode === "endless" || s.gameMode === "finalBoss") updateHUD(s);
    }
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
        let eMult = 0.24;
        if (s.breezeT > 0) eMult *= 0.5;
        if (s.boss) eMult *= 0.62;
        if (s.gameMode === "tutorial") eMult *= 0.55;
        e.angle = wrapAngle(e.angle + e.dir * (spd * eMult) * gdt);
        e.wobble += gdt * 3.5;
      }
      resolveEnemyHazards(s);
    }

    if (!p.trail) p.trail = [];
    const pr = currentRadius(s);
    const pp = angleToPos(p.angle, pr);
    p.trail.unshift({ x: pp.x, y: pp.y, a: 1 });
    if (p.trail.length > 8) p.trail.length = 8;
    for (let i = 1; i < p.trail.length; i++) p.trail[i].a *= 0.86;

    s.survived += gdt;
    const flags = flagsFor(s);
    const diff = difficultyFor(s);

    if (s.gameMode === "campaign" || s.gameMode === "finalBoss" || s.gameMode === "tutorial") {
      s.timeLeft -= gdt;
      if (s.gameMode === "finalBoss") tickFinalBoss(s, gdt, laserDt, flags, diff);
      if (s.gameMode === "tutorial") tickTutorialHints(s);
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
      tickEndlessPhase(s, gdt);
    }

    // Candies bounce on their orbit so they read clearly against the ring
    for (const pu of s.pickups) {
      pu.bob += gdt * 7.5;
      pu.spin += gdt * 2;
      pu.angle += 0.08 * gdt;
    }

    if (s.hushT <= 0) {
      s.laserCooldown -= laserDt;
      if (s.laserCooldown <= 0) {
        fireLaser(s, flags);
        let cd;
        if (isFinalBoss(s)) cd = finalBossLaserCooldown(s);
        else if (s.gameMode === "tutorial") cd = 3.4;
        else if (s.boss) cd = [0, 2.3, 2.0, 1.7][s.bossId] || 1.8;
        else {
          const base = flags.fastLaser ? 1.05 : 1.65;
          cd = Math.max(
            0.45,
            (base - (s.gameMode === "endless" ? s.escalation * 0.05 : levelInWorld(s.level) * 0.04)) / Math.sqrt(diff)
          );
        }
        if (s.barrageT > 0) cd *= 0.42;
        if (selectedSkin === "robot") cd *= 0.9;
        s.laserCooldown = Math.max(0.28, cd);
      }
    }
    for (const L of s.lasers) L.t += laserDt;
    s.lasers = s.lasers.filter((L) => L.t < L.wind + L.hold);

    if (flags.asteroids || s.meteorT > 0) {
      s.asteroidTimer -= gdt * (selectedSkin === "chili" ? 1.15 : 1);
      if (s.asteroidTimer <= 0) {
        spawnAsteroid(s, flags, diff);
        let at;
        if (isFinalBoss(s)) at = finalBossAsteroidCooldown(s);
        else if (s.boss) at = [0, 3.4, 2.7, 2.2][s.bossId];
        else if (worldOfLevel(s.level) === 1) at = rand(2.8, 4.2); // sparse endgame W1
        else at = (flags.denseAsteroids || s.meteorT > 0 ? rand(0.7, 1.4) : rand(1.5, 2.8)) / Math.sqrt(diff);
        if (s.meteorT > 0) at *= 0.65;
        s.asteroidTimer = at;
      }
    }

    // Boss / late levels: keep candies flowing (max 5) — final boss has its own phase candy timing
    if (!isFinalBoss(s) && (s.boss || (s.gameMode === "campaign" && worldOfLevel(s.level) >= 2))) {
      s.candyTimer -= gdt;
      if (s.candyTimer <= 0 && s.pickups.length < 5) {
        spawnPickup(s, null, true);
        s.candyTimer = s.boss ? rand(3.2, 5.5) : rand(7, 11);
      }
    }

    // Fighters
    if (flags.fighters) {
      s.fighterTimer -= gdt;
      let cap, fCd;
      if (isFinalBoss(s)) {
        const ph = finalBossPhase(s);
        cap = ph === 1 ? 2 : ph === 2 ? 3 : 4;
        fCd = ph === 1 ? rand(3.2, 4.5) : ph === 2 ? rand(2.0, 3.0) : rand(1.5, 2.4);
      } else {
        cap = s.boss ? 1 + s.bossId : worldOfLevel(s.level) >= 3 ? 3 : 2;
        fCd = s.boss ? rand(5, 8) : rand(4.5, 7.5);
      }
      if (s.fighterTimer <= 0 && s.fighters.length < cap) {
        spawnFighter(s);
        s.fighterTimer = fCd;
      }
    }
    updateFighters(s, gdt);

    // Weather (world 3 + boss 30)
    if (flags.weather) {
      updateWeather(s, gdt, laserDt);
    } else if (s.weather) {
      s.weather = null;
    }

    for (const a of s.asteroids) {
      a.x += a.vx * gdt;
      a.y += a.vy * gdt;
      a.spin += a.spinV * gdt;
      a.life -= gdt;
    }
    // Asteroid ↔ asteroid collisions (all levels)
    for (let i = 0; i < s.asteroids.length; i++) {
      for (let j = i + 1; j < s.asteroids.length; j++) {
        const a = s.asteroids[i];
        const b = s.asteroids[j];
        if (!a || !b || a.life <= 0 || b.life <= 0) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const minD = a.r + b.r;
        if (dist < minD) {
          // bounce apart
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = (minD - dist) * 0.5;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
          const avn = a.vx * nx + a.vy * ny;
          const bvn = b.vx * nx + b.vy * ny;
          const aVx = a.vx + (bvn - avn) * nx;
          const aVy = a.vy + (bvn - avn) * ny;
          const bVx = b.vx + (avn - bvn) * nx;
          const bVy = b.vy + (avn - bvn) * ny;
          a.vx = aVx;
          a.vy = aVy;
          b.vx = bVx;
          b.vy = bVy;
          // occasional shatter on hard hits
          const rel = Math.hypot(a.vx - b.vx, a.vy - b.vy);
          if (rel > 140 && Math.random() < 0.35) {
            shatterAsteroid(s, Math.random() < 0.5 ? a : b, true);
          }
        }
      }
    }
    // Asteroid ↔ enemies (all levels — also covered in collide, refresh here for mid-move hits)
    for (let ai = s.asteroids.length - 1; ai >= 0; ai--) {
      const a = s.asteroids[ai];
      if (!a || a.life <= 0) continue;
      for (let ei = s.enemies.length - 1; ei >= 0; ei--) {
        const e = s.enemies[ei];
        const er = orbitRadius(s.orbitCount, e.orbit);
        const ep = angleToPos(e.angle, er);
        if (Math.hypot(a.x - ep.x, a.y - ep.y) < a.r + 9) {
          destroyEnemyAt(s, ei, C.peach);
          shatterAsteroid(s, a, true);
          break;
        }
      }
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

  function spawnFighter(s) {
    const side = (Math.random() * 4) | 0;
    let x, y;
    if (side === 0) {
      x = rand(40, W - 40);
      y = -20;
    } else if (side === 1) {
      x = W + 20;
      y = rand(40, H - 40);
    } else if (side === 2) {
      x = rand(40, W - 40);
      y = H + 20;
    } else {
      x = -20;
      y = rand(40, H - 40);
    }
    s.fighters.push({
      x,
      y,
      angle: Math.atan2(CY - y, CX - x),
      shootT: rand(1.2, 2.2),
      life: 18,
      speed: s.boss ? 38 : 48,
    });
  }

  function updateFighters(s, gdt) {
    const pp = angleToPos(s.player.angle, currentRadius(s));
    for (const f of s.fighters) {
      const dx = pp.x - f.x;
      const dy = pp.y - f.y;
      const d = Math.hypot(dx, dy) || 1;
      const desired = Math.atan2(dy, dx);
      let da = desired - f.angle;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      f.angle += Math.max(-1.2, Math.min(1.2, da)) * gdt;
      f.x += Math.cos(f.angle) * f.speed * gdt;
      f.y += Math.sin(f.angle) * f.speed * gdt;
      f.life -= gdt;
      f.shootT -= gdt;
      if (f.shootT <= 0) {
        f.shootT = s.boss ? rand(1.6, 2.4) : rand(1.3, 2.1);
        // Slow bolt toward player; some become lobbed asteroids
        if (Math.random() < 0.35) {
          const sp = 55;
          s.asteroids.push({
            x: f.x,
            y: f.y,
            vx: Math.cos(desired) * sp,
            vy: Math.sin(desired) * sp,
            r: rand(10, 14),
            spin: 0,
            spinV: rand(-2, 2),
            life: 6,
            style: 0,
          });
        } else {
          const sp = 90;
          s.shots.push({
            x: f.x,
            y: f.y,
            vx: Math.cos(desired) * sp,
            vy: Math.sin(desired) * sp,
            life: 4,
            r: 5,
          });
        }
      }
    }
    s.fighters = s.fighters.filter((f) => f.life > 0 && f.x > -80 && f.x < W + 80 && f.y > -80 && f.y < H + 80);

    for (const sh of s.shots) {
      sh.x += sh.vx * gdt;
      sh.y += sh.vy * gdt;
      sh.life -= gdt;
    }
    s.shots = s.shots.filter((sh) => sh.life > 0);
  }

  function startWeather(s, type) {
    const names = { wind: "WIND WARNING", cold: "COLD FRONT", hail: "HAIL STORM" };
    toast(names[type] || "WEATHER!");
    s.weather = {
      type,
      dir: rand(0, Math.PI * 2),
      warnT: 1.4,
      t: type === "hail" ? 7 : type === "cold" ? 6 : 8,
    };
  }

  function updateWeather(s, gdt, laserDt) {
    if (!s.weather) {
      s.weatherTimer -= gdt;
      if (s.weatherTimer <= 0) {
        const types = ["wind", "cold", "hail"];
        startWeather(s, types[(Math.random() * types.length) | 0]);
        s.weatherTimer = rand(9, 14);
      }
      return;
    }
    const w = s.weather;
    if (w.warnT > 0) {
      w.warnT -= gdt;
      return;
    }
    w.t -= gdt;
    if (w.type === "hail") {
      if (Math.random() < 0.55) {
        s.hail.push({
          x: rand(0, W),
          y: -10,
          vx: rand(-20, 20) + Math.cos(w.dir) * 30,
          vy: rand(140, 220),
          life: 2.5,
          r: rand(3, 5),
        });
      }
      for (const h of s.hail) {
        h.x += h.vx * gdt;
        h.y += h.vy * gdt;
        h.life -= gdt;
        for (const a of s.asteroids.slice()) {
          if (Math.hypot(a.x - h.x, a.y - h.y) < a.r + h.r) {
            shatterAsteroid(s, a, false);
            h.life = 0;
            break;
          }
        }
      }
      s.hail = s.hail.filter((h) => h.life > 0 && h.y < H + 20);
    }
    if (w.t <= 0) s.weather = null;
    void laserDt;
  }

  function fireLaser(s, flags) {
    if (isFinalBoss(s)) {
      const count = flags.laserCount || 5;
      const spin = s.nebulaT * 0.85;
      for (let i = 0; i < count; i++) {
        const angle = s.player.angle + spin + (i / count) * Math.PI * 2 + rand(-0.08, 0.08);
        s.lasers.push({
          type: "beam",
          angle,
          t: 0,
          wind: 0.42,
          hold: 0.18 * (selectedSkin === "skull" ? 1.15 : 1),
          width: 11,
        });
      }
      sfx.laser();
      return;
    }
    if (s.boss) {
      const count = flags.laserCount || (s.bossId === 1 ? 2 : 3);
      const spin = s.bossId === 2 ? s.nebulaT * 0.35 : s.bossId === 3 ? s.nebulaT * 0.7 : 0;
      for (let i = 0; i < count; i++) {
        const angle =
          i === 0
            ? s.player.angle + rand(-0.1, 0.1)
            : s.player.angle + spin + (i === 1 ? 2.1 : -2.1) + rand(-0.15, 0.15);
        s.lasers.push({
          type: "beam",
          angle,
          t: 0,
          wind: s.bossId === 3 ? 0.48 : 0.58,
          hold: 0.2 * (selectedSkin === "skull" ? 1.15 : 1),
          width: 10 + s.bossId,
        });
      }
      sfx.laser();
      return;
    }
    const count = flags.laserCount || (flags.multiLaser ? (flags.aggressiveAim ? 3 : 2) : 1);
    for (let i = 0; i < count; i++) {
      const angle =
        flags.aggressiveAim && Math.random() < 0.5
          ? s.player.angle + rand(-0.18, 0.18)
          : rand(0, Math.PI * 2);
      s.lasers.push({
        angle,
        t: 0,
        wind: flags.fastLaser ? 0.42 : 0.68,
        hold: 0.2 * (selectedSkin === "skull" ? 1.15 : 1),
        width: 9 + Math.min(6, levelInWorld(s.level) + s.escalation),
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
    const planetoid = !!(flags.planetoids || isFinalBoss(s));
    const speed = ((flags.denseAsteroids ? 95 : 72) + (s.level + s.escalation) * 4) * Math.min(1.6, Math.sqrt(diff));
    const spd = planetoid ? speed * 0.78 : speed;
    s.asteroids.push({
      x,
      y,
      vx: (dx / d) * spd,
      vy: (dy / d) * spd,
      r: planetoid ? rand(26, 36) : rand(14, 22),
      spin: rand(0, Math.PI),
      spinV: rand(-2.5, 2.5),
      life: planetoid ? 14 : 10,
      style: (Math.random() * 3) | 0,
      tier: planetoid ? 2 : 1, // 2 = small planet → rocks → debris
      planetoid,
    });
  }

  function shatterAsteroid(s, a, intoFragments) {
    const idx = s.asteroids.indexOf(a);
    if (idx >= 0) s.asteroids.splice(idx, 1);
    const col = a.planetoid || a.tier === 2 ? "#c080ff" : C.peach;
    s.burst.push({ x: a.x, y: a.y, t: 0.32, color: col, r: a.r });
    if (!intoFragments) return;
    // Planet → asteroids
    if ((a.tier || 1) >= 2) {
      const n = 3 + ((Math.random() * 2) | 0);
      for (let i = 0; i < n; i++) {
        const ang = rand(0, Math.PI * 2);
        const sp = rand(50, 130);
        s.asteroids.push({
          x: a.x,
          y: a.y,
          vx: Math.cos(ang) * sp + a.vx * 0.25,
          vy: Math.sin(ang) * sp + a.vy * 0.25,
          r: rand(12, 18),
          spin: rand(0, Math.PI),
          spinV: rand(-3, 3),
          life: 8,
          style: (Math.random() * 3) | 0,
          tier: 1,
          planetoid: false,
        });
      }
      return;
    }
    // Asteroid → debris
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
      if (angDist(pu.angle, s.player.angle) < (selectedSkin === "berry" ? 0.14 : 0.2)) {
        collectPickup(s, pu);
      }
    }

    const hopSafe = s.player.hopInvuln > 0 || Math.abs(s.player.radiusBoost) > 14;
    for (let ei = s.enemies.length - 1; ei >= 0; ei--) {
      const e = s.enemies[ei];
      if (e.orbit !== s.player.orbit) continue;
      if (hopSafe) continue;
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
        // Trade: lose a life, but the clone dies too (same idea as debris vanishing)
        destroyEnemyAt(s, ei, C.coral);
        killPlayer(s, "Bumped a clone!", "clone");
        return;
      }
    }

    for (const L of s.lasers) {
      if (L.t < L.wind) continue;
      if (s.glitterT > 0) continue;
      if (L.type === "ring") {
        // Entire orbit is lethal — hop off that ring
        if (s.player.orbit === L.orbit && Math.abs(s.player.radiusBoost) < 26) {
          killPlayer(s, "Orbit overload!", "laser");
          return;
        }
        if (!L._ringCleared) {
          L._ringCleared = true;
          for (let ei = s.enemies.length - 1; ei >= 0; ei--) {
            if (s.enemies[ei].orbit === L.orbit) destroyEnemyAt(s, ei, C.coral);
          }
          const rr = orbitRadius(s.orbitCount, L.orbit);
          for (const a of s.asteroids.slice()) {
            const rad = Math.hypot(a.x - CX, a.y - CY);
            if (Math.abs(rad - rr) < a.r + 14) shatterAsteroid(s, a, true);
          }
        }
        continue;
      }
      if (angDist(s.player.angle, L.angle) < 0.09 && Math.abs(s.player.radiusBoost) < 22) {
        killPlayer(s, "Lasered!", "laser");
        return;
      }
      for (const a of s.asteroids.slice()) {
        const ap = { x: a.x - CX, y: a.y - CY };
        const ang = Math.atan2(ap.y, ap.x);
        const rad = Math.hypot(ap.x, ap.y);
        if (rad < 40 || rad > 380) continue;
        if (angDist(ang, L.angle) < 0.08) shatterAsteroid(s, a, true);
      }
      for (let ei = s.enemies.length - 1; ei >= 0; ei--) {
        const e = s.enemies[ei];
        const er = orbitRadius(s.orbitCount, e.orbit);
        const ep = angleToPos(e.angle, er);
        const ap = { x: ep.x - CX, y: ep.y - CY };
        const ang = Math.atan2(ap.y, ap.x);
        const rad = Math.hypot(ap.x, ap.y);
        if (rad < 36 || rad > 340) continue;
        if (angDist(ang, L.angle) < 0.09) destroyEnemyAt(s, ei, C.coral);
      }
    }

    for (const a of s.asteroids.slice()) {
      if (Math.hypot(a.x - pp.x, a.y - pp.y) < a.r + playerR) {
        if (s.jellyT > 0) {
          shatterAsteroid(s, a, true);
          s.burst.push({ x: a.x, y: a.y, t: 0.2, color: C.mint, r: 24 });
          continue;
        }
        killPlayer(s, "Asteroid!", "asteroid");
        shatterAsteroid(s, a, false);
        return;
      }
      for (let ei = s.enemies.length - 1; ei >= 0; ei--) {
        const e = s.enemies[ei];
        const er = orbitRadius(s.orbitCount, e.orbit);
        const ep = angleToPos(e.angle, er);
        if (Math.hypot(a.x - ep.x, a.y - ep.y) < a.r + 8) {
          destroyEnemyAt(s, ei, C.peach);
          shatterAsteroid(s, a, true);
          break;
        }
      }
    }

    if (flags.fragmentsHurt || selectedSkin === "bee") {
      for (const f of s.fragments) {
        if (s.magnetT > 0 || s.jellyT > 0) continue;
        const hitR = selectedSkin === "bee" ? f.r + playerR + 2 : f.r + playerR;
        if (Math.hypot(f.x - pp.x, f.y - pp.y) < hitR) {
          killPlayer(s, "Sprinkle debris!", "asteroid");
          f.life = 0;
          return;
        }
      }
    }

    for (const sh of s.shots.slice()) {
      if (Math.hypot(sh.x - pp.x, sh.y - pp.y) < sh.r + playerR) {
        killPlayer(s, "Fighter bolt!", "laser");
        sh.life = 0;
        return;
      }
    }
    for (const f of s.fighters) {
      if (Math.hypot(f.x - pp.x, f.y - pp.y) < 14) {
        killPlayer(s, "Fighter rammed!", "asteroid");
        return;
      }
    }
  }

  // ---------- DRAW ----------
  function draw(s) {
    ctx.save();
    // Static letterbox + hard clip so margins never receive gameplay pixels
    beginPlayfieldClip();

    if (s.gameMode === "endless" && s.mode !== "title") {
      const ph = endlessPhaseInfo(s);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, ph.sky[0]);
      g.addColorStop(0.45, ph.sky[1]);
      g.addColorStop(1, ph.sky[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const vig = ctx.createRadialGradient(CX, CY, 80, CX, CY, 420);
      vig.addColorStop(0, "rgba(255,255,255,0)");
      vig.addColorStop(1, ph.haze);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    } else if (isFinalBoss(s) && s.mode !== "title") {
      // Holy void — black with illuminating white core bloom
      const g = ctx.createRadialGradient(CX, CY * 0.92, 40, CX, CY, 520);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.12, "#f4f0ff");
      g.addColorStop(0.35, "#2a2038");
      g.addColorStop(0.65, "#0a0810");
      g.addColorStop(1, "#000000");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // rare color flashes
      const flash = 0.5 + 0.5 * Math.sin(s.nebulaT * 3.2);
      if (flash > 0.92) {
        ctx.fillStyle = `rgba(255,40,60,${(flash - 0.92) * 1.5})`;
        ctx.fillRect(0, 0, W, H);
      } else if (flash < 0.08) {
        ctx.fillStyle = `rgba(140,60,255,${(0.08 - flash) * 1.4})`;
        ctx.fillRect(0, 0, W, H);
      }
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, C.skyTop);
      g.addColorStop(0.45, C.skyMid || C.skyTop);
      g.addColorStop(1, C.skyBot);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const vig = ctx.createRadialGradient(CX, CY, 80, CX, CY, 420);
      vig.addColorStop(0, "rgba(255,255,255,0)");
      vig.addColorStop(1, C.vig || "rgba(180,150,210,0.14)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    // World/shake camera — only inside the clipped playfield
    if (s.camZoom && s.camZoom !== 1) {
      ctx.translate(CX, CY);
      ctx.scale(s.camZoom, s.camZoom);
      ctx.translate(-CX, -CY);
    }
    if (s.rewindT > 0) {
      const k = s.rewindT / 0.35;
      ctx.translate(rand(-4, 4) * k, rand(-3, 3) * k);
    } else if (s.boss || s.shakeT > 0) {
      ctx.translate(rand(-2.2, 2.2), rand(-1.8, 1.8));
    }

    if (s.mode === "title" && ui.overlay.classList.contains("show")) {
      const onMain = mainStep && !mainStep.classList.contains("hidden");
      if (onMain) {
        drawSynthMenuBG(s);
      } else {
        drawBlob(CX - 160 + Math.sin(s.nebulaT * 0.15) * 30, 140, 200, C.hazePink);
        drawBlob(CX + 180, CY + 90, 210, C.hazeAqua);
        drawBlob(CX - 40, CY + 40, 240, C.hazeLilac);
        drawVibeDecor(s);
      }
      ctx.restore();
      sealPlayfieldLetterbox();
      return;
    }

    if (s.gameMode === "endless") {
      drawEndlessPhaseFX(s);
    } else if (isFinalBoss(s)) {
      drawFinalBossAura(s);
    } else {
      drawBlob(CX - 160 + Math.sin(s.nebulaT * 0.15) * 30, 140, 200, C.hazePink);
      drawBlob(CX + 180, CY + 90, 210, C.hazeAqua);
      drawBlob(CX - 40, CY + 40, 240, C.hazeLilac);
      drawVibeDecor(s);
    }

    drawPlanet(s);
    drawRings(s);
    drawLasers(s);
    drawAsteroids(s);
    drawFighters(s);
    drawWeatherFX(s);
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
    if (s.gameMode === "endless" && (s.endlessPhase | 0) >= 2) {
      // Top-layer mood overload after sprites
      const ph = s.endlessPhase | 0;
      if (ph === 2) {
        ctx.fillStyle = `rgba(255,40,20,${0.04 + 0.04 * Math.abs(Math.sin(s.nebulaT * 4))})`;
        ctx.fillRect(0, 0, W, H);
      } else if (ph === 3) {
        ctx.fillStyle = `rgba(160,40,255,${0.05 + 0.05 * Math.abs(Math.sin(s.nebulaT * 5))})`;
        ctx.fillRect(0, 0, W, H);
        // RGB split ghost of center
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = "#ff40a0";
        ctx.beginPath();
        ctx.arc(CX - 4, CY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#40e0ff";
        ctx.beginPath();
        ctx.arc(CX + 4, CY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();
    sealPlayfieldLetterbox();
  }

  function drawVibeDecor(s) {
    const t = s.nebulaT || 0;
    if (vibe === "frost") {
      // Pixel teal cosmos — nebula clumps, diagonal ring, rim-lit moons
      // dithered nebula blobs
      for (let i = 0; i < 48; i++) {
        const seed = i * 71.3;
        const x = (seed * 13 + Math.sin(t * 0.15 + i) * 8) % W;
        const y = 40 + ((seed * 29) % (H * 0.7));
        const sz = 4 + (i % 5) * 3;
        const on = ((i + (t * 2) | 0) % 3) !== 0;
        ctx.globalAlpha = on ? 0.22 : 0.1;
        ctx.fillStyle = i % 2 ? "#0a8a78" : "#40f0e0";
        // chunky pixel cluster
        for (let py = 0; py < sz; py += 2) {
          for (let px = 0; px < sz; px += 2) {
            if (((px + py + i) & 2) === 0) ctx.fillRect((x + px) | 0, (y + py) | 0, 2, 2);
          }
        }
      }
      ctx.globalAlpha = 1;
      // far planet with cyan halo (left)
      softCircle(W * 0.32, H * 0.42, 56, "rgba(64,240,224,0.18)", null);
      softCircle(W * 0.32, H * 0.42, 38, "rgba(10,70,80,0.55)", null);
      ctx.fillStyle = "#021a28";
      ctx.beginPath();
      ctx.arc(W * 0.32, H * 0.42, 32, 0, Math.PI * 2);
      ctx.fill();
      // diagonal celestial ring
      ctx.save();
      ctx.translate(W * 0.38, H * 0.48);
      ctx.rotate(-0.55);
      ctx.strokeStyle = "rgba(180,255,240,0.55)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 120, 28, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(64,240,224,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 128, 34, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      // small moon bottom-right
      softCircle(W * 0.78, H * 0.72, 22, "rgba(64,240,224,0.2)", null);
      ctx.fillStyle = "#0a3040";
      ctx.beginPath();
      ctx.arc(W * 0.78, H * 0.72, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(64,240,224,0.5)";
      ctx.fillRect((W * 0.78 - 10) | 0, (H * 0.72 - 4) | 0, 3, 3);
      // pixel stars
      for (let i = 0; i < 55; i++) {
        const seed = i * 97.1;
        const x = ((seed * 17) % W) | 0;
        const y = ((seed * 41) % H) | 0;
        ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t + i));
        ctx.fillStyle = i % 8 === 0 ? "#ffe0a0" : "#e8ffff";
        ctx.fillRect(x, y, i % 11 === 0 ? 2 : 1, i % 11 === 0 ? 2 : 1);
        if (i % 13 === 0) {
          ctx.fillRect(x - 2, y, 5, 1);
          ctx.fillRect(x, y - 2, 1, 5);
        }
      }
      ctx.globalAlpha = 1;
    } else if (vibe === "ember") {
      softCircle(CX, 150, 90, "rgba(255,200,80,0.18)", null);
      softCircle(CX, 150, 55, "rgba(255,230,140,0.28)", null);
      ctx.strokeStyle = "rgba(255,240,180,0.55)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(CX, 150, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(CX, 150, 88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(20,10,4,0.55)";
      for (let i = 0; i < 10; i++) {
        const x = 40 + i * 95 + Math.sin(t * 0.2 + i) * 4;
        const h = 50 + ((i * 41) % 90);
        ctx.fillRect(x, H - h, 28 + (i % 3) * 10, h);
        ctx.fillRect(x + 8, H - h - 20, 10, 20);
      }
      drawBlob(CX, H - 20, 280, "rgba(255,140,60,0.12)");
    } else {
      // Magenta synthscape (final boss / world 3)
      const final = s.boss && s.bossId >= 3;
      // horizon glow
      const hg = ctx.createLinearGradient(0, H * 0.45, 0, H);
      hg.addColorStop(0, "rgba(255,0,180,0)");
      hg.addColorStop(0.35, final ? "rgba(255,0,180,0.35)" : "rgba(255,0,180,0.18)");
      hg.addColorStop(1, "rgba(40,0,80,0.5)");
      ctx.fillStyle = hg;
      ctx.fillRect(0, H * 0.4, W, H * 0.6);
      // huge magenta-backed sphere when final boss (behind gameplay rings)
      if (final) {
        softCircle(CX, H * 0.38, 180, "rgba(255,40,200,0.22)", null);
        softCircle(CX, H * 0.4, 120, "rgba(120,0,160,0.35)", null);
      } else {
        softCircle(CX, H * 0.35, 90, "rgba(255,40,200,0.12)", null);
      }
      // wireframe mountain peaks
      ctx.strokeStyle = final ? "rgba(220,120,255,0.65)" : "rgba(180,80,255,0.4)";
      ctx.fillStyle = "rgba(20,0,40,0.75)";
      ctx.lineWidth = 1.5;
      let x = -20;
      ctx.beginPath();
      ctx.moveTo(0, H);
      while (x < W + 40) {
        const peak = 70 + ((x * 13) % 110) + (final ? 30 : 0);
        const mid = x + 28 + ((x * 7) % 40);
        ctx.lineTo(x, H);
        ctx.lineTo(mid, H - peak);
        ctx.lineTo(x + 70 + ((x * 3) % 30), H);
        x += 55 + ((x * 5) % 25);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // grid on faces
      ctx.strokeStyle = "rgba(255,80,220,0.22)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const y = H - 20 - i * 14;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y + Math.sin(t + i) * 2);
        ctx.stroke();
      }
      // floating rocks / stars
      for (let i = 0; i < 28; i++) {
        const seed = i * 83.2;
        const fx = ((seed * 11 + t * 12) % (W + 60)) - 30;
        const fy = 40 + ((seed * 19) % (H * 0.45));
        ctx.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(t + i));
        ctx.fillStyle = i % 3 ? "#ff80e0" : "#ffffff";
        ctx.fillRect(fx | 0, fy | 0, i % 5 === 0 ? 3 : 1, i % 5 === 0 ? 3 : 1);
      }
      ctx.globalAlpha = 1;
      // extra magenta bloom on final boss
      if (final) {
        drawBlob(CX, H * 0.55, 220, "rgba(255,20,160,0.16)");
      }
    }
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
    if (s.superCd <= 0 && s.mode === "play") {
      const def = SKIN_SUPERS[selectedSkin] || SKIN_SUPERS.marshmallow;
      if (!def.none) pills.push({ t: def.name.split(" ")[0].toUpperCase(), c: C.pink });
    }
    if (s.weather && s.weather.t > 0) {
      const wt = s.weather.type.toUpperCase();
      pills.push({ t: s.weather.warnT > 0 ? `!${wt}` : wt, c: C.butter });
    }
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

  function drawSynthMenuBG(s) {
    const t = s.nebulaT || menuOrbit || 0;
    // Expansive cosmic mix: spiral galaxy · melting moon · pink cloudbanks · teal nebula
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#050210");
    sky.addColorStop(0.35, "#120828");
    sky.addColorStop(0.65, "#0a1830");
    sky.addColorStop(1, "#021018");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Teal nebula clouds (image 4) — left / lower layers
    for (let i = 0; i < 36; i++) {
      const seed = i * 61.7;
      const x = (seed * 11 + Math.sin(t * 0.12 + i) * 20) % (W + 80) - 40;
      const y = H * 0.35 + ((seed * 17) % (H * 0.55));
      const r = 40 + (i % 6) * 18;
      ctx.globalAlpha = 0.08 + (i % 4) * 0.02;
      drawBlob(x, y, r, i % 2 ? "rgba(30,200,160,0.9)" : "rgba(10,120,110,0.85)");
    }
    ctx.globalAlpha = 1;

    // Pink / purple cloud banks (image 3) — mid / bottom scalloped masses
    for (let band = 0; band < 4; band++) {
      const by = H * (0.52 + band * 0.1);
      ctx.beginPath();
      ctx.moveTo(-20, H);
      for (let x = -20; x <= W + 40; x += 28) {
        const wave = Math.sin(x * 0.018 + t * 0.25 + band) * 18;
        const bump = 40 + ((x * 13 + band * 40) % 55);
        ctx.lineTo(x, by - bump + wave);
      }
      ctx.lineTo(W + 20, H);
      ctx.closePath();
      const cg = ctx.createLinearGradient(0, by - 80, 0, H);
      cg.addColorStop(0, band === 0 ? "rgba(255,180,200,0.35)" : "rgba(255,80,180,0.28)");
      cg.addColorStop(0.45, "rgba(140,40,160,0.4)");
      cg.addColorStop(1, "rgba(30,10,50,0.65)");
      ctx.fillStyle = cg;
      ctx.fill();
    }

    // Spiral galaxy (image 1) — lower-right expansive swirl
    ctx.save();
    ctx.translate(W * 0.62, H * 0.58);
    ctx.rotate(-0.55 + Math.sin(t * 0.08) * 0.04);
    {
      const core = ctx.createRadialGradient(0, 0, 4, 0, 0, 110);
      core.addColorStop(0, "rgba(255,250,255,0.85)");
      core.addColorStop(0.25, "rgba(255,180,230,0.45)");
      core.addColorStop(0.6, "rgba(180,60,200,0.18)");
      core.addColorStop(1, "rgba(180,60,200,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let arm = 0; arm < 3; arm++) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2.4; a += 0.08) {
        const r = 18 + a * 28 + arm * 10;
        const x = Math.cos(a + arm * 2.1 + t * 0.05) * r;
        const y = Math.sin(a + arm * 2.1 + t * 0.05) * r * 0.38;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = arm === 1 ? "rgba(255,100,200,0.55)" : "rgba(180,80,220,0.4)";
      ctx.lineWidth = 10 - arm * 2;
      ctx.lineCap = "round";
      ctx.stroke();
      // pixel dust on arms
      for (let a = 0; a < Math.PI * 2.2; a += 0.2) {
        const r = 20 + a * 26 + arm * 8;
        const x = Math.cos(a + arm * 2.1 + t * 0.05) * r;
        const y = Math.sin(a + arm * 2.1 + t * 0.05) * r * 0.38;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "#ffc0e8";
        ctx.fillRect((x) | 0, (y) | 0, 2, 2);
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Melting / glitch moon (image 2) — upper left
    const mx = W * 0.28;
    const my = H * 0.32;
    const mR = 70;
    softCircle(mx, my, mR * 1.3, "rgba(255,100,200,0.15)", null);
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, mR, 0, Math.PI * 2);
    ctx.clip();
    for (let i = -mR; i <= mR; i++) {
      const u = (i + mR) / (2 * mR);
      const col = u < 0.45 ? "#f5e6d8" : u < 0.7 ? "#ff80c8" : "#ff2bd6";
      ctx.fillStyle = col;
      const drip = u > 0.55 ? ((i * 17 + (t * 30) | 0) % 28) : 0;
      ctx.fillRect(mx - mR, my + i, mR * 2, 1);
      if (drip > 12) {
        ctx.fillRect(mx - 8 + (i % 17), my + i, 2, drip);
      }
    }
    // vertical glitch lines
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 22; i++) {
      const lx = mx - mR + 4 + i * 6;
      ctx.fillStyle = i % 3 ? "rgba(255,255,255,0.15)" : "rgba(255,40,180,0.2)";
      ctx.fillRect(lx, my - mR, 1, mR * 2 + 20 + (i % 5) * 8);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    // dripping strands below moon
    for (let i = 0; i < 14; i++) {
      const lx = mx - 40 + i * 6;
      const len = 20 + ((i * 37 + (t * 40) | 0) % 50);
      ctx.strokeStyle = i % 2 ? "rgba(255,180,220,0.45)" : "rgba(255,40,180,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lx, my + mR * 0.2);
      ctx.lineTo(lx, my + mR * 0.2 + len);
      ctx.stroke();
    }

    // Pink moon peeking through clouds (image 3 accent)
    softCircle(W * 0.78, H * 0.22, 48, "rgba(255,100,180,0.25)", null);
    ctx.fillStyle = "#ff4db8";
    ctx.beginPath();
    ctx.arc(W * 0.78, H * 0.22, 34, 0, Math.PI * 2);
    ctx.fill();
    // cloud cover over pink moon
    ctx.fillStyle = "rgba(60,20,80,0.55)";
    for (let i = 0; i < 6; i++) {
      const cx = W * 0.7 + i * 22;
      const cy = H * 0.28 + Math.sin(t * 0.4 + i) * 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 28, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Diagonal star streaks (image 2 motion)
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      const seed = i * 47.3;
      const x0 = ((seed * 13 + t * 90) % (W + 200)) - 100;
      const y0 = ((seed * 29) % H);
      const len = 40 + (i % 5) * 25;
      ctx.globalAlpha = 0.15 + (i % 4) * 0.08;
      ctx.strokeStyle = i % 3 === 0 ? "#ff80e0" : "#ffffff";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + len * 0.85, y0 + len * 0.55);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Starfield + cross sparkles
    for (let i = 0; i < 120; i++) {
      const seed = i * 73.17;
      const x = (seed * 19) % W;
      const y = (seed * 41) % H;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.5 + i));
      ctx.globalAlpha = tw;
      ctx.fillStyle = i % 7 === 0 ? "#a8fff0" : i % 5 === 0 ? "#ffc0e8" : "#ffffff";
      const sz = i % 9 === 0 ? 2.5 : 1;
      ctx.fillRect(x | 0, y | 0, sz, sz);
      if (i % 14 === 0) {
        ctx.fillRect((x - 3) | 0, y | 0, 7, 1);
        ctx.fillRect(x | 0, (y - 3) | 0, 1, 7);
      }
    }
    ctx.globalAlpha = 1;

    // Soft vignette so UI stays readable
    const vig = ctx.createRadialGradient(CX, CY * 0.85, 60, CX, CY, 520);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(0.55, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,10,0.55)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // Bottom fade for menu cards
    const fade = ctx.createLinearGradient(0, H * 0.55, 0, H);
    fade.addColorStop(0, "rgba(5,2,16,0)");
    fade.addColorStop(1, "rgba(5,2,16,0.55)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
  }

  function drawTitleDecor() {
    drawSynthMenuBG({ nebulaT: menuOrbit });
  }

  function drawEndlessPhaseFX(s) {
    const t = s.nebulaT || 0;
    const ph = s.endlessPhase | 0;
    const info = endlessPhaseInfo(s);
    const pulse = 0.5 + 0.5 * Math.sin(t * (1.2 + ph * 0.6));

    // Base atmospheric blobs tinted to mood
    drawBlob(CX - 140 + Math.sin(t * 0.2) * 40, 120, 220, info.haze);
    drawBlob(CX + 160, CY + 80, 240, info.haze);
    drawBlob(CX, CY - 40, 180, info.haze);

    if (ph === 0) {
      // Sleep — soft blue drift, dream orbs, sleepy stars
      for (let i = 0; i < 36; i++) {
        const seed = i * 53.7;
        const x = ((seed * 17 + t * 18) % (W + 60)) - 30;
        const y = 30 + ((seed * 29) % (H * 0.85));
        ctx.globalAlpha = 0.12 + 0.2 * Math.abs(Math.sin(t * 0.7 + i));
        ctx.fillStyle = i % 3 ? "#9ad0ff" : "#ffffff";
        ctx.fillRect(x | 0, y | 0, 2, 2);
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 8; i++) {
        const a = t * 0.25 + i * 0.8;
        const r = 120 + i * 28;
        const x = CX + Math.cos(a) * r;
        const y = CY + Math.sin(a * 0.7) * r * 0.55;
        softCircle(x, y, 10 + (i % 3) * 4, `rgba(160,210,255,${0.08 + pulse * 0.08})`, null);
      }
      // floating Zzz
      ctx.globalAlpha = 0.35 + pulse * 0.25;
      ctx.fillStyle = "#c8e8ff";
      ctx.font = "bold 18px Syne, sans-serif";
      for (let i = 0; i < 4; i++) {
        const zx = CX + 50 + i * 18 + Math.sin(t + i) * 6;
        const zy = CY - 70 - i * 16 - (t * 12 + i * 10) % 40;
        ctx.fillText("z", zx, zy);
      }
      ctx.globalAlpha = 1;
      // gentle breathing vignette
      ctx.fillStyle = `rgba(40,100,180,${0.04 + pulse * 0.05})`;
      ctx.fillRect(0, 0, W, H);
    } else if (ph === 1) {
      // Awake — green digital rain + orbit glitches
      for (let i = 0; i < 50; i++) {
        const seed = i * 61.1;
        const x = ((seed * 23) % W) | 0;
        const y = ((seed * 41 + t * 140) % (H + 40)) - 20;
        ctx.globalAlpha = 0.15 + (i % 5) * 0.05;
        ctx.fillStyle = i % 2 ? "#40e880" : "#a8ffc8";
        ctx.fillRect(x, y | 0, 2, 8 + (i % 4) * 6);
      }
      ctx.globalAlpha = 1;
      // scanning rings
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(t * 0.4);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 90 + i * 35 + Math.sin(t * 3 + i) * 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80,255,140,${0.12 + (i % 2) * 0.08})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 10]);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
      // UI-confusing corner glyphs
      ctx.globalAlpha = 0.25 + pulse * 0.2;
      ctx.fillStyle = "#6aff9a";
      ctx.font = "12px ui-monospace, monospace";
      for (let i = 0; i < 12; i++) {
        ctx.fillText(String((Math.sin(t * 4 + i) * 999) | 0), 16 + (i % 3) * 70, 40 + ((i / 3) | 0) * 18);
      }
      ctx.globalAlpha = 1;
      // horizontal glitch bands
      if (((t * 8) | 0) % 7 === 0) {
        const gy = ((t * 90) % H) | 0;
        ctx.fillStyle = "rgba(100,255,160,0.12)";
        ctx.fillRect(0, gy, W, 10);
      }
    } else if (ph === 2) {
      // Angry — heat haze, faux laser warnings, edge burn, sparks
      const burn = ctx.createLinearGradient(0, 0, 0, H);
      burn.addColorStop(0, "rgba(255,40,20,0.18)");
      burn.addColorStop(0.5, "rgba(255,80,20,0.05)");
      burn.addColorStop(1, "rgba(180,20,10,0.28)");
      ctx.fillStyle = burn;
      ctx.fillRect(0, 0, W, H);
      // fake telegraphs (visual only)
      ctx.save();
      ctx.translate(CX, CY);
      for (let i = 0; i < 5; i++) {
        const a = t * 1.3 + i * 1.1 + Math.sin(t * 2 + i) * 0.4;
        ctx.rotate(0); // explicit
        ctx.strokeStyle = `rgba(255,80,40,${0.15 + 0.2 * Math.abs(Math.sin(t * 5 + i))})`;
        ctx.lineWidth = 3 + (i % 2);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 50, Math.sin(a) * 50);
        ctx.lineTo(Math.cos(a) * 420, Math.sin(a) * 420);
        ctx.stroke();
      }
      ctx.restore();
      // ember sparks
      for (let i = 0; i < 40; i++) {
        const seed = i * 77.3;
        const x = ((seed * 13 + t * 60) % W);
        const y = ((seed * 31 + Math.sin(t + i) * 20) % H);
        ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(t * 6 + i));
        ctx.fillStyle = i % 2 ? "#ff8040" : "#ffe080";
        ctx.fillRect(x | 0, y | 0, 2, 2);
      }
      ctx.globalAlpha = 1;
      // pulse corners
      ctx.fillStyle = `rgba(255,40,20,${0.1 + pulse * 0.15})`;
      ctx.fillRect(0, 0, W, 8);
      ctx.fillRect(0, H - 8, W, 8);
      ctx.fillRect(0, 0, 8, H);
      ctx.fillRect(W - 8, 0, 8, H);
    } else {
      // Evil — overload: swirling vortices, RGB ghosts, invert flashes, false rings
      for (let v = 0; v < 3; v++) {
        ctx.save();
        ctx.translate(CX + Math.sin(t + v) * 40, CY + Math.cos(t * 0.7 + v) * 30);
        ctx.rotate(t * (0.8 + v * 0.35));
        ctx.strokeStyle = `rgba(200,80,255,${0.15 + v * 0.05})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, 40 + i * 22, i * 0.4, i * 0.4 + Math.PI * 1.2);
          ctx.stroke();
        }
        ctx.restore();
      }
      // chromatic ghost orbs
      for (let i = 0; i < 16; i++) {
        const a = t * 1.5 + i * 0.4;
        const r = 100 + (i % 5) * 30;
        const x = CX + Math.cos(a) * r;
        const y = CY + Math.sin(a) * r * 0.7;
        softCircle(x - 3, y, 6, "rgba(255,40,120,0.25)", null);
        softCircle(x + 3, y, 6, "rgba(80,220,255,0.25)", null);
        softCircle(x, y, 5, "rgba(220,80,255,0.3)", null);
      }
      // scanline noise
      ctx.globalAlpha = 0.1 + pulse * 0.08;
      for (let y = 0; y < H; y += 4) {
        if (((y + (t * 40) | 0) & 7) === 0) {
          ctx.fillStyle = "#d060ff";
          ctx.fillRect(0, y, W, 1);
        }
      }
      ctx.globalAlpha = 1;
      // false orbit ghosts
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(-t * 0.9);
      ctx.strokeStyle = "rgba(255,80,220,0.22)";
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 8]);
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(Math.sin(t + i) * 10, Math.cos(t * 1.3 + i) * 8, 70 + i * 32, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
      // occasional invert blot
      if (((t * 5) | 0) % 9 === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "difference";
        ctx.fillStyle = "rgba(40,0,60,0.35)";
        ctx.fillRect(W * 0.15, H * 0.2, W * 0.7, H * 0.6);
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // Shared phase transition flash
    if (s.phaseFlash > 0) {
      const k = s.phaseFlash / 0.65;
      ctx.fillStyle = `rgba(255,255,255,${0.35 * k})`;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = info.haze.replace("0.14", String(0.35 * k)).replace("0.16", String(0.4 * k)).replace("0.18", String(0.45 * k));
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawEndlessPlanet(s) {
    const t = s.nebulaT || 0;
    const info = endlessPhaseInfo(s);
    const ph = s.endlessPhase | 0;
    const pulse = 0.5 + 0.5 * Math.sin(t * (1.4 + ph * 0.5));
    const [c0, c1, c2, c3] = info.pals;
    const R = 44;
    const ink = "#0a0814";

    // mood rings
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(t * (0.15 + ph * 0.08));
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.6, R * 0.48, 0.35, 0, Math.PI * 2);
    ctx.strokeStyle = info.ringA;
    ctx.globalAlpha = 0.4 + pulse * 0.3;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.85, R * 0.58, -0.55, 0.1, Math.PI + 0.4);
    ctx.strokeStyle = info.ringB;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    // shadow
    ctx.beginPath();
    ctx.ellipse(CX, CY + R * 0.7, R * 0.85, R * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fill();

    // body bands
    for (let y = -R; y <= R; y += 3) {
      const half = Math.sqrt(Math.max(0, R * R - y * y)) | 0;
      const u = (y + R) / (2 * R);
      let col = c1;
      if (u < 0.25) col = c0;
      else if (u < 0.55) col = c1;
      else if (u < 0.8) col = c2;
      else col = c3;
      // angry cracks / evil mottling
      if (ph >= 2 && ((y + (t * 10) | 0) % 7 === 0)) col = ph === 3 ? "#280840" : "#501010";
      ctx.fillStyle = col;
      ctx.fillRect((CX - half) | 0, (CY + y) | 0, half * 2, 3);
    }
    ctx.beginPath();
    ctx.arc(CX, CY, R + 1, 0, Math.PI * 2);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Faces
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.5;
    if (ph === 0) {
      // sleeping — closed eyes + soft smile + cheek blush
      ctx.beginPath();
      ctx.moveTo(CX - 14, CY - 4);
      ctx.quadraticCurveTo(CX - 9, CY - 9, CX - 4, CY - 4);
      ctx.moveTo(CX + 4, CY - 4);
      ctx.quadraticCurveTo(CX + 9, CY - 9, CX + 14, CY - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(CX, CY + 8, 8, 0.25, Math.PI - 0.25);
      ctx.stroke();
      ctx.fillStyle = "rgba(160,200,255,0.45)";
      ctx.fillRect(CX - 18, CY + 2, 6, 4);
      ctx.fillRect(CX + 12, CY + 2, 6, 4);
    } else if (ph === 1) {
      // awake — open eyes + small smile
      ctx.fillRect(CX - 12, CY - 8, 5, 6);
      ctx.fillRect(CX + 7, CY - 8, 5, 6);
      ctx.fillStyle = "#e8fff0";
      ctx.fillRect(CX - 11, CY - 7, 2, 2);
      ctx.fillRect(CX + 8, CY - 7, 2, 2);
      ctx.strokeStyle = ink;
      ctx.beginPath();
      ctx.arc(CX, CY + 8, 7, 0.15, Math.PI - 0.15);
      ctx.stroke();
      // sparkle above
      ctx.fillStyle = info.ringA;
      ctx.globalAlpha = 0.5 + pulse * 0.5;
      ctx.fillRect(CX + 16, CY - 18, 3, 3);
      ctx.globalAlpha = 1;
    } else if (ph === 2) {
      // angry — brows + glare + frown + gritted teeth
      ctx.strokeStyle = ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(CX - 16, CY - 14);
      ctx.lineTo(CX - 4, CY - 8);
      ctx.moveTo(CX + 16, CY - 14);
      ctx.lineTo(CX + 4, CY - 8);
      ctx.stroke();
      ctx.fillStyle = ink;
      ctx.fillRect(CX - 13, CY - 6, 6, 6);
      ctx.fillRect(CX + 7, CY - 6, 6, 6);
      ctx.fillStyle = "#ff4030";
      ctx.globalAlpha = 0.55 + pulse * 0.4;
      ctx.fillRect(CX - 12, CY - 5, 3, 3);
      ctx.fillRect(CX + 8, CY - 5, 3, 3);
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.moveTo(CX - 12, CY + 14);
      ctx.quadraticCurveTo(CX, CY + 4, CX + 12, CY + 14);
      ctx.lineWidth = 3;
      ctx.stroke();
      // teeth
      ctx.fillStyle = "#ffe8d0";
      for (let i = -2; i <= 2; i++) ctx.fillRect(CX + i * 5 - 1, CY + 10, 3, 4);
    } else {
      // evil — horns, slit eyes, wide grin
      ctx.fillStyle = "#2a0840";
      ctx.beginPath();
      ctx.moveTo(CX - 22, CY - 18);
      ctx.lineTo(CX - 10, CY - 32 - pulse * 3);
      ctx.lineTo(CX - 6, CY - 16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(CX + 22, CY - 18);
      ctx.lineTo(CX + 10, CY - 32 - pulse * 3);
      ctx.lineTo(CX + 6, CY - 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ff40c8";
      ctx.globalAlpha = 0.6 + pulse * 0.4;
      ctx.fillRect(CX - 14, CY - 8, 8, 4);
      ctx.fillRect(CX + 6, CY - 8, 8, 4);
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      ctx.fillRect(CX - 12, CY - 7, 5, 3);
      ctx.fillRect(CX + 7, CY - 7, 5, 3);
      // jagged grin
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.moveTo(CX - 16, CY + 8);
      ctx.lineTo(CX - 8, CY + 18);
      ctx.lineTo(CX, CY + 10);
      ctx.lineTo(CX + 8, CY + 18);
      ctx.lineTo(CX + 16, CY + 8);
      ctx.lineTo(CX + 10, CY + 16);
      ctx.lineTo(CX, CY + 20 + pulse * 2);
      ctx.lineTo(CX - 10, CY + 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffe060";
      ctx.fillRect(CX - 6, CY + 12, 3, 5);
      ctx.fillRect(CX + 3, CY + 12, 3, 5);
      // aura cracks
      ctx.strokeStyle = "rgba(200,80,255,0.55)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const a = t * 2 + i;
        ctx.beginPath();
        ctx.moveTo(CX + Math.cos(a) * (R - 6), CY + Math.sin(a) * (R - 6));
        ctx.lineTo(CX + Math.cos(a) * (R + 10), CY + Math.sin(a) * (R + 10));
        ctx.stroke();
      }
    }
  }

  function drawFinalBossAura(s) {
    const t = s.nebulaT || 0;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    const ph = finalBossPhase(s);

    // Soft white radiance
    const sc = playScale();
    softCircle(CX, CY, (220 + pulse * 30) * sc, `rgba(255,255,255,${0.1 + pulse * 0.08})`, null);
    softCircle(CX, CY, 140 * sc, `rgba(255,255,255,${0.12 + pulse * 0.06})`, null);

    // Sparse holy stars
    for (let i = 0; i < 50; i++) {
      const seed = i * 91.3;
      const x = ((seed * 17) % W) | 0;
      const y = ((seed * 41) % H) | 0;
      const tw = 0.25 + 0.75 * Math.abs(Math.sin(t * 2 + i));
      ctx.globalAlpha = tw * 0.85;
      ctx.fillStyle = i % 11 === 0 ? "#ff4050" : i % 7 === 0 ? "#c080ff" : "#ffffff";
      const sz = i % 13 === 0 ? 2 : 1;
      ctx.fillRect(x, y, sz, sz);
      if (i % 17 === 0) {
        ctx.fillRect(x - 3, y, 7, 1);
        ctx.fillRect(x, y - 3, 1, 7);
      }
    }
    ctx.globalAlpha = 1;

    // Occasional radial color flashes (red / purple)
    if (((t * 4) | 0) % 11 === 0) {
      const col = ((t * 3) | 0) % 2 ? "rgba(255,50,70,0.12)" : "rgba(150,70,255,0.12)";
      const ang = t * 1.7;
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(ang);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 420, -0.25, 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Phase 3: stronger sanctified pulse rings
    if (ph >= 2) {
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(t * 0.35);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 100 + i * 45 + pulse * 12, 0, Math.PI * 2);
        ctx.strokeStyle = i % 2 ? `rgba(255,255,255,${0.12})` : `rgba(200,80,255,${0.1})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 12]);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  function drawFinalKingPlanet(s) {
    const t = s.nebulaT || 0;
    const pulse = 0.5 + 0.5 * Math.sin(t * 4.5);
    const ph = finalBossPhase(s);
    // Illuminating holy body — white light, black shadow, flashes
    const pals = ["#ffffff", "#f2eef8", "#d8d0e0", "#1a1420"];
    const [c0, c1, c2, c3] = pals;
    const R = Math.round(128 * playScale());
    const ink = "#08060c";
    const flash = Math.sin(t * 6.5);
    const flashCol = flash > 0.7 ? "#ff3048" : flash < -0.75 ? "#a050ff" : null;

    // blinding halo
    softCircle(CX, CY, R * 1.85, `rgba(255,255,255,${0.2 + pulse * 0.15})`, null);
    softCircle(CX, CY, R * 1.35, `rgba(255,255,255,${0.18 + pulse * 0.1})`, null);
    if (flashCol) {
      softCircle(CX, CY, R * 1.55, flash > 0.7 ? "rgba(255,48,72,0.16)" : "rgba(160,80,255,0.16)", null);
    }

    // orbital rings — white / black with tint flashes
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(t * 0.25);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, R * (1.45 + i * 0.18), R * (0.42 + i * 0.06), 0.4 + i * 0.2, 0, Math.PI * 2);
      const tint = flashCol && i % 2 === 0 ? flashCol : i % 2 ? "#ffffff" : "#2a2430";
      ctx.strokeStyle = tint;
      ctx.globalAlpha = 0.3 + pulse * 0.25 - i * 0.04;
      ctx.lineWidth = 5 - i;
      ctx.stroke();
    }
    for (let i = 0; i < 8; i++) {
      const a = t * 1.1 + (i / 8) * Math.PI * 2;
      const rad = R + 34 + Math.sin(t * 3.5 + i) * 6;
      const gem = i % 3 === 0 ? "#ff4058" : i % 3 === 1 ? "#b070ff" : "#ffffff";
      softCircle(Math.cos(a) * rad, Math.sin(a) * rad, 3.2, gem, null);
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    // luminous body banding
    for (let y = -R; y <= R; y += 4) {
      const half = Math.sqrt(Math.max(0, R * R - y * y)) | 0;
      const u = (y + R) / (2 * R);
      let col = c1;
      if (u < 0.2) col = c0;
      else if (u < 0.55) col = c1;
      else if (u < 0.8) col = c2;
      else col = c3;
      // sacred cracks — black veins, flash fills
      if (((y + (t * 14) | 0) % 11 === 0)) col = flashCol || "#0c0a10";
      ctx.fillStyle = col;
      ctx.fillRect((CX - half) | 0, (CY + y) | 0, half * 2, 4);
    }
    ctx.beginPath();
    ctx.arc(CX, CY, R + 1, 0, Math.PI * 2);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 5;
    ctx.stroke();
    // outer white rim light
    ctx.beginPath();
    ctx.arc(CX, CY, R + 4, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.35 + pulse * 0.35})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // white-gold crown
    ctx.fillStyle = "#f8f4ff";
    ctx.beginPath();
    ctx.moveTo(CX - 48, CY - R + 28);
    ctx.lineTo(CX - 36, CY - R - 8 - pulse * 4);
    ctx.lineTo(CX - 20, CY - R + 18);
    ctx.lineTo(CX, CY - R - 18 - pulse * 6);
    ctx.lineTo(CX + 20, CY - R + 18);
    ctx.lineTo(CX + 36, CY - R - 8 - pulse * 4);
    ctx.lineTo(CX + 48, CY - R + 28);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.stroke();
    softCircle(CX, CY - R - 10 - pulse * 6, 7, flashCol || "#ffffff", ink, 2);

    // horns / crest — black with tip flashes
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.moveTo(CX - 40, CY - 34);
    ctx.lineTo(CX - 18, CY - 58 - pulse * 3);
    ctx.lineTo(CX - 10, CY - 28);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(CX + 40, CY - 34);
    ctx.lineTo(CX + 18, CY - 58 - pulse * 3);
    ctx.lineTo(CX + 10, CY - 28);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = flashCol || "#ffffff";
    ctx.fillRect(CX - 20, CY - 56 - pulse * 3, 4, 4);
    ctx.fillRect(CX + 16, CY - 56 - pulse * 3, 4, 4);

    // eyes — glowing white slits, flash red/purple
    ctx.fillStyle = flashCol || "#ffffff";
    ctx.globalAlpha = 0.75 + pulse * 0.25;
    ctx.fillRect(CX - 28, CY - 16, 18, 8);
    ctx.fillRect(CX + 10, CY - 16, 18, 8);
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink;
    ctx.fillRect(CX - 22, CY - 13, 8, 3);
    ctx.fillRect(CX + 14, CY - 13, 8, 3);

    // solemn / divine mouth
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.moveTo(CX - 28, CY + 16);
    ctx.lineTo(CX - 12, CY + 30);
    ctx.lineTo(CX, CY + 20);
    ctx.lineTo(CX + 12, CY + 30);
    ctx.lineTo(CX + 28, CY + 16);
    ctx.lineTo(CX + 14, CY + 26);
    ctx.lineTo(CX, CY + 34 + pulse * 2);
    ctx.lineTo(CX - 14, CY + 26);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(CX - 10, CY + 20, 5, 7);
    ctx.fillRect(CX + 5, CY + 20, 5, 7);

    // light rays
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(t * 0.15);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.strokeStyle = i % 4 === 0 ? "rgba(255,60,80,0.18)" : i % 4 === 1 ? "rgba(160,80,255,0.16)" : `rgba(255,255,255,${0.12 + pulse * 0.1})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (R + 8), Math.sin(a) * (R + 8));
      ctx.lineTo(Math.cos(a) * (R + 28 + ph * 6), Math.sin(a) * (R + 28 + ph * 6));
      ctx.stroke();
    }
    ctx.restore();

    ctx.globalAlpha = 0.4 + pulse * 0.25;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Orbitron, Syne, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PLANET KING", CX, CY + R + 22);
    ctx.globalAlpha = 1;
  }

  function drawPlanet(s) {
    if (s.gameMode === "endless") {
      drawEndlessPlanet(s);
      return;
    }
    if (isFinalBoss(s)) {
      drawFinalKingPlanet(s);
      return;
    }
    const t = s.nebulaT || 0;
    const boss = s.boss;
    const style = boss ? 0 : (s.planetStyle || 0) % 5;
    const pulse = 0.5 + 0.5 * Math.sin(t * (boss ? 4.5 : 2.2));
    const palettes = [
      ["#d0fff8", "#40f0e0", "#0a8a78", "#021a22"],
      ["#e8ffff", "#5ef0d0", "#208898", "#041828"],
      ["#c8f8ff", "#3ec8c0", "#0a4a58", "#020c14"],
      ["#f0fffc", "#7ad8e8", "#2a8098", "#021018"],
      ["#d8fff0", "#40f0e0", "#0a6080", "#001018"],
    ];
    const bossPals = [
      ["#d0fff8", "#40f0e0", "#0a8a78", "#021a22"], // Cryo — teal pixel planet
      [C.cream, C.butter, C.peach, C.coral], // Ash Halo
      ["#2a0848", "#4B0082", "#8A2BE2", "#120028"], // Pulse Core — dark magenta orb
    ];
    const [c0, c1, c2, c3] = boss ? bossPals[(s.bossId - 1) % 3] : palettes[style];
    const ringA = boss
      ? s.bossId >= 3
        ? "#ff2bd6"
        : C.coral
      : [C.butter, C.mint, C.lilac, C.peach, C.pink][style];
    const ringB = boss
      ? s.bossId >= 3
        ? "#e040fb"
        : C.butter
      : [C.pink, C.aqua, C.butter, C.lilac, C.mint][style];
    const R = boss ? Math.round(138 * Math.min(1.15, playScale())) : 40;

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(t * (boss ? 0.45 : 0.2));
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.55, R * 0.45, 0.35, 0, Math.PI * 2);
    ctx.strokeStyle = ringA;
    ctx.globalAlpha = 0.45 + pulse * 0.25;
    ctx.lineWidth = boss ? 7 : 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 1.75, R * 0.55, -0.6, 0.1, Math.PI + 0.4);
    ctx.strokeStyle = ringB;
    ctx.lineWidth = boss ? 5 : 3;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(CX, CY + R * 0.7, R * 0.85, R * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fill();

    for (let y = -R; y <= R; y += boss ? 4 : 3) {
      const half = Math.sqrt(Math.max(0, R * R - y * y)) | 0;
      const u = (y + R) / (2 * R);
      let col = c1;
      if (u < 0.25) col = c0;
      else if (u < 0.55) col = c1;
      else if (u < 0.8) col = c2;
      else col = c3;
      ctx.fillStyle = col;
      ctx.fillRect((CX - half) | 0, (CY + y) | 0, half * 2, boss ? 4 : 3);
    }
    ctx.beginPath();
    ctx.arc(CX, CY, R + 1, 0, Math.PI * 2);
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = boss ? 5 : 3;
    ctx.stroke();

    if (boss) {
      drawBossFace(s.bossId, R, t, pulse);
      return;
    }

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
      ctx.fillRect(CX - 14, CY - 4, 8, 3);
      ctx.fillRect(CX + 6, CY - 4, 8, 3);
      ctx.fillRect(CX - 4, CY + 8, 8, 3);
      ctx.fillStyle = C.mint;
      ctx.fillRect(CX + 10, CY + 10, 4, 4);
    } else if (style === 2) {
      ctx.fillRect(CX - 14, CY - 8, 6, 6);
      ctx.fillRect(CX + 8, CY - 8, 6, 6);
      ctx.fillStyle = C.white;
      ctx.fillRect(CX - 12, CY - 6, 2, 2);
      ctx.fillRect(CX + 10, CY - 6, 2, 2);
      ctx.fillStyle = ink;
      ctx.fillRect(CX - 5, CY + 6, 10, 3);
    } else if (style === 3) {
      ctx.fillRect(CX - 11, CY - 5, 4, 4);
      ctx.fillRect(CX + 7, CY - 5, 4, 4);
      ctx.beginPath();
      ctx.moveTo(CX, CY + 2);
      ctx.lineTo(CX - 6, CY + 10);
      ctx.lineTo(CX + 6, CY + 10);
      ctx.closePath();
      ctx.fill();
    } else {
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

  function drawBossFace(bossId, R, t, pulse) {
    const ink = C.ink;
    const snarl = Math.sin(t * 6) * 2;
    const accent = bossId === 1 ? C.pink : bossId === 2 ? C.mint : C.aqua;
    // Show aura — rings + orbiting sparks
    ctx.save();
    ctx.translate(CX, CY);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, R + 16 + i * 12 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.2 - i * 0.04 + pulse * 0.12;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      const a = t * (1 + bossId * 0.4) + (i / 10) * Math.PI * 2;
      const rad = R + 26 + Math.sin(t * 5 + i) * 7;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * rad, Math.sin(a) * rad, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = bossId === 1 ? C.butter : accent;
      ctx.globalAlpha = 0.5 + pulse * 0.4;
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    if (bossId === 1) {
      ctx.fillStyle = C.coral;
      ctx.beginPath();
      ctx.moveTo(CX - 34, CY - 28 + snarl);
      ctx.lineTo(CX - 6, CY - 16);
      ctx.lineTo(CX - 28, CY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(CX + 34, CY - 28 - snarl);
      ctx.lineTo(CX + 6, CY - 16);
      ctx.lineTo(CX + 28, CY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#1a1228";
      ctx.fillRect(CX - 22, CY - 14, 16, 16);
      ctx.fillRect(CX + 6, CY - 14, 16, 16);
      ctx.fillStyle = C.butter;
      ctx.fillRect(CX - 18, CY - 10, 6, 6);
      ctx.fillRect(CX + 12, CY - 10, 6, 6);
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.moveTo(CX - 26, CY + 12);
      ctx.quadraticCurveTo(CX, CY + 36 + snarl, CX + 26, CY + 12);
      ctx.lineTo(CX + 14, CY + 22);
      ctx.quadraticCurveTo(CX, CY + 28, CX - 14, CY + 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = C.white;
      ctx.fillRect(CX - 12, CY + 16, 5, 10);
      ctx.fillRect(CX + 8, CY + 16, 5, 10);
    } else if (bossId === 2) {
      ctx.strokeStyle = "#0a1008";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(CX - 34, CY - 22);
      ctx.lineTo(CX - 8, CY - 6);
      ctx.moveTo(CX + 34, CY - 24);
      ctx.lineTo(CX + 8, CY - 8);
      ctx.stroke();
      ctx.fillStyle = "#0a1008";
      ctx.fillRect(CX - 24, CY - 12, 16, 16);
      ctx.fillStyle = C.mint;
      ctx.globalAlpha = 0.5 + pulse * 0.5;
      ctx.beginPath();
      ctx.arc(CX + 14, CY - 4, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      ctx.fillRect(CX - 18, CY + 16, 36, 10);
      ctx.strokeStyle = "rgba(0,0,0,0.45)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const a = t + i;
        ctx.beginPath();
        ctx.moveTo(CX + Math.cos(a) * (R - 12), CY + Math.sin(a) * (R - 12));
        ctx.lineTo(CX + Math.cos(a) * (R + 10), CY + Math.sin(a) * (R + 10));
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = C.aqua;
      ctx.globalAlpha = 0.28 + pulse * 0.45;
      ctx.beginPath();
      ctx.arc(CX, CY, R * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = C.aqua;
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(CX + i * 18, CY - R + 10);
        ctx.lineTo(CX + i * 18, CY + R - 10);
        ctx.stroke();
      }
      ctx.fillStyle = "#020818";
      ctx.fillRect(CX - 30, CY - 18, 20, 12);
      ctx.fillRect(CX + 10, CY - 18, 20, 12);
      ctx.fillStyle = C.butter;
      ctx.globalAlpha = 0.65 + pulse * 0.35;
      ctx.fillRect(CX - 26, CY - 14, 10, 6);
      ctx.fillRect(CX + 16, CY - 14, 10, 6);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = C.coral;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(CX - 22, CY + 18);
      ctx.quadraticCurveTo(CX, CY + 4 + snarl * 2, CX + 22, CY + 18);
      ctx.stroke();
    }
  }

  function drawRings(s) {
    for (let i = 0; i < s.orbitCount; i++) {
      const r = orbitRadius(s.orbitCount, i);
      const active = i === s.player.orbit;
      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, Math.PI * 2);
      ctx.strokeStyle = active ? C.pink : (s.boss ? "rgba(255,80,80,0.5)" : "rgba(201,168,255,0.45)");
      ctx.lineWidth = s.boss ? (active ? 6 : 4) : active ? 4 : 2.5;
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
    crown(c, S, time) {
      const pulse = 0.5 + 0.5 * Math.sin(time / 120);
      const flash = Math.sin(time / 90);
      const jewel = flash > 0.65 ? "#ff3048" : flash < -0.65 ? "#a050ff" : "#fff8ff";
      stickerShadow(c, S);
      // band
      stickerPoly(
        c,
        [[-13, 1], [13, 1], [12, 9], [-12, 9]],
        S,
        "#f8f4ff",
        "#d8d0e8",
        [[-11, 4], [11, 4], [10, 8], [-10, 8]]
      );
      // black filigree
      fillPoly(c, [[-10, 4.5], [-7, 4.5], [-7, 6.5], [-10, 6.5]], S, "#0a0810", null, 0);
      fillPoly(c, [[7, 4.5], [10, 4.5], [10, 6.5], [7, 6.5]], S, "#0a0810", null, 0);
      // spikes
      stickerPoly(c, [[-13, 1], [-8, -11 - pulse], [-3, 1]], S, "#ffffff", "#e8e0f0", null);
      stickerPoly(c, [[-4, 1], [0, -16 - pulse * 1.4], [4, 1]], S, "#ffffff", "#e8e0f0", null);
      stickerPoly(c, [[3, 1], [8, -11 - pulse], [13, 1]], S, "#ffffff", "#e8e0f0", null);
      // center jewel
      stickerOval(c, 0, -8 - pulse * 0.6, 3.6, 3.6, S, jewel);
      fillPoly(c, [[-1.2, -9.5], [0.6, -10], [1.2, -8], [-0.4, -7.6]], S, "rgba(255,255,255,0.75)", null, 0);
      // cute face on band
      stickerEyes(c, S, 4.2, 3.6, 0, "#0a0810");
      stickerSmile(c, S, 7.2, 2.4);
    },
  };

  function enemyTint(style, fromHit) {
    if (fromHit || style === 4) {
      return {
        hi: shade(C.enemyHit || C.pink, 40),
        mid: C.enemyHit || C.pink,
        lo: shade(C.enemyHit || C.pink, -40),
        core: C.butter,
      };
    }
    const key = "enemy" + (style % 4);
    const mid = C[key] || C.lilac;
    return {
      hi: shade(mid, 45),
      mid,
      lo: shade(mid, -45),
      core: C.cream,
    };
  }

  // One crystal drone body — recolored per style / hit debt
  function drawEnemySkin(c, style, S, t, seed, fromHit) {
    const time = t == null ? performance.now() : t;
    const tint = enemyTint(style, fromHit);
    const bob = Math.sin(time / 220 + (seed || 0) * 0.01) * 0.8;
    c.save();
    c.translate(0, bob);

    // soft shadow
    c.globalAlpha = 0.25;
    c.fillStyle = "#000";
    c.beginPath();
    c.ellipse(0, 12 * S, 8 * S, 2.5 * S, 0, 0, Math.PI * 2);
    c.fill();
    c.globalAlpha = 1;

    // faceted crystal body (singular silhouette)
    const body = [
      [0, -13],
      [10, -5],
      [9, 6],
      [0, 12],
      [-9, 6],
      [-10, -5],
    ];
    // back facet
    shadePoly(c, [[0, -13], [10, -5], [0, 2], [-10, -5]], S, tint.hi, tint.mid, tint.lo);
    // lower facet
    shadePoly(c, [[-10, -5], [0, 2], [10, -5], [9, 6], [0, 12], [-9, 6]], S, tint.mid, tint.lo, tint.lo);
    // left highlight shard
    shadePoly(c, [[-10, -5], [0, -13], [0, 2]], S, tint.hi, tint.mid, null);
    // right dark shard
    shadePoly(c, [[10, -5], [0, -13], [0, 2]], S, tint.mid, tint.lo, null);

    // glowing core
    c.beginPath();
    c.arc(0, 0, 3.2 * S, 0, Math.PI * 2);
    c.fillStyle = tint.core;
    c.fill();
    c.beginPath();
    c.arc(0, 0, 4.8 * S, 0, Math.PI * 2);
    c.strokeStyle = tint.hi;
    c.globalAlpha = 0.55;
    c.lineWidth = 1.5;
    c.stroke();
    c.globalAlpha = 1;

    // twin eye slits (readable, same on every color)
    c.fillStyle = C.ink;
    c.fillRect(-4.5 * S, -2.5 * S, 3 * S, 2 * S);
    c.fillRect(1.5 * S, -2.5 * S, 3 * S, 2 * S);
    c.fillStyle = tint.core;
    c.fillRect(-3.5 * S, -2 * S, 1.2 * S, 1 * S);
    c.fillRect(2.5 * S, -2 * S, 1.2 * S, 1 * S);

    // outer stroke for silhouette clarity
    c.beginPath();
    c.moveTo(body[0][0] * S, body[0][1] * S);
    for (let i = 1; i < body.length; i++) c.lineTo(body[i][0] * S, body[i][1] * S);
    c.closePath();
    c.strokeStyle = C.ink;
    c.globalAlpha = 0.55;
    c.lineWidth = 1.8;
    c.stroke();
    c.globalAlpha = 1;
    c.restore();
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
      const fromHit = typeof style === "object" ? style.fromHit : style === 4;
      const st = typeof style === "object" ? style.style : style;
      drawEnemySkin(ctx, st, S, performance.now(), x + y, fromHit);
    }
    ctx.restore();
  }

  function drawPlayer(s) {
    const p = s.player;
    if (p.blink > 0 && Math.floor(p.blink * 12) % 2 === 0) return;
    const pos = angleToPos(p.angle, currentRadius(s));
    if (p.trail) {
      for (let i = p.trail.length - 1; i >= 1; i--) {
        const t = p.trail[i];
        ctx.globalAlpha = t.a * 0.35;
        softCircle(t.x, t.y, 8 - i * 0.6, C.aqua, null);
      }
      ctx.globalAlpha = 1;
    }
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 21, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 3;
    ctx.stroke();
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
    drawChar(pos.x, pos.y, "player", (p.hop > 0 ? 1.18 : 1) * (s.boss ? 1.22 : 1), p.angle, selectedSkin);
  }

  function drawEnemies(s) {
    for (const e of s.enemies) {
      const r = orbitRadius(s.orbitCount, e.orbit);
      const jitter = Math.sin(e.wobble) * 1.2;
      const pos = angleToPos(e.angle, r + jitter);
      ctx.globalAlpha = e.fromHit ? 0.78 : 0.58;
      for (let t = 1; t <= 3; t++) {
        const ta = e.angle - e.dir * t * 0.08;
        const tp = angleToPos(ta, r);
        softCircle(tp.x, tp.y, 3.5 - t * 0.5, C.aqua, null);
      }
      drawChar(pos.x, pos.y, "clone", 0.92 * (s.boss ? 1.18 : 1), e.angle, e);
      ctx.globalAlpha = 1;
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
      if (L.type === "ring") {
        const rr = orbitRadius(s.orbitCount, L.orbit);
        const holy = isFinalBoss(s);
        ctx.beginPath();
        ctx.arc(CX, CY, rr, 0, Math.PI * 2);
        ctx.strokeStyle = holy
          ? winding
            ? `rgba(255,255,255,${0.4 + alpha * 0.4})`
            : `rgba(255,40,60,${0.88})`
          : winding
            ? `rgba(255,120,255,${0.35 + alpha * 0.4})`
            : `rgba(255,40,200,${0.85})`;
        ctx.lineWidth = winding ? 6 : 14;
        ctx.shadowColor = holy ? "#ffffff" : "#ff40c8";
        ctx.shadowBlur = winding ? 12 : 28;
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (!winding) {
          ctx.globalAlpha = 0.18;
          ctx.strokeStyle = holy ? "#c080ff" : "#ffe0ff";
          ctx.lineWidth = 22;
          ctx.beginPath();
          ctx.arc(CX, CY, rr, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        continue;
      }
      const len = isFinalBoss(s) ? 420 : 340;
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
      if (a.planetoid || a.tier === 2) {
        // Mini planet (Planet King smashers)
        const pals = isFinalBoss(s)
          ? [
              ["#ffffff", "#e8e4f0", "#2a2430", "#08060c"],
              ["#f8f0ff", "#d0c8e0", "#1a1420", "#000000"],
              ["#ffffff", "#ffd0d8", "#401018", "#0c0608"],
            ][a.style % 3]
          : [
          ["#e8c0ff", "#a040e8", "#501080", "#140820"],
          ["#c8e8ff", "#5080e0", "#203060", "#081018"],
          ["#ffe0a0", "#e08040", "#803018", "#201008"],
        ][a.style % 3];
        for (let y = -a.r; y <= a.r; y += 2) {
          const half = Math.sqrt(Math.max(0, a.r * a.r - y * y)) | 0;
          const u = (y + a.r) / (2 * a.r);
          ctx.fillStyle = u < 0.3 ? pals[0] : u < 0.55 ? pals[1] : u < 0.8 ? pals[2] : pals[3];
          ctx.fillRect(-half, y, half * 2, 2);
        }
        ctx.beginPath();
        ctx.arc(0, 0, a.r + 1, 0, Math.PI * 2);
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 2;
        ctx.stroke();
        // tiny face
        ctx.fillStyle = C.ink;
        ctx.fillRect(-5, -3, 3, 3);
        ctx.fillRect(2, -3, 3, 3);
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 3, 4, 0.2, Math.PI - 0.2);
        ctx.stroke();
        softCircle(-a.r * 0.35, -a.r * 0.35, a.r * 0.18, "rgba(255,255,255,0.45)", null);
        ctx.restore();
        continue;
      }
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

  function drawFighters(s) {
    for (const f of s.fighters) {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.fillStyle = C.lilacDeep || C.lilac;
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = C.aqua;
      ctx.fillRect(-2, -3, 6, 6);
      ctx.restore();
    }
    for (const sh of s.shots) {
      softCircle(sh.x, sh.y, sh.r, C.coral, C.ink, 1.5);
    }
  }

  function drawWeatherFX(s) {
    if (!s.weather) return;
    const w = s.weather;
    if (w.warnT > 0) {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, H * 0.38, W, 56);
      ctx.fillStyle = C.butter;
      ctx.font = "bold 22px Syne, Outfit, sans-serif";
      ctx.textAlign = "center";
      const label = w.type === "wind" ? "WIND INCOMING" : w.type === "cold" ? "COLD FRONT" : "HAIL STORM";
      ctx.fillText(label, CX, H * 0.38 + 36);
      return;
    }
    if (w.type === "wind") {
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const x = ((s.nebulaT * 80 + i * 97) % (W + 40)) - 20;
        const y = 40 + i * 55;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(w.dir) * 40, y + Math.sin(w.dir) * 40);
        ctx.stroke();
      }
    } else if (w.type === "cold") {
      ctx.fillStyle = "rgba(180,220,255,0.12)";
      ctx.fillRect(0, 0, W, H);
    } else if (w.type === "hail") {
      for (const h of s.hail) {
        softCircle(h.x, h.y, h.r, C.white, C.aqua, 1);
      }
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
  function pauseGame() {
    const s = state;
    if (s.mode !== "play" && s.mode !== "preview") return;
    s._pausedFrom = s.mode;
    s.mode = "paused";
    if (ui.previewBanner) ui.previewBanner.classList.add("hidden");
    if (ui.pauseScreen) ui.pauseScreen.classList.remove("hidden");
    setTheme("none");
    toast("Paused — Esc to resume", 1200);
  }

  function resumeGame() {
    const s = state;
    if (s.mode !== "paused") return;
    s.mode = s._pausedFrom || "play";
    s._pausedFrom = null;
    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
    if (s.mode === "preview" && ui.previewBanner) ui.previewBanner.classList.remove("hidden");
    setTheme(themeForState(s));
    s.player.invuln = Math.max(s.player.invuln, 0.45);
  }

  function onKey(e, down) {
    const k = e.key.toLowerCase();
    state.keys[k] = down;
    if (!down) return;

    if (k === "escape") {
      e.preventDefault();
      if (state._heldInfo) {
        dismissInventory();
        return;
      }
      if (state.mode === "powerInfo") {
        dismissPowerInfo();
        return;
      }
      if (state.mode === "paused") {
        resumeGame();
        return;
      }
      if (state.mode === "play" || state.mode === "preview") {
        pauseGame();
        return;
      }
      return;
    }

    if (state._heldInfo && (k === "i" || k === "enter")) {
      e.preventDefault();
      dismissInventory();
      return;
    }
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
      tryUseSuper(state);
    } else if (k === "i") {
      e.preventDefault();
      showHeldPowers(state);
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

  let charTipTimer = 0;
  function hideCharTip() {
    clearTimeout(charTipTimer);
    charTipTimer = 0;
    const tip = document.getElementById("charTip");
    if (tip) tip.classList.add("hidden");
  }
  function showCharTip(skin, anchor) {
    const tip = document.getElementById("charTip");
    if (!tip) return;
    const def = SKIN_SUPERS[skin.id] || SKIN_SUPERS.marshmallow;
    tip.innerHTML =
      `<div class="char-tip-name">${skin.name}</div>` +
      `<div class="char-tip-buff"><span>BUFF</span>${def.buff || def.name}</div>` +
      `<div class="char-tip-debuff"><span>DEBUFF</span>${def.debuff || "—"}</div>`;
    tip.classList.remove("hidden");
    const r = anchor.getBoundingClientRect();
    const fr = document.getElementById("frame").getBoundingClientRect();
    let left = r.left - fr.left + r.width / 2 - 110;
    left = Math.min(fr.width - 228, Math.max(8, left));
    let top = r.top - fr.top - 12;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
    tip.style.transform = "translateY(-100%)";
  }

  function renderCharGrid() {
    if (!charGrid) return;
    hideCharTip();
    charGrid.innerHTML = "";
    charPreviewCanvases = [];
    ensureSelectedSkinValid();
    for (const skin of SKINS) {
      const unlocked = isSkinUnlocked(skin.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "char-card" +
        (selectedSkin === skin.id ? " selected" : "") +
        (unlocked ? "" : " locked");
      const c = document.createElement("canvas");
      c.width = 72;
      c.height = 72;
      btn.appendChild(c);
      const name = document.createElement("div");
      name.className = "char-name";
      name.textContent = unlocked ? skin.name : "???";
      const desc = document.createElement("div");
      desc.className = "char-desc";
      const def = SKIN_SUPERS[skin.id] || SKIN_SUPERS.marshmallow;
      desc.textContent = unlocked
        ? def.none
          ? `${skin.desc}`
          : `${skin.desc} · Super: ${def.name}`
        : skin.unlockText;
      btn.appendChild(name);
      btn.appendChild(desc);
      if (unlocked) {
        btn.addEventListener("click", () => {
          selectedSkin = skin.id;
          saveSelectedSkin(selectedSkin);
          toast(`${skin.name} selected`);
          renderCharGrid();
        });
        btn.addEventListener("mouseenter", () => {
          clearTimeout(charTipTimer);
          charTipTimer = setTimeout(() => showCharTip(skin, btn), 2000);
        });
        btn.addEventListener("mouseleave", hideCharTip);
        charPreviewCanvases.push({ canvas: c, id: skin.id });
      } else {
        const x = c.getContext("2d");
        x.fillStyle = "#1a1228";
        x.fillRect(0, 0, 72, 72);
        x.fillStyle = "#fff";
        x.font = "bold 28px Syne";
        x.textAlign = "center";
        x.fillText("?", 36, 44);
      }
      charGrid.appendChild(btn);
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
    const W = canvasEl.width || 72;
    const H = canvasEl.height || 72;
    x.imageSmoothingEnabled = true;
    x.clearRect(0, 0, W, H);
    const g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#fff8f0");
    g.addColorStop(1, "#e8f6ff");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    x.save();
    x.translate(W / 2, H * 0.55);
    const sc = Math.min(W, H) / 48;
    drawPlayerSkin(x, skinId, sc, now == null ? performance.now() : now);
    x.restore();
  }

  const worldStep = document.getElementById("worldStep");
  const tutorialStep = document.getElementById("tutorialStep");
  const worldGrid = document.getElementById("worldGrid");
  const btnBackWorld = document.getElementById("btnBackWorld");
  const btnTutorial = document.getElementById("btnTutorial");
  const btnBackTutorial = document.getElementById("btnBackTutorial");
  const btnBoss1 = document.getElementById("btnBoss1");
  const btnBoss2 = document.getElementById("btnBoss2");
  const btnBoss3 = document.getElementById("btnBoss3");

  function hideAllMenuSteps() {
    if (mainStep) mainStep.classList.add("hidden");
    if (charStep) charStep.classList.add("hidden");
    if (worldStep) worldStep.classList.add("hidden");
    if (tutorialStep) tutorialStep.classList.add("hidden");
  }

  function showMainMenu() {
    hideAllMenuSteps();
    if (mainStep) mainStep.classList.remove("hidden");
    if (ui.overlay) ui.overlay.classList.add("synth-menu");
    if (typeof hideCharTip === "function") hideCharTip();
    applyVibe("frost");
  }

  function showCharMenu() {
    hideAllMenuSteps();
    if (charStep) charStep.classList.remove("hidden");
    if (ui.overlay) ui.overlay.classList.remove("synth-menu");
    tryUnlockSkins(false);
    ensureSelectedSkinValid();
    renderCharGrid();
  }

  function showTutorialMenu() {
    hideAllMenuSteps();
    if (tutorialStep) tutorialStep.classList.remove("hidden");
    if (ui.overlay) ui.overlay.classList.remove("synth-menu");
    applyVibe("frost");
  }

  function showWorldMenu() {
    hideAllMenuSteps();
    if (worldStep) worldStep.classList.remove("hidden");
    if (ui.overlay) ui.overlay.classList.remove("synth-menu");
    applyVibe("frost");
    renderWorldGrid();
    updateFinalBossCard();
    const panel = document.getElementById("bossTestPanel");
    if (panel) panel.classList.toggle("hidden", isFinalBossUnlocked());
  }

  function updateFinalBossCard() {
    const btn = document.getElementById("btnFinalBoss");
    const kicker = document.getElementById("finalBossKicker");
    if (!btn) return;
    const unlocked = isFinalBossUnlocked();
    btn.classList.toggle("locked", !unlocked);
    if (kicker) kicker.textContent = unlocked ? "UNLOCKED" : "AFTER LEVEL 30";
  }

  function renderWorldGrid() {
    if (!worldGrid) return;
    worldGrid.innerHTML = "";
    const unlocked = getUnlockedWorld();
    for (const w of WORLDS) {
      const locked = w.id > unlocked;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mode-card" + (locked ? " locked" : "") + (w.id === 2 ? " alt" : "") + (w.id === 3 ? " soft" : "");
      btn.innerHTML = `
        <span class="mode-kicker">${w.kicker}</span>
        <span class="mode-title">${w.name}</span>
        <span class="mode-desc">Levels ${w.range}<br>${w.desc}</span>
        ${locked ? `<span class="mode-lock">Locked · beat world ${w.id - 1} boss</span>` : ""}
      `;
      if (!locked) {
        btn.addEventListener("mouseenter", () => applyVibe(w.vibe));
        btn.addEventListener("focus", () => applyVibe(w.vibe));
        btn.addEventListener("click", () => startCampaignWorld(w.id));
      }
      worldGrid.appendChild(btn);
    }
  }

  function startCampaignWorld(worldId) {
    ensureAudio();
    const w = WORLDS[worldId - 1];
    applyVibe(w.vibe);
    setTheme("none");
    state = createState("campaign");
    state.worldStart = w.startLevel;
    state.bossTest = false;
    beginCampaignLevel(state, w.startLevel, false);
  }

  function startBossTest(worldId) {
    ensureAudio();
    const w = WORLDS[worldId - 1];
    applyVibe(w.vibe);
    setTheme("none");
    state = createState("campaign");
    state.bossTest = true;
    state.worldStart = w.endLevel;
    state.enemies = [];
    for (let i = 0; i < worldId * 2; i++) {
      state.enemies.push(makeEnemy(0, rand(0, Math.PI * 2), Math.random() < 0.5 ? 1 : -1, true));
    }
    beginCampaignLevel(state, w.endLevel, true);
  }

  function startCampaign() {
    ensureAudio();
    setTheme("menu");
    showWorldMenu();
  }

  function startEndless() {
    ensureAudio();
    applyVibe("frost");
    setTheme("none");
    state = createState("endless");
    beginEndless(state);
  }

  function startFinalBoss() {
    if (!isFinalBossUnlocked()) {
      toast("Beat level 30 to unlock the Planet King");
      return;
    }
    ensureAudio();
    applyVibe("frost");
    setTheme("none");
    state = createState("finalBoss");
    state.lives = 3;
    beginFinalBoss(state);
  }

  function backToMenu() {
    setFinalImmersive(false);
    const goWorlds = !!state._endGoWorlds;
    state = createState();
    state.mode = "title";
    state.boss = false;
    state.camZoom = 1;
    showHud(false);
    if (ui.previewBanner) ui.previewBanner.classList.add("hidden");
    ui.endScreen.classList.add("hidden");
    ui.pick.classList.add("hidden");
    if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
    ui.overlay.classList.remove("hidden");
    ui.overlay.classList.add("show");
    if (goWorlds) showWorldMenu();
    else showMainMenu();
    ensureAudio();
    setTheme("menu");
  }

  function startTutorialBeat() {
    ensureAudio();
    applyVibe("frost");
    setTheme("none");
    state = createState("tutorial");
    state.lives = 5;
    beginTutorial(state);
  }

  ui.btnCampaign.addEventListener("click", startCampaign);
  ui.btnEndless.addEventListener("click", startEndless);
  if (btnCharacters) btnCharacters.addEventListener("click", showCharMenu);
  if (btnBackMain) btnBackMain.addEventListener("click", showMainMenu);
  if (btnBackWorld) btnBackWorld.addEventListener("click", showMainMenu);
  if (btnTutorial) btnTutorial.addEventListener("click", showTutorialMenu);
  if (btnBackTutorial) btnBackTutorial.addEventListener("click", showWorldMenu);
  const btnPlayTutorial = document.getElementById("btnPlayTutorial");
  if (btnPlayTutorial) btnPlayTutorial.addEventListener("click", startTutorialBeat);
  if (ui.pauseResume) ui.pauseResume.addEventListener("click", resumeGame);
  if (ui.pauseMenu) {
    ui.pauseMenu.addEventListener("click", () => {
      if (ui.pauseScreen) ui.pauseScreen.classList.add("hidden");
      backToMenu();
    });
  }
  if (btnBoss1) btnBoss1.addEventListener("click", () => startBossTest(1));
  if (btnBoss2) btnBoss2.addEventListener("click", () => startBossTest(2));
  if (btnBoss3) btnBoss3.addEventListener("click", () => startBossTest(3));
  const btnFinalBoss = document.getElementById("btnFinalBoss");
  if (btnFinalBoss) btnFinalBoss.addEventListener("click", startFinalBoss);
  ui.endMenu.addEventListener("click", backToMenu);
  if (ui.infoOk) ui.infoOk.addEventListener("click", dismissPowerInfo);
  if (ui.invOk) ui.invOk.addEventListener("click", dismissInventory);
  if (ui.invPanel) {
    ui.invPanel.addEventListener("click", (e) => {
      if (e.target === ui.invPanel) dismissInventory();
    });
  }
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
      applyVibe("frost");
      if (state.mode === "title") setTheme("menu");
    },
    { once: true }
  );

  showMainMenu();

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
