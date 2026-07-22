from cache import TtlCache
from weather import rain_status, weather_label


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
