import React from 'react';
import { Platform, Pressable, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import Svg, { Defs, FeColorMatrix, FeTurbulence, Filter, Rect } from 'react-native-svg';
import { CREAM, FONT, INK } from '../theme';

let grainSeq = 0;

export function Grain({
  opacity = 0.32,
  blend = 'multiply',
  baseFrequency = 0.85,
  borderRadius = 0,
}: {
  opacity?: number;
  blend?: 'multiply' | 'overlay';
  baseFrequency?: number;
  borderRadius?: number;
}) {
  const id = React.useRef(`grain-${++grainSeq}`).current;
  const webBlend = Platform.OS === 'web' ? ({ mixBlendMode: blend } as ViewStyle) : null;
  return (
    <View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity, overflow: 'hidden', borderRadius },
        webBlend,
      ]}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <Filter id={id}>
            <FeTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves={3} stitchTiles="stitch" />
            <FeColorMatrix type="saturate" values="0" />
          </Filter>
        </Defs>
        <Rect width="100%" height="100%" filter={`url(#${id})`} />
      </Svg>
    </View>
  );
}

interface ChipProps {
  selected: boolean;
  label: string;
  onPress: () => void;
  height?: number;
  fontSize?: number;
  uppercase?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  flex?: number;
}

export function Chip({
  selected,
  label,
  onPress,
  height = 34,
  fontSize = 13,
  uppercase = true,
  leftIcon,
  style,
  textStyle,
  flex,
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        {
          height,
          borderRadius: height / 2,
          borderWidth: 1,
          borderColor: INK,
          backgroundColor: selected ? INK : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          flex,
        },
        style,
      ]}
    >
      {leftIcon}
      <Text
        style={[
          {
            fontFamily: FONT.medium,
            fontSize,
            letterSpacing: fontSize * 0.06,
            color: selected ? CREAM : INK,
            textTransform: uppercase ? 'uppercase' : 'none',
            lineHeight: fontSize,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44 }}
    >
      <Text
        style={{
          width: 26,
          textAlign: 'right',
          fontFamily: FONT.regular,
          fontSize: 11,
          letterSpacing: 1.1,
          textTransform: 'uppercase',
          color: INK,
        }}
      >
        {on ? 'On' : 'Off'}
      </Text>
      <View
        style={{
          width: 48,
          height: 26,
          borderRadius: 13,
          borderWidth: 1,
          borderColor: INK,
          padding: 3,
          backgroundColor: on ? INK : 'transparent',
          flexDirection: 'row',
          justifyContent: on ? 'flex-end' : 'flex-start',
        }}
      >
        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: on ? CREAM : INK }} />
      </View>
    </Pressable>
  );
}

export function StepButton({
  icon,
  onPress,
  size = 44,
  borderColor = INK,
  disabled,
  style,
}: {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  borderColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}
