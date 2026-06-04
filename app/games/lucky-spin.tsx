import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const SEGMENTS = [
  { label: '$0.10', value: 0.10, color: '#6C5CE7', probability: 0.30 },
  { label: '$0.25', value: 0.25, color: '#00CEC9', probability: 0.25 },
  { label: '$0.50', value: 0.50, color: '#FD79A8', probability: 0.20 },
  { label: '$1.00', value: 1.00, color: '#FDCB6E', probability: 0.12 },
  { label: '$2.00', value: 2.00, color: '#00B894', probability: 0.07 },
  { label: '$5.00', value: 5.00, color: '#E17055', probability: 0.04 },
  { label: '$10.00', value: 10.00, color: '#A29BFE', probability: 0.015 },
  { label: 'MISS', value: 0, color: '#4A5568', probability: 0.005 },
];

const SPIN_COST = 0.50;
const SEG_COUNT = SEGMENTS.length;
const SEG_DEG = 360 / SEG_COUNT;
const WHEEL_SIZE = 280;
const RADIUS = WHEEL_SIZE / 2;

function pickSegment(): number {
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < SEGMENTS.length; i++) {
    cumulative += SEGMENTS[i].probability;
    if (rand <= cumulative) return i;
  }
  return 0;
}

function WheelSlice({ index, total, color, label }: { index: number; total: number; color: string; label: string }) {
  const segDeg = 360 / total;
  const startDeg = index * segDeg;
  const midDeg = startDeg + segDeg / 2;
  const midRad = ((midDeg - 90) * Math.PI) / 180;
  const textR = RADIUS * 0.62;
  const tx = RADIUS + textR * Math.cos(midRad);
  const ty = RADIUS + textR * Math.sin(midRad);

  return (
    <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: WHEEL_SIZE,
          height: WHEEL_SIZE,
          transform: [{ rotate: `${startDeg}deg` }],
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: RADIUS,
            top: 0,
            width: RADIUS,
            height: WHEEL_SIZE,
            backgroundColor: color,
            transformOrigin: `0 ${RADIUS}px`,
            transform: [{ rotate: `${segDeg}deg` }],
          } as any}
        />
        <View
          style={{
            position: 'absolute',
            left: RADIUS,
            top: 0,
            width: RADIUS,
            height: WHEEL_SIZE,
            backgroundColor: color,
          }}
        />
      </View>
      <Text
        style={{
          position: 'absolute',
          left: tx - 24,
          top: ty - 10,
          width: 48,
          textAlign: 'center',
          fontSize: 10,
          fontWeight: '800',
          color: '#fff',
          transform: [{ rotate: `${midDeg}deg` }],
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function SpinWheel({ rotation }: { rotation: Animated.Value }) {
  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE, transform: [{ rotate: spin }] }}>
      <View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE, borderRadius: RADIUS, overflow: 'hidden', position: 'relative', backgroundColor: Colors.surface }}>
        {SEGMENTS.map((seg, i) => (
          <WheelSlice key={i} index={i} total={SEG_COUNT} color={seg.color} label={seg.label} />
        ))}
        {/* Divider lines */}
        {SEGMENTS.map((_, i) => (
          <View
            key={`line-${i}`}
            style={{
              position: 'absolute',
              left: RADIUS - 1,
              top: 0,
              width: 2,
              height: RADIUS,
              backgroundColor: 'rgba(0,0,0,0.3)',
              transformOrigin: `1px ${RADIUS}px`,
              transform: [{ rotate: `${i * SEG_DEG}deg` }],
            } as any}
          />
        ))}
        {/* Center circle */}
        <View style={styles.wheelCenter}>
          <Text style={styles.wheelCenterText}>SPIN</Text>
        </View>
      </View>
      {/* Outer ring */}
      <View style={[StyleSheet.absoluteFillObject, {
        borderRadius: RADIUS, borderWidth: 6, borderColor: Colors.surfaceAlt, pointerEvents: 'none',
      } as any]} />
    </Animated.View>
  );
}

