# CLAUDE.md — PitchUp Project Context
### Read this first when starting a Claude Code session in this project

---

## What is this project?

**PitchUp** is a junior cricket management platform — a single-file PWA (`pitchup.html`) built with vanilla HTML/CSS/JS. No framework, no build tools, no package.json.

**Owner:** ThinkViz Limited (Vijay Iyer) · Company No. 09906407  
**Target users:** Junior cricket clubs, coaches, scorers — primarily U11/U12 age groups  
**Key commercial target:** Hampshire Cricket Early Engagement Pathway, then wider UK club cricket

---

## File map

```
C:\CricketScorer\
├── pitchup.html        ← THE APP. Everything is in here.
├── CLAUDE.md           ← This file (Claude Code reads this first)
├── README.md           ← Human-readable project overview
├── CHANGELOG.md        ← Version history
└── docs\
    └── PitchUp-Hosting-Guide.md
```

**The entire application is `pitchup.html`.** When asked to make changes, edit that file directly.

---

## Architecture — how the code is organised

`pitchup.html` has three sections:

### 1. `<style>` block (~400 lines)
CSS design system with CSS variables. Key tokens:
- `--navy / --navy2 / --navy3` — dark scoring screens
- `--gold / --gold2` — Charlie Cricket accent colour
- `--grass / --grass2 / --grass3` — green primary actions
- `--home-bg: #ffffff` — white home screen
- Fonts: `--fd` = Oswald (display), `--fu` = Rajdhani (UI labels), `--fb` = Source Sans 3 (body)

Screen classes: `.screen.dark` (scoring/setup) · `.screen.light` (home/teams)

### 2. `<div id="app">` — the app shell
Completely empty. All UI is injected by `render()`.

### 3. `<script>` block (~1100 lines)
Organised as follows:

```
Constants & helpers
  DEFAULT_RULES, WICKET_TYPES, RETIRE_REASONS
  initBatter(), initBowler(), overStr(), escHtml(), uid()

State
  state = { screen, match, currentInnings, savedMatches, teams, modal, editTeamId }
  loadState() / persist()  — localStorage key 'pitchup_v1'

Helper accessors
  getInn()   — current innings object
  getRules() — current match rules
  getBpo()   — balls per over
  isCharlie() — true if match.bowlingMode === 'charlie'
  updateInn(fn) — immutable update to current innings

CSV Export
  exportCSV(match)

Scoring actions  ← CORE LOGIC
  scoreRuns(runs)
  scoreExtra(type)   — 'Wide' | 'No Ball' | 'Bye' | 'Leg Bye'
  scoreWicket(outId, type, runs)
  swapBowlers()      — manual swap
  isInningsOver()
  endInnings()

Modal system
  openModal(type, data) / closeModal()

Setup wizard state
  setupData = { step, teamA, teamB, format, overs, bowlingMode, rules, ... }
  initSetup(teamAId, teamBId)

Team management
  saveTeam() / deleteTeam(id) / editTeam(id) / newTeam()
  editTeamData = { name, players:[{id, name}] }

Render system
  render()           — rebuilds app innerHTML from state
  buildScreenHTML()  — dispatches to screen renderers

Screen renderers
  renderHome()
  renderTeams()
  renderEditTeam()
  renderSetup()           — step 0: match config · step 1/2: squad entry
  renderInningsSetup()
  renderScoring()         — main scoring UI
    renderScorecard(inn, teamName, bpo)
    renderRulesConfig(r)
  renderResult()

Modal renderers
  renderModal(modal)
  renderNewBatterModal(data)
  renderStrikerModal()
  renderRetireBowlerModal()
  renderReplaceBowlerModal(data)

Boot
  loadState() → updateOffline() → render()
  Service Worker (blob URL, caches '/')
```

---

## Key data structures

### `state.match`
```js
{
  teamA, teamB,           // team names
  format,                 // 'T20' | 'Custom'
  totalOvers,             // number
  bowlingMode,            // 'charlie' | 'standard'  ← CRITICAL
  rules: {
    ballsPerOver,         // 4–8, default 6
    wideRuns,             // default 1
    wideBowlAgain,        // true = illegal, false = legal ball
    noBallRuns,           // default 1
    noBallBowlAgain,      // true = illegal, false = legal ball
    retirementScore,      // 0 = disabled
  },
  playersA, playersB,     // string[] of names
  innings: [inn0, inn1],
}
```

