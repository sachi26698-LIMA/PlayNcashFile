import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const SEGMENTS = [
  { label: '$0.10', value: 0.10, colors: ['#6C5CE7', '#4F46E5'] as const, probability: 0.30 },
  { label: '$0.25', value: 0.25, colors: ['#06B6D4', '#0284C7'] as const, probability: 0.25 },
  { label: '$0.50', value: 0.50, colors: ['#EC4899', '#BE185D'] as const, probability: 0.20 },
  { label: '$1.00', value: 1.00, colors: ['#F59E0B', '#D97706'] as const, probability: 0.12 },
  { label: '$2.00', value: 2.00, colors: ['#10B981', '#059669'] as const, probability: 0.07 },
  { label: '$5.00', value: 5.00, colors: ['#F97316', '#EA580C'] as const, probability: 0.04 },
  { label: '$10.00', value: 10.00, colors: ['#A78BFA', '#7C3AED'] as const, probability: 0.015 },
  { label: 'MISS', value: 0, colors: ['#334155', '#1E293B'] as const, probability: 0.005 },
];

const SPIN_COST = 0.50;
const SEG_COUNT = SEGMENTS.length;
const SEG_DEG = 360 / SEG_COUNT;
const WHEEL_SIZE = 270;
const R = WHEEL_SIZE / 2;

function pickSegment(): number {
  let r = Math.random(), c = 0;
  for (let i = 0; i < SEGMENTS.length; i++) {
    c += SEGMENTS[i].probability;
    if (r <= c) return i;
  }
  return 0;
}

function WheelView({ rotation }: { rotation: Animated.Value }) {
  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE, transform: [{ rotate: spin }] }}>
      {/* Outer glow ring */}
      <View style={styles.wheelGlowRing} />
      <View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE, borderRadius: R, overflow: 'hidden', position: 'relative' }}>
        {SEGMENTS.map((seg, i) => {
          const midAngle = (i + 0.5) * SEG_DEG;
          const midRad = ((midAngle - 90) * Math.PI) / 180;
          const textR = R * 0.63;
          const tx = R + textR * Math.cos(midRad) - 22;
          const ty = R + textR * Math.sin(midRad) - 10;
          return (
            <View key={i} style={StyleSheet.absoluteFillObject}>
              {/* Segment slice using clip */}
              <View style={[StyleSheet.absoluteFillObject, { transform: [{ rotate: `${i * SEG_DEG}deg` }], overflow: 'hidden' }]}>
                <View style={[styles.sliceLeft, { backgroundColor: seg.colors[0] }]} />
              </View>
              <View style={[StyleSheet.absoluteFillObject, { transform: [{ rotate: `${i * SEG_DEG + SEG_DEG}deg` }], overflow: 'hidden' }]}>
                <View style={[styles.sliceRight, { backgroundColor: seg.colors[0] }]} />
              </View>
              {/* Label */}
              <View style={[styles.segLabelWrap, { left: tx, top: ty, transform: [{ rotate: `${midAngle}deg` }] }]}>
                <Text style={styles.segLabel}>{seg.label}</Text>
              </View>
            </View>
          );
        })}
        {/* Divider lines */}
        {SEGMENTS.map((_, i) => (
          <View key={`d${i}`} style={[styles.divider, { transform: [{ rotate: `${i * SEG_DEG}deg` }] } as any]} />
        ))}
        {/* Center */}
        <View style={styles.wheelCenter}>
          <LinearGradient colors={Colors.gradientPrimary} style={styles.wheelCenterGrad}>
            <Ionicons name="star" size={18} color={Colors.white} />
          </LinearGradient>
        </View>
      </View>
    </Animated.View>
  );
}

