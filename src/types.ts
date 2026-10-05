export interface CardArt {
  url: string;
  name: string;
  artist: string;
}

export type CounterKey = 'poison' | 'energy' | 'exp';

export interface Player {
  life: number;
  poison: number;
  energy: number;
  exp: number;
  /** Commander damage received, indexed by attacker's player index. */
  cmdr: number[];
  /** Commander damage received from each attacker's *second* (partner) commander. */
  cmdr2: number[];
  time: number;
  name: string;
  combo: string;
  partner: boolean;
  art: CardArt | null;
  art2: CardArt | null;
}

export type MenuView = 'main' | 'clock';
export type ArtStatus = 'idle' | 'loading' | 'ok' | 'empty' | 'error';

export interface GameState {
  screen: 'setup' | 'game';
  count: number;
  life: number;
  clocksOn: boolean;
  minutes: number;
  seconds: number;
  active: number;
  running: boolean;
  panel: number | null;
  menu: boolean;
  menuView: MenuView;
  players: Player[] | null;
  cmdMode: number | null;
  cnt: Record<number, CounterKey>;
  flash: Record<number, string>;
  deltas: Record<number, number>;
  doomFade: boolean;
  doomPhase: number;
  artQ: string;
  artRes: CardArt[];
  artStatus: ArtStatus;
  artSlot: 1 | 2;
}

export type OutReason = 'life' | 'poison' | 'cmdr' | null;
