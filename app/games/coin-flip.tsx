import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

type Side = 'heads' | 'tails';
type Result = 'win' | 'loss' | null;

const BET_OPTIONS = [0.10, 0.25, 0.50, 1.00];

export default function CoinFlipGame() {
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(24.75);
  const [bet, setBet] = useState(0.25);
  const [pick, setPick] = useState<Side>('heads');
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [landedSide, setLandedSide] = useState<Side | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalWon, setTotalWon] = useState(0);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;

  const flipCoin = () => {
    if (flipping || balance < bet) return;

    setResult(null);
    setLandedSide(null);
    setFlipping(true);
    resultOpacity.setValue(0);

    const outcome: Side = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = outcome === pick;

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.timing(flipAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(flipAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(flipAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(flipAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(flipAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(flipAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setFlipping(false);
      setLandedSide(outcome);
      setResult(won ? 'win' : 'loss');

      if (won) {
        const winAmount = bet * 1.9;
        setBalance(prev => Math.round((prev + winAmount) * 100) / 100);
        setStreak(prev => prev + 1);
        setTotalWon(prev => Math.round((prev + winAmount) * 100) / 100);
      } else {
        setBalance(prev => Math.round((prev - bet) * 100) / 100);
        setStreak(0);
      }

      Animated.timing(resultOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const coinFace = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['1', '0', '-1'],
  });

  const coinScale = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.3, 1],
  });

  const displaySide = landedSide ?? pick;

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Coin Flip</Text>
        <View style={styles.balancePill}>
          <Ionicons name="wallet" size={14} color={Colors.gold} />
          <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Streak */}
      {streak > 0 && (
        <View style={styles.streakBanner}>
          <Text style={styles.streakText}>🔥 {streak} Win Streak!</Text>
        </View>
      )}

      {/* Coin */}
      <View style={styles.coinArea}>
        <Animated.View style={[styles.coinWrapper, { transform: [{ scaleX: coinFace }, { scale: coinScale }] }]}>
          <View style={[styles.coin, displaySide === 'heads' ? styles.coinHeads : styles.coinTails]}>
            <Text style={styles.coinEmoji}>{displaySide === 'heads' ? '👑' : '🦅'}</Text>
            <Text style={styles.coinLabel}>{displaySide === 'heads' ? 'HEADS' : 'TAILS'}</Text>
          </View>
        </Animated.View>

        {/* Result */}
        <Animated.View style={[styles.resultBadge, { opacity: resultOpacity }]}>
          {result === 'win' && (
            <View style={styles.winBadge}>
              <Text style={styles.resultEmoji}>🎉</Text>
              <Text style={styles.resultTitle}>You Won!</Text>
              <Text style={styles.resultAmount}>+${(bet * 1.9).toFixed(2)}</Text>
            </View>
          )}
          {result === 'loss' && (
            <View style={styles.lossBadge}>
              <Text style={styles.resultEmoji}>😞</Text>
              <Text style={styles.resultTitle}>Landed {landedSide}</Text>
              <Text style={styles.resultAmountLoss}>-${bet.toFixed(2)}</Text>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Pick Side */}
      <Text style={styles.sectionLabel}>PICK YOUR SIDE</Text>
      <View style={styles.pickRow}>
        <TouchableOpacity
          style={[styles.pickBtn, pick === 'heads' && styles.pickBtnActive]}
          onPress={() => !flipping && setPick('heads')}
        >
          <Text style={styles.pickEmoji}>👑</Text>
          <Text style={[styles.pickLabel, pick === 'heads' && styles.pickLabelActive]}>Heads</Text>
          <Text style={styles.pickOdds}>1.9x</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickBtn, pick === 'tails' && styles.pickBtnActive]}
          onPress={() => !flipping && setPick('tails')}
        >
          <Text style={styles.pickEmoji}>🦅</Text>
          <Text style={[styles.pickLabel, pick === 'tails' && styles.pickLabelActive]}>Tails</Text>
          <Text style={styles.pickOdds}>1.9x</Text>
        </TouchableOpacity>
      </View>

      {/* Bet Amount */}
      <Text style={styles.sectionLabel}>BET AMOUNT</Text>
      <View style={styles.betRow}>
        {BET_OPTIONS.map(amount => (
          <TouchableOpacity
            key={amount}
            style={[styles.betBtn, bet === amount && styles.betBtnActive]}
            onPress={() => !flipping && setBet(amount)}
          >
            <Text style={[styles.betBtnText, bet === amount && styles.betBtnTextActive]}>
              ${amount.toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Flip Button */}
      <TouchableOpacity
        style={[styles.flipBtn, (flipping || balance < bet) && styles.flipBtnDisabled]}
        onPress={flipCoin}
        disabled={flipping || balance < bet}
      >
        {flipping ? (
          <Text style={styles.flipBtnText}>Flipping...</Text>
        ) : (
          <>
            <Ionicons name="sync" size={20} color={Colors.white} />
            <Text style={styles.flipBtnText}>Flip for ${bet.toFixed(2)}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>${totalWon.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Won</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>50%</Text>
          <Text style={styles.statLabel}>Win Chance</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  backBtn: { padding: 8, backgroundColor: Colors.surface, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  balancePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  balanceText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  streakBanner: {
    marginHorizontal: 20, marginBottom: 8, backgroundColor: Colors.warning + '22',
    borderRadius: 12, padding: 10, alignItems: 'center',
  },
  streakText: { fontSize: 15, fontWeight: '700', color: Colors.warning },
  coinArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  coinWrapper: { alignItems: 'center', justifyContent: 'center' },
  coin: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16,
    elevation: 16,
  },
  coinHeads: { backgroundColor: Colors.gold, borderWidth: 4, borderColor: '#E6B800' },
  coinTails: { backgroundColor: Colors.primary, borderWidth: 4, borderColor: Colors.primaryDark },
  coinEmoji: { fontSize: 48 },
  coinLabel: { fontSize: 14, fontWeight: '800', color: Colors.white, letterSpacing: 2 },
  resultBadge: { alignItems: 'center' },
  winBadge: { alignItems: 'center', gap: 4, backgroundColor: Colors.success + '22', padding: 16, borderRadius: 20, minWidth: 160 },
  lossBadge: { alignItems: 'center', gap: 4, backgroundColor: Colors.error + '22', padding: 16, borderRadius: 20, minWidth: 160 },
  resultEmoji: { fontSize: 28 },
  resultTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  resultAmount: { fontSize: 24, fontWeight: '800', color: Colors.success },
  resultAmountLoss: { fontSize: 24, fontWeight: '800', color: Colors.error },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1.5, paddingHorizontal: 20, marginBottom: 10,
  },
  pickRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  pickBtn: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 6, borderWidth: 2, borderColor: Colors.transparent,
  },
  pickBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '22' },
  pickEmoji: { fontSize: 28 },
  pickLabel: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  pickLabelActive: { color: Colors.primary },
  pickOdds: { fontSize: 12, color: Colors.textMuted },
  betRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  betBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 2, borderColor: Colors.transparent },
  betBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '22' },
  betBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  betBtnTextActive: { color: Colors.gold },
  flipBtn: {
    marginHorizontal: 20, backgroundColor: Colors.primary, borderRadius: 20,
    paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20,
  },
  flipBtnDisabled: { backgroundColor: Colors.surfaceAlt },
  flipBtnText: { fontSize: 17, fontWeight: '800', color: Colors.white },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 20, backgroundColor: Colors.surface,
    borderRadius: 16, padding: 16, marginBottom: 20, alignItems: 'center',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
});
