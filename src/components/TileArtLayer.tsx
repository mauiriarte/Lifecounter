import React from 'react';
import { Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CardArt } from '../types';

/** Native fallback: no CSS clip-path, so the partner's second art is blended in rather than diagonally split. */
export function TileArtLayer({ art, art2, partner }: { art: CardArt | null; art2: CardArt | null; partner: boolean }) {
  if (!art && !(partner && art2)) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      {art && <Image source={{ uri: art.url }} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} resizeMode="cover" />}
      {partner && art2 && (
        <Image
          source={{ uri: art2.url }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: art ? 0.45 : 1 }}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={['rgba(10,10,9,0.38)', 'rgba(10,10,9,0.62)']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
    </View>
  );
}
