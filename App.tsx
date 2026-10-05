import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameMenu } from './src/components/GameMenu';
import { GameScreen } from './src/components/GameScreen';
import { PlayerPanel } from './src/components/PlayerPanel';
import { SetupScreen } from './src/components/SetupScreen';
import { GameProvider, useGameState } from './src/state/GameContext';
import { PAPER_MID } from './src/theme';

function Root() {
  const state = useGameState();
  return (
    <View style={{ flex: 1, backgroundColor: state.screen === 'game' ? '#141311' : PAPER_MID }}>
      {state.screen === 'game' ? <GameScreen /> : <SetupScreen />}
      <PlayerPanel />
      <GameMenu />
      <StatusBar style={state.screen === 'game' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: PAPER_MID }} />;
  }

  return (
    <SafeAreaProvider>
      <GameProvider>
        <Root />
      </GameProvider>
    </SafeAreaProvider>
  );
}
