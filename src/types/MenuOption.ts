import type { Prompt } from "../presentation/input.ts";
import type { Config } from "./Settings.ts";

export interface MenuContext {
  prompt: Prompt;
  config: Config;
}

export interface MenuOption {
  key: string;
  label: (config: Config) => string;
  run: (ctx: MenuContext) => Promise<void> | void;
}
