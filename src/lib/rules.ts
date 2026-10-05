import { OutReason, Player } from '../types';

export function outReason(p: Player): OutReason {
  if (p.poison >= 10) return 'poison';
  const maxCmdr = Math.max(0, ...p.cmdr, ...(p.cmdr2 || []));
  if (maxCmdr >= 21) return 'cmdr';
  if (p.life <= 0) return 'life';
  return null;
}

export function nextAlive(i: number, players: Player[]): number {
  for (let k = 1; k < players.length; k++) {
    const j = (i + k) % players.length;
    if (!outReason(players[j])) return j;
  }
  return i;
}

export const COUNTER_MAX: Record<'poison' | 'energy' | 'exp', number> = {
  poison: 10,
  energy: 99,
  exp: 99,
};
