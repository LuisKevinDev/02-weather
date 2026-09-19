# AGENTS.md

## Project

Weather CLI app (Spanish-language UI). Fully functional interactive menu app: add/remove cities, set default city, toggle °C/°F, current weather for one or all saved cities. Two-step OpenMeteo flow: geocoding API resolves city name to lat/lon, then forecast API. No API key required. Config persists in `~/.config/weather-cli/`. Colored output via ANSI codes in `src/colors.ts` (cyan menu, yellow temps, green/red ok/error; respects `NO_COLOR` and non-TTY). Final deliverable is a standalone executable via `bun build --compile`. Entry point: `index.ts` (per `module` field in `package.json`).

## Commands

Runtime is Bun, not Node. Package manager is Bun (`bun.lock` — use `bun install` / `bun add`, not npm/yarn).

- Run: `bun run index.ts`
- Typecheck: `bun x tsc` (TS 7 native compiler; `noEmit` is already set in `tsconfig.json`)
- Build binary: `bun build --compile index.ts --outfile out/weather.exe`

No `package.json` scripts, lint, formatter, or tests exist yet — don't assume a `test` or `lint` command works.

## TypeScript gotchas

- `verbatimModuleSyntax` is on: type-only imports must use `import type { ... }` or inline `type` modifiers, or `tsc` errors.
- `noUncheckedIndexedAccess` is on: indexed access returns `T | undefined` — guard or assert before use.
- `allowImportingTsExtensions` is on: imports may include `.ts` extensions.
