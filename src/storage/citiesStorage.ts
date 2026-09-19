import type { City } from "../types/City.ts";
import type { Config } from "../types/Settings.ts";
import { saveConfig } from "./config.ts";

export function getCities(config: Config): City[] {
  return config.cities;
}

export function getDefaultCity(config: Config): City | null {
  return config.cities.find((c) => c.id === config.defaultCityId) ?? null;
}

export function isCitySaved(config: Config, city: City): boolean {
  return config.cities.some((c) => c.id === city.id);
}

export function addCity(config: Config, city: City): void {
  config.cities.push(city);
  saveConfig(config);
}

export function removeCityAt(config: Config, index: number): City | null {
  const removed = config.cities[index];
  if (!removed) return null;
  config.cities.splice(index, 1);
  saveConfig(config);
  return removed;
}
