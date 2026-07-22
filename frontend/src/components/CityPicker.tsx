import type { CitySummary } from "../types";

type CityPickerProps = {
  cities: CitySummary[];
  selectedId: string;
  onSelect: (cityId: string) => void;
  onClose: () => void;
};

export function CityPicker({ cities, selectedId, onSelect, onClose }: CityPickerProps) {
  return (
    <div className="credits-backdrop" role="presentation" onClick={onClose}>
      <div
        className="win95-raised credits-window"
        role="dialog"
        aria-labelledby="city-picker-title"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="win95-titlebar">
          <span id="city-picker-title" className="flex min-w-0 items-center gap-1.5 truncate">
            <span>Change city</span>
          </span>
          <div className="win95-titlebar__controls">
            <button
              type="button"
              className="win95-titlebar__control"
              aria-label="Close city picker"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>
        <div className="credits-body win95-inset">
          <p>Pick a city for the suburb dry/wet map.</p>
          <div className="city-picker-list" role="listbox" aria-label="Cities">
            {cities.map((city) => {
              const selected = city.id === selectedId;
              return (
                <button
                  key={city.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`city-picker-item${selected ? " city-picker-item--active" : ""}`}
                  onClick={() => {
                    onSelect(city.id);
                  }}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="credits-actions">
          <button type="button" className="win95-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
