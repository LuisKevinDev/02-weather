export type Unit = "celsius" | "fahrenheit";

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface ForecastResponse {
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
