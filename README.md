# PitchUp — Junior Cricket Management Platform
### © 2025 ThinkViz Limited · Company No. 09906407 · All Rights Reserved

---

## Project Overview

PitchUp is a mobile-first, offline-capable junior cricket management platform built as a single-file Progressive Web App (PWA). It covers live match scoring, squad management, and player development tracking.

**Current version:** v1.0  
**Tech stack:** Vanilla HTML · CSS · JavaScript (no build tools, no frameworks, no dependencies)  
**Primary format support:** Charlie Cricket (tandem bowling) + Standard  

---

## Local Development

### Folder Structure

```
C:\CricketScorer\
├── pitchup.html          ← Main application (single file, production-ready)
├── README.md             ← This file
├── CHANGELOG.md          ← Version history
├── docs\
│   └── PitchUp-Hosting-Guide.md   ← Deployment instructions
└── archive\
    └── charlie-cricket.html       ← Previous version (keep for reference)
```

### Running Locally

The app is a plain HTML file — no build step needed.

**Option 1 — Browser directly**
```
Double-click pitchup.html  (works for basic testing)
```

**Option 2 — Local HTTP server (recommended, enables PWA/Service Worker)**
```powershell
# PowerShell — if Python is installed:
cd C:\CricketScorer
python -m http.server 8080
# Then open: http://localhost:8080/pitchup.html
```

**Option 3 — VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click `pitchup.html` → Open with Live Server

### Claude Code (CLI) Setup

With Claude Code installed and this directory open:

```powershell
cd C:\CricketScorer
claude
```

Claude has full project context via `CLAUDE.md` in this folder.

---

## Feature Summary

| Feature | Status |
|---------|--------|
| Live match scoring | ✅ v1.0 |
| Charlie Cricket tandem bowling | ✅ v1.0 |
| Standard bowling mode | ✅ v1.0 |
| Squad management (up to 15 players) | ✅ v1.0 |
| Auto bowler swap per delivery (Charlie) | ✅ v1.0 |
| Batter auto-retirement (score-based) | ✅ v1.0 |
| Striker override mid-delivery | ✅ v1.0 |
| Bowler retirement (injury/illness) | ✅ v1.0 |
| Configurable wide / no-ball rules | ✅ v1.0 |
| Configurable balls per over (4–8) | ✅ v1.0 |
| CSV export (batting, bowling, ball-by-ball) | ✅ v1.0 |
| Offline PWA — Service Worker | ✅ v1.0 |
| Install to phone home screen | ✅ v1.0 |
| Match history (last 20 matches) | ✅ v1.0 |
| Player skill credits & development tracking | 🔜 v1.1 |
| Cloud sync & user accounts | 🔜 v2.0 |
| Club admin dashboard | 🔜 v2.0 |
| Hampshire Cricket / county integration | 🔜 v2.0 |

---

## Architecture Notes

- **Single file:** All HTML, CSS, JS in `pitchup.html`. Zero runtime dependencies.
- **Storage:** `localStorage` key `pitchup_v1`. No server calls, no accounts needed.
- **Offline:** Service Worker via blob URL — caches after first load, works at cricket grounds.
- **Fonts:** Google Fonts (Oswald, Rajdhani, Source Sans 3) — browser-cached after first load.
- **State:** Flat JS object `state`, rendered via `render()`. No framework needed at this scale.
- **Bowling mode:** `match.bowlingMode` — `'charlie'` or `'standard'`. Governs auto-swap in `scoreRuns()`, `scoreExtra()`, `scoreWicket()`.

---

## IP & Legal

This software is proprietary and confidential.  
**© 2025 ThinkViz Limited. All Rights Reserved.**  
Registered in England & Wales · Company No. 09906407  
Unauthorised copying, distribution or modification is strictly prohibited.
