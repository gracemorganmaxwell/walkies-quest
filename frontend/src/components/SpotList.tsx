import { PixelIcon } from "./PixelIcon";
import { iconForSpot } from "../icons";
import type { Spot } from "../types";

type SpotListProps = {
  spots: Spot[];
  dryOnly: boolean;
  selectedName: string;
  onSelect: (name: string) => void;
};

export function SpotList({ spots, dryOnly, selectedName, onSelect }: SpotListProps) {
  const visible = dryOnly ? spots.filter((s) => s.status === "dry") : spots;

  return (
    <ul className="spot-list m-0 flex list-none flex-col gap-0.5 p-0">
      {visible.map((spot) => {
        const selected = spot.name === selectedName;
        return (
          <li key={spot.name}>
            <button
              type="button"
              className={`spot-row${selected ? " spot-row--selected" : ""}`}
              data-suburb={spot.name}
              title={`${spot.name}: ${spot.status} · ${spot.label}`}
              aria-pressed={selected}
              onClick={() => {
                onSelect(spot.name);
              }}
            >
              <PixelIcon src={iconForSpot(spot)} alt="" size={16} />
              <span className="spot-row__name">{spot.name}</span>
            </button>
          </li>
        );
      })}
      {visible.length === 0 && (
        <li className="px-2 py-4 text-center text-[0.75rem] text-[#404040]">
          No dry suburbs in this snapshot.
        </li>
      )}
    </ul>
  );
}
