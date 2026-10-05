import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { MAX_CLOCK_SECONDS } from '../lib/format';
import { buildPlayers } from '../lib/players';
import { nextAlive, outReason, COUNTER_MAX } from '../lib/rules';
import { CardArt, CounterKey, GameState, MenuView, Player } from '../types';

function buzz() {
  if (Platform.OS === 'web') return;
  import('expo-haptics')
    .then((Haptics) => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))
    .catch(() => {});
}

const initialState: GameState = {
  screen: 'setup',
  count: 4,
  life: 40,
  clocksOn: true,
  minutes: 25,
  seconds: 0,
  active: 0,
  running: false,
  panel: null,
  menu: false,
  menuView: 'main',
  players: null,
  cmdMode: null,
  cnt: {},
  flash: {},
  deltas: {},
  doomFade: false,
  doomPhase: 0,
  artQ: '',
  artRes: [],
  artStatus: 'idle',
  artSlot: 1,
};

type Patch = Partial<GameState> | ((prev: GameState) => Partial<GameState>);

export interface GameActions {
  set: (patch: Patch) => void;
  mutate: (fn: (players: Player[]) => void, quiet?: boolean) => void;

  setCount: (n: number) => void;
  setLife: (n: number) => void;
  lifeStepperMinus: () => void;
  lifeStepperPlus: () => void;
  toggleClocks: () => void;
  setClockTotal: (totalSeconds: number) => void;
  minMinus: () => void;
  minPlus: () => void;
  secMinus: () => void;
  secPlus: () => void;
  startGame: () => void;
  resetGame: () => void;
  newGame: () => void;

  openMenu: () => void;
  closeMenu: () => void;
  setMenuView: (v: MenuView) => void;
  toggleRunning: () => void;
  nextTurn: () => void;
  applyClocks: () => void;

  openPanel: (i: number) => void;
  closePanel: () => void;
  setName: (i: number, name: string) => void;
  togglePartner: (i: number) => void;
  setArtSlot: (slot: 1 | 2) => void;
  setArtQuery: (q: string) => void;
  searchArt: () => void;
  pickCombo: (i: number, combo: string) => void;
  pickArt: (i: number, slot: 1 | 2, art: CardArt) => void;
  clearArt: (i: number, slot: 1 | 2) => void;

  lifeTap: (i: number, delta: 1 | -1) => void;
  clockTap: (i: number) => void;
  openPlayerSheet: (i: number) => void;
  setCnt: (i: number, key: CounterKey | null) => void;
  openCounters: (i: number) => void;
  counterStep: (i: number, key: CounterKey, delta: 1 | -1) => void;
  setCmdModeFromChip: (i: number) => void;
  exitCmdMode: () => void;
  toggleCmdModeFromSwipe: (i: number) => void;
  commanderStep: (victim: number, source: number, slot: 1 | 2, delta: 1 | -1) => void;
}

