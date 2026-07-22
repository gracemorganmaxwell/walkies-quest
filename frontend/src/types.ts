export type RainStatus = "dry" | "raining" | "unknown";

export type Spot = {
  name: string;
  lat: number;
  lon: number;
  status: RainStatus;
  label: string;
  precipitation_mm: number;
  weather_code: number;
};

export type CitySummary = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  zoom: number;
};

export type CitiesResponse = {
  default_id: string;
  cities: CitySummary[];
};

export type DrySpotsResponse = {
  updated_at: string;
  source: string;
  city_id: string;
  city_name: string;
  center: { lat: number; lon: number };
  zoom: number;
  spots: Spot[];
};

export type ApiError = {
  error: string;
  detail?: string;
};

export type RadarFrameResponse = {
  updated_at: string;
  frame_time: number;
  host: string;
  path: string;
  tile_url_template: string;
  coverage_url_template: string;
  attribution: string;
};
