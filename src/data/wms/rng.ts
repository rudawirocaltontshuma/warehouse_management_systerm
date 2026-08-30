// Deterministic pseudo-random generator so the demo dataset is stable across renders
// and server/client hydration, without needing a backend or database.

export function createRng(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)] as T;
}

export function pickWeighted<T>(rng: () => number, items: readonly (readonly [T, number])[]): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [item, weight] of items) {
    roll -= weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1]?.[0];
}

export function intBetween(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function floatBetween(rng: () => number, min: number, max: number, decimals = 2): number {
  const value = rng() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function pad(num: number, length: number): string {
  return String(num).padStart(length, "0");
}

export function daysFromToday(offset: number): string {
  const base = new Date("2026-08-30T09:00:00Z");
  base.setUTCDate(base.getUTCDate() + offset);
  return base.toISOString().slice(0, 10);
}

export function hoursFromNow(offset: number): string {
  const base = new Date("2026-08-30T09:00:00Z");
  base.setUTCHours(base.getUTCHours() + offset);
  return base.toISOString();
}
