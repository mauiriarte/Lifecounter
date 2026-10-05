import React from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pad2 } from '../lib/format';
import { COMBOS, comboInfo, DEFAULT_COMBOS } from '../lib/mana';
import { useGameActions, useGameState } from '../state/GameContext';
import { FONT, INK, PAPER_GRADIENT } from '../theme';
import { CloseIcon } from './icons';
import { GradientSurface } from './GradientSurface';
import { Grain, ToggleSwitch } from './primitives';

export function PlayerPanel() {
  const s = useGameState();
  const a = useGameActions();
  const players = s.players ?? [];
  const pi = s.panel;
  if (pi == null || pi >= players.length) return null;
  const q = players[pi];
  const combo = comboInfo(q.combo || DEFAULT_COMBOS[pi] || 'C');
  const artSlot = q.partner && s.artSlot === 2 ? 2 : 1;
  const slotArt = artSlot === 2 ? q.art2 : q.art;

  return (
    <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      <Pressable onPress={a.closePanel} accessibilityLabel="Close player sheet" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,19,17,0.66)' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '94%' }}>
        <GradientSurface stops={PAPER_GRADIENT} angle={170} style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
          <Grain opacity={0.32} blend="multiply" baseFrequency={0.85} />
          <SafeAreaView edges={['bottom']}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 26 }} showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: INK }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 12, height: 12, backgroundColor: combo.solid }} />
                  <Text style={{ fontFamily: FONT.regular, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: INK }}>Player sheet</Text>
                </View>
                <Pressable
                  onPress={a.closePanel}
                  accessibilityLabel="Close"
                  style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: INK, alignItems: 'center', justifyContent: 'center' }}
                >
                  <CloseIcon size={18} color={INK} />
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: INK }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 48, lineHeight: 42, letterSpacing: -2.2, color: INK }}>
                  {q.name ? q.name : 'Player'}{' '}
                  <Text style={{ fontFamily: FONT.regular, opacity: 0.55 }}>{q.name ? '' : pad2(pi + 1)}</Text>
                </Text>
              </View>

              <View style={{ gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: INK }}>
                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: INK }}>Name</Text>
                  <TextInput
                    value={q.name}
                    onChangeText={(t) => a.setName(pi, t)}
                    placeholder={`Player ${pad2(pi + 1)}`}
                    placeholderTextColor="rgba(20,19,17,0.4)"
                    maxLength={16}
                    style={{
                      height: 46, borderWidth: 1, borderColor: INK, borderRadius: 23, paddingHorizontal: 18,
                      backgroundColor: 'rgba(255,255,255,0.35)', color: INK, fontFamily: FONT.regular, fontSize: 18,
                    }}
                  />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={{ fontSize: 18, fontFamily: FONT.medium, letterSpacing: -0.2, color: INK }}>Partner commanders</Text>
                    <Text style={{ fontSize: 12, color: INK, opacity: 0.7 }}>Tracks damage from each commander separately</Text>
                  </View>
                  <ToggleSwitch on={q.partner} onToggle={() => a.togglePartner(pi)} />
                </View>

                <View style={{ gap: 10, paddingTop: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: INK }}>Card art background</Text>
                    {!!slotArt && (
                      <Pressable onPress={() => a.clearArt(pi, artSlot)}>
                        <Text style={{ fontFamily: FONT.regular, fontSize: 13, color: INK, textDecorationLine: 'underline' }}>Remove {slotArt.name}</Text>
                      </Pressable>
                    )}
                  </View>

                  {q.partner && (
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {[1, 2].map((slot) => {
                        const art = slot === 1 ? q.art : q.art2;
                        const on = artSlot === slot;
                        return (
                          <Pressable
                            key={slot}
                            onPress={() => a.setArtSlot(slot as 1 | 2)}
                            style={{
                              flex: 1, borderWidth: 1, borderColor: INK, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12,
                              backgroundColor: on ? INK : 'transparent',
                            }}
                          >
                            <Text style={{ fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase', opacity: 0.75, color: on ? '#EDE8DF' : INK }}>Commander {slot}</Text>
                            <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: FONT.medium, color: on ? '#EDE8DF' : INK }}>
                              {art ? art.name : 'No art yet'}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TextInput
                      value={s.artQ}
                      onChangeText={a.setArtQuery}
                      placeholder="Search a card, e.g. Atraxa"
                      placeholderTextColor="rgba(20,19,17,0.4)"
                      onSubmitEditing={a.searchArt}
                      returnKeyType="search"
                      style={{
                        flex: 1, height: 46, borderWidth: 1, borderColor: INK, borderRadius: 23, paddingHorizontal: 18,
                        backgroundColor: 'rgba(255,255,255,0.35)', color: INK, fontFamily: FONT.regular, fontSize: 16,
                      }}
                    />
                    <Pressable onPress={a.searchArt} style={{ height: 46, paddingHorizontal: 18, borderRadius: 23, backgroundColor: INK, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: FONT.medium, fontSize: 15, color: '#EDE8DF' }}>Search</Text>
                    </Pressable>
                  </View>

                  {s.artStatus !== 'ok' && s.artStatus !== 'idle' && (
                    <Text style={{ fontSize: 13, lineHeight: 18, color: INK, opacity: 0.72 }}>
                      {s.artStatus === 'loading'
                        ? 'Searching cards…'
                        : s.artStatus === 'empty'
                        ? 'No cards found. Try another name.'
                        : "Couldn't reach the card database. This preview may block outside sites; it works in the installed app."}
                    </Text>
                  )}

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {s.artRes.map((r, idx) => {
                      const on = !!slotArt && slotArt.url === r.url;
                      return (
                        <Pressable key={idx} onPress={() => a.pickArt(pi, artSlot, r)} style={{ width: '47%', gap: 5 }}>
                          <Image
                            source={{ uri: r.url }}
                            style={{
                              width: '100%', aspectRatio: 4 / 3, borderRadius: 8, backgroundColor: '#D8D2C6',
                              borderWidth: on ? 2 : 0, borderColor: INK,
                            }}
                          />
                          <Text numberOfLines={1} style={{ fontSize: 13, fontFamily: FONT.medium, color: INK }}>{r.name}</Text>
                          <Text numberOfLines={1} style={{ fontSize: 11, color: INK, opacity: 0.7 }}>Art by {r.artist}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 14, marginTop: 4, borderTopWidth: 1, borderTopColor: INK }}>
                  <Text style={{ fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: INK }}>Colors</Text>
                  <Text style={{ fontSize: 18, fontFamily: FONT.medium, letterSpacing: -0.2, color: INK }}>{combo.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 2 }}>
                  {COMBOS.map(([key, name]) => {
                    const info = comboInfo(key);
                    const on = (q.combo || DEFAULT_COMBOS[pi]) === key;
                    return (
                      <Pressable key={key} onPress={() => a.pickCombo(pi, key)} style={{ width: '22%', gap: 6 }}>
                        <GradientSurface
                          stops={info.stops}
                          style={{
                            width: '100%', height: 44, borderRadius: 10, padding: 6, justifyContent: 'flex-end',
                            borderWidth: on ? 2 : 0, borderColor: INK,
                          }}
                        >
                          <Text style={{ fontSize: 11, fontFamily: FONT.semibold, letterSpacing: 1, color: info.dark ? '#141311' : '#F4EFE6' }}>{key}</Text>
                        </GradientSurface>
                        <Text numberOfLines={1} style={{ fontSize: 11, color: INK }}>{name}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </GradientSurface>
      </View>
    </View>
  );
}
