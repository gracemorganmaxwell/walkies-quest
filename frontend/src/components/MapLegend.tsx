export function MapLegend() {
  return (
    <div className="map-legend win95-inset" aria-label="Map legend">
      <div className="map-legend__row">
        <span className="map-legend__dot map-legend__dot--dry" />
        <span>Dry</span>
      </div>
      <div className="map-legend__row">
        <span className="map-legend__dot map-legend__dot--wet" />
        <span>Raining</span>
      </div>
    </div>
  );
}
