import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import FloatingParticles from '@/components/FloatingParticles';
import NeonCard from '@/components/NeonCard';
import SocialFeed from '@/components/SocialFeed';
import DailyChallenges from '@/components/DailyChallenges';

const { width } = Dimensions.get('window');

const GAMES = [
  { name: 'Coin Rush', icon: 'logo-bitcoin', route: '/games/coin-flip', gradColors: ['#F59E0B', '#DC2626'] as const, glow: Colors.neonGold, reward: '1.9x', tag: 'HOT' },
  { name: 'Lucky Spin', icon: 'sync', route: '/games/lucky-spin', gradColors: ['#8B5CF6', '#4F46E5'] as const, glow: Colors.neonPurple, reward: '$10', tag: 'JACKPOT' },
  { name: 'Quiz Master', icon: 'help-circle', route: '/games/quiz', gradColors: ['#06B6D4', '#0284C7'] as const, glow: Colors.neonCyan, reward: 'FREE', tag: 'FREE' },
];

const LIVE_WINS = [
  { user: 'CryptoKing', amount: '$10.00', game: 'Lucky Spin', avatar: '💎', color: Colors.neonGold },
  { user: 'NightWolf', amount: '$4.75', game: 'Coin Rush', avatar: '🐺', color: Colors.neonPurple },
  { user: 'StarPlayer', amount: '$2.50', game: 'Quiz Master', avatar: '⭐', color: Colors.neonCyan },
  { user: 'LuckyAce', amount: '$7.25', game: 'Lucky Spin', avatar: '🃏', color: Colors.neonPink },
];

function GlowOrb({ x, y, color, size = 200 }: { x: number; y: number; color: string; size?: number }) {
  return (
    <View style={{
      position: 'absolute', left: x - size / 2, top: y - size / 2,
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color,
      opacity: 0.06,
    }} />
  );
}

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const int = setInterval(() => {
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
        setIdx(i => (i + 1) % LIVE_WINS.length);
        anim.setValue(0);
      });
    }, 3000);
    return () => clearInterval(int);
  }, []);

  const item = LIVE_WINS[idx];
  return (
    <Animated.View style={{ opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 1] }) }}>
      <View style={styles.tickerRow}>
        <Text style={styles.tickerAvatar}>{item.avatar}</Text>
        <Text style={styles.tickerText}>
          <Text style={{ color: item.color, fontWeight: '700' }}>{item.user}</Text>
          {' won '}
          <Text style={{ color: Colors.neonGreen, fontWeight: '800' }}>{item.amount}</Text>
          {' on ' + item.game}
        </Text>
      </View>
    </Animated.View>
  );
}

