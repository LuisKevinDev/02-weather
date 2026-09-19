const enabled = process.stdout.isTTY === true && !("NO_COLOR" in process.env);

function wrap(code: string): (text: string) => string {
  return (text: string) => (enabled ? `\x1b[${code}m${text}\x1b[0m` : text);
}

export const cyan = wrap("36");
export const yellow = wrap("33");
export const green = wrap("32");
export const red = wrap("31");
