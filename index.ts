import { geocodeCity, getForecast, getWeather } from "./src/api.ts";
import { loadConfig, saveConfig } from "./src/storage.ts";
import { chooseCity, cityLabel, createPrompt, printForecast, printMenu, unitSymbol } from "./src/ui.ts";
import { green, red, yellow } from "./src/colors.ts";
import type { Config } from "./src/types.ts";
import type { Prompt } from "./src/ui.ts";

async function showDefaultWeather(config: Config): Promise<void> {
  const city = config.cities.find((c) => c.id === config.defaultCityId);
  if (!city) {
    console.log(red("  No hay ciudad default establecida. Usa la opción 5 para elegirla."));
    return;
  }
  const temp = await getWeather(city.latitude, city.longitude, config.unit);
  console.log(`  ${cityLabel(city)}: ${yellow(`${temp} ${unitSymbol(config.unit)}`)}`);
}

async function showAllWeather(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Agrega una con la opción 3."));
    return;
  }
  const results = await Promise.allSettled(
    config.cities.map((city) => getWeather(city.latitude, city.longitude, config.unit))
  );
  results.forEach((result, index) => {
    const city = config.cities[index];
    if (!city) return;
    if (result.status === "fulfilled") {
      console.log(`  ${index + 1}. ${cityLabel(city)}: ${yellow(`${result.value} ${unitSymbol(config.unit)}`)}`);
    } else {
      console.log(red(`  ${index + 1}. ${cityLabel(city)}: no se pudo obtener el clima`));
    }
  });
}

async function showForecast(rl: Prompt, config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Agrega una con la opción 3."));
    return;
  }
  const index = await chooseCity(
    rl,
    config.cities,
    config.defaultCityId,
    "  Número de la ciudad (Enter para cancelar): "
  );
  if (index === null) {
    console.log("  Cancelado.");
    return;
  }
  const city = config.cities[index];
  if (!city) return;
  const forecast = await getForecast(city.latitude, city.longitude, config.unit);
  printForecast(city, forecast, config.unit);
}

async function searchAndAddCity(rl: Prompt, config: Config): Promise<void> {
  const name = await rl.ask("  Nombre de la ciudad: ");
  if (name === null || name.length === 0) {
    console.log("  Cancelado.");
    return;
  }
  const city = await geocodeCity(name);
  if (!city) {
    console.log(red("  Ciudad no encontrada."));
    return;
  }
  if (config.cities.some((c) => c.id === city.id)) {
    console.log(red(`  ${cityLabel(city)} ya está guardada.`));
    return;
  }
  config.cities.push(city);
  let note = "";
  if (config.defaultCityId === null) {
    config.defaultCityId = city.id;
    note = " (establecida como default)";
  }
  saveConfig(config);
  console.log(green(`  Ciudad agregada: ${cityLabel(city)}${note}`));
}

async function removeCity(rl: Prompt, config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas."));
    return;
  }
  const index = await chooseCity(
    rl,
    config.cities,
    config.defaultCityId,
    "  Número de la ciudad a eliminar (Enter para cancelar): "
  );
  if (index === null) {
    console.log("  Cancelado.");
    return;
  }
  const removed = config.cities[index];
  if (!removed) return;
  config.cities.splice(index, 1);
  if (config.defaultCityId === removed.id) {
    config.defaultCityId = null;
  }
  saveConfig(config);
  console.log(green(`  Ciudad eliminada: ${cityLabel(removed)}`));
}

async function setDefaultCity(rl: Prompt, config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log(red("  No hay ciudades guardadas. Agrega una con la opción 3."));
    return;
  }
  const index = await chooseCity(
    rl,
    config.cities,
    config.defaultCityId,
    "  Número de la ciudad (Enter para cancelar): "
  );
  if (index === null) {
    console.log("  Cancelado.");
    return;
  }
  const city = config.cities[index];
  if (!city) return;
  config.defaultCityId = city.id;
  saveConfig(config);
  console.log(green(`  Ciudad default: ${cityLabel(city)}`));
}

function toggleUnit(config: Config): void {
  config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  saveConfig(config);
  console.log(green(`  Unidad de temperatura: ${unitSymbol(config.unit)}`));
}

async function main(): Promise<void> {
  const config = loadConfig();
  const rl = createPrompt();
  while (true) {
    printMenu(config.cities.length, config.unit);
    const option = await rl.ask("  Selecciona una opción: ");
    if (option === null) return;
    if (option === "9") {
      console.log(green("  ¡Hasta luego!"));
      return;
    }
    try {
      switch (option) {
        case "1":
          await showDefaultWeather(config);
          break;
        case "2":
          await showAllWeather(config);
          break;
        case "3":
          await searchAndAddCity(rl, config);
          break;
        case "4":
          await removeCity(rl, config);
          break;
        case "5":
          await setDefaultCity(rl, config);
          break;
        case "6":
          await showForecast(rl, config);
          break;
        case "8":
          toggleUnit(config);
          break;
        default:
          console.log(red("  Opción no válida."));
      }
    } catch (error) {
      console.log(red(`  Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    console.log("");
  }
}

await main();
