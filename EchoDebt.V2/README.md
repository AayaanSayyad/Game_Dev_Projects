# Echo Debt

Orbit the rings. Dodge the clones your deaths leave behind. Clear the ledger.

A browser arcade about debt, lasers, and candy — keyboard only.

## Play locally

```bash
python3 -m http.server 8080 --directory .
```

Open [http://localhost:8080](http://localhost:8080) and click once to unlock audio.

## Modes

- **Campaign** — 3 worlds · 30 levels · bosses at 10 / 20 / 30  
  - Teal Rift · Ember Ring · Magenta Rise  
  - Beat Pulse Core (30) to unlock the **Final Boss**
- **Final Boss** — Planet King · 5 rings · 3 minutes · 3 phases
- **Endless** — escalation every 15s · mood phases (Dreaming → Corrupt)
- **Tutorial** — short practice beat under Campaign (spin, hop, laser, candy)

## Controls

| Input | Action |
|-------|--------|
| **A / D** or **← / →** | Spin on the ring |
| **W / S** or **↑ / ↓** | Switch rings · hop on the rim |
| **1 – 4** | Use held candy from slots |
| **Space** | Character super (if any) |
| **I** | Inventory peek |
| **Esc** | Pause · resume · close panels |

## The loop

- Survive until the timer ends.
- **Debt** = clones on the board. Hits usually add more debt.
- Bumping a clone costs a life — that clone pops too.
- Lasers telegraph, then fire. Candies are mystery pickups (buff or curse).

## Characters

Unlock skins through play (clears, bosses, deaths, endless). Each has a super and a tradeoff. Your selection is saved in the browser.

## Tech

Static site: `index.html` · `game.js` · `style.css`  
Progress in `localStorage` (`echoDebtMeta`, `echoDebtWorld`, `echoDebtSkin`).

Free host: GitHub Pages, Netlify Drop, or Cloudflare Pages — no build step.
