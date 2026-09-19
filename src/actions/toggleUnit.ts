import { getUnit, setUnit } from "../storage/settingsStorage.ts";
import type { MenuContext } from "../types/MenuOption.ts";
import { green } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";

export function toggleUnitAction({ config }: MenuContext): void {
  const next = getUnit(config) === "celsius" ? "fahrenheit" : "celsius";
  setUnit(config, next);
  console.log(green(`  Unidad de temperatura: ${unitSymbol(next)}`));
}
