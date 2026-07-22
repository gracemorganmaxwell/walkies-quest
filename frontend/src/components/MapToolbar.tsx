type MapToolbarProps = {
  cityName: string;
  onChangeCity: () => undefined;
  onOpenCredits: () => undefined;
};

export function MapToolbar({ cityName, onChangeCity, onOpenCredits }: MapToolbarProps) {
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
      <button type="button" className="map-toolbar__btn" title="Credits" onClick={onOpenCredits}>
        Credits
      </button>
    </div>
  );
}
