# PitchUp — Hosting & Deployment Guide
### A Product of ThinkViz Limited · © 2025 All Rights Reserved

---

## What you have

**`pitchup.html`** — a single self-contained file.  
No server, no database, no build process, no dependencies to install.  
Host it anywhere that serves HTML and it works.

---

## Option 1 — Netlify Drop ⭐ Recommended (FREE, 5 minutes)

**Best for:** getting live immediately today.

1. Go to **https://app.netlify.com/drop**
2. Drag and drop **`pitchup.html`** onto the page
3. Netlify instantly gives you a live URL — e.g. `https://pitchup-abc123.netlify.app`
4. Rename it: Site settings → Change site name → e.g. `pitchup-thinkviz`
5. Your URL becomes: `https://pitchup-thinkviz.netlify.app`

**Custom domain (optional):**
- In Netlify: Domain settings → Add custom domain
- Point `pitchup.app` or `pitchup.co.uk` at it — Netlify handles SSL automatically

**To update the app:** just drag the new `pitchup.html` onto the same project. Zero downtime.

---

## Option 2 — GitHub Pages (FREE, permanent, version-controlled)

**Best for:** keeping your code safe and tracked, free permanent URL.

1. Create a GitHub account at **https://github.com** (free)
2. New repository → name it `pitchup`
3. Upload `pitchup.html`, rename it to **`index.html`**
4. Settings → Pages → Source: main branch → Save
5. Live at: `https://yourusername.github.io/pitchup`

Bonus: every change is version-controlled — you can roll back any update.

---

## Option 3 — Your existing hosting (GoDaddy / cPanel / SiteGround)

If ThinkViz already has a hosting account:

1. Log in to cPanel or File Manager
2. Navigate to `public_html`
3. Upload `pitchup.html`
4. Access at: `https://yourdomain.com/pitchup.html`
   — or rename to `index.html` for root access

For a dedicated subdomain (e.g. `app.thinkviz.co.uk`):
1. Create subdomain in cPanel → Subdomains → `app`
2. Upload `pitchup.html` as `index.html` into the subdomain folder

---

## Option 4 — Cloudflare Pages (FREE, fastest global CDN)

**Best for:** speed and professionalism — loads fast worldwide.

1. **https://pages.cloudflare.com** → Create project → Direct Upload
2. Upload `pitchup.html`
3. Gets a `*.pages.dev` URL instantly
4. Connect your own domain (free via Cloudflare)

Ideal if you already use Cloudflare for ThinkViz domains.

---

## Recommended domain names to register

| Domain | Registrar note |
|--------|---------------|
| `pitchup.app` | Premium `.app` TLD — great for app stores |
| `pitchup.co.uk` | UK-local, credible for county cricket |
| `getpitchup.com` | Universal, clear |
| `pitchup.cricket` | Niche but memorable |
| `thinkviz.app` | Company-branded alternative |

Check availability at **https://www.namecheap.com** or **https://domains.google.com**

---

## Installing as a mobile app (PWA)

Once hosted online, users install it like a native app — no App Store needed.

**iPhone / iPad (Safari):**
1. Open the URL in Safari
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add** → appears as a PitchUp app icon

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the **3-dot menu** → "Add to Home screen"
3. Chrome may show an **"Install"** banner automatically

Once installed it runs **fully offline** — all scoring, squad management, and CSV export work with zero network.

---

## Sharing with clubs & coaches

Once live, share the URL via:
- **WhatsApp group** for the team/club
- **Email** to coaches and team managers
- **QR code** printed at the ground — generate free at **https://qr.io**
- **Hampshire Cricket** — if pitching for county-wide adoption, provide the URL for their coaching staff to trial

---

## Data & IP protection

- All data (teams, match history, player records) is stored **locally on the user's device** in browser localStorage
- Nothing is transmitted to any external server — zero data exposure
- Each device maintains its own records independently
- To share results between devices, use the **CSV export** button

**IP Protection:** The source file contains the copyright notice:
```
© 2025 ThinkViz Limited. All Rights Reserved.
Registered in England & Wales · Company No. 09906407
```
This appears in the HTML comment header of every copy of the file.

---

## Subscription model when ready

When you're ready to move to a paid tier with cloud sync and accounts:

| Tier | Target | Features |
|------|--------|----------|
| **Free** | Individual scorer | 3 teams, local storage only |
| **Club** (~£3–5/month) | Cricket club | Unlimited teams, CSV export, history |
| **Academy** (~£10/month) | Junior academies | Player development tracking, skill badges, reports |
| **County** (custom) | Hampshire Cricket etc. | Multi-club dashboard, branded, API access |

The current `pitchup.html` is the Club-tier feature set — strong foundation for the paid roadmap.

---

## Recommended day-of-match setup

1. Lead scorer opens **pitchup.app** (or wherever hosted) on their phone/tablet
2. First visit — install to Home Screen while on WiFi
3. From that point it works **fully offline at the ground**
4. Pre-load teams before match day in the Teams & Players section
5. Match day: New Match → select teams → score
6. End of match: Export CSV → email or WhatsApp to club secretary

---

## Support & updates

For updates to the app, simply re-upload `pitchup.html` to your hosting.  
All user data is in localStorage — updates don't affect saved teams or match history.

**ThinkViz Limited**  
Company No. 09906407  
Hook, Hampshire RG27 9QU  
vijay.iyer@insightdelivered.com
