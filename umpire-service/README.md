# PitchUp Umpire Service

A tiny Express proxy that turns natural-language cricket questions into JSON answers from Claude, citing the MCC Laws.

## What it does

`POST /api/umpire`

Request:
```json
{ "question": "Can you be bowled off a no ball?",
  "context": [ { "n": 21, "title": "No ball", "summary": "..." } ] }
```

Response:
```json
{ "answer": "No. A batter cannot be bowled off a no ball (Law 21). The only modes of dismissal off a no ball are run out, hit ball twice, obstructing the field and handled-ball.", "laws": [21] }
```

`GET /health` — readiness check, returns `{ ok: true, service, model, version }`.

## Deploy on Railway (recommended)

1. **Get an Anthropic API key.** This is *not* the same as your Claude Max subscription — it has its own billing. Go to <https://console.anthropic.com> → API Keys → Create Key. Add at least $5 credit. Claude Haiku 4.5 costs about $0.001 per umpire question.

2. **Create a new service in your existing Railway project:**
   - Open your PitchUp project in Railway.
   - Click **+ New** → **GitHub Repo** → select `CricketScorer`.
   - In the new service's **Settings**:
     - **Root Directory:** `umpire-service`
     - **Build:** leave on Dockerfile (auto-detected)
     - **Public Networking:** toggle on (you'll need a public URL).

3. **Set environment variables** on the new service:

   | Variable | Value | Required |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` from console.anthropic.com | yes |
   | `ALLOWED_ORIGIN` | `https://pitchup.up.railway.app` (comma-separated for multiple) | recommended |
   | `PITCHUP_SHARED_SECRET` | any random 24+ char string — paste the same value into pitchup.html | recommended |
   | `MODEL` | default `claude-haiku-4-5-20251001` — override only if needed | optional |
   | `MAX_TOKENS` | default `400` | optional |
   | `RATE_LIMIT_PER_HOUR` | default `20` per IP | optional |

   Generate a shared secret quickly:
   ```bash
   node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
   ```

4. **Deploy.** Railway builds the Docker image and assigns a URL like `https://pitchup-umpire-production.up.railway.app`. Open `<that-url>/health` to confirm `{"ok":true,...}`.

5. **Wire it into PitchUp.** Edit `pitchup.html`:
   ```js
   const UMPIRE_AI_ENDPOINT = 'https://pitchup-umpire-production.up.railway.app/api/umpire';
   const UMPIRE_AI_TOKEN    = '<paste the same shared secret here>';
   ```
   Commit, push, and bump `CACHE_VERSION` in `sw.js` so installed PWAs pick up the new client. From then on, the Ask the Umpire tab will silently fall back to the AI when the offline copy doesn't have a confident match.

## Local dev

```bash
cd umpire-service
npm install
ANTHROPIC_API_KEY=sk-ant-... ALLOWED_ORIGIN=http://localhost:8080 npm start
# in another terminal:
curl -X POST http://localhost:3000/api/umpire \
  -H 'Content-Type: application/json' \
  -d '{"question":"What is mankading?"}'
```

## Hardening

The defaults give you:
- **CORS**: locks the browser path to `pitchup.up.railway.app` only.
- **Rate limit**: 20 questions/hour/IP (in-memory; resets on restart). Tune via `RATE_LIMIT_PER_HOUR`.
- **Shared secret**: blocks direct curl/Postman abuse. The PWA stores the same secret and sends it in `X-Pitchup-Token`. Anyone reading the page source can see this — it's a *deflection* layer, not real auth.
- **Hard input cap**: 500 chars per question, 8KB body, 400-token answer cap.

If you need stronger auth: drop in Firebase ID-token verification in front of `/api/umpire`. The PitchUp client already has a logged-in user; we'd send `await firebase.auth().currentUser.getIdToken()` and verify with `firebase-admin` here. Happy to add this when needed.
