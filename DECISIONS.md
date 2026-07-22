# Design decisions — walkies.quest

## 2026-07-21 — Flask API + React/Tailwind SPA

- **Context:** Personal Christchurch rain map for Catalyst interview prep (Python → frontend → project → exercise). Domain `walkies.quest` on Vercel DNS.
- **Options:** (1) Jinja + vanilla JS (2) Flask API + React/Tailwind SPA (3) JS-only on Vercel (4) Django for the whole app
- **Chosen:** (2) Flask JSON API + Vite React + Tailwind + react-leaflet; prod Flask serves `frontend/dist`
- **Rationale:** Python owns weather fetch/cache/classify (interview depth); React/Tailwind gives a modern frontend story; one repo / one deploy
- **Trade-offs:** More setup than Jinja; Vite proxy in dev; cold starts on free PaaS hosts

## 2026-07-21 — Open-Meteo + RainViewer (not Google/OpenWeather)

- **Context:** Show rain vs not-known-rain across Christchurch without paid keys
- **Options:** OpenWeather, Google Maps, MetService commercial, Open-Meteo, RainViewer
- **Chosen:** Open-Meteo current precip/weather_code for suburb points; RainViewer public radar tiles for overlay; Leaflet + OSM basemap
- **Rationale:** FOSS / no-key / personal-use friendly; Canterbury radar exists on RainViewer; strong Catalyst open-source talking point
- **Trade-offs:** Point sampling ≠ radar resolution; RainViewer personal-use ToS + attribution; Open-Meteo attribution (CC BY 4.0)

## 2026-07-21 — Hosting: Render + Vercel DNS

- **Context:** Need HTTPS URL and custom domain; Vercel is domain registrar only
- **Options:** Vercel-only (poor Python), Render, Railway, Fly, local-only
- **Chosen:** Local-first for interview reliability; optional Render free web service; Vercel DNS CNAME to host
- **Rationale:** Real Python process; Vercel has no special pairing with PaaS beyond DNS
- **Trade-offs:** Render free ~60s cold start after idle

## 2026-07-22 — Ship on Render via Blueprint; Vercel DNS only

- **Context:** Need a durable public HTTPS URL + `walkies.quest`; Flask/gunicorn cannot run on Vercel as-is
- **Options:** (1) Vercel serverless rewrite (2) Render Web Service for API+SPA; Vercel holds DNS and CNAMEs to Render (3) Railway/Fly
- **Chosen:** (2) `render.yaml` free Python web service builds `frontend/dist`, installs `backend` deps, starts gunicorn on `$PORT`; custom domain via Vercel DNS → Render
- **Rationale:** Matches existing hosting decision; one process serves `/api` and SPA; Blueprint keeps build/start reproducible
- **Trade-offs:** Free tier cold starts (~60s); Blueprint create/sync still needs a Render account action once

## 2026-07-22 — walkies.quest DNS: Vercel ALIAS → Render

- **Context:** Domain registered on Vercel returned `DEPLOYMENT_NOT_FOUND`; app lives on `walkies-quest.onrender.com`
- **Options:** (1) keep Vercel edge ALIAS (2) apex ALIAS + www CNAME to `walkies-quest.onrender.com`; add `domains` in Blueprint; Render issues TLS
- **Chosen:** (2) Vercel DNS records point at Render; `render.yaml` lists `domains: [walkies.quest]` (www auto-added by Render)
- **Rationale:** Vercel stays registrar/DNS only; HTTPS certs and routing belong on the process host
- **Trade-offs:** Must add/verify the custom domain once in Render Dashboard (or Blueprint sync); remove default Vercel edge ALIAS or traffic stays on Vercel

## 2026-07-21 — UI chrome inspired by custardsquare.exe / custardsq.app

- **Context:** Personal walkies.quest UI needed a stronger visual identity for demo + interview
- **Options:** (1) keep dark slate utility UI (2) adopt custardsquare Win95 + dream vaporwave tokens (3) invent a separate brand
- **Chosen:** (2) Win95 raised/inset bevels, purple titlebars, Tahoma, dream wallpaper + light CRT overlay — adapted for a map + sidebar app (not a full desktop OS shell)
- **Rationale:** Matches your existing public brand language; memorable in interview; still readable on phone
## 2026-07-21 — Map-centred layout

- **Context:** Sidebar was dominating; needed clearer hierarchy
- **Options:** (1) left-heavy controls (2) map as primary window with slim suburb strip (3) full desktop-icon shell
- **Chosen:** (2) Map first/largest; ~15.5rem suburb panel
- **Rationale:** Map is the decision surface; list is supporting detail
- **Trade-offs:** Slim list truncates long names (`title` tooltip has full text)

