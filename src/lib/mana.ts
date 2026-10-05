export const MANA: Record<string, string> = {
  W: '#ECE7DC',
  U: '#1F4E9C',
  B: '#3B3340',
  R: '#B0361E',
  G: '#2A6B3A',
  C: '#5E5A55',
};

export const COMBOS: Array<[string, string]> = [
  ['W', 'White'], ['U', 'Blue'], ['B', 'Black'], ['R', 'Red'], ['G', 'Green'], ['C', 'Colorless'],
  ['WU', 'Azorius'], ['UB', 'Dimir'], ['BR', 'Rakdos'], ['RG', 'Gruul'], ['GW', 'Selesnya'],
  ['WB', 'Orzhov'], ['UR', 'Izzet'], ['BG', 'Golgari'], ['RW', 'Boros'], ['GU', 'Simic'],
  ['GWU', 'Bant'], ['WUB', 'Esper'], ['UBR', 'Grixis'], ['BRG', 'Jund'], ['RGW', 'Naya'],
  ['WBG', 'Abzan'], ['URW', 'Jeskai'], ['BGU', 'Sultai'], ['RWB', 'Mardu'], ['GUR', 'Temur'],
  ['WUBR', 'Yore-Tiller'], ['UBRG', 'Glint-Eye'], ['BRGW', 'Dune-Brood'], ['RGWU', 'Ink-Treader'], ['GWUB', 'Witch-Maw'],
  ['WUBRG', 'Five-Color'],
];

export const DEFAULT_COMBOS = ['R', 'U', 'G', 'B', 'W', 'UR', 'BG', 'C'];

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function shade(hex: string, amt: number): string {
  const [r, g, b] = rgb(hex);
  const t = amt < 0 ? 0 : 255;
  const a = Math.abs(amt);
  const f = (c: number) => Math.round(c + (t - c) * a);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

export function shadeHex(hex: string, amt: number): string {
  const [r, g, b] = rgb(hex);
  const t = amt < 0 ? 0 : 255;
  const a = Math.abs(amt);
  const f = (c: number) => Math.round(c + (t - c) * a);
  return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** 3-stop linear gradient matching the original `grad()` helper, 155deg, lighter -> base -> darker. */
export function gradStops(hex: string): [string, string, string] {
  return [shadeHex(hex, 0.09), hex, shadeHex(hex, -0.14)];
}

export interface ComboInfo {
  solid: string;
  stops: string[];
  name: string;
  dark: boolean;
}

const comboCache = new Map<string, ComboInfo>();

export function comboInfo(key: string): ComboInfo {
  const cached = comboCache.get(key);
  if (cached) return cached;
  const chars = key.split('');
  const cols = chars.map((k) => MANA[k] ?? MANA.C);
  const stops = cols.length === 1 ? gradStops(cols[0]) : cols;
  let name = '';
  for (const c of COMBOS) if (c[0] === key) name = c[1];

  const f = 0.5 * (cols.length - 1);
  const a = rgb(cols[Math.floor(f)]);
  const b = rgb(cols[Math.ceil(f)]);
  const t = f - Math.floor(f);
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const mid: [number, number, number] = [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * t) as [number, number, number];
  const lum = 0.2126 * lin(mid[0]) + 0.7152 * lin(mid[1]) + 0.0722 * lin(mid[2]);

  const info: ComboInfo = { solid: cols[0], stops, name, dark: lum > 0.4 };
  comboCache.set(key, info);
  return info;
}

/** CSS linear-gradient string at 155deg through evenly spaced stops (web only). */
export function cssGradient(stops: string[], angle = 155): string {
  if (stops.length === 1) return stops[0];
  const parts = stops.map((c, k) => `${c} ${Math.round((k / (stops.length - 1)) * 100)}%`);
  return `linear-gradient(${angle}deg, ${parts.join(', ')})`;
}
