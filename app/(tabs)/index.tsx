import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

const FEATURED_GAMES = [
  { id: '1', name: 'Coin Rush', icon: 'logo-bitcoin', color: '#FDCB6E', reward: '$0.50', players: '12.4K' },
  { id: '2', name: 'Lucky Spin', icon: 'sync', color: '#6C5CE7', reward: '$1.00', players: '8.1K' },
  { id: '3', name: 'Card Battle', icon: 'card', color: '#FD79A8', reward: '$0.25', players: '5.3K' },
  { id: '4', name: 'Quiz Master', icon: 'help-circle', color: '#00CEC9', reward: '$0.75', players: '9.7K' },
];

const RECENT_WINS = [
  { user: 'alex_p', amount: '$5.00', game: 'Lucky Spin', time: '2m ago' },
  { user: 'sam_k', amount: '$2.50', game: 'Coin Rush', time: '5m ago' },
  { user: 'jay_m', amount: '$10.00', game: 'Card Battle', time: '8m ago' },
  { user: 'ria_w', amount: '$1.25', game: 'Quiz Master', time: '12m ago' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 16 }]}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.username}>Player</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => {}}>
          <Ionicons name="notifications" size={22} color={Colors.text} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceGradient}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$24.75</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <Ionicons name="trending-up" size={14} color={Colors.success} />
              <Text style={styles.balanceStatText}>+$3.50 today</Text>
            </View>
            <TouchableOpacity style={styles.withdrawBtn} onPress={() => router.push('/(tabs)/wallet')}>
              <Text style={styles.withdrawBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Games Played', value: '47', icon: 'game-controller', color: Colors.primary },
          { label: 'Win Rate', value: '68%', icon: 'trophy', color: Colors.gold },
          { label: 'Streak', value: '5 🔥', icon: 'flame', color: Colors.warning },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Featured Games */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Games</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/games')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gamesScroll}>
        {FEATURED_GAMES.map((game) => (
          <TouchableOpacity key={game.id} style={styles.gameCard} onPress={() => router.push('/(tabs)/games')}>
            <View style={[styles.gameIcon, { backgroundColor: game.color + '22' }]}>
              <Ionicons name={game.icon as any} size={32} color={game.color} />
            </View>
            <Text style={styles.gameName}>{game.name}</Text>
            <View style={styles.gameRewardRow}>
              <Text style={styles.gameReward}>Win {game.reward}</Text>
            </View>
            <Text style={styles.gamePlayers}>{game.players} playing</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Live Wins Feed */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Wins</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.winsFeed}>
        {RECENT_WINS.map((win, i) => (
          <View key={i} style={styles.winRow}>
            <View style={styles.winAvatar}>
              <Text style={styles.winAvatarText}>{win.user[0].toUpperCase()}</Text>
            </View>
            <View style={styles.winInfo}>
              <Text style={styles.winUser}>{win.user}</Text>
              <Text style={styles.winGame}>{win.game}</Text>
            </View>
            <View style={styles.winRight}>
              <Text style={styles.winAmount}>{win.amount}</Text>
              <Text style={styles.winTime}>{win.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Banner */}
      <TouchableOpacity style={styles.ctaBanner} onPress={() => router.push('/(tabs)/games')}>
        <Ionicons name="rocket" size={24} color={Colors.white} />
        <View style={styles.ctaText}>
          <Text style={styles.ctaTitle}>Ready to Win?</Text>
          <Text style={styles.ctaSubtitle}>Play games & earn real cash</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.white} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  username: { fontSize: 22, fontWeight: '700', color: Colors.text },
  notifBtn: { position: 'relative', padding: 8, backgroundColor: Colors.surface, borderRadius: 12 },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  balanceCard: { marginHorizontal: 20, marginBottom: 16, borderRadius: 20, overflow: 'hidden' },
  balanceGradient: {
    backgroundColor: Colors.primary,
    padding: 24,
    borderRadius: 20,
  },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  balanceAmount: { fontSize: 42, fontWeight: '800', color: Colors.white, marginBottom: 16 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  balanceStatText: { fontSize: 13, color: Colors.success, fontWeight: '600' },
  withdrawBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  withdrawBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 14,
    alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  gamesScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4, marginBottom: 24 },
  gameCard: {
    backgroundColor: Colors.surface, borderRadius: 20, padding: 16,
    width: width * 0.4, alignItems: 'center', gap: 8,
  },
  gameIcon: { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  gameName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  gameRewardRow: { backgroundColor: Colors.success + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  gameReward: { fontSize: 12, color: Colors.success, fontWeight: '700' },
  gamePlayers: { fontSize: 11, color: Colors.textMuted },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.error + '22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error },
  liveText: { fontSize: 10, color: Colors.error, fontWeight: '700' },
  winsFeed: { marginHorizontal: 20, backgroundColor: Colors.surface, borderRadius: 20, padding: 16, gap: 16, marginBottom: 20 },
  winRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  winAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '33', justifyContent: 'center', alignItems: 'center' },
  winAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  winInfo: { flex: 1 },
  winUser: { fontSize: 14, fontWeight: '600', color: Colors.text },
  winGame: { fontSize: 12, color: Colors.textSecondary },
  winRight: { alignItems: 'flex-end' },
  winAmount: { fontSize: 15, fontWeight: '800', color: Colors.success },
  winTime: { fontSize: 11, color: Colors.textMuted },
  ctaBanner: {
    marginHorizontal: 20, backgroundColor: Colors.primary, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12,
  },
  ctaText: { flex: 1 },
  ctaTitle: { fontSize: 16, fontWeight: '800', color: Colors.white },
  ctaSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
});
