import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import FloatingParticles from '@/components/FloatingParticles';

const { width } = Dimensions.get('window');

const FEATURED_GAMES = [
  { id: '1', name: 'Coin Flip', icon: 'logo-bitcoin', gradient: ['#F59E0B', '#EF4444'] as const, reward: '$1.90', route: '/games/coin-flip' },
  { id: '2', name: 'Lucky Spin', icon: 'sync', gradient: ['#7C3AED', '#4F46E5'] as const, reward: '$10.00', route: '/games/lucky-spin' },
  { id: '3', name: 'Quiz Master', icon: 'help-circle', gradient: ['#06B6D4', '#3B82F6'] as const, reward: '$0.75', route: '/games/quiz' },
];

const RECENT_WINS = [
  { user: 'alex_p', amount: '$5.00', game: 'Lucky Spin', time: '2m ago', color: '#7C3AED' },
  { user: 'sam_k', amount: '$2.50', game: 'Coin Flip', time: '5m ago', color: '#F59E0B' },
  { user: 'jay_m', amount: '$10.00', game: 'Lucky Spin', time: '8m ago', color: '#10B981' },
  { user: 'ria_w', amount: '$1.25', game: 'Quiz Master', time: '12m ago', color: '#06B6D4' },
];

function PulsingDot() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = () => Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.8, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ]).start(loop);
    loop();
  }, []);
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.error, transform: [{ scale }], opacity }} />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error }} />
    </View>
  );
}

function BalanceCard() {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 2500, useNativeDriver: true })
    ).start();
  }, []);
  const shimmerX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-width, width] });
  return (
    <LinearGradient colors={['#7C3AED', '#4F46E5', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
      <View style={styles.balanceCardInner}>
        <Animated.View style={[styles.shimmer, { transform: [{ translateX: shimmerX }] }]} />
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
            <Text style={styles.balanceAmount}>$24.75</Text>
          </View>
          <View style={styles.balanceBadge}>
            <Ionicons name="trending-up" size={14} color={Colors.successLight} />
            <Text style={styles.balanceBadgeText}>+$3.50</Text>
          </View>
        </View>
        <View style={styles.balanceDivider} />
        <View style={styles.balanceBottom}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceInfoLabel}>Games Played</Text>
            <Text style={styles.balanceInfoValue}>47</Text>
          </View>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceInfoLabel}>Win Rate</Text>
            <Text style={styles.balanceInfoValue}>68%</Text>
          </View>
          <TouchableOpacity style={styles.withdrawBtn} onPress={() => router.push('/(tabs)/wallet')}>
            <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.withdrawGrad}>
              <Text style={styles.withdrawText}>Withdraw</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

