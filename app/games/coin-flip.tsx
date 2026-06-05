import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

type Side = 'heads' | 'tails';
const BETS = [0.10, 0.25, 0.50, 1.00];
const COIN_SIZE = 160;

export default function CoinFlipGame() {
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(24.75);
  const [bet, setBet] = useState(0.25);
  const [pick, setPick] = useState<Side>('heads');
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [landedSide, setLandedSide] = useState<Side>('heads');
  const [streak, setStreak] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [spins, setSpins] = useState(0);

  const rotateY = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0)).current;
  const bgGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatY, { toValue: -10, duration: 1400, useNativeDriver: true }),
      Animated.timing(floatY, { toValue: 0, duration: 1400, useNativeDriver: true }),
    ])).start();
  }, []);

  const flip = () => {
    if (flipping || balance < bet) return;
    setBalance(p => Math.round((p - bet) * 100) / 100);
    setFlipping(true);
    setResult(null);
    resultScale.setValue(0);
    bgGlow.setValue(0);

    const outcome: Side = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = outcome === pick;
    const finalAngle = 6 * 360 + (outcome === 'tails' ? 180 : 0);

    Animated.timing(rotateY, { toValue: finalAngle, duration: 2000, useNativeDriver: true }).start(() => {
      setLandedSide(outcome);
      setResult(won ? 'win' : 'loss');
      setSpins(s => s + 1);
      if (won) {
        const winAmt = Math.round(bet * 1.9 * 100) / 100;
        setBalance(p => Math.round((p + winAmt) * 100) / 100);
        setStreak(s => s + 1);
        setTotalWon(p => Math.round((p + winAmt) * 100) / 100);
      } else {
        setStreak(0);
      }
      setFlipping(false);
      Animated.spring(resultScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
      Animated.timing(bgGlow, { toValue: 1, duration: 600, useNativeDriver: false }).start();
    });
  };

  const spin = rotateY.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const headsOp = rotateY.interpolate({ inputRange: [0, 89, 90, 269, 270, 360], outputRange: [1, 1, 0, 0, 1, 1] });
  const tailsOp = rotateY.interpolate({ inputRange: [0, 89, 90, 269, 270, 360], outputRange: [0, 0, 1, 1, 0, 0] });
  const won = result === 'win';

  const glowStyle = Platform.OS === 'web' ? {
    boxShadow: result ? `0 0 60px ${won ? Colors.neonGreen : Colors.neonRed}44, 0 0 120px ${won ? Colors.neonGreen : Colors.neonRed}22` : undefined,
  } as any : {};

  return (
    <View style={[styles.container, glowStyle]}>
      {/* Header */}
      <LinearGradient colors={[Colors.bgAlt, Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Coin Rush</Text>
          <Text style={styles.subtitle}>50% Chance · 1.9x Payout</Text>
        </View>
        <LinearGradient colors={Colors.gradGold} style={styles.balancePill}>
          <Ionicons name="wallet" size={12} color={Colors.bg} />
          <Text style={styles.balanceTxt}>${balance.toFixed(2)}</Text>
        </LinearGradient>
      </LinearGradient>

      {streak >= 2 && (
        <LinearGradient colors={['#F97316', '#EF4444']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.streakBanner}>
          <Text style={styles.streakTxt}>🔥 {streak} Win Streak! Keep going!</Text>
        </LinearGradient>
      )}

      {/* Coin Arena */}
      <View style={styles.arena}>
        {/* Background glow orbs */}
        <View style={[styles.arenaOrb, { backgroundColor: Colors.neonGold, top: 20, left: -60 }]} />
        <View style={[styles.arenaOrb, { backgroundColor: Colors.neonPurple, bottom: 20, right: -60 }]} />

        <Animated.View style={{ transform: [{ translateY: floatY }, { perspective: 1000 } as any, { rotateY: spin }] }}>
          {/* HEADS */}
          <Animated.View style={[styles.coin, { opacity: headsOp, position: 'absolute' }]}>
            <LinearGradient colors={['#FCD34D', '#F59E0B', '#D97706', '#B45309']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.coinFace}>
              <View style={styles.coinRim} />
              <Text style={styles.coinEmoji}>👑</Text>
              <Text style={styles.coinLabel}>HEADS</Text>
              {/* Inner ring detail */}
              <View style={styles.coinInnerRing} />
            </LinearGradient>
          </Animated.View>
          {/* TAILS */}
          <Animated.View style={[styles.coin, { opacity: tailsOp }]}>
            <LinearGradient colors={['#A78BFA', '#8B5CF6', '#6D28D9', '#4C1D95']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.coinFace}>
              <View style={styles.coinRim} />
              <Text style={styles.coinEmoji}>🦅</Text>
              <Text style={styles.coinLabel}>TAILS</Text>
              <View style={styles.coinInnerRing} />
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* Shadow */}
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']} style={styles.coinShadow} />

        {/* Result */}
        {result && (
          <Animated.View style={[styles.resultPop, { transform: [{ scale: resultScale }] }]}>
            <LinearGradient
              colors={won ? [Colors.neonGreen, '#059669'] : [Colors.neonRed, '#B91C1C']}
              style={styles.resultPopInner}
            >
              <Text style={styles.resultEmoji}>{won ? '🎉' : '💸'}</Text>
              <Text style={styles.resultTitle}>{won ? 'YOU WON!' : 'YOU LOST'}</Text>
              <Text style={styles.resultAmount}>{won ? `+$${(bet * 1.9).toFixed(2)}` : `-$${bet.toFixed(2)}`}</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </View>

      {/* Pick side */}
      <View style={styles.section}>
        <Text style={styles.sectionLbl}>PICK YOUR SIDE</Text>
        <View style={styles.pickRow}>
          {(['heads', 'tails'] as Side[]).map(side => {
            const active = pick === side;
            const grad = side === 'heads' ? ['#FCD34D', '#F59E0B'] as const : ['#A78BFA', '#8B5CF6'] as const;
            const gs = active && Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${side === 'heads' ? Colors.neonGold : Colors.neonPurple}55` } as any : {};
            return (
              <TouchableOpacity key={side} style={{ flex: 1 }} onPress={() => !flipping && setPick(side)}>
                {active
                  ? <LinearGradient colors={grad} style={[styles.pickActive, gs]}><Text style={styles.pickEmoji}>{side === 'heads' ? '👑' : '🦅'}</Text><Text style={styles.pickActiveTxt}>{side === 'heads' ? 'Heads' : 'Tails'}</Text></LinearGradient>
                  : <View style={styles.pickInactive}><Text style={styles.pickEmoji}>{side === 'heads' ? '👑' : '🦅'}</Text><Text style={styles.pickTxt}>{side === 'heads' ? 'Heads' : 'Tails'}</Text></View>
                }
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bet */}
      <View style={styles.section}>
        <Text style={styles.sectionLbl}>BET AMOUNT</Text>
        <View style={styles.betRow}>
          {BETS.map(amt => {
            const gs = bet === amt && Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${Colors.neonPurple}44` } as any : {};
            return (
              <TouchableOpacity key={amt} style={{ flex: 1 }} onPress={() => !flipping && setBet(amt)}>
                {bet === amt
                  ? <LinearGradient colors={Colors.gradPurple} style={[styles.betActive, gs]}><Text style={styles.betActiveTxt}>${amt.toFixed(2)}</Text></LinearGradient>
                  : <View style={styles.betInactive}><Text style={styles.betTxt}>${amt.toFixed(2)}</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Flip button */}
      <TouchableOpacity onPress={flip} disabled={flipping || balance < bet} activeOpacity={0.9} style={styles.flipWrap}>
        <LinearGradient
          colors={(flipping || balance < bet) ? [Colors.surfaceAlt, Colors.surfaceAlt] : ['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.flipBtn}
        >
          <Ionicons name={flipping ? 'ellipsis-horizontal' : 'sync'} size={20} color={Colors.white} />
          <Text style={styles.flipTxt}>{flipping ? 'Flipping...' : `Flip for $${bet.toFixed(2)}`}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Won', value: `$${totalWon.toFixed(2)}`, color: Colors.neonGreen },
          { label: 'Streak', value: `${streak} 🔥`, color: Colors.neonGold },
          { label: 'Flips', value: `${spins}`, color: Colors.neonPurple },
        ].map((s, i) => (
          <View key={s.label} style={[styles.stat, i > 0 && { borderLeftWidth: 1, borderLeftColor: Colors.border }]}>
            <Text style={[styles.statV, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statL}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: Colors.text, flex: 1 },
  subtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  balancePill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  balanceTxt: { fontSize: 13, fontWeight: '900', color: Colors.bg },
  streakBanner: { marginHorizontal: 16, marginTop: 10, borderRadius: 14, padding: 10, alignItems: 'center' },
  streakTxt: { fontSize: 14, fontWeight: '800', color: Colors.white },
  arena: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  arenaOrb: { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.07 },
  coin: { width: COIN_SIZE, height: COIN_SIZE, borderRadius: COIN_SIZE / 2 },
  coinFace: {
    flex: 1, borderRadius: COIN_SIZE / 2, alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.25)',
  },
  coinRim: { position: 'absolute', inset: 10, borderRadius: COIN_SIZE / 2 - 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
  coinInnerRing: { position: 'absolute', inset: 20, borderRadius: COIN_SIZE / 2 - 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  coinEmoji: { fontSize: 52 },
  coinLabel: { fontSize: 11, fontWeight: '900', color: 'rgba(255,255,255,0.9)', letterSpacing: 2 },
  coinShadow: { width: COIN_SIZE * 0.7, height: 20, borderRadius: 50, marginTop: 16 },
  resultPop: { position: 'absolute', bottom: 20 },
  resultPopInner: { paddingHorizontal: 28, paddingVertical: 16, borderRadius: 22, alignItems: 'center', gap: 2 },
  resultEmoji: { fontSize: 28 },
  resultTitle: { fontSize: 14, fontWeight: '900', color: Colors.white, letterSpacing: 1.5 },
  resultAmount: { fontSize: 26, fontWeight: '900', color: Colors.white },
  section: { paddingHorizontal: 16, marginBottom: 14 },
  sectionLbl: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 2, marginBottom: 10 },
  pickRow: { flexDirection: 'row', gap: 10 },
  pickActive: { borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 6 },
  pickActiveTxt: { fontSize: 14, fontWeight: '800', color: Colors.white },
  pickInactive: { borderWidth: 1, borderColor: Colors.border, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 6, backgroundColor: Colors.surface },
  pickTxt: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
  pickEmoji: { fontSize: 26 },
  betRow: { flexDirection: 'row', gap: 8 },
  betActive: { borderRadius: 14, paddingVertical: 11, alignItems: 'center' },
  betActiveTxt: { fontSize: 13, fontWeight: '800', color: Colors.white },
  betInactive: { borderWidth: 1, borderColor: Colors.border, borderRadius: 14, paddingVertical: 11, alignItems: 'center', backgroundColor: Colors.surface },
  betTxt: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  flipWrap: { marginHorizontal: 16, marginBottom: 14, borderRadius: 22, overflow: 'hidden' },
  flipBtn: { paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  flipTxt: { fontSize: 18, fontWeight: '900', color: Colors.white },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1, borderColor: Colors.border },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statV: { fontSize: 18, fontWeight: '800' },
  statL: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
});
