"""Weather helpers: Open-Meteo suburb dry/rain status."""

from __future__ import annotations

from datetime import datetime, timezone

import requests

from cities import get_city

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
REQUEST_TIMEOUT = 8

# WMO weather interpretation codes that imply precipitation
RAIN_CODES = {
    51,
    53,
    55,
    56,
    57,
    61,
    63,
    65,
    66,
    67,
    71,
    73,
    75,
    77,
    80,
    81,
    82,
    85,
    86,
    95,
    96,
    99,
}


def rain_status(weather_code: int | None, precipitation: float | None, rain: float | None) -> str:
    """Return dry, raining, or unknown."""
    if weather_code is None and precipitation is None and rain is None:
        return "unknown"
    if weather_code is not None and weather_code in RAIN_CODES:
        return "raining"
    precip = precipitation if precipitation is not None else 0.0
    rain_mm = rain if rain is not None else 0.0
    if precip > 0 or rain_mm > 0:
        return "raining"
    if weather_code is not None:
        return "dry"
    return "unknown"


def weather_label(weather_code: int | None) -> str:
    if weather_code is None:
        return "Unknown"
    if weather_code == 0:
        return "Clear"
    if weather_code in {1, 2, 3}:
        return "Clouds"
    if weather_code in {45, 48}:
        return "Fog"
    if weather_code in RAIN_CODES:
        return "Precipitation"
    return f"Code {weather_code}"


def fetch_dry_spots(city_id: str | None = None) -> dict:
    city = get_city(city_id)
    spots_def = city["spots"]
    latitudes = ",".join(str(s["lat"]) for s in spots_def)
    longitudes = ",".join(str(s["lon"]) for s in spots_def)
    params = {
        "latitude": latitudes,
        "longitude": longitudes,
        "current": "precipitation,rain,weather_code",
        "timezone": "Pacific/Auckland",
    }
    response = requests.get(OPEN_METEO_URL, params=params, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    payload = response.json()

    # Multi-location responses are lists aligned with request order
    if isinstance(payload, list):
        locations = payload
    else:
        locations = [payload]

    spots = []
    for suburb, location in zip(spots_def, locations):
        current = location.get("current") or {}
        code = current.get("weather_code")
        precipitation = current.get("precipitation")
        rain = current.get("rain")
        code_int = code if isinstance(code, int) else None
        precip_f = precipitation if isinstance(precipitation, (int, float)) else None
        rain_f = rain if isinstance(rain, (int, float)) else None
        spots.append(
            {
                "name": suburb["name"],
                "lat": suburb["lat"],
                "lon": suburb["lon"],
                "status": rain_status(code_int, precip_f, rain_f),
                "label": weather_label(code_int),
                "precipitation_mm": precip_f if precip_f is not None else 0.0,
                "weather_code": code_int if code_int is not None else -1,
            }
        )

    return {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "source": "Open-Meteo (CC BY 4.0)",
        "city_id": city["id"],
        "city_name": city["name"],
        "center": {"lat": city["lat"], "lon": city["lon"]},
        "zoom": city["zoom"],
        "spots": spots,
    }
