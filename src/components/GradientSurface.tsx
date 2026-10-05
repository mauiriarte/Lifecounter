import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function angleToPoints(deg: number) {
  const rad = (deg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  return { start: { x: 0.5 - dx / 2, y: 0.5 - dy / 2 }, end: { x: 0.5 + dx / 2, y: 0.5 + dy / 2 } };
}

export function GradientSurface({
  stops,
  angle = 155,
  style,
  children,
}: {
  stops: string[];
  angle?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const colors = stops.length > 1 ? stops : [stops[0], stops[0]];
  const locations = colors.map((_, i) => i / (colors.length - 1));
  const { start, end } = angleToPoints(angle);
  return (
    <LinearGradient colors={colors as [string, string, ...string[]]} start={start} end={end} locations={locations as any} style={style}>
      {children}
    </LinearGradient>
  );
}