export default function LuckySpinGame() {
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(24.75);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<{ value: number; label: string } | null>(null);
  const [history, setHistory] = useState<{ label: string; value: number; color: string }[]>([]);
  const [totalWon, setTotalWon] = useState(0);
  const [spins, setSpins] = useState(0);

  const rotationAnim = useRef(new Animated.Value(0)).current;
  const totalRotation = useRef(0);

  const spin = () => {
    if (spinning || balance < SPIN_COST) return;

    setBalance(prev => Math.round((prev - SPIN_COST) * 100) / 100);
    setSpinning(true);
    setLastWin(null);

    const segIndex = pickSegment();
    const targetSegAngle = segIndex * SEG_DEG;
    const extraSpins = 6 + Math.floor(Math.random() * 3);
    const landAt = 360 - targetSegAngle - SEG_DEG / 2;
    const totalDeg = extraSpins * 360 + landAt;

    totalRotation.current += totalDeg;

    Animated.timing(rotationAnim, {
      toValue: totalRotation.current / 360,
      duration: 4500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const seg = SEGMENTS[segIndex];
      setLastWin({ value: seg.value, label: seg.label });
      setSpins(s => s + 1);
      setHistory(prev => [seg, ...prev.slice(0, 4)]);
      if (seg.value > 0) {
        setBalance(prev => Math.round((prev + seg.value) * 100) / 100);
        setTotalWon(prev => Math.round((prev + seg.value) * 100) / 100);
      }
      setSpinning(false);
    });
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Lucky Spin</Text>
        <View style={styles.balancePill}>
          <Ionicons name="wallet" size={14} color={Colors.gold} />
          <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Result Banner */}
      {lastWin !== null && (
        <View style={[styles.resultBanner, { backgroundColor: lastWin.value > 0 ? Colors.success + '22' : Colors.error + '22' }]}>
          <Text style={[styles.resultText, { color: lastWin.value > 0 ? Colors.success : Colors.error }]}>
            {lastWin.value > 0 ? `🎉 You won ${lastWin.label}!` : '😞 No luck this time — try again!'}
          </Text>
        </View>
      )}

      {/* Prizes Legend */}
      <ScrollableSegments />

      {/* Wheel */}
      <View style={styles.wheelWrapper}>
        {/* Pointer arrow at top */}
        <View style={styles.pointerWrap}>
          <View style={styles.pointerArrow} />
        </View>
        <SpinWheel rotation={rotationAnim} />
      </View>

      {/* Spin button */}
      <Text style={styles.costHint}>Each spin costs ${SPIN_COST.toFixed(2)}</Text>
      <TouchableOpacity
        style={[styles.spinBtn, (spinning || balance < SPIN_COST) && styles.spinBtnDisabled]}
        onPress={spin}
        disabled={spinning || balance < SPIN_COST}
      >
        <Ionicons name="sync" size={22} color={Colors.white} />
        <Text style={styles.spinBtnText}>{spinning ? 'Spinning...' : 'SPIN!'}</Text>
      </TouchableOpacity>

      {/* Recent history */}
      {history.length > 0 && (
        <View style={styles.historyRow}>
          {history.map((h, i) => (
            <View key={i} style={[styles.historyPill, { backgroundColor: h.color + '33', borderColor: h.color }]}>
              <Text style={[styles.historyText, { color: h.value > 0 ? Colors.text : Colors.textMuted }]}>{h.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}><Text style={styles.statValue}>{spins}</Text><Text style={styles.statLabel}>Spins</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.stat}><Text style={styles.statValue}>${totalWon.toFixed(2)}</Text><Text style={styles.statLabel}>Won</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.stat}><Text style={styles.statValue}>${(spins * SPIN_COST).toFixed(2)}</Text><Text style={styles.statLabel}>Spent</Text></View>
      </View>
    </View>
  );
}

function ScrollableSegments() {
  return (
    <View style={styles.legendRow}>
      {SEGMENTS.map((s, i) => (
        <View key={i} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: s.color }]} />
          <Text style={styles.legendText}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  backBtn: { padding: 8, backgroundColor: Colors.surface, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  balancePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  balanceText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  resultBanner: {
    marginHorizontal: 20, marginBottom: 8, borderRadius: 12, padding: 10, alignItems: 'center',
  },
  resultText: { fontSize: 15, fontWeight: '700' },
  legendRow: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8, marginBottom: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  wheelWrapper: {
    alignItems: 'center', justifyContent: 'center', marginVertical: 8, position: 'relative',
  },
  pointerWrap: {
    position: 'absolute', top: -14, zIndex: 10, alignItems: 'center',
  },
  pointerArrow: {
    width: 0, height: 0,
    borderLeftWidth: 14, borderRightWidth: 14,
    borderTopWidth: 26,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: Colors.white,
  },
  wheelCenter: {
    position: 'absolute',
    left: RADIUS - 32,
    top: RADIUS - 32,
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.surfaceAlt,
    zIndex: 5,
  },
  wheelCenterText: { fontSize: 11, fontWeight: '900', color: Colors.primary, letterSpacing: 1 },
  costHint: { textAlign: 'center', color: Colors.textSecondary, fontSize: 13, marginTop: 8, marginBottom: 8 },
  spinBtn: {
    marginHorizontal: 20, backgroundColor: Colors.primary, borderRadius: 20,
    paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 12,
  },
  spinBtnDisabled: { backgroundColor: Colors.surfaceAlt },
  spinBtnText: { fontSize: 20, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  historyRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12, justifyContent: 'center' },
  historyPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  historyText: { fontSize: 12, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 20, backgroundColor: Colors.surface,
    borderRadius: 16, padding: 16, marginBottom: 20, alignItems: 'center',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
});
