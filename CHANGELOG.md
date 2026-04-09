# PitchUp — Changelog
### © 2025 ThinkViz Limited

---

## v1.0.0 — 2025-04 (Initial Release)

### Core scoring
- Live match scoring — runs (0, 1, 2, 3, 4, 6)
- Extras: Wide, No Ball, Bye, Leg Bye
- Wicket recording with dismissal type and fielder credit
- Batter strike rotation (auto on odd runs, end-of-over)
- Over-by-over ball tracking (last 14 deliveries shown)
- Target, runs required, balls remaining display

### Bowling modes
- **Charlie Cricket mode** — tandem pair bowling, auto-swap after every delivery
- **Standard mode** — one bowler per over, manual change via ⇄
- Mode selected at match setup, persists throughout match

### Charlie Cricket mechanics
- Active bowler (can field own ball) vs Waiting bowler (cannot field)
- Auto-swap on every legal delivery (runs, legal extras, wickets)
- Wides/No-balls that must rebowl — no swap triggered
- Manual ⇄ override available at any time
- Bowler retirement (injury/illness) with replacement selection

### Match rules (all configurable)
- Balls per over: 4–8 (default 6, junior option 5)
- Wide runs: 0–5 (default 1) + must-rebowl toggle
- No Ball runs: 0–5 (default 1) + must-rebowl toggle
- Batter auto-retirement score (default off, steps of 5)

### Squad & team management
- Register teams with up to 15 players (11–15 squad size)
- Team registry — save, edit, delete teams
- Auto-populate squad into match setup from registry
- Quick match start from home screen (select two registered teams)

### Batting controls
- Striker override — tap striker badge to swap who faces next delivery
- New batter selection after wicket or retirement
- Retired-not-out tracking (auto on score-limit or manual via Retired wicket type)

### Match structure
- Two innings
- Innings setup: select openers + opening bowler(s)
- Innings-over detection: all out or overs complete
- Result screen with winner, margin, full scorecards

### Data & export
- Match history: last 20 matches stored in localStorage
- CSV export: batting, bowling, extras, ball-by-ball
- CSV branded with PitchUp / ThinkViz header

### Platform
- Single-file PWA — `pitchup.html` (no server, no build)
- Offline-first via Service Worker (blob URL registration)
- Install to phone home screen (iOS Safari, Android Chrome)
- Responsive, mobile-first layout (max 480px)
- Safe-area insets for iPhone notch/home bar
- Touch targets minimum 44px

### Design & branding
- White home screen, dark scoring screens
- Fonts: Oswald (display) · Rajdhani (UI) · Source Sans 3 (body)
- Colour palette: Navy (#050a14) · Gold (#e8a820) · Grass green (#2a9152)
- Copyright header in HTML source
- ThinkViz Limited attribution throughout

---

## Planned — v1.1.0

- Player skill credit system (coach awards skills during/after match)
- Player profile screen (history, credits, development arc)
- Configurable skills library per club

## Planned — v2.0.0

- Cloud sync and user accounts (Supabase or Firebase)
- Club admin dashboard
- Multi-team management
- Hampshire Cricket / county board integration
- Subscription tier enforcement (Free / Club / Academy / County)
