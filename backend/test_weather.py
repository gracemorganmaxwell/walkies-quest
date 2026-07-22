from cache import TtlCache
from weather import fetch_radar_frame, rain_status, weather_label


def test_rain_status_clear():
    assert rain_status(0, 0.0, 0.0) == "dry"


def test_rain_status_code():
    assert rain_status(61, 0.0, 0.0) == "raining"


def test_rain_status_precip():
    assert rain_status(3, 0.4, 0.0) == "raining"


def test_rain_status_unknown():
    assert rain_status(None, None, None) == "unknown"


def test_weather_label():
    assert weather_label(0) == "Clear"
    assert weather_label(61) == "Precipitation"


def test_ttl_cache_expires(monkeypatch):
    cache = TtlCache(ttl_seconds=10)
    now = {"t": 100.0}
    monkeypatch.setattr("cache.time.monotonic", lambda: now["t"])
    cache.set("k", {"ok": True})
    assert cache.get("k") == {"ok": True}
    now["t"] = 120.0
    assert cache.get("k") is None


def test_fetch_radar_frame(monkeypatch):
    class FakeResponse:
        def raise_for_status(self):
            return None

        def json(self):
            return {
                "host": "https://tilecache.rainviewer.com",
                "radar": {
                    "past": [{"time": 100, "path": "/v2/radar/abc"}],
                    "nowcast": [{"time": 200, "path": "/v2/radar/def"}],
                },
            }

    monkeypatch.setattr("weather.requests.get", lambda *args, **kwargs: FakeResponse())
    payload = fetch_radar_frame()
    assert payload["frame_time"] == 200
    assert payload["path"] == "/v2/radar/def"
    assert "{z}" in payload["tile_url_template"]
    assert payload["attribution"] == "Radar © RainViewer"
