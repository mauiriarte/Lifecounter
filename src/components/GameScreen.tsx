import React from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { computeSeats } from '../lib/layout';
import { comboInfo } from '../lib/mana';
import { useGameActions, useGameState } from '../state/GameContext';
import { INK, CREAM } from '../theme';
import { MenuIcon } from './icons';
import { PlayerTile } from './PlayerTile';

export function GameScreen() {
  const state = useGameState();
  const actions = useGameActions();
  const { width, height } = useWindowDimensions();
  const players = state.players ?? [];
  const n = Math.max(2, players.length);
  const seats = computeSeats(n, width, height);
  const combos = players.map((p) => comboInfo(p.combo));
  const colors = combos.map((c) => c.solid);

  return (
    <View style={{ flex: 1, backgroundColor: INK }}>
      {players.map((p, i) => (
        <PlayerTile key={i} index={i} player={p} players={players} seat={seats[i]} colors={colors} combos={combos} />
      ))}

      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -33, marginTop: -33 }}
      >
        <Pressable
          onPress={actions.openMenu}
          accessibilityLabel="Game menu"
          style={{
            width: 66,
            height: 66,
            borderRadius: 33,
            backgroundColor: INK,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' }}>
            <MenuIcon size={22} color={INK} strokeWidth={1.6} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
