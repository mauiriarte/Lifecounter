export function pad2(v: number): string {
  return (v < 10 && v >= 0 ? '0' : '') + v;
}

export function fmt(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const MAX_CLOCK_SECONDS = 99 * 60;
