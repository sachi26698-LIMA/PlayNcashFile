import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const PERIODS = ['Today', 'Week', 'Month', 'All Time'];

const PLAYERS = [
  { rank: 1, name: 'CryptoKing', avatar: '💎', earned: '$1,247.50', games: 342, winRate: '78%', badge: '👑', gradient: Colors.gradGoldSoft, glow: Colors.neonGold, isMe: false },
  { rank: 2, name: 'NightWolf', avatar: '🐺', earned: '$987.25', games: 289, winRate: '71%', badge: '🥈', gradient: ['#94A3B8', '#64748B'] as const, glow: '#94A3B8', isMe: false },
  { rank: 3, name: 'StarBlaze', avatar: '⭐', earned: '$754.00', games: 215, winRate: '68%', badge: '🥉', gradient: ['#F97316', '#EA580C'] as const, glow: '#F97316', isMe: false },
  { rank: 4, name: 'AcePlayer', avatar: '🃏', earned: '$623.75', games: 198, winRate: '65%', badge: '4', gradient: Colors.gradPurple, glow: Colors.neonPurple, isMe: false },
  { rank: 5, name: 'LuckyFox', avatar: '🦊', earned: '$512.50', games: 177, winRate: '62%', badge: '5', gradient: Colors.gradPurple, glow: Colors.neonPurple, isMe: false },
  { rank: 6, name: 'ZenMaster', avatar: '🧘', earned: '$445.00', games: 156, winRate: '59%', badge: '6', gradient: Colors.gradPurple, glow: Colors.neonPurple, isMe: false },
  { rank: 7, name: 'StormBolt', avatar: '⚡', earned: '$389.25', games: 142, winRate: '57%', badge: '7', gradient: Colors.gradPurple, glow: Colors.neonPurple, isMe: false },
  { rank: 142, name: 'Player (You)', avatar: '👤', earned: '$24.75', games: 47, winRate: '68%', badge: '142', gradient: Colors.gradCyan, glow: Colors.neonCyan, isMe: true },
];

const TOP3 = PLAYERS.slice(0, 3);
const REST = PLAYERS.slice(3);

