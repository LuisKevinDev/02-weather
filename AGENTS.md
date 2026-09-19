# AGENTS.md

## Project

Weather CLI app (Spanish-language UI). Fully functional interactive menu app: add/remove cities, set default city, list cities, toggle °C/°F, current weather for one or all saved cities, 7-day forecast. Two-step OpenMeteo flow: geocoding API resolves city name to lat/lon, then forecast API. No API key required. Config persists in `~/.weather-cli.json` (override with `WEATHER_CLI_CONFIG` env var); storage layer is split into `src/storage/citiesStorage.ts` and `src/storage/settingsStorage.ts` over a shared `src/storage/config.ts`. Colored output via ANSI codes in `src/utils/colors.ts` (cyan menu, yellow temps, green/red ok/error; respects `NO_COLOR` and non-TTY). Final deliverable is a standalone executable via `bun build --compile`. Entry point: `src/index.ts` (per `module` field in `package.json`).

## Structure

Layered architecture (see `references/file-system.md`): `src/actions/` (user-facing actions), `src/presentation/` (menu/input/output), `src/storage/` (persistence), `src/types/` (global TS contracts), `src/api/` (OpenMeteo geocoding + weather), `src/utils/` (format, constants, colors). Menu options are defined declaratively in `src/presentation/menu.ts` as `MenuOption[]`; the main loop in `src/index.ts` dispatches by key.

## Commands

Runtime is Bun, not Node. Package manager is Bun (`bun.lock` — use `bun install` / `bun add`, not npm/yarn).

- Run: `bun run src/index.ts` (or `bun start`)
- Typecheck: `bun x tsc` (TS 7 native compiler; `noEmit` is already set in `tsconfig.json`)
- Build binary: `bun run build` (compiles `src/index.ts` via `bun build --compile`)

`package.json` has `start`, `dev`, and `build` scripts. No lint, formatter, or tests exist yet — don't assume a `test` or `lint` command works.

## TypeScript gotchas

- `verbatimModuleSyntax` is on: type-only imports must use `import type { ... }` or inline `type` modifiers, or `tsc` errors.
- `noUncheckedIndexedAccess` is on: indexed access returns `T | undefined` — guard or assert before use.
- `allowImportingTsExtensions` is on: imports may include `.ts` extensions.