## 2026-07-21 — Icons from existing repos only

- **Context:** Prefer assets already in the Win95 / learning-journey / custardsquare lineage over new SVGs
- **Options:** (1) custom SVGs (2) custardsquare pack only (3) learning-journey-core weather set + custardsquare pack chrome icons
- **Chosen:** (3) `weather_app.png` + `weather/*.png` from learning-journey-core; `world`, `clock`, `search`, `games`, `tools` from custardsquare-exe pack
- **Rationale:** Same pixel language as custardsq.app / prior OS portfolio; no invented icons
- **Trade-offs:** No dedicated dog/paw glyph in those packs — weather_app stands in for the walkies window

## 2026-07-21 — Map-first single window redesign

- **Context:** Two Win95 frames wasted chrome; filters lived far from the map; status chips duplicated icons
- **Options:** (1) keep dual windows (2) single window, map canvas + overlay toolbar/legend + slim suburb strip with selection sync
- **Chosen:** (2) One `walkies-window`; MapToolbar / MapLegend overlays; suburb list selects markers (`flyTo` + purple ring); titlebar carries live counts
- **Rationale:** Map is the decision surface; controls sit on the map; list is a compact index
- **Trade-offs:** Overlay question caption can crowd small phones (shifted toward bottom on narrow screens)

## 2026-07-21 — In-memory cache (5–10 min)

- **Context:** Avoid hammering Open-Meteo on every page refresh
- **Options:** No cache, Redis, in-memory dict with TTL
- **Chosen:** In-memory TTL cache on the Flask process
- **Rationale:** Enough for personal use and interview explanation; zero infra
- **Trade-offs:** Cache lost on process restart / multi-instance inconsistency (fine for hobby)

## 2026-07-22 — Pencil design file mirrors live UI tokens/assets

- **Context:** Explore better UI layouts in Pencil without inventing a new visual language
- **Options:** (1) freeform Pencil mock with placeholder glyphs (2) rebuild `.pen` from established CSS tokens + custardsquare/learning-journey icons
- **Chosen:** (2) `walkies-quest.pen` + `design-assets/icons/` copies of `frontend/public/icons`; tokens recorded as Pencil variables (`dream-*`, `win95-*`, marker colors); screen matches map-first single window (titlebar status, overlay toolbar with refresh/clear/rain/notepad, soft caption, dry/wet legend, bottom-right zoom, suburb pins with weather icons + selection ring)
- **Rationale:** Pencil explorations should start from the brand we already shipped in React, then propose layout improvements
- **Trade-offs:** Pencil has no Tahoma — UI font variable uses Noto Sans; soft CRT is omitted on the canvas for readability (still in CSS); wallpaper must be a sibling rectangle (not parent fill) or nested chrome fails to paint in the Pencil renderer

## 2026-07-22 — Toolbar text labels; banner stays top-centre

- **Context:** Icon-only toolbar was harder to read at a glance during demos
- **Options:** (1) keep pixel icons (2) text labels on Win95 buttons, toolbar top-left, quest banner top-centre
- **Chosen:** (2) Refresh / Dry only / Radar / Credits text buttons; caption remains centred at top
- **Rationale:** Clearer affordances for interview walkthrough; icons remain in legend/markers where status is visual
- **Trade-offs:** Toolbar takes more horizontal space; wraps on narrow widths; mobile caption drops below toolbar

## 2026-07-22 — Multi-city + vertical left toolbar

- **Context:** Demo should not be locked to Christchurch; toolbar clutter (radar / dry-only) fought the map
- **Options:** (1) Christchurch-only (2) NZ city registry with Change city dialog; vertical text buttons left; drop radar toggle and dry-only filter
- **Chosen:** (2) Cities: Christchurch, Auckland, Wellington, Dunedin via `/api/cities` + `/api/dry-spots?city=`; toolbar = Refresh / Change city / Credits stacked left; radar overlay removed from UI
- **Rationale:** Clearer primary actions; city switch is interview-friendly without adding filter modes
- **Trade-offs:** Suburb lists are curated samples per city; radar API later removed as dead code (see 2026-07-22 entry)

## 2026-07-22 — Toolbar is Change city / Credits only

- **Context:** Manual Refresh duplicated initial load and city-switch fetches; toolbar should stay minimal for demos
- **Options:** (1) keep Refresh (2) drop Refresh; weather loads on visit + city change; keep ~5 min server cache
- **Chosen:** (2) MapToolbar = Change city / Credits only; loading overlay remains for fetch feedback
- **Rationale:** Fewer chrome controls; cache already covers reload/city-switch rate limiting for Open-Meteo
- **Trade-offs:** No one-click force re-fetch without changing city or waiting for cache TTL / process restart

