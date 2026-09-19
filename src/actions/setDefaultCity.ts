import { chooseCity } from "../presentation/input.ts";
import { getCities } from "../storage/citiesStorage.ts";
import { setDefaultCityId } from "../storage/settingsStorage.ts";
import type { MenuContext } from "../types/MenuOption.ts";
import { cityLabel } from "../utils/format.ts";
import { green, red } from "../utils/colors.ts";

export async function setDefaultCityAction({ prompt, config }: MenuContext): Promise<void> {
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
  setDefaultCityId(config, city.id);
  console.log(green(`  Ciudad default: ${cityLabel(city)}`));
}