### `innings` object
```js
{
  total, wickets, legalBalls, overs,
  batters: [{id, name, runs, balls, fours, sixes, out, retired, dismissal}],
  bowlers: [{id, name, balls, runs, wickets, wides, noBalls, retiredInjured, retireReason}],
  currentBatters: [strikerId, nonStrikerId],   // null = vacancy
  charlieBowlers: [activeId, waitingId],        // slot 0 = bowling, slot 1 = next
  extras: {total, wides, noBalls, byes, legByes},
  deliveries: [{over, ball, bowler, batter, event, runs, isWicket, isExtra, extraType}],
  complete: bool,
}
```

### `state.teams`
```js
[{ id, name, players: [{id, name}] }]
```

---

## Bowling mode — how it works

`isCharlie()` returns `true` when `match.bowlingMode === 'charlie'`.

In **Charlie mode:**
- After every legal delivery, `charlieBowlers` array is swapped: `[1,0]`
- This happens in `scoreRuns()`, `scoreExtra()` (legal balls only), and `scoreWicket()`
- The waiting bowler **cannot field** the current ball (displayed in UI)
- Innings setup shows **two bowler selectors** (active + waiting)

In **Standard mode:**
- No auto-swap — `charlieBowlers[0]` stays the same throughout the over
- Scorer taps ⇄ Change manually to select a new bowler each over
- Innings setup shows **one bowler selector**

---

## CSS conventions

- All inline styles use JS template literal interpolation: `` `color:${val}` ``
- Never use `class=""` with dynamic state — use inline style conditionals
- Dark screens: use `var(--navy3)`, `var(--border)`, `var(--muted)`
- Light screens (home/teams): use `var(--home-bg)`, `var(--home-border)`, `var(--home-muted)`
- Touch targets: minimum 44px height on all interactive elements

---

## How to make changes

### Adding a new screen
1. Add screen name to `buildScreenHTML()` dispatch
2. Create `renderMyScreen()` function returning HTML string
3. Add navigation: `state.screen='my_screen';render()`
4. Add topbar with `renderTopbar()` pattern or custom

### Adding a new scoring rule
1. Add field to `DEFAULT_RULES`
2. Add stepper/toggle to `renderRulesConfig()`
3. Apply logic in `scoreRuns()` / `scoreExtra()` / `scoreWicket()`
4. Store in `state.match.rules` via `handleSquadNext()`

### Adding a new modal
1. Add case to `renderModal()`
2. Create `renderMyModal()` returning `.modal-sheet` HTML
3. Open with `openModal('myModal', data)`

### Editing styles
All styles are in the `<style>` block. Use CSS variables — never hardcode colours.

---

## Next features planned (v1.1)

### Player Skill Credits
- Coach awards a skill badge/credit to a player during or after a match
- Skills defined by coaching staff (e.g. "Correct grip", "Played straight", "Good follow-through")
- Credits stored against player ID in `state.teams[].players[].credits[]`
- Displayed in a player profile card
- Exportable in CSV

### Implementation approach
- Add `credits` array to each player in `editTeamData`
- New modal during scoring: "Award Skill Credit" → pick player → pick skill → add note
- Skills list configurable per team/club
- New screen: Player Profile (from Teams → tap player)

---

## Running a local dev server (Windows)

```powershell
# PowerShell
cd C:\CricketScorer
python -m http.server 8080
# Open http://localhost:8080/pitchup.html
```

Or use VS Code Live Server extension.

---

## Deployment

Upload `pitchup.html` to any static host:
- Netlify Drop (recommended): https://app.netlify.com/drop
- GitHub Pages
- Any cPanel hosting under public_html

Full instructions: `docs\PitchUp-Hosting-Guide.md`

---

## Copyright

**© 2025 ThinkViz Limited. All Rights Reserved.**  
Registered in England & Wales · Company No. 09906407  
Do not distribute or modify without written permission.