const StateContext = createContext<GameState>(initialState);
const ActionsContext = createContext<GameActions | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const flashTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const deltaTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const doomFadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const set = useCallback<GameActions['set']>((patch) => {
    setState((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const mutate = useCallback<GameActions['mutate']>((fn, quiet) => {
    if (!quiet) buzz();
    setState((prev) => {
      if (!prev.players) return prev;
      const players = prev.players.map((p) => ({ ...p, cmdr: [...p.cmdr], cmdr2: [...p.cmdr2] }));
      fn(players);
      return { ...prev, players };
    });
  }, []);

  // Per-player turn clock, ticking once a second while running.
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      if (s.screen !== 'game' || !s.clocksOn || !s.running || !s.players) return;
      setState((prev) => {
        if (!prev.players) return prev;
        const q = prev.players[prev.active];
        if (!q) return prev;
        const players = prev.players.slice();
        const time = Math.max(0, q.time - 1);
        players[prev.active] = { ...q, time };
        return { ...prev, players, running: time === 0 ? false : prev.running };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Cycles the "fallen" doom message while any player is out.
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      if (s.screen !== 'game' || !s.players) return;
      const anyDead = s.players.some((p) => outReason(p));
      if (!anyDead) return;
      setState((prev) => ({ ...prev, doomFade: true }));
      clearTimeout(doomFadeTimer.current);
      doomFadeTimer.current = setTimeout(() => {
        setState((prev) => ({ ...prev, doomFade: false, doomPhase: prev.doomPhase + 1 }));
      }, 480);
    }, 4200);
    return () => {
      clearInterval(id);
      clearTimeout(doomFadeTimer.current);
    };
  }, []);

  const flashTile = useCallback((i: number, slot?: 1 | 2, dir?: 1 | -1) => {
    const key = slot ? `${dir && dir < 0 ? 'L' : 'R'}${slot}` : dir != null ? (dir < 0 ? 'L' : 'R') : 'L';
    setState((prev) => ({ ...prev, flash: { ...prev.flash, [i]: key } }));
    clearTimeout(flashTimers.current[i]);
    flashTimers.current[i] = setTimeout(() => {
      setState((prev) => {
        const flash = { ...prev.flash };
        delete flash[i];
        return { ...prev, flash };
      });
    }, 150);
  }, []);

  const showDelta = useCallback((i: number, delta: number) => {
    setState((prev) => ({ ...prev, deltas: { ...prev.deltas, [i]: (prev.deltas[i] || 0) + delta } }));
    clearTimeout(deltaTimers.current[i]);
    deltaTimers.current[i] = setTimeout(() => {
      setState((prev) => {
        const deltas = { ...prev.deltas };
        delete deltas[i];
        return { ...prev, deltas };
      });
    }, 1600);
  }, []);

  const actions = useMemo<GameActions>(() => {
    const setCount: GameActions['setCount'] = (n) => set({ count: n });
    const setLife: GameActions['setLife'] = (n) => set({ life: n });
    const lifeStepperMinus = () => set((p) => ({ life: Math.max(1, p.life - 1) }));
    const lifeStepperPlus = () => set((p) => ({ life: Math.min(999, p.life + 1) }));
    const toggleClocks = () => set((p) => ({ clocksOn: !p.clocksOn }));

    const clampTime = (t: number) => Math.max(15, Math.min(MAX_CLOCK_SECONDS, t));
    const setClockTotal: GameActions['setClockTotal'] = (t) => {
      const clamped = clampTime(t);
      set({ minutes: Math.floor(clamped / 60), seconds: clamped % 60 });
    };
    const minMinus = () => set((p) => { const t = clampTime(p.minutes * 60 + p.seconds - 60); return { minutes: Math.floor(t / 60), seconds: t % 60 }; });
    const minPlus = () => set((p) => { const t = clampTime(p.minutes * 60 + p.seconds + 60); return { minutes: Math.floor(t / 60), seconds: t % 60 }; });
    const secMinus = () => set((p) => { const t = clampTime(p.minutes * 60 + p.seconds - 15); return { minutes: Math.floor(t / 60), seconds: t % 60 }; });
    const secPlus = () => set((p) => { const t = clampTime(p.minutes * 60 + p.seconds + 15); return { minutes: Math.floor(t / 60), seconds: t % 60 }; });

    const startGame = () => set((p) => ({
      screen: 'game',
      players: buildPlayers(p.count, p.life, p.minutes * 60 + p.seconds),
      active: 0,
      running: false,
      panel: null,
      menu: false,
    }));

    const resetGame = () => set((p) => ({
      players: buildPlayers(p.count, p.life, p.minutes * 60 + p.seconds),
      running: false,
      active: 0,
      menu: false,
      panel: null,
    }));

    const newGame = () => set({ screen: 'setup', players: null, running: false, active: 0, menu: false, panel: null });

    const openMenu = () => set({ menu: true, menuView: 'main', panel: null });
    const closeMenu = () => set({ menu: false });
    const setMenuView: GameActions['setMenuView'] = (v) => set({ menuView: v });
    const toggleRunning = () => set((p) => ({ running: !p.running }));
    const nextTurn = () => set((p) => ({ active: p.players ? nextAlive(p.active, p.players) : p.active }));

    const applyClocks = () => set((p) => {
      if (!p.clocksOn || !p.players) return { menu: false, menuView: 'main' };
      const total = p.minutes * 60 + p.seconds;
      const players = p.players.map((pl) => ({ ...pl, time: total }));
      return { players, running: false, menu: false, menuView: 'main' };
    });

    const openPanel: GameActions['openPanel'] = (i) => set({ panel: i, menu: false });
    const closePanel = () => set({ panel: null });

    const setName: GameActions['setName'] = (i, name) =>
      mutate((players) => { players[i].name = name.slice(0, 16); }, true);

    const togglePartner: GameActions['togglePartner'] = (i) => {
      mutate((players) => { players[i].partner = !players[i].partner; });
      set({ artSlot: 1 });
    };

    const setArtSlot: GameActions['setArtSlot'] = (slot) => set({ artSlot: slot });
    const setArtQuery: GameActions['setArtQuery'] = (q) => set({ artQ: q });

    const searchArt = () => {
      const q = stateRef.current.artQ.trim();
      if (!q) return;
      set({ artStatus: 'loading', artRes: [] });
      fetch(`https://api.scryfall.com/cards/search?unique=art&q=${encodeURIComponent(q)}`, {
        headers: { Accept: 'application/json' },
      })
        .then((r) => {
          if (r.status === 404) return { data: [] };
          if (!r.ok) throw new Error(`status ${r.status}`);
          return r.json();
        })
        .then((j) => {
          const res: CardArt[] = (j.data || [])
            .map((c: any) => {
              const face = c.card_faces && c.card_faces[0];
              const iu = c.image_uris || (face && face.image_uris);
              if (!iu || !iu.art_crop) return null;
              return { name: c.name, artist: c.artist || (face && face.artist) || 'Unknown', url: iu.art_crop };
            })
            .filter(Boolean)
            .slice(0, 12);
          set({ artRes: res, artStatus: res.length ? 'ok' : 'empty' });
        })
        .catch(() => set({ artStatus: 'error' }));
    };

    const pickCombo: GameActions['pickCombo'] = (i, combo) => mutate((players) => { players[i].combo = combo; });
    const pickArt: GameActions['pickArt'] = (i, slot, art) =>
      mutate((players) => { players[i][slot === 2 ? 'art2' : 'art'] = art; });
    const clearArt: GameActions['clearArt'] = (i, slot) =>
      mutate((players) => { players[i][slot === 2 ? 'art2' : 'art'] = null; });

    const lifeTap: GameActions['lifeTap'] = (i, delta) => {
      mutate((players) => { players[i].life = Math.max(-99, Math.min(999, players[i].life + delta)); });
      showDelta(i, delta);
      flashTile(i, undefined, delta);
    };

    const clockTap: GameActions['clockTap'] = (i) => {
      const s = stateRef.current;
      if (!s.players) return;
      if (!s.running) { set({ active: i, running: s.players[i].time > 0 }); return; }
      if (s.active === i) set({ active: nextAlive(i, s.players) });
      else set({ active: i });
    };

    const openPlayerSheet: GameActions['openPlayerSheet'] = (i) => set({ panel: i, menu: false });

    const setCnt: GameActions['setCnt'] = (i, key) =>
      set((p) => {
        const cnt = { ...p.cnt };
        if (key == null) delete cnt[i];
        else cnt[i] = key;
        return { cnt, cmdMode: null, panel: null, menu: false };
      });

    const openCounters: GameActions['openCounters'] = (i) => setCnt(i, 'poison');

    const counterStep: GameActions['counterStep'] = (i, key, delta) => {
      flashTile(i, undefined, delta);
      mutate((players) => {
        const cur = players[i][key] || 0;
        players[i][key] = Math.max(0, Math.min(COUNTER_MAX[key], cur + delta));
      });
    };

    const setCmdModeFromChip: GameActions['setCmdModeFromChip'] = (i) =>
      set((p) => {
        const cnt = { ...p.cnt };
        delete cnt[i];
        return { cnt, cmdMode: i };
      });

    const exitCmdMode = () => set({ cmdMode: null });

    const toggleCmdModeFromSwipe: GameActions['toggleCmdModeFromSwipe'] = (i) =>
      set((p) => ({ cmdMode: p.cmdMode === i ? null : i, cnt: {}, panel: null, menu: false }));

    const commanderStep: GameActions['commanderStep'] = (victim, source, slot, delta) => {
      flashTile(source, slot, delta);
      mutate((players) => {
        const key = slot === 2 ? 'cmdr2' : 'cmdr';
        if (delta < 0) {
          if (players[victim][key][source] > 0) {
            players[victim][key][source] -= 1;
            players[victim].life += 1;
          }
        } else {
          players[victim][key][source] += 1;
          players[victim].life -= 1;
        }
      });
    };

    return {
      set, mutate,
      setCount, setLife, lifeStepperMinus, lifeStepperPlus, toggleClocks,
      setClockTotal, minMinus, minPlus, secMinus, secPlus,
      startGame, resetGame, newGame,
      openMenu, closeMenu, setMenuView, toggleRunning, nextTurn, applyClocks,
      openPanel, closePanel, setName, togglePartner, setArtSlot, setArtQuery, searchArt,
      pickCombo, pickArt, clearArt,
      lifeTap, clockTap, openPlayerSheet, setCnt, openCounters, counterStep,
      setCmdModeFromChip, exitCmdMode, toggleCmdModeFromSwipe, commanderStep,
    };
  }, [set, mutate, flashTile, showDelta]);

  return (
    <StateContext.Provider value={state}>
      <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
    </StateContext.Provider>
  );
}

export function useGameState() {
  return useContext(StateContext);
}

export function useGameActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('useGameActions must be used within a GameProvider');
  return ctx;
}
