import { PixelIcon } from "./PixelIcon";
import { ICONS } from "../icons";

type CreditsWindowProps = {
  onClose: () => void;
};

export function CreditsWindow({ onClose }: CreditsWindowProps) {
  return (
    <div className="credits-backdrop" role="presentation" onClick={onClose}>
      <div
        className="win95-raised credits-window"
        role="dialog"
        aria-labelledby="credits-title"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="win95-titlebar">
          <span id="credits-title" className="flex min-w-0 items-center gap-1.5 truncate">
            <PixelIcon src={ICONS.notepad} alt="" size={16} />
            <span>Credits</span>
          </span>
          <div className="win95-titlebar__controls">
            <button
              type="button"
              className="win95-titlebar__control"
              aria-label="Close credits"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>
        <div className="credits-body win95-inset">
          <p>
            <strong>walkies.quest</strong> shows a suburb weather snapshot for a chosen NZ city so
            you can pick a drier place to walk the dogs.
          </p>
          <ul>
            <li>
              Weather data by{" "}
              <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
                Open-Meteo.com
              </a>{" "}
              (CC BY 4.0)
            </li>
            <li>
              Basemap ©{" "}
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
                OpenStreetMap
              </a>{" "}
              contributors
            </li>
          </ul>
          <p>
            Markers are sample points at suburb centres. “Dry” means no precipitation in the
            current model reading at that point — not a guarantee of sunshine street-by-street.
          </p>
        </div>
        <div className="credits-actions">
          <button type="button" className="win95-btn win95-btn--primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
