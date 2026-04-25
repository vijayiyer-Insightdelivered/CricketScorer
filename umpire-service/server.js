// PitchUp Umpire — Claude proxy for cricket-law questions.
// Deployed as a separate Railway service alongside the PitchUp static site.
//
// Required env vars:
//   ANTHROPIC_API_KEY         — your Anthropic API key (console.anthropic.com)
// Optional env vars:
//   ALLOWED_ORIGIN            — CORS allowlist, default https://pitchup.up.railway.app
//   PITCHUP_SHARED_SECRET     — if set, requests must include X-Pitchup-Token header matching this value
//   MODEL                     — override model, default claude-haiku-4-5-20251001
//   MAX_TOKENS                — hard cap on answer length, default 400
//   RATE_LIMIT_PER_HOUR       — per-IP rate limit, default 20
//   PORT                      — listen port, Railway sets this automatically

import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGIN || 'https://pitchup.up.railway.app').split(',').map(s => s.trim());
const SHARED_SECRET = process.env.PITCHUP_SHARED_SECRET || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.MODEL || 'claude-haiku-4-5-20251001';
const MAX_TOKENS = Number(process.env.MAX_TOKENS) || 400;
const RATE_LIMIT_PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR) || 20;

if (!ANTHROPIC_API_KEY) {
  console.error('FATAL: ANTHROPIC_API_KEY env var is required.');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const app = express();
app.set('trust proxy', 1); // Railway is behind a proxy; honour X-Forwarded-For
app.use(express.json({ limit: '8kb' }));
app.use(cors({
  origin: (origin, cb) => {
    // Allow no-origin (curl, server-to-server) for /health checks; browsers send Origin.
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGIN.includes(origin) || ALLOWED_ORIGIN.includes('*')) return cb(null, true);
    cb(new Error('Origin not allowed'));
  }
}));

// ─── per-IP rate limit (in-memory, resets on restart) ────────────────────────
const rateMap = new Map();
const WINDOW_MS = 60 * 60 * 1000;
function rateLimit(req, res, next) {
  const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() || req.ip || 'unknown';
  const now = Date.now();
  const arr = (rateMap.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (arr.length >= RATE_LIMIT_PER_HOUR) {
    res.set('Retry-After', '3600');
    return res.status(429).json({ error: `Rate limit: max ${RATE_LIMIT_PER_HOUR} questions per hour per IP.` });
  }
  arr.push(now);
  rateMap.set(ip, arr);
  next();
}

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'pitchup-umpire', model: MODEL, version: '1.0.0' });
});

app.post('/api/umpire', rateLimit, async (req, res) => {
  try {
    if (SHARED_SECRET) {
      const tok = req.headers['x-pitchup-token'];
      if (tok !== SHARED_SECRET) return res.status(401).json({ error: 'Unauthorized' });
    }
    const { question, context } = req.body || {};
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Missing question' });
    }
    if (question.length > 500) {
      return res.status(400).json({ error: 'Question too long (max 500 chars)' });
    }
    const ctxLaws = Array.isArray(context) ? context.slice(0, 5) : [];
    const ctxText = ctxLaws.length
      ? ctxLaws.map(l => `Law ${l.n} — ${l.title}: ${l.summary}`).join('\n')
      : '(none — rely on your own knowledge of the MCC Laws)';

    const system = `You are an assistant for junior-cricket coaches and volunteer umpires (U9–U13 age groups), answering questions about the MCC Laws of Cricket (2017 Code, revised to 2022).

Style: concise, practical, 2–4 sentences. Always cite the Law number(s) you rely on. Explain in plain language for parents and volunteers, not just seasoned umpires.

Output format: respond with valid JSON ONLY, no prose outside the JSON, of shape:
{"answer": "your answer referencing Law N", "laws": [<integers of Law numbers cited>]}

If the question is NOT about cricket laws or umpiring, reply:
{"answer": "I can only help with questions about the Laws of Cricket.", "laws": []}`;

    const user = `Question: ${question}

Candidate Laws from our offline index (may be empty or partially relevant):
${ctxText}

Respond with JSON only.`;

    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: 'user', content: user }]
    });

    const txt = (resp.content?.[0]?.text || '').trim();
    let parsed;
    try {
      // Strip markdown fences if Claude wraps output
      const clean = txt.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
      parsed = JSON.parse(clean);
    } catch {
      parsed = { answer: txt || '(no answer)', laws: [] };
    }
    if (!parsed.answer || typeof parsed.answer !== 'string') {
      parsed = { answer: '(no answer)', laws: [] };
    }
    if (!Array.isArray(parsed.laws)) parsed.laws = [];
    parsed.laws = parsed.laws.filter(n => Number.isInteger(n) && n >= 1 && n <= 42);
    res.json(parsed);
  } catch (err) {
    console.error('umpire error:', err);
    res.status(500).json({ error: 'Umpire service error', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`PitchUp Umpire listening on :${PORT} (model=${MODEL}, rate=${RATE_LIMIT_PER_HOUR}/h)`);
});
