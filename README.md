# walkies.quest

Personal NZ rain map: see which sampled suburbs look **dry** vs **raining** right now across Christchurch, Auckland, Wellington, and Dunedin.

Built for Catalyst interview prep — **Python Flask API** + **React / Tailwind / Leaflet**.

Live path: **Render** serves the Flask API and built SPA; **Vercel** holds DNS for `walkies.quest` and points it at Render.

## Quick start (local)

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

API runs at [http://127.0.0.1:5001](http://127.0.0.1:5001).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI runs at [http://127.0.0.1:5173](http://127.0.0.1:5173) and proxies `/api` to Flask.

### Production-style (Flask serves the SPA)

```bash
cd frontend && npm run build
cd ../backend && source .venv/bin/activate && gunicorn -b 0.0.0.0:5001 app:app
```

## Deploy on Render

Config lives in [`render.yaml`](./render.yaml): one free Python web service builds the SPA, installs backend deps, and runs gunicorn on `$PORT` so Flask can serve `frontend/dist`.

### Option A — Blueprint (dashboard)

1. Open [Render Dashboard → Blueprints](https://dashboard.render.com/blueprints) → **New Blueprint Instance**.
2. Connect the GitHub repo `gracemorganmaxwell/walkies-quest` (branch `main`).
3. Confirm it picks up root `render.yaml`, then apply.
4. Wait for the first deploy. Note the service URL: `https://walkies-quest.onrender.com` (name may vary if taken).
5. Verify:
   - `GET https://<service>.onrender.com/api/health` → `{"ok": true, ...}`
   - Open the root URL — map UI should load.

### Option B — CLI (after `render login`)

```bash
brew install render   # if needed
render login
render workspace set  # pick your workspace
# Create from the same settings as render.yaml:
render services create \
  --name walkies-quest \
  --type web_service \
  --runtime python \
  --plan free \
  --region singapore \
  --repo https://github.com/gracemorganmaxwell/walkies-quest \
  --branch main \
  --build-command 'npm --prefix frontend ci && npm --prefix frontend run build && pip install -r backend/requirements.txt' \
  --start-command 'gunicorn -b 0.0.0.0:$PORT app:app --chdir backend' \
  --health-check-path /api/health \
  --env-var PYTHON_VERSION=3.12.8 \
  --env-var NODE_VERSION=22.14.0 \
  --confirm -o text
```

**Note:** Free Render web services sleep after idle; the first request after sleep can take ~30–60s.

## Custom domain: walkies.quest (Vercel DNS → Render)

Domain registrar/DNS is **Vercel**. The app process runs on **Render**.

1. In Render → your web service → **Settings → Custom Domains** → add `walkies.quest` (and optionally `www.walkies.quest`).
2. Copy the target hostname Render shows (usually `walkies-quest.onrender.com`).
3. In Vercel DNS for `walkies.quest`, replace the default Vercel ALIAS/CNAME targets with records that point at Render:

```bash
# List current records
npx vercel dns ls walkies.quest

# Apex: Vercel supports ALIAS to an external hostname.
# Remove the default Vercel ALIAS first (use the record id from dns ls), then:
npx vercel dns add walkies.quest '@' ALIAS walkies-quest.onrender.com
npx vercel dns add walkies.quest www CNAME walkies-quest.onrender.com
```

4. Wait for DNS + Render certificate provisioning, then confirm:
   - `https://walkies.quest/api/health`
   - Map loads at `https://walkies.quest`

If Render asks for a specific CNAME/TXT for verification, add those exact records from the Render custom-domain UI.

## API

| Endpoint | Description |
|---|---|
| `GET /api/health` | Liveness |
| `GET /api/cities` | City list + default |
| `GET /api/dry-spots?city=` | Suburb statuses from Open-Meteo (cached ~5 min) |
| `GET /api/radar-frame` | Latest RainViewer tile URL template (cached ~5 min; optional UI overlay) |

## Data honesty

- Suburb markers are **point samples**, not street-level radar.
- Optional **Radar** overlay is the latest RainViewer frame for visual context; markers remain the dry/wet signal.
- “Dry” means the model/codes show no precip at that point — not a promise of sun.
- See in-app **Credits** for Open-Meteo, RainViewer, and OpenStreetMap attribution.

## Design decisions

See [DECISIONS.md](./DECISIONS.md).