## 2026-07-22 — Remove unused RainViewer radar API

- **Context:** Radar overlay was dropped from the UI (multi-city toolbar), but `GET /api/radar-frame` + RainViewer fetch/cache remained unused
- **Options:** (1) keep endpoint for future UI (2) remove dead path and document restore as stretch
- **Chosen:** (2) Delete `/api/radar-frame`, `fetch_radar_frame`, and radar TTL cache; Open-Meteo suburb points remain the weather source
- **Rationale:** Prefer no unused API surface; README/Credits already omit RainViewer; restore tracked as stretch (#10)
- **Trade-offs:** Re-adding radar needs API + UI together; historical DECISIONS still mention RainViewer as the original overlay choice

## 2026-07-22 — Remove dryOnly / unused SpotList

- **Context:** Dry-only filter left the toolbar earlier; `SpotList` with a `dryOnly` prop remained unreferenced after the map-only layout
- **Options:** (1) keep SpotList for a future sidebar (2) delete dead component + CSS
- **Chosen:** (2) Remove `SpotList.tsx` and `.spot-row*` styles; markers remain the suburb UI
- **Rationale:** No callers; dead props invite drift
- **Trade-offs:** Reintroducing a suburb strip needs a new component

## 2026-07-22 — Keep Render; decline Vercel serverless rewrite (#9)

- **Context:** Issue #9 proposed rewriting the API for Vercel serverless so `walkies.quest` could run entirely on Vercel instead of Flask on Render + Vercel DNS
- **Options:** (1) migrate to Vercel serverless (JS/TS + shared cache) (2) keep Render Web Service + Vercel DNS (3) split static Vercel / API Render
- **Chosen:** (2) Stay on Render; Vercel remains DNS/registrar only; #9 closed without implementation
- **Rationale:** Hosting decisions already locked Flask + gunicorn on Render; in-memory TTL cache and Python interview story are a poor fit for Vercel serverless as-is; no need for a second platform rewrite
- **Trade-offs:** Free-tier cold starts and two vendors (Render host + Vercel DNS) remain accepted

## 2026-07-22 — Restore RainViewer radar as optional overlay (#10)

- **Context:** Radar API/UI were removed to declutter the multi-city toolbar; stretch #10 asks to bring the overlay back without crowding Change city / Credits
- **Options:** (1) always-on radar (2) off-by-default toolbar toggle + `/api/radar-frame` with TTL cache (3) leave Open-Meteo markers only
- **Chosen:** (2) Restore `GET /api/radar-frame` + `fetch_radar_frame`; Leaflet `TileLayer` when **Radar** is pressed; default off; Credits + on-map attribution when visible
- **Rationale:** Latest RainViewer frame is visual context for NZ cities; suburb Open-Meteo markers stay the walk decision signal; separate fetch so RainViewer downtime cannot break dry-spots
- **Trade-offs:** One extra toolbar button; latest frame only (no animation); personal/educational RainViewer ToS + attribution required

## 2026-07-22 — Decline Open-Meteo weather-map-layer embed (#11)

- **Context:** Stretch #11 explored [open-meteo/weather-map-layer](https://github.com/open-meteo/weather-map-layer) (GPL-2.0) as precip overlay alternative/complement to RainViewer
- **Spike:** Package is MapLibre/`om://` protocol-first; ships Leaflet/OpenLayers adapters, but still depends on `@openmeteo/weather-map-layer`. Tiles are `.om` files on `map-tiles.open-meteo.com` (e.g. `dwd_icon` + `precipitation`), not plain PNG URLs — without that protocol handler we cannot render the layer on our Leaflet stack. Demo: [maps.open-meteo.com](https://maps.open-meteo.com/). Package still marked pre-production.
- **License:** GPL-2.0. Bundling/adapting the library would push walkies.quest toward GPL-2.0; the app currently has no GPL license and we are not choosing to relicense.
- **Product:** Model precip fields ≠ live NZ MetService radar composite; RainViewer (#10) better matches “where is rain now”; Open-Meteo suburb points remain source of truth for dry/wet.
- **Options:** (1) adopt MapLibre + weather-map-layer under GPL-2.0 (2) keep Leaflet + RainViewer overlay; document spike and decline embed (3) reimplement OMfile decode ourselves (large, out of scope)
- **Chosen:** (2) Do not ship weather-map-layer; RainViewer optional radar is the precip visualization; revisit only with an explicit GPL-2.0 relicensing decision
- **Trade-offs:** No Open-Meteo model-field heatmap; NZ “live radar” story stays RainViewer-dependent; spike closes #11 without a second overlay stack
