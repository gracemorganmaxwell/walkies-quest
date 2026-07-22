import type { RainStatus, Spot } from "./types";

/** Icons from learning-journey-core weather set + custardsquare pack. */
export const ICONS = {
  weatherApp: "/icons/weather_app.png",
  world: "/icons/world.png",
  clock: "/icons/clock.png",
  search: "/icons/search.png",
  tools: "/icons/tools.png",
  refresh: "/icons/refresh.png",
  notepad: "/icons/notepad.png",
  games: "/icons/games.png",
  clear: "/icons/weather/clear.png",
  clouds: "/icons/weather/clouds.png",
  fewClouds: "/icons/weather/few_clouds.png",
  mist: "/icons/weather/mist.png",
  rain: "/icons/weather/rain.png",
  snow: "/icons/weather/snow.png",
  thunder: "/icons/weather/thunder.png",
  unavailable: "/icons/weather/unavailable.png",
} as const;

export function iconForStatus(status: RainStatus): string {
  if (status === "dry") {
    return ICONS.clear;
  }
  if (status === "raining") {
    return ICONS.rain;
  }
  return ICONS.unavailable;
}

export function iconForSpot(spot: Spot): string {
  const label = spot.label.toLowerCase();
  if (spot.status === "raining" || label.includes("precip") || label.includes("rain")) {
    if (label.includes("thunder")) {
      return ICONS.thunder;
    }
    if (label.includes("snow")) {
      return ICONS.snow;
    }
    return ICONS.rain;
  }
  if (label.includes("fog") || label.includes("mist")) {
    return ICONS.mist;
  }
  if (label.includes("cloud")) {
    return ICONS.clouds;
  }
  if (label.includes("clear")) {
    return ICONS.clear;
  }
  if (spot.status === "unknown") {
    return ICONS.unavailable;
  }
  return ICONS.fewClouds;
}
