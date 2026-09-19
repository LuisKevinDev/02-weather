import type { DailyForecast, ForecastResponse, Unit } from "../types/Weather.ts";
import { FORECAST_URL } from "../utils/constants.ts";

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
