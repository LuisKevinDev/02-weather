import { addCityAction } from "../actions/addCity.ts";
import { getForecastAction } from "../actions/getForecast.ts";
import { showAllWeather, showDefaultWeather } from "../actions/getWeather.ts";
import { listCitiesAction } from "../actions/listCities.ts";
import { removeCityAction } from "../actions/removeCity.ts";
import { setDefaultCityAction } from "../actions/setDefaultCity.ts";
import { toggleUnitAction } from "../actions/toggleUnit.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import type { Config } from "../types/Settings.ts";
import { cyan } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";
import { MENU_WIDTH } from "../utils/constants.ts";

export const MENU_OPTIONS: MenuOption[] = [
  { key: "1", label: () => "Clima de ciudad default", run: showDefaultWeather },
  {
    key: "2",
    label: (config) => `Clima de todas las ciudades (${config.cities.length})`,
    run: showAllWeather,
  },
  { key: "3", label: () => "Buscar y agregar ciudad", run: addCityAction },
  { key: "4", label: () => "Eliminar ciudad", run: removeCityAction },
  { key: "5", label: () => "Establecer ciudad default", run: setDefaultCityAction },
  { key: "6", label: () => "Pronóstico 7 días", run: getForecastAction },
  { key: "7", label: () => "Listar ciudades guardadas", run: listCitiesAction },
  {
    key: "8",
    label: (config) => `Ajustes (${unitSymbol(config.unit)})`,
    run: toggleUnitAction,
  },
];

export function printMenu(config: Config): void {
  const bar = cyan("═".repeat(MENU_WIDTH));
  const title = cyan("WEATHER CLI");
  console.log(bar);
  console.log(`         ${title}`);
  console.log(bar);
  for (const option of MENU_OPTIONS) {
    console.log(cyan(`  ${option.key}. ${option.label(config)}`));
  }
  console.log(cyan("  9. Salir"));
  console.log(bar);
}