function BalanceCard() {
  const shimmer = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(shimmer, { toValue: 1, duration: 3000, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.02, duration: 1500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
    ])).start();
  }, []);

  const shimX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-width, width] });

  return (
    <Animated.View style={{ transform: [{ scale: pulse }], marginHorizontal: 16, marginBottom: 16 }}>
      <NeonCard
        gradient={['#1A0A3D', '#0D1A3D', '#0A1A1A']}
        glowColor={Colors.neonPurple}
        glowIntensity="high"
        borderColor={Colors.borderPurple}
        style={styles.balanceCard}
      >
        {/* Shimmer overlay */}
        <Animated.View style={[styles.shimmerBar, { transform: [{ translateX: shimX }] }]} />

        {/* Top pattern */}
        <View style={styles.cardPattern}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.cardLine, { opacity: 0.06 + i * 0.01, top: i * 22 }]} />
          ))}
        </View>

        <View style={styles.balanceInner}>
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
              <Text style={styles.balanceAmount}>$24.75</Text>
              <View style={styles.gainRow}>
                <Ionicons name="arrow-up" size={12} color={Colors.neonGreen} />
                <Text style={styles.gainText}>+$3.50 today</Text>
              </View>
            </View>
            <View style={styles.balanceRight}>
              <LinearGradient colors={Colors.gradGoldSoft} style={styles.vipBadge}>
                <Ionicons name="shield" size={10} color={Colors.bg} />
                <Text style={styles.vipText}>GOLD VIP</Text>
              </LinearGradient>
              <View style={styles.rankPill}>
                <Text style={styles.rankText}>#142</Text>
              </View>
            </View>
          </View>

          <View style={styles.balanceStats}>
            {[
              { label: 'Games', value: '47', icon: 'game-controller' },
              { label: 'Win Rate', value: '68%', icon: 'trending-up' },
              { label: 'Streak', value: '5🔥', icon: 'flame' },
            ].map((s, i) => (
              <View key={s.label} style={[styles.balanceStat, i > 0 && styles.balanceStatBorder]}>
                <Text style={styles.balanceStatValue}>{s.value}</Text>
                <Text style={styles.balanceStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.balanceActions}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/wallet')} style={{ flex: 1 }}>
              <LinearGradient colors={Colors.gradPurple} style={styles.actionBtn}>
                <Ionicons name="arrow-up" size={16} color={Colors.white} />
                <Text style={styles.actionText}>Withdraw</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/vip')} style={{ flex: 1 }}>
              <LinearGradient colors={Colors.gradGoldSoft} style={styles.actionBtn}>
                <Ionicons name="diamond" size={16} color={Colors.bg} />
                <Text style={[styles.actionText, { color: Colors.bg }]}>Go VIP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </NeonCard>
    </Animated.View>
  );
}

function GameCard3D({ game, index }: { game: typeof GAMES[0]; index: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.93, useNativeDriver: true }),
      Animated.timing(rotateY, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };
  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(rotateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const tilt = rotateY.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '6deg'] });
  const glowStyle = Platform.OS === 'web' ? {
    boxShadow: `0 8px 32px ${game.glow}44, 0 0 16px ${game.glow}22`,
  } as any : {};

  return (
    <Animated.View style={{ transform: [{ scale }, { perspective: 800 } as any, { rotateY: tilt }], marginLeft: index === 0 ? 16 : 0 }}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push(game.route as any)}
        activeOpacity={1}
      >
        <LinearGradient
          colors={game.gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gameCard, glowStyle, { borderColor: `${game.glow}55`, borderWidth: 1 }]}
        >
          {/* Background glow orb */}
          <View style={[styles.cardOrb, { backgroundColor: game.glow }]} />

          {/* Tag */}
          <View style={[styles.cardTag, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
            <Text style={styles.cardTagText}>{game.tag}</Text>
          </View>

          <View style={styles.gameCardIcon}>
            <Ionicons name={game.icon as any} size={34} color="rgba(255,255,255,0.95)" />
          </View>
          <Text style={styles.gameCardName}>{game.name}</Text>
          <Text style={styles.gameCardReward}>Win up to <Text style={{ fontWeight: '900', color: Colors.white }}>{game.reward}</Text></Text>
          <View style={styles.playNowBtn}>
            <Text style={styles.playNowText}>PLAY NOW</Text>
            <Ionicons name="play" size={10} color={Colors.white} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <FloatingParticles />
      {/* Background orbs */}
      <GlowOrb x={width * 0.8} y={100} color={Colors.neonPurple} size={280} />
      <GlowOrb x={width * 0.1} y={400} color={Colors.neonCyan} size={200} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
          <View>
            <Text style={styles.greeting}>Welcome back 👾</Text>
            <Text style={styles.username}>Player</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textSec} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live ticker */}
        <NeonCard glowColor={Colors.neonGreen} glowIntensity="low" borderColor={Colors.neonGreen + '33'} style={styles.ticker}>
          <View style={styles.tickerInner}>
            <LinearGradient colors={[Colors.neonGreen, Colors.neonCyan]} style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </LinearGradient>
            <LiveTicker />
          </View>
        </NeonCard>

        {/* Balance Card */}
        <BalanceCard />

        {/* Featured Games */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>🎮 Featured Games</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/games')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
          {GAMES.map((g, i) => <GameCard3D key={g.name} game={g} index={i} />)}
        </ScrollView>

        {/* Stats Row */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>📊 Your Stats</Text>
        </View>
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Won', value: '$47.25', icon: 'trophy', gradient: Colors.gradGold, glow: Colors.neonGold },
            { label: 'Best Streak', value: '12 🔥', icon: 'flame', gradient: Colors.gradPink, glow: Colors.neonPink },
            { label: 'Global Rank', value: '#142', icon: 'podium', gradient: Colors.gradCyan, glow: Colors.neonCyan },
            { label: 'This Week', value: '+$8.50', icon: 'trending-up', gradient: Colors.gradGreen, glow: Colors.neonGreen },
          ].map(s => {
            const glowStyle = Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${s.glow}33` } as any : {};
            return (
              <LinearGradient key={s.label} colors={s.gradient} style={[styles.statCard, glowStyle]}>
                <Ionicons name={s.icon as any} size={18} color="rgba(255,255,255,0.7)" />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </LinearGradient>
            );
          })}
        </View>

        {/* Daily Challenges */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>⚡ Daily Missions</Text>
          <View style={[styles.liveIndicator, { backgroundColor: Colors.neonGold + '22', borderColor: Colors.neonGold + '44' }]}>
            <View style={[styles.livePulse, { backgroundColor: Colors.neonGold }]} />
            <Text style={[styles.liveIndicatorTxt, { color: Colors.neonGold }]}>TODAY</Text>
          </View>
        </View>
        <DailyChallenges />

        {/* Quick Actions */}
        <View style={[styles.sectionRow, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>🎮 Quick Actions</Text>
        </View>
        <View style={styles.quickRow}>
          {[
            { label: 'Leaderboard', icon: 'podium', route: '/(tabs)/leaderboard', gradient: Colors.gradPurple, glow: Colors.neonPurple },
            { label: 'VIP Rewards', icon: 'diamond', route: '/vip', gradient: Colors.gradGoldSoft, glow: Colors.neonGold },
          ].map(a => {
            const gs = Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${a.glow}33` } as any : {};
            return (
              <TouchableOpacity key={a.label} style={{ flex: 1 }} onPress={() => router.push(a.route as any)}>
                <LinearGradient colors={a.gradient} style={[styles.quickCard, gs]}>
                  <Ionicons name={a.icon as any} size={22} color={Colors.white} />
                  <Text style={styles.quickLabel}>{a.label}</Text>
                  <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Community Feed */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>💬 Community Feed</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.livePulse} />
            <Text style={styles.liveIndicatorTxt}>LIVE</Text>
          </View>
        </View>
        <SocialFeed maxVisible={6} showCompose />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  greeting: { fontSize: 12, color: Colors.textMuted, fontWeight: '500', letterSpacing: 0.5 },
  username: { fontSize: 26, fontWeight: '900', color: Colors.text, marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: 10 },
  headerBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.neonRed, borderWidth: 1.5, borderColor: Colors.bg },
  ticker: { marginHorizontal: 16, marginBottom: 12, borderRadius: 14 },
  tickerInner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.white },
  liveText: { fontSize: 9, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  tickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  tickerAvatar: { fontSize: 16 },
  tickerText: { fontSize: 12, color: Colors.textSec, flex: 1 },
  balanceCard: { borderRadius: 24, overflow: 'hidden', position: 'relative' },
  shimmerBar: { position: 'absolute', top: 0, bottom: 0, width: 100, backgroundColor: 'rgba(255,255,255,0.04)', zIndex: 1, skewX: '-15deg' } as any,
  cardPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cardLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: Colors.borderBright },
  balanceInner: { padding: 22, gap: 16, zIndex: 2 },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: '700', marginBottom: 6 },
  balanceAmount: { fontSize: 46, fontWeight: '900', color: Colors.white, letterSpacing: -1 },
  gainRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  gainText: { fontSize: 12, color: Colors.neonGreen, fontWeight: '700' },
  balanceRight: { alignItems: 'flex-end', gap: 8 },
  vipBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  vipText: { fontSize: 9, fontWeight: '900', color: Colors.bg, letterSpacing: 1 },
  rankPill: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  rankText: { fontSize: 12, color: Colors.textSec, fontWeight: '700' },
  balanceStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 14, overflow: 'hidden' },
  balanceStat: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  balanceStatBorder: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.08)' },
  balanceStatValue: { fontSize: 16, fontWeight: '800', color: Colors.white },
  balanceStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: '500' },
  balanceActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 14 },
  actionText: { fontSize: 14, fontWeight: '800', color: Colors.white },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.neonPurple, fontWeight: '700' },
  gameCard: { width: 168, borderRadius: 24, padding: 18, gap: 10, overflow: 'hidden', position: 'relative', minHeight: 220 },
  cardOrb: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, opacity: 0.2 },
  cardTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  cardTagText: { fontSize: 9, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  gameCardIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  gameCardName: { fontSize: 16, fontWeight: '900', color: Colors.white, marginTop: 4 },
  gameCardReward: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  playNowBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start', marginTop: 4 },
  playNowText: { fontSize: 10, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  statCard: { width: '47.5%', borderRadius: 18, padding: 16, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  quickRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  quickCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 18 },
  quickLabel: { flex: 1, fontSize: 14, fontWeight: '800', color: Colors.white },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.neonGreen + '22', borderWidth: 1, borderColor: Colors.neonGreen + '44', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  livePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.neonGreen },
  liveIndicatorTxt: { fontSize: 10, fontWeight: '900', color: Colors.neonGreen, letterSpacing: 1 },
});
