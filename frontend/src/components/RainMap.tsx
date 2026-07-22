import { CircleMarker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Spot } from "../types";

type RainMapProps = {
  spots: Spot[];
  selectedName: string;
  onSelect: (name: string) => undefined;
  radarTileUrl: string | undefined;
  showRadar: boolean;
};

function statusColor(status: Spot["status"]): string {
  if (status === "dry") {
    return "#f4d35e";
  }
  if (status === "raining") {
    return "#38bdf8";
  }
  return "#a8a29e";
}

function FlyToSelected({ spots, selectedName }: { spots: Spot[]; selectedName: string }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedName) {
      return;
    }
    const spot = spots.find((s) => s.name === selectedName);
    if (!spot) {
      return;
    }
    map.flyTo([spot.lat, spot.lon], Math.max(map.getZoom(), 12), { duration: 0.6 });
  }, [map, spots, selectedName]);

  return <></>;
}

export function RainMap({ spots, selectedName, onSelect, radarTileUrl, showRadar }: RainMapProps) {
  return (
    <>
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {showRadar && radarTileUrl && (
        <TileLayer
          attribution="Radar © RainViewer"
          url={radarTileUrl}
          opacity={0.65}
          zIndex={200}
        />
      )}
      <FlyToSelected spots={spots} selectedName={selectedName} />
      {spots.map((spot) => {
        const selected = spot.name === selectedName;
        return (
          <CircleMarker
            key={spot.name}
            center={[spot.lat, spot.lon]}
            radius={selected ? 14 : 9}
            pathOptions={{
              color: selected ? "#6d4bc3" : "#404040",
              weight: selected ? 3 : 1,
              fillColor: statusColor(spot.status),
              fillOpacity: 0.92,
            }}
            eventHandlers={{
              click: () => {
                onSelect(spot.name);
              },
            }}
          >
            <Tooltip
              permanent
              direction="top"
              offset={[0, -10]}
              className={`suburb-label suburb-label--${spot.status}${selected ? " suburb-label--selected" : ""}`}
            >
              {spot.name}
            </Tooltip>
            <Popup>
              <strong>{spot.name}</strong>
              <br />
              {spot.status} · {spot.label}
              <br />
              precip {spot.precipitation_mm} mm
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
