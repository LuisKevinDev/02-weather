import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { City, Config } from "./types.ts";

function configPath(): string {
  return process.env.WEATHER_CLI_CONFIG ?? join(homedir(), ".weather-cli.json");
}

export function defaultConfig(): Config {
  return { cities: [], defaultCityId: null, unit: "celsius" };
}

function isCity(value: unknown): value is City {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "number" &&
    typeof c.name === "string" &&
    typeof c.latitude === "number" &&
    typeof c.longitude === "number"
  );
}

export function loadConfig(): Config {
  const path = configPath();
  if (!existsSync(path)) return defaultConfig();
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<Config>;
    const cities = Array.isArray(raw.cities) ? raw.cities.filter(isCity) : [];
    return {
      cities,
      defaultCityId: typeof raw.defaultCityId === "number" ? raw.defaultCityId : null,
      unit: raw.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    return defaultConfig();
  }
}

export function saveConfig(config: Config): void {
  writeFileSync(configPath(), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}