function PodiumCard({ player, height, index }: { player: typeof PLAYERS[0]; height: number; index: number }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, delay: index * 150, friction: 7, useNativeDriver: true }).start();
  }, []);

  const gs = Platform.OS === 'web' ? { boxShadow: `0 8px 32px ${player.glow}55, 0 0 20px ${player.glow}22` } as any : {};

  return (
    <Animated.View style={[styles.podiumWrap, { transform: [{ scale }] }]}>
      <LinearGradient colors={player.gradient} style={[styles.podiumCard, { borderColor: `${player.glow}55`, borderWidth: 1 }, gs]}>
        <View style={styles.podiumOrb} />
        <Text style={styles.podiumBadge}>{player.badge}</Text>
        <Text style={styles.podiumAvatar}>{player.avatar}</Text>
        <Text style={styles.podiumName}>{player.name.split(' ')[0]}</Text>
        <Text style={styles.podiumEarned}>{player.earned}</Text>
        <View style={styles.podiumRate}>
          <Text style={styles.podiumRateTxt}>{player.winRate}</Text>
        </View>
      </LinearGradient>
      <LinearGradient colors={[player.gradient[0] + '88', player.gradient[0] + '22']} style={[styles.podiumBar, { height, marginTop: 8 }]}>
        <Text style={styles.podiumBarRank}>#{player.rank}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

function PlayerRow({ player, delay }: { player: typeof PLAYERS[0]; delay: number }) {
  const tx = useRef(new Animated.Value(60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(tx, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const gs = player.isMe && Platform.OS === 'web'
    ? { boxShadow: `0 0 24px ${Colors.neonCyan}44, inset 0 1px 0 rgba(255,255,255,0.1)` } as any : {};

  return (
    <Animated.View style={{ transform: [{ translateX: tx }], opacity, marginBottom: 8, marginHorizontal: 16 }}>
      <LinearGradient
        colors={player.isMe ? ['rgba(6,182,212,0.15)', 'rgba(6,182,212,0.05)'] : ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
        style={[styles.playerRow, { borderColor: player.isMe ? Colors.neonCyan + '55' : Colors.border }, gs]}
      >
        {/* Rank */}
        <View style={[styles.rankBadge, { backgroundColor: `${player.glow}22`, borderColor: `${player.glow}44` }]}>
          <Text style={[styles.rankNum, { color: player.glow }]}>#{player.rank}</Text>
        </View>

        {/* Avatar */}
        <LinearGradient colors={player.gradient} style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{player.avatar}</Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.playerInfo}>
          <View style={styles.playerNameRow}>
            <Text style={[styles.playerName, player.isMe && { color: Colors.neonCyan }]}>{player.name}</Text>
            {player.isMe && (
              <View style={styles.youBadge}>
                <Text style={styles.youBadgeTxt}>YOU</Text>
              </View>
            )}
          </View>
          <Text style={styles.playerGames}>{player.games} games · {player.winRate} win rate</Text>
        </View>

        {/* Earned */}
        <Text style={[styles.earned, { color: player.isMe ? Colors.neonCyan : Colors.neonGreen }]}>{player.earned}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState('Week');
  const headerScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.spring(headerScale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <LinearGradient colors={['#1A0A3D', '#0A0A20', Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
          <Animated.View style={{ transform: [{ scale: headerScale }] }}>
            <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
            <Text style={styles.headerSub}>Top earners this week</Text>
          </Animated.View>

          {/* Period filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 16 }}>
            {PERIODS.map(p => (
              <TouchableOpacity key={p} onPress={() => setPeriod(p)}>
                {period === p
                  ? <LinearGradient colors={Colors.gradGoldSoft} style={styles.periodActive}><Text style={styles.periodActiveTxt}>{p}</Text></LinearGradient>
                  : <View style={styles.periodInactive}><Text style={styles.periodInactiveTxt}>{p}</Text></View>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* Podium */}
        <View style={styles.podiumSection}>
          <View style={styles.podiumRow}>
            <PodiumCard player={TOP3[1]} height={60} index={1} />
            <PodiumCard player={TOP3[0]} height={90} index={0} />
            <PodiumCard player={TOP3[2]} height={45} index={2} />
          </View>
        </View>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          {[
            { label: 'Total Players', value: '5,030', icon: 'people', color: Colors.neonPurple },
            { label: 'Total Paid Out', value: '$48,750', icon: 'cash', color: Colors.neonGreen },
            { label: 'Your Rank', value: '#142', icon: 'podium', color: Colors.neonCyan },
          ].map((s, i) => (
            <View key={s.label} style={[styles.statBarItem, i > 0 && { borderLeftWidth: 1, borderLeftColor: Colors.border }]}>
              <Ionicons name={s.icon as any} size={14} color={s.color} />
              <Text style={[styles.statBarVal, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statBarLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Player list */}
        <Text style={styles.sectionLbl}>📋 Full Rankings</Text>
        {REST.map((p, i) => <PlayerRow key={p.rank} player={p} delay={i * 80} />)}

        {/* My rank card */}
        <View style={styles.myRankCard}>
          <LinearGradient colors={Colors.gradCyan} style={styles.myRankInner}>
            <View style={styles.myRankLeft}>
              <Text style={styles.myRankLabel}>Your Ranking</Text>
              <Text style={styles.myRankNum}>#142 of 5,030</Text>
              <Text style={styles.myRankSub}>Top 3% of all players 🔥</Text>
            </View>
            <View style={styles.myRankRight}>
              <Text style={styles.myRankEmoji}>👤</Text>
              <Text style={styles.myRankGames}>47 games</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  periodActive: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  periodActiveTxt: { fontSize: 12, fontWeight: '800', color: Colors.bg },
  periodInactive: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  periodInactiveTxt: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  podiumSection: { paddingTop: 16, paddingBottom: 8 },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 10, paddingHorizontal: 16 },
  podiumWrap: { flex: 1, alignItems: 'center' },
  podiumCard: { width: '100%', borderRadius: 20, padding: 12, alignItems: 'center', gap: 4, overflow: 'hidden', position: 'relative' },
  podiumOrb: { position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.08)' },
  podiumBadge: { fontSize: 18 },
  podiumAvatar: { fontSize: 28 },
  podiumName: { fontSize: 11, fontWeight: '800', color: Colors.white, textAlign: 'center' },
  podiumEarned: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  podiumRate: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  podiumRateTxt: { fontSize: 9, fontWeight: '700', color: Colors.white },
  podiumBar: { width: '100%', borderRadius: 12, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 6 },
  podiumBarRank: { fontSize: 12, fontWeight: '900', color: Colors.white },
  statsBar: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 16, backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1, borderColor: Colors.border },
  statBarItem: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 4 },
  statBarVal: { fontSize: 15, fontWeight: '800' },
  statBarLabel: { fontSize: 9, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
  sectionLbl: { fontSize: 16, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 12 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1 },
  rankBadge: { width: 38, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 },
  rankNum: { fontSize: 11, fontWeight: '900' },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarEmoji: { fontSize: 20 },
  playerInfo: { flex: 1 },
  playerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  playerName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  youBadge: { backgroundColor: Colors.neonCyan + '22', borderWidth: 1, borderColor: Colors.neonCyan + '55', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  youBadgeTxt: { fontSize: 8, fontWeight: '900', color: Colors.neonCyan, letterSpacing: 1 },
  playerGames: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  earned: { fontSize: 14, fontWeight: '900', flexShrink: 0 },
  myRankCard: { marginHorizontal: 16, marginTop: 8, borderRadius: 22, overflow: 'hidden' },
  myRankInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  myRankLeft: { gap: 4 },
  myRankLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 1 },
  myRankNum: { fontSize: 26, fontWeight: '900', color: Colors.white },
  myRankSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  myRankRight: { alignItems: 'center', gap: 4 },
  myRankEmoji: { fontSize: 36 },
  myRankGames: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});
