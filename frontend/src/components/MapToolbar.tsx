type MapToolbarProps = {
  loading: boolean;
  cityName: string;
  onRefresh: () => void;
  onChangeCity: () => void;
  onOpenCredits: () => void;
};

export function MapToolbar({
  loading,
  cityName,
  onRefresh,
  onChangeCity,
  onOpenCredits,
}: MapToolbarProps) {
  return (
    <div className="map-toolbar win95-raised" role="toolbar" aria-label="Map controls">
      <button
        type="button"
        className="map-toolbar__btn"
        title="Refresh weather"
        aria-busy={loading}
        disabled={loading}
        onClick={onRefresh}
      >
        {loading ? "Refreshing…" : "Refresh"}
      </button>
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
