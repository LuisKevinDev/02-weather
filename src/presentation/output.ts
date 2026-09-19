import type { City } from "../types/City.ts";
import type { DailyForecast, Unit } from "../types/Weather.ts";
import { cityLabel, formatWeekday, unitSymbol, weatherCodeLabel } from "../utils/format.ts";
import { yellow } from "../utils/colors.ts";

export function printCityList(cities: City[], defaultCityId: number | null): void {
  cities.forEach((city, index) => {
    const marker = city.id === defaultCityId ? " (default)" : "";
    console.log(`  ${index + 1}. ${cityLabel(city)}${marker}`);
  });
}

export function printForecast(city: City, forecast: DailyForecast[], unit: Unit): void {
  const symbol = unitSymbol(unit);
  console.log(`  ${cityLabel(city)} — próximos 7 días:`);
  forecast.forEach((day) => {
    const when = formatWeekday(day.date) ?? day.date;
    console.log(
      `  ${when}: ${yellow(`${day.tempMax}°`)} / ${day.tempMin}° ${symbol} — ${weatherCodeLabel(day.weatherCode)}`
    );
  });
}
