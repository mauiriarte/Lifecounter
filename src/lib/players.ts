import { Player } from '../types';
import { DEFAULT_COMBOS } from './mana';

export function buildPlayers(count: number, life: number, timeSeconds: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    life,
    poison: 0,
    energy: 0,
    exp: 0,
    cmdr: Array(count).fill(0),
    cmdr2: Array(count).fill(0),
    time: timeSeconds,
    name: '',
    combo: DEFAULT_COMBOS[i] || 'C',
    partner: false,
    art: null,
    art2: null,
  }));
}

/** Demo seed data, mirroring the original artifact's preview fixtures. */
export function buildDemoPlayers(count: number, life: number, timeSeconds: number): Player[] {
  const players = buildPlayers(count, life, timeSeconds);
  const frac = [0.22, 0.45, 1, 0, 0.32, 0.12, 0.78, 0.42];
  const poi = [0, 4, 0, 0, 2, 0, 7, 0];
  const used = [312, 540, 845, 120, 410, 95, 700, 260];
  for (let i = 0; i < count; i++) {
    players[i].life = Math.max(0, Math.round(life * (1 - frac[i])));
    players[i].poison = poi[i];
    players[i].time = Math.max(0, timeSeconds - used[i]);
  }
  const dmg: Array<[number, number, number]> = [[0, 2, 9], [1, 0, 6], [2, 1, 21], [4, 3, 12], [6, 5, 16]];
  dmg.forEach(([victim, attacker, val]) => {
    if (victim < count && attacker < count) players[victim].cmdr[attacker] = val;
  });
  return players;
}
