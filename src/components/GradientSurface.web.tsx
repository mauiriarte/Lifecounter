import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { cssGradient } from '../lib/mana';

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
  const backgroundImage = stops.length === 1 ? undefined : cssGradient(stops, angle);
  const backgroundColor = stops.length === 1 ? stops[0] : undefined;
  return (
    <View style={[style, ({ backgroundImage, backgroundColor } as unknown) as ViewStyle]}>
      {children}
    </View>
  );
}
