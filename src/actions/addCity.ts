import { geocodeCity } from "../api/geocoding.ts";
import { addCity, isCitySaved } from "../storage/citiesStorage.ts";
import { getDefaultCityId, setDefaultCityId } from "../storage/settingsStorage.ts";
import type { MenuContext } from "../types/MenuOption.ts";
import { cityLabel } from "../utils/format.ts";
import { green, red } from "../utils/colors.ts";

export async function addCityAction({ prompt, config }: MenuContext): Promise<void> {
  const name = await prompt.ask("  Nombre de la ciudad: ");
  if (name === null || name.length === 0) {
    console.log("  Cancelado.");
    return;
  }
  const city = await geocodeCity(name);
  if (!city) {
    console.log(red("  Ciudad no encontrada."));
    return;
  }
  if (isCitySaved(config, city)) {
    console.log(red(`  ${cityLabel(city)} ya está guardada.`));
    return;
  }
  let note = "";
  if (getDefaultCityId(config) === null) {
    setDefaultCityId(config, city.id);
    note = " (establecida como default)";
  }
  addCity(config, city);
  console.log(green(`  Ciudad agregada: ${cityLabel(city)}${note}`));
}
