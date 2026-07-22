# walkies.quest

Personal Christchurch rain map: see which sampled suburbs look **dry** vs **raining** right now, with an optional RainViewer radar overlay.

Built for Catalyst interview prep — **Python Flask API** + **React / Tailwind / Leaflet**.

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

## API

| Endpoint | Description |
|---|---|
| `GET /api/health` | Liveness |
| `GET /api/dry-spots` | Suburb statuses from Open-Meteo (cached ~5 min) |
| `GET /api/radar-frame` | Latest RainViewer tile URL template (cached ~5 min) |

## Data honesty

- Suburb markers are **point samples**, not street-level radar.
- “Dry” means the model/codes show no precip at that point — not a promise of sun.
- See in-app **Credits** for Open-Meteo, RainViewer, and OpenStreetMap attribution.

## Domain

`walkies.quest` can stay on Vercel DNS and CNAME to a Render (or similar) Flask service when you deploy.

## Design decisions

See [DECISIONS.md](./DECISIONS.md).
