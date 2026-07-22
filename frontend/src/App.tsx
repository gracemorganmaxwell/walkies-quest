import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
import { fetchCities, fetchDrySpots } from "./api";
import { CityPicker } from "./components/CityPicker";
import { CreditsWindow } from "./components/CreditsWindow";
import { MapLegend } from "./components/MapLegend";
import { MapToolbar } from "./components/MapToolbar";
import { RainMap } from "./components/RainMap";
import type { CitySummary, DrySpotsResponse } from "./types";

const FALLBACK_CITIES: CitySummary[] = [
  { id: "christchurch", name: "Christchurch", lat: -43.5321, lon: 172.6362, zoom: 11 },
  { id: "auckland", name: "Auckland", lat: -36.8509, lon: 174.7645, zoom: 11 },
  { id: "wellington", name: "Wellington", lat: -41.2865, lon: 174.7762, zoom: 12 },
  { id: "dunedin", name: "Dunedin", lat: -45.8788, lon: 170.5028, zoom: 12 },
];

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString("en-NZ", {
    timeZone: "Pacific/Auckland",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function titleStatus(dryCount: number, wetCount: number, updatedAt: string | undefined): string {
  const timePart = updatedAt ? ` · updated ${formatTime(updatedAt)}` : "";
  if (wetCount === 0 && dryCount > 0) {
    return `all dry${timePart}`;
  }
  if (dryCount === 0 && wetCount > 0) {
    return `all wet${timePart}`;
  }
  return `${dryCount} dry · ${wetCount} wet${timePart}`;
}

export default function App() {
  const [cities, setCities] = useState<CitySummary[]>(FALLBACK_CITIES);
  const [cityId, setCityId] = useState("christchurch");
  const [data, setData] = useState<DrySpotsResponse | undefined>(undefined);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedName, setSelectedName] = useState<string>("");
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchCities()
      .then((response) => {
        if (cancelled || response.cities.length === 0) {
          return;
        }
        setCities(response.cities);
      })
      .catch(() => {
        // Keep fallback cities if endpoint fails
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCity = useMemo(() => {
    return cities.find((city) => city.id === cityId) ?? FALLBACK_CITIES[0];
  }, [cities, cityId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const startedAt = Date.now();
    try {
      const spots = await fetchDrySpots(cityId);
      setData(spots);
      setSelectedName("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, 450 - elapsed);
      if (remaining > 0) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, remaining);
        });
      }
      setLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    load();
  }, [load]);

  // Only show spots that belong to the selected city (avoids stale markers while loading)
  const spotsForCity = data?.city_id === cityId ? data.spots : [];
  const dryCount = spotsForCity.filter((s) => s.status === "dry").length;
  const wetCount = spotsForCity.filter((s) => s.status === "raining").length;
  const cityName = data?.city_id === cityId ? data.city_name : activeCity.name;
  const statusUpdatedAt = data?.city_id === cityId ? data.updated_at : undefined;

  return (
    <div className="walkies-shell">
      <div className="walkies-wallpaper" aria-hidden />
      <div className="walkies-crt" aria-hidden />

      <div className="walkies-stage">
        <div className="win95-raised walkies-window">
          <div className="win95-titlebar">
            <span className="flex min-w-0 items-center gap-1.5 truncate">
              <span>walkies.quest</span>
              <span className="titlebar-meta">{cityName}</span>
              {statusUpdatedAt && (
                <span className="titlebar-meta">
                  {titleStatus(dryCount, wetCount, statusUpdatedAt)}
                </span>
              )}
            </span>
            <div className="win95-titlebar__controls" aria-hidden>
              <span className="win95-titlebar__control">_</span>
              <span className="win95-titlebar__control">□</span>
              <span className="win95-titlebar__control">×</span>
            </div>
          </div>

          <div className="walkies-client walkies-client--map-only">
            <div className="walkies-map-pane">
              <div className="win95-inset walkies-map-inset">
                <MapContainer
                  key={cityId}
                  center={[activeCity.lat, activeCity.lon]}
                  zoom={activeCity.zoom}
                  className="h-full w-full walkies-leaflet"
                  scrollWheelZoom
                  attributionControl={false}
                  zoomControl={false}
                >
                  <ZoomControl position="bottomright" />
                  <RainMap
                    spots={spotsForCity}
                    selectedName={selectedName}
                    onSelect={setSelectedName}
                  />
                </MapContainer>

                <MapToolbar
                  cityName={cityName}
                  onChangeCity={() => {
                    setCityPickerOpen(true);
                    return undefined;
                  }}
                  onOpenCredits={() => {
                    setCreditsOpen(true);
                    return undefined;
                  }}
                />
                <MapLegend />

                <p className="map-question">Where should I quest with my dogs today?</p>

                {loading && (
                  <div className="map-loading" role="status" aria-live="polite">
                    <div className="map-loading__panel win95-raised">
                      <span className="map-loading__pulse" aria-hidden />
                      <span>Updating weather…</span>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="map-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {cityPickerOpen && (
        <CityPicker
          cities={cities}
          selectedId={cityId}
          onSelect={(nextId) => {
            setCityId(nextId);
            setData(undefined);
            setSelectedName("");
            setCityPickerOpen(false);
          }}
          onClose={() => {
            setCityPickerOpen(false);
          }}
        />
      )}

      {creditsOpen && (
        <CreditsWindow
          onClose={() => {
            setCreditsOpen(false);
          }}
        />
      )}
    </div>
  );
}
