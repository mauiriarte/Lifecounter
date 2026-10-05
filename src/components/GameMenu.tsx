import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pad2 } from '../lib/format';
import { useGameActions, useGameState } from '../state/GameContext';
import { FONT, INK, PAPER_GRADIENT } from '../theme';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, MinusIcon, PlusIcon } from './icons';
import { GradientSurface } from './GradientSurface';
import { Chip, Grain, StepButton, ToggleSwitch } from './primitives';

const TIME_PRESETS = [10, 20, 30, 50];

export function GameMenu() {
  const s = useGameState();
  const a = useGameActions();
  if (!s.menu) return null;
  const totalSeconds = s.minutes * 60 + s.seconds;

  const items: { label: string; onPress: () => void }[] = [];
  if (s.clocksOn) {
    items.push({ label: s.running ? 'Pause clocks' : 'Start clocks', onPress: a.toggleRunning });
    items.push({ label: 'Next turn', onPress: a.nextTurn });
  }
  items.push({ label: 'Clocks', onPress: () => a.setMenuView('clock') });
  items.push({ label: 'Reset game', onPress: a.resetGame });
  items.push({ label: 'New game', onPress: a.newGame });

  return (
    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      <Pressable onPress={a.closeMenu} accessibilityLabel="Close menu" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,19,17,0.66)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <GradientSurface stops={PAPER_GRADIENT} angle={170} style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
          <Grain opacity={0.32} blend="multiply" baseFrequency={0.85} />
          <SafeAreaView edges={['bottom']}>
            <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 26 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: INK }}>
                {s.menuView === 'main' ? (
                  <Text style={{ fontFamily: FONT.regular, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: INK }}>Game menu</Text>
                ) : (
                  <Pressable onPress={() => a.setMenuView('main')} style={{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ArrowLeftIcon size={18} color={INK} />
                    <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: INK }}>Game menu / Clocks</Text>
                  </Pressable>
                )}
                <StepButton icon={<CloseIcon size={18} color={INK} />} onPress={a.closeMenu} />
              </View>

              {s.menuView === 'clock' ? (
                <View style={{ gap: 14, paddingTop: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: FONT.semibold, fontSize: 22, color: INK, letterSpacing: -0.4 }}>
                      Clocks <Text style={{ fontFamily: FONT.regular, opacity: 0.55 }}>per player</Text>
                    </Text>
                    <ToggleSwitch on={s.clocksOn} onToggle={a.toggleClocks} />
                  </View>

                  {s.clocksOn && (
                    <View style={{ gap: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <StepButton icon={<MinusIcon size={18} color={INK} />} onPress={a.minMinus} />
                        <View style={{ width: 72, alignItems: 'center', gap: 2 }}>
                          <Text style={{ fontFamily: FONT.regular, fontSize: 52, lineHeight: 44, color: INK, letterSpacing: -2 }}>{pad2(s.minutes)}</Text>
                          <Text style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: INK }}>Min</Text>
                        </View>
                        <StepButton icon={<PlusIcon size={18} color={INK} />} onPress={a.minPlus} />
                        <Text style={{ fontFamily: FONT.regular, fontSize: 44, color: INK, marginBottom: 14 }}>:</Text>
                        <StepButton icon={<MinusIcon size={18} color={INK} />} onPress={a.secMinus} />
                        <View style={{ width: 72, alignItems: 'center', gap: 2 }}>
                          <Text style={{ fontFamily: FONT.regular, fontSize: 52, lineHeight: 44, color: INK, letterSpacing: -2 }}>{pad2(s.seconds)}</Text>
                          <Text style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: INK }}>Sec</Text>
                        </View>
                        <StepButton icon={<PlusIcon size={18} color={INK} />} onPress={a.secPlus} />
                      </View>
                      <View style={{ flexDirection: 'row', gap: 4 }}>
                        {TIME_PRESETS.map((m) => (
                          <Chip key={m} selected={totalSeconds === m * 60} label={`${m}:00`} onPress={() => a.setClockTotal(m * 60)} height={34} fontSize={13} style={{ flex: 1 }} />
                        ))}
                      </View>
                      <Text style={{ fontFamily: FONT.regular, fontSize: 13, lineHeight: 18, color: INK, opacity: 0.72 }}>
                        Applying resets every player's clock to this time and pauses play.
                      </Text>
                    </View>
                  )}

                  <Pressable
                    onPress={a.applyClocks}
                    style={{ marginTop: 4, height: 60, borderRadius: 30, backgroundColor: INK, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Text style={{ fontFamily: FONT.semibold, fontSize: 22, color: '#EDE8DF', letterSpacing: -0.4 }}>
                      {s.clocksOn ? 'Apply to all players' : 'Done'}
                    </Text>
                    <ArrowRightIcon size={24} color="#EDE8DF" strokeWidth={1.4} />
                  </Pressable>
                </View>
              ) : (
                <View>
                  {items.map((m, idx) => (
                    <Pressable
                      key={m.label}
                      onPress={m.onPress}
                      style={{ height: 64, borderBottomWidth: 1, borderBottomColor: INK, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 12 }}>
                        <Text style={{ fontFamily: FONT.regular, fontSize: 11, letterSpacing: 1.1, color: INK }}>{pad2(idx + 1)}</Text>
                        <Text style={{ fontFamily: FONT.medium, fontSize: 28, color: INK, letterSpacing: -0.8 }}>{m.label}</Text>
                      </View>
                      <ArrowRightIcon size={22} color={INK} strokeWidth={1.4} />
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </SafeAreaView>
        </GradientSurface>
      </View>
    </View>
  );
}