function GameCard({ game, index }: { game: typeof FEATURED_GAMES[0]; index: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push(game.route as any)}
      >
        <LinearGradient colors={game.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gameCard}>
          <View style={styles.gameCardGlow} />
          <View style={styles.gameIconWrap}>
            <Ionicons name={game.icon as any} size={30} color="rgba(255,255,255,0.9)" />
          </View>
          <Text style={styles.gameCardName}>{game.name}</Text>
          <View style={styles.gameCardReward}>
            <Text style={styles.gameCardRewardText}>Win {game.reward}</Text>
          </View>
          <View style={styles.playArrow}>
            <Ionicons name="play-circle" size={22} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [notifCount] = useState(3);
  const bellAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ring = () => Animated.sequence([
      Animated.timing(bellAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(bellAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
      Animated.timing(bellAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(bellAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => setTimeout(ring, 6000));
    setTimeout(ring, 2000);
  }, []);

  const bellRot = bellAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-12deg', '0deg', '12deg'] });

  return (
    <View style={styles.container}>
      <FloatingParticles />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 12 }]}>
          <View>
            <Text style={styles.greeting}>Good evening 👋</Text>
            <Text style={styles.username}>Player</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Animated.View style={{ transform: [{ rotate: bellRot }] }}>
              <Ionicons name="notifications" size={22} color={Colors.text} />
            </Animated.View>
            {notifCount > 0 && (
              <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{notifCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <BalanceCard />

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Streak', value: '5 🔥', gradient: ['#F97316', '#EF4444'] as const },
            { label: 'Rank', value: '#142', gradient: ['#7C3AED', '#4F46E5'] as const },
            { label: 'Today', value: '+$3.50', gradient: ['#10B981', '#059669'] as const },
          ].map(s => (
            <LinearGradient key={s.label} colors={s.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Featured Games */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>🎮 Play & Earn</Text>
            <Text style={styles.sectionSub}>Win real cash rewards</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/games')}>
            <LinearGradient colors={['rgba(124,58,237,0.2)', 'rgba(79,70,229,0.2)']} style={styles.seeAllBtn}>
              <Text style={styles.seeAll}>See All</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.primaryLight} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gamesScroll}>
          {FEATURED_GAMES.map((game, i) => <GameCard key={game.id} game={game} index={i} />)}
        </ScrollView>

        {/* Live Wins */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Live Wins</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.winsCard}>
          {RECENT_WINS.map((win, i) => (
            <View key={i} style={[styles.winRow, i < RECENT_WINS.length - 1 && styles.winRowBorder]}>
              <LinearGradient
                colors={[win.color + '33', win.color + '11']}
                style={styles.winAvatar}
              >
                <Text style={[styles.winAvatarText, { color: win.color }]}>{win.user[0].toUpperCase()}</Text>
              </LinearGradient>
              <View style={styles.winInfo}>
                <Text style={styles.winUser}>{win.user}</Text>
                <Text style={styles.winGame}>{win.game} · {win.time}</Text>
              </View>
              <LinearGradient colors={[Colors.success + '22', Colors.successLight + '11']} style={styles.winAmountBadge}>
                <Text style={styles.winAmount}>{win.amount}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaWrap} onPress={() => router.push('/(tabs)/games')} activeOpacity={0.9}>
          <LinearGradient colors={['#7C3AED', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaBanner}>
            <View style={styles.ctaLeft}>
              <Text style={styles.ctaEmoji}>🚀</Text>
              <View>
                <Text style={styles.ctaTitle}>Start Winning</Text>
                <Text style={styles.ctaSub}>3 games available now</Text>
              </View>
            </View>
            <View style={styles.ctaArrow}>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  greeting: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  username: { fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: 2 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  notifBadge: {
    position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  notifBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.white },
  balanceCard: { marginHorizontal: 20, borderRadius: 24, marginBottom: 16, overflow: 'hidden' },
  balanceCardInner: { padding: 24 },
  shimmer: {
    position: 'absolute', top: 0, bottom: 0, width: 80,
    backgroundColor: 'rgba(255,255,255,0.08)', skewX: '-20deg',
  } as any,
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  balanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, fontWeight: '600', marginBottom: 6 },
  balanceAmount: { fontSize: 44, fontWeight: '900', color: Colors.white, letterSpacing: -1 },
  balanceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(16,185,129,0.2)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  balanceBadgeText: { fontSize: 13, color: Colors.successLight, fontWeight: '700' },
  balanceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: 16 },
  balanceBottom: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  balanceInfo: { flex: 1 },
  balanceInfoLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  balanceInfoValue: { fontSize: 18, fontWeight: '800', color: Colors.white, marginTop: 2 },
  withdrawBtn: { borderRadius: 14 },
  withdrawGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  withdrawText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 18, padding: 14, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  sectionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  seeAll: { fontSize: 13, color: Colors.primaryLight, fontWeight: '600' },
  gamesScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 8, marginBottom: 24 },
  gameCard: {
    width: 160, borderRadius: 22, padding: 18, gap: 10, overflow: 'hidden',
    position: 'relative',
  },
  gameCardGlow: {
    position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  gameIconWrap: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  gameCardName: { fontSize: 15, fontWeight: '800', color: Colors.white },
  gameCardReward: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  gameCardRewardText: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  playArrow: { alignSelf: 'flex-end' },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error },
  liveText: { fontSize: 11, color: Colors.error, fontWeight: '800', letterSpacing: 1 },
  winsCard: {
    marginHorizontal: 20, backgroundColor: Colors.surface,
    borderRadius: 22, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, marginBottom: 20,
  },
  winRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  winRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  winAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  winAvatarText: { fontSize: 17, fontWeight: '800' },
  winInfo: { flex: 1 },
  winUser: { fontSize: 14, fontWeight: '700', color: Colors.text },
  winGame: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  winAmountBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  winAmount: { fontSize: 15, fontWeight: '800', color: Colors.success },
  ctaWrap: { marginHorizontal: 20 },
  ctaBanner: { borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  ctaEmoji: { fontSize: 32 },
  ctaTitle: { fontSize: 17, fontWeight: '800', color: Colors.white },
  ctaSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  ctaArrow: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
});
