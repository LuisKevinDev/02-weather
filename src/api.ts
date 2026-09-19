import type { City, DailyForecast, Unit } from "./types.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  current?: {
    temperature_2m?: number;
  };
  daily?: {
    time?: unknown[];
    temperature_2m_max?: unknown[];
    temperature_2m_min?: unknown[];
    weather_code?: unknown[];
  };
}

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

export async function getWeather(
  latitude: number,
  longitude: number,
  unit: Unit
): Promise<number> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m",
    temperature_unit: unit,
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`La API de clima respondió con código ${res.status}`);
  }
  const data = (await res.json()) as ForecastResponse;
  const temp = data.current?.temperature_2m;
  if (typeof temp !== "number") {
    throw new Error("La respuesta no incluye la temperatura");
  }
  return temp;
}

export async function getForecast(
  latitude: number,
  longitude: number,
  unit: Unit
): Promise<DailyForecast[]> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: "7",
    timezone: "auto",
    temperature_unit: unit,
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`La API de clima respondió con código ${res.status}`);
  }
  const data = (await res.json()) as ForecastResponse;
  const daily = data.daily;
  const times = daily?.time;
  const maxs = daily?.temperature_2m_max;
  const mins = daily?.temperature_2m_min;
  const codes = daily?.weather_code;
  if (
    !Array.isArray(times) ||
    !Array.isArray(maxs) ||
    !Array.isArray(mins) ||
    !Array.isArray(codes) ||
    times.length !== 7 ||
    maxs.length !== times.length ||
    mins.length !== times.length ||
    codes.length !== times.length
  ) {
    throw new Error("La respuesta no incluye el pronóstico diario");
  }
  const forecast: DailyForecast[] = [];
  for (let i = 0; i < times.length; i++) {
    const date = times[i];
    const max = maxs[i];
    const min = mins[i];
    const code = codes[i];
    if (
      typeof date !== "string" ||
      typeof max !== "number" ||
      typeof min !== "number" ||
      typeof code !== "number"
    ) {
      throw new Error("La respuesta no incluye el pronóstico diario");
    }
    forecast.push({ date, tempMax: max, tempMin: min, weatherCode: code });
  }
  return forecast;
}
