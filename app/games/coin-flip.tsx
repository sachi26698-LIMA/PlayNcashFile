import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

type Side = 'heads' | 'tails';

const BET_OPTIONS = [0.10, 0.25, 0.50, 1.00];

export default function CoinFlipGame() {
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(24.75);
  const [bet, setBet] = useState(0.25);
  const [pick, setPick] = useState<Side>('heads');
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [landedSide, setLandedSide] = useState<Side | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalWon, setTotalWon] = useState(0);

  // 3D flip animation
  const rotateY = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Idle float
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const flipCoin = () => {
    if (flipping || balance < bet) return;
    setResult(null);
    setLandedSide(null);
    setFlipping(true);
    resultScale.setValue(0);
    glowAnim.setValue(0);

    const outcome: Side = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = outcome === pick;

    // 3D spin: multiple full 360 rotations + land on correct face
    // heads = 0°, tails = 180°
    const extraFlips = 4;
    const finalAngle = extraFlips * 360 + (outcome === 'tails' ? 180 : 0);

    Animated.timing(rotateY, {
      toValue: finalAngle,
      duration: 1800,
      useNativeDriver: true,
    }).start(() => {
      setFlipping(false);
      setLandedSide(outcome);
      setResult(won ? 'win' : 'loss');

      if (won) {
        const winAmount = bet * 1.9;
        setBalance(prev => Math.round((prev + winAmount) * 100) / 100);
        setStreak(s => s + 1);
        setTotalWon(prev => Math.round((prev + winAmount) * 100) / 100);
      } else {
        setBalance(prev => Math.round((prev - bet) * 100) / 100);
        setStreak(0);
      }

      Animated.spring(resultScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start();
    });
  };

  // Calculate 3D perspective transform
  const spin = rotateY.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const headsOpacity = rotateY.interpolate({
    inputRange: [0, 89, 90, 269, 270, 360],
    outputRange: [1, 1, 0, 0, 1, 1],
  });

  const tailsOpacity = rotateY.interpolate({
    inputRange: [0, 89, 90, 269, 270, 360],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  const won = result === 'win';
  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', won ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.background, Colors.surface]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Coin Flip</Text>
          <Text style={styles.subtitle}>50% Win Chance · 1.9x Payout</Text>
        </View>
        <LinearGradient colors={Colors.gradientGold} style={styles.balancePill}>
          <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
        </LinearGradient>
      </LinearGradient>

      {/* Streak banner */}
      {streak >= 2 && (
        <LinearGradient colors={['#F97316', '#EF4444']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.streakBanner}>
          <Text style={styles.streakText}>🔥 {streak} Win Streak! Keep going!</Text>
        </LinearGradient>
      )}

      {/* Coin Arena */}
      <Animated.View style={[styles.coinArena, { backgroundColor: glowColor }]}>
        {/* 3D Coin */}
        <Animated.View style={[styles.coinContainer, { transform: [{ translateY }, { perspective: 800 } as any, { rotateY: spin }] }]}>
          {/* Heads face */}
          <Animated.View style={[styles.coin, styles.coinFaceHeads, { opacity: headsOpacity }]}>
            <LinearGradient colors={['#FCD34D', '#F59E0B', '#D97706']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.coinFace}>
              <View style={styles.coinRim} />
              <Text style={styles.coinEmoji}>👑</Text>
              <Text style={styles.coinFaceLabel}>HEADS</Text>
            </LinearGradient>
          </Animated.View>
          {/* Tails face */}
          <Animated.View style={[styles.coin, styles.coinFaceTails, { opacity: tailsOpacity }]}>
            <LinearGradient colors={['#A78BFA', '#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.coinFace}>
              <View style={styles.coinRim} />
              <Text style={styles.coinEmoji}>🦅</Text>
              <Text style={styles.coinFaceLabel}>TAILS</Text>
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* Shadow */}
        <View style={styles.coinShadow} />

        {/* Result popup */}
        {result && (
          <Animated.View style={[styles.resultPop, { transform: [{ scale: resultScale }] }]}>
            <LinearGradient
              colors={won ? [Colors.success, Colors.successLight] : [Colors.error, '#F87171']}
              style={styles.resultPopInner}
            >
              <Text style={styles.resultPopEmoji}>{won ? '🎉' : '😞'}</Text>
              <Text style={styles.resultPopTitle}>{won ? 'YOU WON!' : 'YOU LOST'}</Text>
              <Text style={styles.resultPopAmount}>{won ? `+$${(bet * 1.9).toFixed(2)}` : `-$${bet.toFixed(2)}`}</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </Animated.View>

      {/* Pick Side */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PICK YOUR SIDE</Text>
        <View style={styles.pickRow}>
          {(['heads', 'tails'] as Side[]).map(side => (
            <TouchableOpacity key={side} onPress={() => !flipping && setPick(side)} style={{ flex: 1 }} activeOpacity={0.85}>
              {pick === side ? (
                <LinearGradient
                  colors={side === 'heads' ? ['#FCD34D', '#F59E0B'] : ['#A78BFA', '#7C3AED']}
                  style={styles.pickBtnActive}
                >
                  <Text style={styles.pickEmoji}>{side === 'heads' ? '👑' : '🦅'}</Text>
                  <Text style={styles.pickLabelActive}>{side === 'heads' ? 'Heads' : 'Tails'}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.pickBtn}>
                  <Text style={styles.pickEmoji}>{side === 'heads' ? '👑' : '🦅'}</Text>
                  <Text style={styles.pickLabel}>{side === 'heads' ? 'Heads' : 'Tails'}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bet */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>BET AMOUNT</Text>
        <View style={styles.betRow}>
          {BET_OPTIONS.map(amt => (
            <TouchableOpacity key={amt} onPress={() => !flipping && setBet(amt)} style={{ flex: 1 }}>
              {bet === amt ? (
                <LinearGradient colors={Colors.gradientPrimary} style={styles.betActive}>
                  <Text style={styles.betActiveText}>${amt.toFixed(2)}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.betBtn}>
                  <Text style={styles.betText}>${amt.toFixed(2)}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Flip button */}
      <TouchableOpacity
        style={{ marginHorizontal: 20, marginBottom: 16, borderRadius: 20, overflow: 'hidden' }}
        onPress={flipCoin}
        disabled={flipping || balance < bet}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={(flipping || balance < bet) ? [Colors.surfaceAlt, Colors.surfaceAlt] : ['#7C3AED', '#EC4899']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.flipBtn}
        >
          <Ionicons name={flipping ? 'ellipsis-horizontal' : 'sync'} size={20} color={Colors.white} />
          <Text style={styles.flipBtnText}>{flipping ? 'Flipping...' : `Flip for $${bet.toFixed(2)}`}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Won', value: `$${totalWon.toFixed(2)}`, color: Colors.success },
          { label: 'Streak', value: `${streak} 🔥`, color: Colors.warning },
          { label: 'Chance', value: '50%', color: Colors.primaryLight },
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

const COIN_SIZE = 160;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
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
  streakBanner: { marginHorizontal: 16, marginTop: 10, borderRadius: 14, padding: 10, alignItems: 'center' },
  streakText: { fontSize: 14, fontWeight: '800', color: Colors.white },
  coinArena: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    position: 'relative', borderRadius: 24, margin: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  coinContainer: { width: COIN_SIZE, height: COIN_SIZE, position: 'relative' },
  coin: { position: 'absolute', width: COIN_SIZE, height: COIN_SIZE, borderRadius: COIN_SIZE / 2 },
  coinFaceHeads: {},
  coinFaceTails: {},
  coinFace: {
    flex: 1, borderRadius: COIN_SIZE / 2, alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 20,
    elevation: 20,
  },
  coinRim: {
    position: 'absolute', inset: 8, borderRadius: COIN_SIZE / 2 - 8,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)',
  },
  coinEmoji: { fontSize: 52 },
  coinFaceLabel: { fontSize: 12, fontWeight: '900', color: 'rgba(255,255,255,0.9)', letterSpacing: 2 },
  coinShadow: {
    width: COIN_SIZE * 0.7, height: 20, borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.4)', marginTop: 20,
  },
  resultPop: { position: 'absolute', bottom: 16 },
  resultPopInner: {
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 20,
    alignItems: 'center', gap: 2,
  },
  resultPopEmoji: { fontSize: 24 },
  resultPopTitle: { fontSize: 14, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  resultPopAmount: { fontSize: 22, fontWeight: '900', color: Colors.white },
  section: { paddingHorizontal: 16, marginBottom: 14 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 10 },
  pickRow: { flexDirection: 'row', gap: 10 },
  pickBtn: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 18,
    paddingVertical: 14, alignItems: 'center', gap: 6, backgroundColor: Colors.surface,
  },
  pickBtnActive: { borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 6 },
  pickEmoji: { fontSize: 26 },
  pickLabel: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  pickLabelActive: { fontSize: 14, fontWeight: '800', color: Colors.white },
  betRow: { flexDirection: 'row', gap: 8 },
  betBtn: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 14,
    paddingVertical: 10, alignItems: 'center', backgroundColor: Colors.surface,
  },
  betActive: { borderRadius: 14, paddingVertical: 10, alignItems: 'center' },
  betText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  betActiveText: { fontSize: 13, fontWeight: '800', color: Colors.white },
  flipBtn: { paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  flipBtnText: { fontSize: 17, fontWeight: '800', color: Colors.white },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 16,
    backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statCardBorder: { borderRightWidth: 1, borderRightColor: Colors.border },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
});
