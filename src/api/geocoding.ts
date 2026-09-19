import type { City } from "../types/City.ts";
import type { GeocodingResponse } from "../types/Weather.ts";
import { GEOCODING_URL } from "../utils/constants.ts";

export async function geocodeCity(name: string): Promise<City | null> {
  const params = new URLSearchParams({
    name,
    count: "1",
    language: "es",
    format: "json",
  });
  const res = await fetch(`${GEOCODING_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`La API de geocoding respondió con código ${res.status}`);
  }
  const data = (await res.json()) as GeocodingResponse;
  const first = data.results?.[0];
  if (!first) return null;
  return {
    id: first.id,
    name: first.name,
    latitude: first.latitude,
    longitude: first.longitude,
    country: first.country,
    admin1: first.admin1,
  };
}
