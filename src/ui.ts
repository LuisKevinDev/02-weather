import { cyan, red, yellow } from "./colors.ts";
import type { City, DailyForecast, Unit } from "./types.ts";

const MENU_WIDTH = 40;
const BAR = cyan("═".repeat(MENU_WIDTH));
const TITLE = cyan("WEATHER CLI");

class LineReader {
  private buffer = "";
  private queue: string[] = [];
  private waiters: Array<(line: string | null) => void> = [];
  private eof = false;
  private started = false;

  private start(): void {
    if (this.started) return;
    this.started = true;
    const decoder = new TextDecoder();
    void (async () => {
      try {
        for await (const chunk of Bun.stdin.stream()) {
          this.buffer += decoder.decode(chunk, { stream: true });
          let newlineIndex = this.buffer.indexOf("\n");
          while (newlineIndex !== -1) {
            const line = this.buffer.slice(0, newlineIndex).replace(/\r$/, "");
            this.buffer = this.buffer.slice(newlineIndex + 1);
            this.deliver(line);
            newlineIndex = this.buffer.indexOf("\n");
          }
        }
        this.buffer += decoder.decode();
      } catch {
        this.buffer = "";
      }
      this.eof = true;
      for (const waiter of this.waiters.splice(0)) waiter(null);
    })();
  }

  private deliver(line: string): void {
    const waiter = this.waiters.shift();
    if (waiter) {
      waiter(line);
    } else {
      this.queue.push(line);
    }
  }

  readLine(): Promise<string | null> {
    this.start();
    const queued = this.queue.shift();
    if (queued !== undefined) return Promise.resolve(queued);
    if (this.eof) return Promise.resolve(null);
    return new Promise<string | null>((resolve) => {
      this.waiters.push(resolve);
    });
  }
}

export class Prompt {
  private reader = new LineReader();

  async ask(question: string): Promise<string | null> {
    process.stdout.write(question);
    const line = await this.reader.readLine();
    if (line === null) {
      process.stdout.write("\n");
      return null;
    }
    return line.trim();
  }
}

export function createPrompt(): Prompt {
  return new Prompt();
}

export function unitSymbol(unit: Unit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function cityLabel(city: City): string {
  return [city.name, city.admin1, city.country]
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .join(", ");
}

export function printMenu(cityCount: number, unit: Unit): void {
  console.log(BAR);
  console.log(`         ${TITLE}`);
  console.log(BAR);
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${cityCount})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan("  6. Pronóstico 7 días"));
  console.log(cyan(`  8. Ajustes (${unitSymbol(unit)})`));
  console.log(cyan("  9. Salir"));
  console.log(BAR);
}

export function printCityList(cities: City[], defaultCityId: number | null): void {
  cities.forEach((city, index) => {
    const marker = city.id === defaultCityId ? " (default)" : "";
    console.log(`  ${index + 1}. ${cityLabel(city)}${marker}`);
  });
}

export async function chooseCity(
  prompt: Prompt,
  cities: City[],
  defaultCityId: number | null,
  question: string
): Promise<number | null> {
  printCityList(cities, defaultCityId);
  while (true) {
    const answer = await prompt.ask(question);
    if (answer === null || answer.length === 0) return null;
    const num = Number(answer);
    if (Number.isInteger(num) && num >= 1 && num <= cities.length) {
      return num - 1;
    }
    console.log(red("  Número no válido. Intenta de nuevo (o Enter para cancelar)."));
  }
}

const WEATHER_CODES: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna",
  55: "Llovizna intensa",
  56: "Llovizna helada",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia",
  65: "Lluvia intensa",
  66: "Lluvia helada",
  67: "Lluvia helada intensa",
  71: "Nieve ligera",
  73: "Nieve",
  75: "Nieve intensa",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos",
  82: "Chubascos intensos",
  85: "Chubascos de nieve",
  86: "Chubascos de nieve intensos",
  95: "Tormenta",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo intensa",
};

export function printForecast(city: City, forecast: DailyForecast[], unit: Unit): void {
  const symbol = unitSymbol(unit);
  console.log(`  ${cityLabel(city)} — próximos 7 días:`);
  const weekdayFormat = new Intl.DateTimeFormat("es", { weekday: "long" });
  const dateFormat = new Intl.DateTimeFormat("es", { day: "2-digit", month: "2-digit" });
  forecast.forEach((day) => {
    const parsed = new Date(`${day.date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      console.log(`  ${day.date}: ${yellow(`${day.tempMax}°`)} / ${day.tempMin}° ${symbol} — ${WEATHER_CODES[day.weatherCode] ?? "Desconocido"}`);
      return;
    }
    const weekday = weekdayFormat.format(parsed);
    const date = dateFormat.format(parsed);
    console.log(
      `  ${weekday} ${date}: ${yellow(`${day.tempMax}°`)} / ${day.tempMin}° ${symbol} — ${WEATHER_CODES[day.weatherCode] ?? "Desconocido"}`
    );
  });
}
