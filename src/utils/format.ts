import type { City } from "../types/City.ts";
import type { Unit } from "../types/Weather.ts";

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function cityLabel(city: City): string {
  return [city.name, city.admin1, city.country]
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .join(", ");
}

const weekdayFormat = new Intl.DateTimeFormat("es", { weekday: "long" });
const dateFormat = new Intl.DateTimeFormat("es", { day: "2-digit", month: "2-digit" });

export function formatWeekday(date: string): string | null {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${weekdayFormat.format(parsed)} ${dateFormat.format(parsed)}`;
}

const WEATHER_CODES: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna",
  55: "Llovizna intensa",
  56: "Llovizna helada",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia",
  65: "Lluvia intensa",
  66: "Lluvia helada",
  67: "Lluvia helada intensa",
  71: "Nieve ligera",
  73: "Nieve",
  75: "Nieve intensa",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos",
  82: "Chubascos intensos",
  85: "Chubascos de nieve",
  86: "Chubascos de nieve intensos",
  95: "Tormenta",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo intensa",
};

export function weatherCodeLabel(code: number): string {
  return WEATHER_CODES[code] ?? "Desconocido";
}
