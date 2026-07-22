"""Flask API for walkies.quest — city dry spots + optional radar frame."""

from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from cache import TtlCache
from cities import DEFAULT_CITY_ID, get_city, list_cities
from weather import fetch_dry_spots, fetch_radar_frame

CACHE_TTL_SECONDS = 5 * 60
dry_spots_cache = TtlCache(CACHE_TTL_SECONDS)
radar_cache = TtlCache(CACHE_TTL_SECONDS)

ROOT = Path(__file__).resolve().parent
FRONTEND_DIST = ROOT.parent / "frontend" / "dist"

app = Flask(__name__, static_folder=None)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "walkies-quest"})


@app.get("/api/cities")
def cities():
    return jsonify({"default_id": DEFAULT_CITY_ID, "cities": list_cities()})


@app.get("/api/dry-spots")
def dry_spots():
    city_id = request.args.get("city") or DEFAULT_CITY_ID
    city = get_city(city_id)
    cache_key = f"dry-spots:{city['id']}"
    cached = dry_spots_cache.get(cache_key)
    if cached is not None:
        return jsonify(cached)
    try:
        payload = fetch_dry_spots(city["id"])
    except Exception as exc:  # noqa: BLE001 — surface upstream errors to the client
        return jsonify({"error": "Failed to fetch weather", "detail": str(exc)}), 502
    dry_spots_cache.set(cache_key, payload)
    return jsonify(payload)


@app.get("/api/radar-frame")
def radar_frame():
    cached = radar_cache.get("radar-frame")
    if cached is not None:
        return jsonify(cached)
    try:
        payload = fetch_radar_frame()
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": "Failed to fetch radar", "detail": str(exc)}), 502
    radar_cache.set("radar-frame", payload)
    return jsonify(payload)


@app.get("/")
def index():
    if FRONTEND_DIST.exists():
        return send_from_directory(FRONTEND_DIST, "index.html")
    return jsonify(
        {
            "message": "walkies.quest API is running. Start the Vite frontend in development, or build frontend/dist for production.",
            "endpoints": ["/api/health", "/api/cities", "/api/dry-spots", "/api/radar-frame"],
        }
    )


@app.get("/<path:path>")
def spa_assets(path: str):
    if not FRONTEND_DIST.exists():
        return jsonify({"error": "Frontend not built"}), 404
    target = FRONTEND_DIST / path
    if target.is_file():
        return send_from_directory(FRONTEND_DIST, path)
    return send_from_directory(FRONTEND_DIST, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)
