import { red } from "../utils/colors.ts";
import { cityLabel } from "../utils/format.ts";
import type { City } from "../types/City.ts";

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

export async function chooseCity(
  prompt: Prompt,
  cities: City[],
  defaultCityId: number | null,
  question: string
): Promise<number | null> {
  cities.forEach((city, index) => {
    const marker = city.id === defaultCityId ? " (default)" : "";
    console.log(`  ${index + 1}. ${cityLabel(city)}${marker}`);
  });
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
