export type Unit = "celsius" | "fahrenheit";

export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface Config {
  cities: City[];
  defaultCityId: number | null;
  unit: Unit;
}
