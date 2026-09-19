import { getForecast } from "../api/weather.ts";
import { printForecast } from "../presentation/output.ts";
import { chooseCity } from "../presentation/input.ts";
import { getCities } from "../storage/citiesStorage.ts";
import type { MenuContext } from "../types/MenuOption.ts";
import { red } from "../utils/colors.ts";

export async function getForecastAction({ prompt, config }: MenuContext): Promise<void> {
  const cities = getCities(config);
  if (cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Agrega una con la opción 3."));
    return;
  }
  const index = await chooseCity(
    prompt,
    cities,
    config.defaultCityId,
    "  Número de la ciudad (Enter para cancelar): "
  );
  if (index === null) {
    console.log("  Cancelado.");
    return;
  }
  const city = cities[index];
  if (!city) return;
  const forecast = await getForecast(city.latitude, city.longitude, config.unit);
  printForecast(city, forecast, config.unit);
}
