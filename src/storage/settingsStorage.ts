import type { Config } from "../types/Settings.ts";
import type { Unit } from "../types/Weather.ts";
import { saveConfig } from "./config.ts";

export function getUnit(config: Config): Unit {
  return config.unit;
}

export function setUnit(config: Config, unit: Unit): void {
  config.unit = unit;
  saveConfig(config);
}

export function getDefaultCityId(config: Config): number | null {
  return config.defaultCityId;
}

export function setDefaultCityId(config: Config, id: number | null): void {
  config.defaultCityId = id;
  saveConfig(config);
}
