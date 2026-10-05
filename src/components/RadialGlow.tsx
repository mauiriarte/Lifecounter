import React from 'react';
import { View } from 'react-native';

/** Native fallback for the dead-tile radial glow (no true CSS radial-gradient on native). */
export function RadialGlow({ color = 'rgba(120,18,18,0.55)' }: { color?: string }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      <View
        style={{
          position: 'absolute',
          left: '20%',
          right: '20%',
          top: '18%',
          bottom: '18%',
          borderRadius: 999,
          backgroundColor: color,
          opacity: 0.35,
        }}
      />
    </View>
  );
}
