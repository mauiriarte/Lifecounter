import React from 'react';
import { View, ViewStyle } from 'react-native';

export function RadialGlow({ color = 'rgba(120,18,18,0.38)' }: { color?: string }) {
  return (
    <View
      pointerEvents="none"
      style={
        ({
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 50% 46%, ${color}, rgba(0,0,0,0) 62%)`,
        } as unknown) as ViewStyle
      }
    />
  );
}
