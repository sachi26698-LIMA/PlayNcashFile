import { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const CATEGORIES = ['All', 'Hot', 'Free', 'Jackpot'];
const GAMES = [
  { id: '1', name: 'Coin Rush', desc: '50/50 odds — flip to win', icon: 'logo-bitcoin', route: '/games/coin-flip', gradient: ['#F59E0B', '#DC2626'] as const, glow: Colors.neonGold, reward: '1.9x payout', tag: '🔥 HOT', category: 'Hot', players: 1247, winRate: '50%', maxWin: '$2.00' },
  { id: '2', name: 'Lucky Spin', desc: 'Spin for up to $10 jackpot', icon: 'sync', route: '/games/lucky-spin', gradient: ['#8B5CF6', '#4F46E5'] as const, glow: Colors.neonPurple, reward: 'Up to $10.00', tag: '💎 JACKPOT', category: 'Jackpot', players: 3891, winRate: '72%', maxWin: '$10.00' },
  { id: '3', name: 'Quiz Master', desc: 'Answer 5 questions, earn cash', icon: 'help-circle', route: '/games/quiz', gradient: ['#06B6D4', '#0284C7'] as const, glow: Colors.neonCyan, reward: 'Up to $0.75', tag: '🆓 FREE', category: 'Free', players: 892, winRate: '64%', maxWin: '$0.75' },
];

function FeaturedBanner({ game }: { game: typeof GAMES[0] }) {
  const scale = useRef(new Animated.Value(1)).current;
  const gs = Platform.OS === 'web' ? { boxShadow: `0 12px 48px ${game.glow}55, 0 0 60px ${game.glow}22` } as any : {};
  return (
    <Animated.View style={[{ transform: [{ scale }], marginHorizontal: 16, marginBottom: 20 }, gs]}>
      <TouchableOpacity
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onPress={() => router.push(game.route as any)} activeOpacity={1}
      >
        <LinearGradient colors={game.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featBanner}>
          <View style={[styles.orb, { top: -50, right: -30, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }]} />
          <View style={[styles.orb, { bottom: -20, left: 50, width: 80, height: 80, backgroundColor: 'rgba(0,0,0,0.12)' }]} />
          <Ionicons name={game.icon as any} size={100} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: 8, top: 8 }} />

          <View style={styles.featTag}><Text style={styles.featTagTxt}>{game.tag}</Text></View>
          <Text style={styles.featTitle}>{game.name}</Text>
          <Text style={styles.featDesc}>{game.desc}</Text>
          <Text style={styles.featReward}>{game.reward}</Text>

          <View style={styles.featMeta}>
            {[{ v: `${game.players.toLocaleString()}`, l: 'Players' }, { v: game.winRate, l: 'Win Rate' }, { v: game.maxWin, l: 'Max Win' }].map((s, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <Text style={styles.featMetaV}>{s.v}</Text>
                <Text style={styles.featMetaL}>{s.l}</Text>
              </View>
            ))}
          </View>
          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.featPlayBtn}>
            <Ionicons name="play" size={16} color={Colors.white} />
            <Text style={styles.featPlayTxt}>Play Now</Text>
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function GameRow({ game }: { game: typeof GAMES[0] }) {
  const scale = useRef(new Animated.Value(1)).current;
  const gs = Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${game.glow}22, inset 0 1px 0 rgba(255,255,255,0.06)` } as any : {};
  return (
    <Animated.View style={[{ transform: [{ scale }], marginHorizontal: 16, marginBottom: 12 }]}>
      <TouchableOpacity
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onPress={() => router.push(game.route as any)} activeOpacity={1}
      >
        <View style={[styles.gameRow, { borderColor: `${game.glow}33` }, gs]}>
          <LinearGradient colors={game.gradient} style={styles.gameIcon}>
            <Ionicons name={game.icon as any} size={26} color={Colors.white} />
          </LinearGradient>
          <View style={styles.gameBody}>
            <View style={styles.gameTop}>
              <Text style={styles.gameName}>{game.name}</Text>
              <View style={[styles.gameTag, { backgroundColor: `${game.glow}22`, borderColor: `${game.glow}55` }]}>
                <Text style={[styles.gameTagTxt, { color: game.glow }]}>{game.tag}</Text>
              </View>
            </View>
            <Text style={styles.gameDesc}>{game.desc}</Text>
            <View style={styles.gameFoot}>
              <View style={styles.playerRow}>
                <View style={styles.greenDot} />
                <Text style={styles.playerTxt}>{game.players.toLocaleString()} playing</Text>
              </View>
              <Text style={[styles.rewardTxt, { color: game.glow }]}>{game.reward}</Text>
            </View>
          </View>
          <View style={[styles.chevronBtn, { backgroundColor: `${game.glow}18`, borderColor: `${game.glow}44` }]}>
            <Ionicons name="chevron-forward" size={18} color={game.glow} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? GAMES : GAMES.filter(g => g.category === cat);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <LinearGradient colors={[Colors.bgAlt, Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
          <View>
            <Text style={styles.headerTitle}>Game Arena</Text>
            <Text style={styles.headerSub}>Play & earn real cash</Text>
          </View>
          <View style={styles.onlinePill}>
            <View style={styles.greenDot} />
            <Text style={styles.onlineTxt}>5,030 online</Text>
          </View>
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 16, paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <TouchableOpacity key={c} onPress={() => setCat(c)}>
              {cat === c
                ? <LinearGradient colors={Colors.gradPurple} style={styles.filterActive}><Text style={styles.filterActiveTxt}>{c}</Text></LinearGradient>
                : <View style={styles.filterInactive}><Text style={styles.filterInactiveTxt}>{c}</Text></View>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLbl}>⭐ Featured Game</Text>
        <FeaturedBanner game={GAMES[1]} />

        <Text style={styles.sectionLbl}>🎯 All Games</Text>
        {filtered.map(g => <GameRow key={g.id} game={g} />)}

        <Text style={styles.sectionLbl}>🔒 Coming Soon</Text>
        <View style={styles.comingRow}>
          {['Poker', 'Blackjack', 'Dice Rush'].map(n => (
            <View key={n} style={styles.comingCard}>
              <Ionicons name="lock-closed" size={20} color={Colors.textMuted} />
              <Text style={styles.comingName}>{n}</Text>
              <Text style={styles.comingLabel}>Soon™</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  onlinePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  greenDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.neonGreen },
  onlineTxt: { fontSize: 12, fontWeight: '700', color: Colors.neonGreen },
  filterActive: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  filterActiveTxt: { fontSize: 13, fontWeight: '800', color: Colors.white },
  filterInactive: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  filterInactiveTxt: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  sectionLbl: { fontSize: 16, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 12 },
  featBanner: { borderRadius: 26, padding: 22, overflow: 'hidden', position: 'relative', gap: 12 },
  orb: { position: 'absolute', borderRadius: 100 },
  featTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  featTagTxt: { fontSize: 11, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  featTitle: { fontSize: 30, fontWeight: '900', color: Colors.white, letterSpacing: -0.5 },
  featDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  featReward: { fontSize: 14, fontWeight: '900', color: Colors.neonGoldLight },
  featMeta: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 14, paddingVertical: 10 },
  featMetaV: { fontSize: 15, fontWeight: '800', color: Colors.white },
  featMetaL: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '600' },
  featPlayBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 14 },
  featPlayTxt: { fontSize: 15, fontWeight: '800', color: Colors.white },
  gameRow: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1 },
  gameIcon: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  gameBody: { flex: 1, gap: 5 },
  gameTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gameName: { fontSize: 15, fontWeight: '800', color: Colors.text, flex: 1 },
  gameTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  gameTagTxt: { fontSize: 10, fontWeight: '700' },
  gameDesc: { fontSize: 12, color: Colors.textMuted },
  gameFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  playerTxt: { fontSize: 11, color: Colors.textMuted },
  rewardTxt: { fontSize: 12, fontWeight: '800' },
  chevronBtn: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 },
  comingRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  comingCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 18, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border },
  comingName: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  comingLabel: { fontSize: 10, color: Colors.textMuted, backgroundColor: Colors.surfaceAlt, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
});
