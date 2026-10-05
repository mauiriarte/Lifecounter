import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function MinusIcon({ size = 18, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function PlusIcon({ size = 18, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 18, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function MenuIcon({ size = 22, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 8h14M5 12h14M5 16h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 24, color = 'currentColor', strokeWidth = 1.4 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12h16M14 6l6 6-6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = 18, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M10 6l-6 6 6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ClockIcon({ size = 18, color = 'currentColor', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Plain drop outline, used as the small marker on poison chips/badges. */
export function DropletIcon({ size = 12, color = 'currentColor', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5c3.6 4.6 6.5 8 6.5 11.5a6.5 6.5 0 0 1-13 0c0-3.5 2.9-6.9 6.5-11.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Drop-with-bubbles icon used for the tile's bottom-left poison footer. */
export function PoisonFooterIcon({ size = 13, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5c3.6 4.6 6.5 8 6.5 11.5a6.5 6.5 0 0 1-13 0c0-3.5 2.9-6.9 6.5-11.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx={9.6} cy={14.6} r={1.6} fill={color} stroke="none" />
      <Circle cx={13.6} cy={17.4} r={1} fill={color} stroke="none" />
    </Svg>
  );
}

export function SkullIcon({ size = 60, color = '#D9CFC0', strokeWidth = 1.3 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.8a8.2 8.2 0 0 0-8.2 8.2c0 2.7 1.2 4.6 3.1 5.8V20a1.2 1.2 0 0 0 1.2 1.2h7.8a1.2 1.2 0 0 0 1.2-1.2v-3.2c1.9-1.2 3.1-3.1 3.1-5.8A8.2 8.2 0 0 0 12 2.8z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.9 9.6c1.3 0 2.2 1 2.2 2.1s-.9 1.7-2 1.7-2.3-.6-2.3-1.7.8-2.1 2.1-2.1zM15.1 9.6c1.3 0 2.1 1 2.1 2.1s-1.2 1.7-2.3 1.7-2-.6-2-1.7.9-2.1 2.2-2.1z"
        fill={color}
      />
      <Path d="M12 14.6l-1.1 1.9h2.2z" fill={color} />
      <Path d="M10 21.2v-2.4M12 21.2v-2.4M14 21.2v-2.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
