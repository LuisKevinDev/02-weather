import { getWeather } from "../api/weather.ts";
import type { MenuContext } from "../types/MenuOption.ts";
import { getDefaultCity, getCities } from "../storage/citiesStorage.ts";
import { red, yellow } from "../utils/colors.ts";
import { cityLabel, unitSymbol } from "../utils/format.ts";

export async function showDefaultWeather({ config }: MenuContext): Promise<void> {
  const city = getDefaultCity(config);
  if (!city) {
    console.log(red("  No hay ciudad default establecida. Usa la opción 5 para elegirla."));
    return;
  }
  const temp = await getWeather(city.latitude, city.longitude, config.unit);
  console.log(`  ${cityLabel(city)}: ${yellow(`${temp} ${unitSymbol(config.unit)}`)}`);
}

export async function showAllWeather({ config }: MenuContext): Promise<void> {
  const cities = getCities(config);
  if (cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Agrega una con la opción 3."));
    return;
  }
  const results = await Promise.allSettled(
    cities.map((city) => getWeather(city.latitude, city.longitude, config.unit))
  );
  results.forEach((result, index) => {
    const city = cities[index];
    if (!city) return;
    if (result.status === "fulfilled") {
      console.log(`  ${index + 1}. ${cityLabel(city)}: ${yellow(`${result.value} ${unitSymbol(config.unit)}`)}`);
    } else {
      console.log(red(`  ${index + 1}. ${cityLabel(city)}: no se pudo obtener el clima`));
    }
  });
}
