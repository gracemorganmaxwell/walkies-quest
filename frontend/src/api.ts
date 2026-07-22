import type { ApiError, CitiesResponse, DrySpotsResponse } from "./types";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as ApiError;
      if (body.error) {
        message = body.detail ? `${body.error}: ${body.detail}` : body.error;
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export async function fetchCities(): Promise<CitiesResponse> {
  const response = await fetch("/api/cities");
  return readJson<CitiesResponse>(response);
}

export async function fetchDrySpots(cityId: string): Promise<DrySpotsResponse> {
  const params = new URLSearchParams({ city: cityId });
  const response = await fetch(`/api/dry-spots?${params.toString()}`);
  return readJson<DrySpotsResponse>(response);
}
