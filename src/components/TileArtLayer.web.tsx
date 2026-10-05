import React from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { CardArt } from '../types';

export function TileArtLayer({ art, art2, partner }: { art: CardArt | null; art2: CardArt | null; partner: boolean }) {
  const showArt2 = partner && !!art2;
  if (!art && !showArt2) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      {art && (
        <View
          style={
            ({
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundImage: `url(${art.url})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            } as unknown) as ViewStyle
          }
        />
      )}
      {showArt2 && (
        <>
          <View
            style={
              ({
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundImage: `url(${art2!.url})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              } as unknown) as ViewStyle
            }
          />
          <View
            style={
              ({
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundImage:
                  'linear-gradient(to bottom right, rgba(244,239,230,0) calc(50% - 1px), rgba(244,239,230,0.55) 50%, rgba(244,239,230,0) calc(50% + 1px))',
              } as unknown) as ViewStyle
            }
          />
        </>
      )}
      <View
        style={
          ({
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(180deg, rgba(10,10,9,0.38), rgba(10,10,9,0.62))',
          } as unknown) as ViewStyle
        }
      />
    </View>
  );
}