export default function LuckySpinGame() {
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(24.75);
  const [spinning, setSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<typeof SEGMENTS[0] | null>(null);
  const [history, setHistory] = useState<typeof SEGMENTS[0][]>([]);
  const [totalWon, setTotalWon] = useState(0);
  const [spins, setSpins] = useState(0);

  const rotAnim = useRef(new Animated.Value(0)).current;
  const totalRot = useRef(0);
  const resultScale = useRef(new Animated.Value(0)).current;

  const spin = () => {
    if (spinning || balance < SPIN_COST) return;
    setBalance(p => Math.round((p - SPIN_COST) * 100) / 100);
    setSpinning(true);
    setLastResult(null);
    resultScale.setValue(0);

    const idx = pickSegment();
    const landAt = 360 - idx * SEG_DEG - SEG_DEG / 2;
    const fullSpins = 7 + Math.floor(Math.random() * 3);
    totalRot.current += fullSpins * 360 + landAt;

    Animated.timing(rotAnim, {
      toValue: totalRot.current / 360,
      duration: 4800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const seg = SEGMENTS[idx];
      setLastResult(seg);
      setSpins(s => s + 1);
      setHistory(h => [seg, ...h.slice(0, 4)]);
      if (seg.value > 0) {
        setBalance(p => Math.round((p + seg.value) * 100) / 100);
        setTotalWon(p => Math.round((p + seg.value) * 100) / 100);
      }
      setSpinning(false);
      Animated.spring(resultScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.background, Colors.surface]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Lucky Spin</Text>
          <Text style={styles.subtitle}>Win up to $10.00 per spin</Text>
        </View>
        <LinearGradient colors={Colors.gradientPrimary} style={styles.balancePill}>
          <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
        </LinearGradient>
      </LinearGradient>

      {/* Result */}
      {lastResult && (
        <Animated.View style={{ transform: [{ scale: resultScale }], marginHorizontal: 16, marginTop: 10 }}>
          <LinearGradient
            colors={lastResult.value > 0 ? [Colors.success, Colors.successLight] : [Colors.error, '#F87171']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.resultBanner}
          >
            <Text style={styles.resultText}>
              {lastResult.value > 0 ? `🎉 You won ${lastResult.label}!` : '😞 No luck — try again!'}
            </Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Prizes legend */}
      <View style={styles.legendRow}>
        {SEGMENTS.map((s, i) => (
          <View key={i} style={styles.legendItem}>
            <LinearGradient colors={s.colors} style={styles.legendDot} />
            <Text style={styles.legendText}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Wheel area */}
      <View style={styles.wheelArea}>
        {/* Glow background */}
        <View style={styles.wheelGlow} />
        {/* Pointer */}
        <View style={styles.pointer}>
          <View style={styles.pointerShadow} />
          <LinearGradient colors={['#F8FAFC', '#CBD5E1']} style={styles.pointerShape} />
        </View>
        <WheelView rotation={rotAnim} />
      </View>

      {/* Spin cost */}
      <Text style={styles.costHint}>Each spin costs <Text style={{ color: Colors.primaryLight, fontWeight: '700' }}>${SPIN_COST.toFixed(2)}</Text></Text>

      {/* Spin button */}
      <TouchableOpacity onPress={spin} disabled={spinning || balance < SPIN_COST} activeOpacity={0.9} style={styles.spinBtnWrap}>
        <LinearGradient
          colors={(spinning || balance < SPIN_COST) ? [Colors.surfaceAlt, Colors.surfaceAlt] : ['#7C3AED', '#EC4899']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.spinBtn}
        >
          <Ionicons name="sync" size={22} color={Colors.white} />
          <Text style={styles.spinBtnText}>{spinning ? 'Spinning...' : '  S P I N  '}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* History */}
      {history.length > 0 && (
        <View style={styles.historyRow}>
          {history.map((h, i) => (
            <LinearGradient key={i} colors={h.colors} style={styles.historyPill}>
              <Text style={styles.historyText}>{h.label}</Text>
            </LinearGradient>
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Spins', value: `${spins}`, color: Colors.primaryLight },
          { label: 'Total Won', value: `$${totalWon.toFixed(2)}`, color: Colors.success },
          { label: 'Spent', value: `$${(spins * SPIN_COST).toFixed(2)}`, color: Colors.error },
        ].map((s, i) => (
          <View key={s.label} style={[styles.statCard, i < 2 && styles.statCardBorder]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  titleWrap: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  balancePill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  balanceText: { fontSize: 14, fontWeight: '800', color: Colors.white },
  resultBanner: { borderRadius: 14, padding: 12, alignItems: 'center' },
  resultText: { fontSize: 15, fontWeight: '800', color: Colors.white },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, paddingTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  wheelArea: { alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative' },
  wheelGlow: {
    position: 'absolute', width: WHEEL_SIZE + 60, height: WHEEL_SIZE + 60, borderRadius: (WHEEL_SIZE + 60) / 2,
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  wheelGlowRing: {
    position: 'absolute', inset: -6, borderRadius: R + 6,
    borderWidth: 4, borderColor: 'rgba(124,58,237,0.3)',
  },
  pointer: { position: 'absolute', top: -2, zIndex: 10, alignItems: 'center' },
  pointerShape: {
    width: 0, height: 0,
    borderLeftWidth: 13, borderRightWidth: 13, borderTopWidth: 28,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: Colors.white,
    borderRadius: 2,
  } as any,
  pointerShadow: {
    position: 'absolute', bottom: -4, width: 16, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sliceLeft: {
    position: 'absolute', left: R, top: 0, width: R, height: R,
    transformOrigin: '0 100%',
    transform: [{ rotate: `${SEG_DEG}deg` }],
  } as any,
  sliceRight: {
    position: 'absolute', left: R, top: 0, width: R, height: R,
  },
  segLabelWrap: { position: 'absolute', width: 44, alignItems: 'center' },
  segLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.95)', textAlign: 'center' },
  divider: {
    position: 'absolute', left: R - 1, top: 0, width: 2, height: R,
    backgroundColor: 'rgba(0,0,0,0.25)',
    transformOrigin: `1px ${R}px`,
  } as any,
  wheelCenter: {
    position: 'absolute', left: R - 26, top: R - 26,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.background,
    borderWidth: 3, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', zIndex: 5,
  },
  wheelCenterGrad: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  costHint: { textAlign: 'center', color: Colors.textSecondary, fontSize: 13, marginBottom: 8 },
  spinBtnWrap: { marginHorizontal: 16, marginBottom: 10, borderRadius: 22, overflow: 'hidden' },
  spinBtn: { paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  spinBtnText: { fontSize: 20, fontWeight: '900', color: Colors.white, letterSpacing: 2 },
  historyRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 10, justifyContent: 'center' },
  historyPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  historyText: { fontSize: 12, fontWeight: '800', color: Colors.white },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 16,
    backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statCardBorder: { borderRightWidth: 1, borderRightColor: Colors.border },
  statValue: { fontSize: 17, fontWeight: '800' },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
});
