import { MENU_OPTIONS, printMenu } from "./presentation/menu.ts";
import { createPrompt } from "./presentation/input.ts";
import { loadConfig } from "./storage/config.ts";
import { EXIT_KEY } from "./utils/constants.ts";
import { green, red } from "./utils/colors.ts";

async function main(): Promise<void> {
  const config = loadConfig();
  const prompt = createPrompt();
  while (true) {
    printMenu(config);
    const option = await prompt.ask("  Selecciona una opción: ");
    if (option === null) return;
    if (option === EXIT_KEY) {
      console.log(green("  ¡Hasta luego!"));
      return;
    }
    try {
      const match = MENU_OPTIONS.find((menuOption) => menuOption.key === option);
      if (!match) {
        console.log(red("  Opción no válida."));
      } else {
        await match.run({ prompt, config });
      }
    } catch (error) {
      console.log(red(`  Error: ${error instanceof Error ? error.message : String(error)}`));
    }
    console.log("");
  }
}

await main();
