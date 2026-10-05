import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pad2 } from '../lib/format';
import { useGameActions, useGameState } from '../state/GameContext';
import { FONT, INK, PAPER_GRADIENT } from '../theme';
import { ArrowRightIcon, MinusIcon, PlusIcon } from './icons';
import { GradientSurface } from './GradientSurface';
import { Chip, Grain, StepButton, ToggleSwitch } from './primitives';

const COUNTS = [2, 3, 4, 5, 6, 7, 8];
const LIFE_PRESETS = [20, 25, 30, 40];
const TIME_PRESETS = [10, 20, 30, 50];

export function SetupScreen() {
  const s = useGameState();
  const a = useGameActions();
  const totalSeconds = s.minutes * 60 + s.seconds;

  return (
    <GradientSurface stops={PAPER_GRADIENT} angle={170} style={{ flex: 1 }}>
      <Grain opacity={0.32} blend="multiply" baseFrequency={0.85} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 22 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: INK }}>
            <Text style={label()}>Life Counter</Text>
            <Text style={label()}>Vol. 01 / MTG</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: INK }}>
            <Text style={{ fontFamily: FONT.semibold, fontSize: 44, lineHeight: 40, letterSpacing: -2, color: INK }}>
              New <Text style={{ fontFamily: FONT.regular, opacity: 0.55 }}>game</Text>
            </Text>
            <Text style={{ fontFamily: FONT.regular, fontSize: 11, lineHeight: 15, letterSpacing: 0.8, textTransform: 'uppercase', color: INK, textAlign: 'right' }}>
              Set the table,{'\n'}then play.
            </Text>
          </View>

          <Section number="01" title="Players" right="Up to eight">
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {COUNTS.map((k) => (
                <Chip key={k} selected={k === s.count} label={String(k)} onPress={() => a.setCount(k)} height={46} fontSize={24} uppercase={false} style={{ flex: 1 }} />
              ))}
            </View>
          </Section>

          <Section number="02" title="Starting life">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <StepButton icon={<MinusIcon size={18} color={INK} />} onPress={a.lifeStepperMinus} />
              <Text style={{ width: 70, textAlign: 'center', fontFamily: FONT.regular, fontSize: 46, color: INK, letterSpacing: -1.8 }}>{s.life}</Text>
              <StepButton icon={<PlusIcon size={18} color={INK} />} onPress={a.lifeStepperPlus} />
            </View>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {LIFE_PRESETS.map((k) => (
                <Chip key={k} selected={k === s.life} label={String(k)} onPress={() => a.setLife(k)} height={34} fontSize={13} style={{ flex: 1 }} />
              ))}
            </View>
          </Section>

          <Section
            number="03"
            title={
              <Text style={{ fontFamily: FONT.semibold, fontSize: 22, color: INK, letterSpacing: -0.4 }}>
                Clocks <Text style={{ fontFamily: FONT.regular, opacity: 0.55 }}>per player</Text>
              </Text>
            }
            right={<ToggleSwitch on={s.clocksOn} onToggle={a.toggleClocks} />}
          >
            {s.clocksOn && (
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <StepButton icon={<MinusIcon size={18} color={INK} />} onPress={a.minMinus} />
                  <View style={{ width: 72, alignItems: 'center', gap: 2 }}>
                    <Text style={{ fontFamily: FONT.medium, fontSize: 52, lineHeight: 44, color: INK, letterSpacing: -2 }}>{pad2(s.minutes)}</Text>
                    <Text style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: INK }}>Min</Text>
                  </View>
                  <StepButton icon={<PlusIcon size={18} color={INK} />} onPress={a.minPlus} />
                  <Text style={{ fontFamily: FONT.regular, fontSize: 48, color: INK, marginBottom: 14 }}>:</Text>
                  <StepButton icon={<MinusIcon size={18} color={INK} />} onPress={a.secMinus} />
                  <View style={{ width: 72, alignItems: 'center', gap: 2 }}>
                    <Text style={{ fontFamily: FONT.medium, fontSize: 52, lineHeight: 44, color: INK, letterSpacing: -2 }}>{pad2(s.seconds)}</Text>
                    <Text style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: INK }}>Sec</Text>
                  </View>
                  <StepButton icon={<PlusIcon size={18} color={INK} />} onPress={a.secPlus} />
                </View>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {TIME_PRESETS.map((m) => (
                    <Chip key={m} selected={totalSeconds === m * 60} label={`${m}:00`} onPress={() => a.setClockTotal(m * 60)} height={34} fontSize={13} style={{ flex: 1 }} />
                  ))}
                </View>
              </View>
            )}
          </Section>

          <View style={{ flex: 1, minHeight: 20 }} />

          <Pressable
            onPress={a.startGame}
            style={{
              height: 64,
              borderRadius: 32,
              backgroundColor: INK,
              paddingHorizontal: 22,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontFamily: FONT.regular, fontSize: 30, color: '#EDE8DF' }}>
              Start <Text style={{ opacity: 0.6 }}>the game</Text>
            </Text>
            <ArrowRightIcon size={26} color="#EDE8DF" strokeWidth={1.4} />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </GradientSurface>
  );
}

function label() {
  return { fontFamily: FONT.regular, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' as const, color: INK };
}

function Section({
  number,
  title,
  right,
  children,
}: {
  number: string;
  title: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: INK }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
          <Text style={{ fontFamily: FONT.regular, fontSize: 11, letterSpacing: 1.1, color: INK }}>{number}</Text>
          {typeof title === 'string' ? (
            <Text style={{ fontFamily: FONT.semibold, fontSize: 22, color: INK, letterSpacing: -0.4 }}>{title}</Text>
          ) : (
            title
          )}
        </View>
        {typeof right === 'string' ? (
          <Text style={{ fontFamily: FONT.regular, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: INK }}>{right}</Text>
        ) : (
          right
        )}
      </View>
      {children}
    </View>
  );
}

