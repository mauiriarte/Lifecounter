import React, { useRef } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import { Seat } from '../lib/layout';
import { ComboInfo, gradStops } from '../lib/mana';
import { pad2, fmt } from '../lib/format';
import { DOOM } from '../lib/doom';
import { outReason } from '../lib/rules';
import { useGameActions, useGameState } from '../state/GameContext';
import { Player } from '../types';
import { FONT, INK, PAPER } from '../theme';
import { GradientSurface } from './GradientSurface';
import { RadialGlow } from './RadialGlow';
import { TileArtLayer } from './TileArtLayer';
import { Grain } from './primitives';
import { ClockIcon, DropletIcon, MinusIcon, PlusIcon, SkullIcon } from './icons';

const SWIPE_CLAIM = 12;
const SWIPE_MIN = 50;

export function PlayerTile({
  index,
  player: q,
  players,
  seat,
  colors,
  combos,
}: {
  index: number;
  player: Player;
  players: Player[];
  seat: Seat;
  colors: string[];
  combos: ComboInfo[];
}) {
  const state = useGameState();
  const actions = useGameActions();
  const n = players.length;

  const side = seat.rot === 90 || seat.rot === 270;
  const iw = side ? seat.h : seat.w;
  const ih = side ? seat.w : seat.h;
  const small = iw < 260;

  const reason = outReason(q);
  const out = !!reason;
  const active = state.active === index;
  const zero = q.time <= 0;
  const maxC = Math.max(0, ...q.cmdr);
  const runningHere = active && state.running && !zero;
  const showFooter = q.poison > 0;
  const slotH = state.clocksOn ? (small ? 32 : 40) : 20;
  const mid = ih - 24 - 2 * slotH - 2 * 8;
  const lifeSize = Math.round(Math.min(mid * 1.15, (iw - 2 * 58) / 1.15));

  const combo = combos[index];
  const cm = state.cmdMode != null && state.cmdMode < n ? state.cmdMode : null;
  const isSource0 = cm != null && cm !== index;
  const dark = !out && !isSource0 && !q.art && combo.dark;
  const CT = dark ? INK : PAPER;
  const fg = out && !isSource0 ? '#9A9488' : CT;

  const cntSel = cm == null ? state.cnt[index] ?? null : null;
  const energy = q.energy || 0;
  const exp = q.exp || 0;

  const isVictim = cm === index;
  const srcPartner = isSource0 && !!q.partner;
  const isSource = isSource0 && !srcPartner;
  const isSourceP = srcPartner;
  const normal = cm == null && cntSel == null;
  const isCnt = cntSel != null;

  const fl = state.flash[index];
  const dv = state.deltas[index] || 0;

  let bgStops: string[];
  let showRadial = false;
  let showArt = false;
  if (isSource0) bgStops = gradStops('#22201C');
  else if (out) { bgStops = gradStops('#141311'); showRadial = true; }
  else if (q.art || (q.partner && q.art2)) { bgStops = combo.stops; showArt = true; }
  else bgStops = combo.stops;

  const flashColor = (slot: string) =>
    fl === slot ? (dark ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.16)') : 'transparent';
  const lifeScale = fl ? 1.07 : 1;

  const name = q.name || (small ? '' : 'Player');
  const label = out ? (small ? 'Out' : `Out / ${reason === 'poison' ? 'Poison' : reason === 'cmdr' ? 'Commander' : 'Life'}`) : name;

  const badges: { text: string }[] = [];
  if (energy > 0) badges.push({ text: `EN ${energy}` });
  if (exp > 0) badges.push({ text: `XP ${exp}` });

  const clockBg = zero ? PAPER : runningHere ? CT : active ? (dark ? 'rgba(20,19,17,0.12)' : 'rgba(255,255,255,0.18)') : 'transparent';
  const clockFg = zero ? '#B23A1C' : runningHere ? (dark ? '#ECE7DC' : out ? '#2A2824' : colors[index]) : fg;

  const doomMessages = reason ? DOOM[reason] : DOOM.life;
  const doomMsg = out ? doomMessages[(index * 3 + state.doomPhase) % doomMessages.length] : '';
  const doomTag = out
    ? `${pad2(index + 1)} · ${q.name || 'Player'} · ${reason === 'poison' ? 'Poisoned' : reason === 'cmdr' ? 'Commander' : 'Fallen'}`
    : '';

  // --- swipe gesture: vertical toggles counters, horizontal toggles commander-damage victim mode ---
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, g) => Math.abs(g.dx) > SWIPE_CLAIM || Math.abs(g.dy) > SWIPE_CLAIM,
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (_evt, g) => {
        const mag = Math.hypot(g.dx, g.dy);
        if (mag < SWIPE_MIN) return;
        let lx = g.dx;
        let ly = g.dy;
        if (seat.rot === 180) { lx = -g.dx; ly = -g.dy; }
        else if (seat.rot === 90) { lx = g.dy; ly = -g.dx; }
        else if (seat.rot === 270) { lx = -g.dy; ly = g.dx; }
        if (Math.abs(ly) > Math.abs(lx)) {
          if (state.cmdMode != null) return;
          if (ly > 0) actions.setCnt(index, cntSel ? null : 'poison');
          else if (cntSel) actions.setCnt(index, null);
          return;
        }
        actions.toggleCmdModeFromSwipe(index);
      },
    })
  ).current;

  const victim = cm != null ? players[cm] : null;
  const srcV = isSource0 && victim ? victim.cmdr[index] : 0;
  const srcV2 = isSource0 && victim ? victim.cmdr2[index] || 0 : 0;
  const pSecH = (ih - 24 - 26 - 12) / 2;
  const pSize = Math.round(Math.min(pSecH * 0.78, (iw - 116) / 1.15));

  return (
    <View
      style={{
        position: 'absolute',
        left: seat.x,
        top: seat.y,
        width: seat.w,
        height: seat.h,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: isVictim ? 3 : isSource0 ? 2 : 0,
        borderColor: isVictim ? PAPER : isSource0 ? colors[index] : 'transparent',
      }}
    >
      <GradientSurface stops={bgStops} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
      {showRadial && <RadialGlow />}
      {showArt && <TileArtLayer art={q.art} art2={q.art2} partner={q.partner} />}
      <Grain opacity={0.55} blend="overlay" baseFrequency={0.9} />

      <View
        {...pan.panHandlers}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: iw,
          height: ih,
          marginLeft: -iw / 2,
          marginTop: -ih / 2,
          transform: [{ rotate: `${seat.rot}deg` }],
        }}
      >
        {normal && (
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => actions.lifeTap(index, -1)}
              accessibilityLabel="Lose 1 life"
              style={{
                position: 'absolute', left: 0, top: 0, width: '50%', height: '100%',
                backgroundColor: flashColor('L'), alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 14,
              }}
            >
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}>
                <MinusIcon size={24} color={fg} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => actions.lifeTap(index, 1)}
              accessibilityLabel="Gain 1 life"
              style={{
                position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
                backgroundColor: flashColor('R'), alignItems: 'flex-end', justifyContent: 'center', paddingRight: 14,
              }}
            >
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}>
                <PlusIcon size={24} color={fg} />
              </View>
            </Pressable>

            <View pointerEvents="box-none" style={{ flex: 1, padding: small ? 10 : 12, paddingHorizontal: 14, justifyContent: 'space-between' }}>
              {out ? (
                <View pointerEvents="box-none" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <View style={{ opacity: state.doomFade ? 0.45 : 0.92 }}>
                    <SkullIcon size={Math.round(Math.max(34, Math.min(96, ih * 0.3, iw * 0.28)))} color="#D9CFC0" />
                  </View>
                  <Text
                    style={{
                      fontFamily: FONT.light, fontSize: small ? 13 : iw > 300 && ih > 300 ? 20 : 16,
                      lineHeight: (small ? 13 : iw > 300 && ih > 300 ? 20 : 16) * 1.25, letterSpacing: 0.3,
                      color: '#E6DDCF', textAlign: 'center', opacity: state.doomFade ? 0 : 1, maxWidth: Math.max(120, iw - 2 * 58),
                    }}
                  >
                    {doomMsg}
                  </Text>
                  <Pressable onPress={() => actions.openPanel(index)} style={{ paddingHorizontal: 6, height: 22, justifyContent: 'center' }}>
                    <Text style={{ fontFamily: FONT.medium, fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: '#8E867A' }}>
                      {doomTag}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    {badges.map((b, k) => (
                      <View key={k} style={{ height: 20, borderRadius: 3, paddingHorizontal: 6, backgroundColor: 'rgba(0,0,0,0.22)', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 0.7, color: fg }}>{b.text}</Text>
                      </View>
                    ))}
                  </View>

                  <View pointerEvents="box-none" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Pressable onPress={() => actions.openPanel(index)} style={{ height: slotH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 6 }}>
                      <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: fg }}>{pad2(index + 1)}</Text>
                      {!!label && <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: fg, opacity: 0.72 }}>{label}</Text>}
                    </Pressable>
                    <View style={{ position: 'relative' }}>
                      <Text style={{ fontFamily: FONT.regular, fontSize: lifeSize, lineHeight: lifeSize * 0.9, letterSpacing: -lifeSize * 0.05, color: fg, transform: [{ scale: lifeScale }] }}>
                        {q.life}
                      </Text>
                      {dv !== 0 && (
                        <View
                          pointerEvents="none"
                          style={{
                            position: 'absolute', left: '100%', top: 0, marginLeft: 6,
                            paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12,
                            backgroundColor: 'rgba(0,0,0,0.28)',
                          }}
                        >
                          <Text numberOfLines={1} style={{ fontFamily: FONT.medium, fontSize: 15, color: fg }}>
                            {dv > 0 ? `+${dv}` : `−${Math.abs(dv)}`}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ height: slotH, alignItems: 'center', justifyContent: 'center' }}>
                      {state.clocksOn && (
                        <Pressable
                          onPress={() => actions.clockTap(index)}
                          accessibilityLabel={runningHere ? 'End turn, pass the clock' : 'Start clock'}
                          style={{
                            height: slotH, paddingHorizontal: small ? 10 : 14, borderRadius: 999,
                            backgroundColor: clockBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
                          }}
                        >
                          <ClockIcon size={small ? 15 : 18} color={clockFg} strokeWidth={2.2} />
                          <Text style={{ fontFamily: FONT.medium, fontSize: small ? 17 : 22, color: clockFg }}>{zero ? 'TIME' : fmt(q.time)}</Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  {showFooter && (
                    <Pressable
                      onPress={() => actions.openCounters(index)}
                      accessibilityLabel="Poison counters"
                      style={{
                        position: 'absolute', left: 0, bottom: 0, height: 24, borderRadius: 3, paddingHorizontal: 6,
                        backgroundColor: reason === 'poison' ? PAPER : 'transparent',
                        flexDirection: 'row', alignItems: 'center', gap: 6,
                      }}
                    >
                      <DropletIcon size={13} color={reason === 'poison' ? bgStops[1] ?? bgStops[0] : fg} />
                      <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.1, color: reason === 'poison' ? bgStops[1] ?? bgStops[0] : fg }}>
                        {pad2(q.poison)}
                      </Text>
                    </Pressable>
                  )}
                  {showArt && (
                    <Text
                      numberOfLines={1}
                      style={{ position: 'absolute', right: 0, bottom: 0, maxWidth: '45%', fontSize: 9, letterSpacing: 0.4, color: fg, opacity: 0.75 }}
                    >
                      {`Art: ${[q.art?.artist, q.partner && q.art2 ? q.art2.artist : null].filter(Boolean).join(' / ')}`}
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {isCnt && cntSel && (
          <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
            <Pressable
              onPress={() => actions.counterStep(index, cntSel, -1)}
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', backgroundColor: flashColor('L'), alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 14 }}
            >
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}><MinusIcon size={24} color={fg} /></View>
            </Pressable>
            <Pressable
              onPress={() => actions.counterStep(index, cntSel, 1)}
              style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', backgroundColor: flashColor('R'), alignItems: 'flex-end', justifyContent: 'center', paddingRight: 14 }}
            >
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}><PlusIcon size={24} color={fg} /></View>
            </Pressable>

            <View pointerEvents="box-none" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 26 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: fg }}>{pad2(index + 1)}</Text>
                <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: fg, opacity: 0.72 }}>
                  {cntSel === 'poison' ? 'Poison' : cntSel === 'energy' ? 'Energy' : small ? 'Exp' : 'Experience'}
                </Text>
              </View>
              <Pressable onPress={() => actions.setCnt(index, null)} style={{ height: 26, paddingHorizontal: 14, borderRadius: 13, backgroundColor: PAPER, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 12, letterSpacing: 0.7, textTransform: 'uppercase', color: combo.solid }}>Done</Text>
              </Pressable>
            </View>

            <View pointerEvents="none" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: FONT.regular, fontSize: Math.round(Math.min(mid * 1.15, (iw - 2 * 58) / 1.15)), lineHeight: lifeSize * 0.9, color: fg, transform: [{ scale: lifeScale }] }}>
                {cntSel === 'poison' ? q.poison : cntSel === 'energy' ? energy : exp}
              </Text>
            </View>

            <View pointerEvents="box-none" style={{ flexDirection: 'row', gap: 4, height: 30 }}>
              {(['poison', 'energy', 'exp', 'cmd'] as const).map((k) => {
                const on = k === cntSel;
                const kLabel = k === 'poison' ? String(q.poison) : k === 'energy' ? `${small ? 'EN ' : 'Energy '}${energy}` : k === 'exp' ? `${small ? 'XP ' : 'Exp '}${exp}` : small ? 'CMD' : 'Cmdr dmg';
                return (
                  <Pressable
                    key={k}
                    onPress={() => (k === 'cmd' ? actions.setCmdModeFromChip(index) : actions.setCnt(index, k))}
                    style={{
                      flex: 1, height: 30, borderRadius: 15, borderWidth: 1, borderColor: on ? PAPER : 'rgba(244,239,230,0.38)',
                      backgroundColor: on ? PAPER : 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}
                  >
                    {k === 'poison' && <DropletIcon size={12} color={on ? bgStops[0] : fg} />}
                    <Text numberOfLines={1} style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 0.7, textTransform: 'uppercase', color: on ? bgStops[0] : fg }}>
                      {kLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {isVictim && (
          <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 26 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: fg }}>{pad2(index + 1)}</Text>
                <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: fg, opacity: 0.72 }}>
                  {small ? 'Cmdr dmg' : 'Commander damage'}
                </Text>
              </View>
              <Pressable onPress={actions.exitCmdMode} style={{ height: 26, paddingHorizontal: 14, borderRadius: 13, backgroundColor: PAPER, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: FONT.semibold, fontSize: 12, letterSpacing: 0.7, textTransform: 'uppercase', color: combo.solid }}>Done</Text>
              </Pressable>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: FONT.regular, fontSize: lifeSize, lineHeight: lifeSize * 0.9, color: fg }}>{q.life}</Text>
            </View>
            <Text style={{ height: 24, fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: fg, opacity: 0.8 }}>
              {small ? 'Use other boxes' : "Add it on the attacker's box"}
            </Text>
          </View>
        )}

        {isSource && victim && (
          <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 8 }}>
            <Pressable
              onPress={() => actions.commanderStep(cm!, index, 1, -1)}
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '50%', backgroundColor: flashColor('L1'), alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 14 }}
            >
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}><MinusIcon size={24} color={PAPER} /></View>
            </Pressable>
            <Pressable
              onPress={() => actions.commanderStep(cm!, index, 1, 1)}
              style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', backgroundColor: flashColor('R1'), alignItems: 'flex-end', justifyContent: 'center', paddingRight: 14 }}
            >
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}><PlusIcon size={24} color={PAPER} /></View>
            </Pressable>

            <View pointerEvents="none" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 26 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 10, height: 10, backgroundColor: colors[index] }} />
                <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: PAPER }}>
                  {`From ${q.name || (small ? pad2(index + 1) : `Player ${pad2(index + 1)}`)}`}
                </Text>
              </View>
              <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: PAPER, opacity: 0.72 }}>{`To ${pad2(cm! + 1)}`}</Text>
            </View>
            <View pointerEvents="none" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: FONT.regular, fontSize: Math.round(lifeSize * 0.9), color: srcV >= 21 ? '#F2A48C' : PAPER }}>{srcV}</Text>
            </View>
            <View pointerEvents="none" style={{ height: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: PAPER, opacity: 0.72 }}>Commander dmg</Text>
              <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: srcV >= 21 ? '#F2A48C' : PAPER }}>
                {srcV >= 21 ? 'Lethal' : `${srcV} / 21`}
              </Text>
            </View>
          </View>
        )}

        {isSourceP && victim && (
          <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, gap: 6 }}>
            <View pointerEvents="none" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 26 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 10, height: 10, backgroundColor: colors[index] }} />
                <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: PAPER }}>
                  {`From ${q.name || (small ? pad2(index + 1) : `Player ${pad2(index + 1)}`)}`}
                </Text>
              </View>
              <Text style={{ fontFamily: FONT.medium, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', color: PAPER, opacity: 0.72 }}>{`To ${pad2(cm! + 1)}`}</Text>
            </View>

            {[1, 2].map((slot) => {
              const val = slot === 1 ? srcV : srcV2;
              const artLabel = slot === 1 ? q.art?.name : q.art2?.name;
              const slotLabel = artLabel || (small ? `Cmdr ${slot}` : `Commander ${slot}`);
              return (
                <View key={slot} style={{ flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Pressable
                    onPress={() => actions.commanderStep(cm!, index, slot as 1 | 2, -1)}
                    style={{ position: 'absolute', left: -14, top: 0, bottom: 0, width: '50%', backgroundColor: flashColor(`L${slot}`), alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 14 }}
                  >
                    <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}><MinusIcon size={22} color={PAPER} /></View>
                  </Pressable>
                  <Pressable
                    onPress={() => actions.commanderStep(cm!, index, slot as 1 | 2, 1)}
                    style={{ position: 'absolute', right: -14, top: 0, bottom: 0, width: '50%', backgroundColor: flashColor(`R${slot}`), alignItems: 'flex-end', justifyContent: 'center', paddingRight: 14 }}
                  >
                    <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}><PlusIcon size={22} color={PAPER} /></View>
                  </Pressable>
                  <Text numberOfLines={1} pointerEvents="none" style={{ maxWidth: '60%', fontFamily: FONT.medium, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: PAPER, opacity: 0.75 }}>
                    {slotLabel}
                  </Text>
                  <Text pointerEvents="none" style={{ fontFamily: FONT.regular, fontSize: pSize, color: val >= 21 ? '#F2A48C' : PAPER }}>{val}</Text>
                  <Text pointerEvents="none" style={{ fontFamily: FONT.medium, fontSize: 10, letterSpacing: 0.9, textTransform: 'uppercase', color: val >= 21 ? '#F2A48C' : PAPER }}>
                    {val >= 21 ? 'Lethal' : `${val} / 21`}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
