import { printCityList } from "../presentation/output.ts";
import { getCities } from "../storage/citiesStorage.ts";
import type { MenuContext } from "../types/MenuOption.ts";
import { red } from "../utils/colors.ts";

export function listCitiesAction({ config }: MenuContext): void {
  const cities = getCities(config);
  if (cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Agrega una con la opción 3."));
    return;
  }
  printCityList(cities, config.defaultCityId);
}
