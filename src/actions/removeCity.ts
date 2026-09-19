import { chooseCity } from "../presentation/input.ts";
import { getCities, removeCityAt } from "../storage/citiesStorage.ts";
import { getDefaultCityId, setDefaultCityId } from "../storage/settingsStorage.ts";
import type { MenuContext } from "../types/MenuOption.ts";
import { cityLabel } from "../utils/format.ts";
import { green, red } from "../utils/colors.ts";

export async function removeCityAction({ prompt, config }: MenuContext): Promise<void> {
  const cities = getCities(config);
  if (cities.length === 0) {
    console.log(red("  No hay ciudades guardadas."));
    return;
  }
  const index = await chooseCity(
    prompt,
    cities,
    config.defaultCityId,
    "  Número de la ciudad a eliminar (Enter para cancelar): "
  );
  if (index === null) {
    console.log("  Cancelado.");
    return;
  }
  const removed = cities[index];
  if (!removed) return;
  removeCityAt(config, index);
  if (getDefaultCityId(config) === removed.id) {
    setDefaultCityId(config, null);
  }
  console.log(green(`  Ciudad eliminada: ${cityLabel(removed)}`));
}
