type MapToolbarProps = {
  cityName: string;
  radarOn: boolean;
  radarAvailable: boolean;
  onChangeCity: () => undefined;
  onToggleRadar: () => undefined;
  onOpenCredits: () => undefined;
};

export function MapToolbar({
  cityName,
  radarOn,
  radarAvailable,
  onChangeCity,
  onToggleRadar,
  onOpenCredits,
}: MapToolbarProps) {
  return (
    <div className="map-toolbar win95-raised" role="toolbar" aria-label="Map controls">
      <button
        type="button"
        className="map-toolbar__btn"
        title={`Change city (currently ${cityName})`}
        onClick={onChangeCity}
      >
        Change city
      </button>
      <button
        type="button"
        className={`map-toolbar__btn${radarOn ? " map-toolbar__btn--active" : ""}`}
        title={
          radarAvailable
            ? radarOn
              ? "Hide RainViewer radar overlay"
              : "Show RainViewer radar overlay"
            : "Radar unavailable"
        }
        aria-pressed={radarOn}
        disabled={!radarAvailable}
        onClick={onToggleRadar}
      >
        Radar
      </button>
      <button type="button" className="map-toolbar__btn" title="Credits" onClick={onOpenCredits}>
        Credits
      </button>
    </div>
  );
}
