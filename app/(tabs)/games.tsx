import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const CATEGORIES = ['All', 'Casual', 'Strategy', 'Trivia', 'Luck'];

const GAMES = [
  {
    id: '1', name: 'Coin Flip', category: 'Luck', icon: 'logo-bitcoin', color: '#FDCB6E',
    reward: 'Up to $1.90', difficulty: 'Easy', players: '12.4K', timeEst: '1 min',
    route: '/games/coin-flip', description: 'Pick heads or tails and double your bet!',
  },
  {
    id: '2', name: 'Lucky Spin', category: 'Luck', icon: 'sync', color: '#6C5CE7',
    reward: 'Up to $10.00', difficulty: 'Easy', players: '8.1K', timeEst: '2 min',
    route: '/games/lucky-spin', description: 'Spin the wheel and win instant cash prizes!',
  },
  {
    id: '3', name: 'Quiz Master', category: 'Trivia', icon: 'help-circle', color: '#00CEC9',
    reward: 'Up to $0.75', difficulty: 'Medium', players: '9.7K', timeEst: '5 min',
    route: '/games/quiz', description: 'Answer 5 questions and earn per correct answer!',
  },
  {
    id: '4', name: 'Card Battle', category: 'Strategy', icon: 'card', color: '#FD79A8',
    reward: '$0.25', difficulty: 'Medium', players: '5.3K', timeEst: '10 min',
    route: null, description: 'Coming soon!',
  },
  {
    id: '5', name: 'Memory Match', category: 'Casual', icon: 'grid', color: '#00B894',
    reward: '$0.30', difficulty: 'Easy', players: '3.2K', timeEst: '4 min',
    route: null, description: 'Coming soon!',
  },
  {
    id: '6', name: 'Number Blitz', category: 'Strategy', icon: 'calculator', color: '#E17055',
    reward: '$2.00', difficulty: 'Hard', players: '1.8K', timeEst: '15 min',
    route: null, description: 'Coming soon!',
  },
];

const DIFF_COLORS: Record<string, string> = {
  Easy: Colors.success,
  Medium: Colors.gold,
  Hard: Colors.error,
};

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? GAMES : GAMES.filter(g => g.category === activeCategory);
  const playable = GAMES.filter(g => g.route);

  const handlePlay = (game: typeof GAMES[0]) => {
    if (game.route) {
      router.push(game.route as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 16 }]}>
        <Text style={styles.title}>Games</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Featured / Playable Banner */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>🎮 Play Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {playable.map(game => (
              <TouchableOpacity key={game.id} style={[styles.featuredCard, { borderTopColor: game.color }]} onPress={() => handlePlay(game)}>
                <View style={[styles.featuredIcon, { backgroundColor: game.color + '22' }]}>
                  <Ionicons name={game.icon as any} size={36} color={game.color} />
                </View>
                <Text style={styles.featuredName}>{game.name}</Text>
                <Text style={styles.featuredDesc} numberOfLines={2}>{game.description}</Text>
                <View style={styles.featuredReward}>
                  <Ionicons name="cash" size={12} color={Colors.success} />
                  <Text style={styles.featuredRewardText}>{game.reward}</Text>
                </View>
                <View style={styles.playNowBtn}>
                  <Ionicons name="play" size={14} color={Colors.white} />
                  <Text style={styles.playNowText}>Play Now</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Games List */}
        <View style={styles.grid}>
          {filtered.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, !game.route && styles.gameCardDimmed]}
              onPress={() => handlePlay(game)}
              disabled={!game.route}
            >
              <View style={styles.gameTop}>
                <View style={[styles.gameIcon, { backgroundColor: game.color + '22' }]}>
                  <Ionicons name={game.icon as any} size={36} color={game.color} />
                  {!game.route && (
                    <View style={styles.comingSoonOverlay}>
                      <Ionicons name="lock-closed" size={16} color={Colors.textMuted} />
                    </View>
                  )}
                </View>
                <View style={styles.gameMeta}>
                  <View style={styles.gameNameRow}>
                    <Text style={styles.gameName}>{game.name}</Text>
                    {!game.route && <View style={styles.soonBadge}><Text style={styles.soonText}>Soon</Text></View>}
                  </View>
                  <Text style={styles.gameCategory}>{game.category}</Text>
                  <View style={styles.gameStats}>
                    <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[game.difficulty] + '22' }]}>
                      <Text style={[styles.diffText, { color: DIFF_COLORS[game.difficulty] }]}>{game.difficulty}</Text>
                    </View>
                    <Text style={styles.gameStat}>{game.timeEst}</Text>
                    <Text style={styles.gameStat}>{game.players} active</Text>
                  </View>
                </View>
              </View>
              <View style={styles.gameBottom}>
                <View>
                  <Text style={styles.rewardLabel}>Reward</Text>
                  <Text style={styles.rewardAmount}>{game.reward}</Text>
                </View>
                {game.route ? (
                  <TouchableOpacity style={styles.playBtn} onPress={() => handlePlay(game)}>
                    <Ionicons name="play" size={14} color={Colors.white} />
                    <Text style={styles.playBtnText}>Play</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.playBtnDisabled}>
                    <Text style={styles.playBtnTextDisabled}>Soon</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  featuredSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, paddingHorizontal: 20, marginBottom: 12 },
  featuredScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
  featuredCard: {
    width: 180, backgroundColor: Colors.surface, borderRadius: 20, padding: 16,
    gap: 8, borderTopWidth: 3,
  },
  featuredIcon: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  featuredName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  featuredDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 16 },
  featuredReward: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featuredRewardText: { fontSize: 12, color: Colors.success, fontWeight: '700' },
  playNowBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 8,
  },
  playNowText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  categories: { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface },
  catBtnActive: { backgroundColor: Colors.primary },
  catText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  grid: { paddingHorizontal: 20, gap: 12 },
  gameCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 16, gap: 16 },
  gameCardDimmed: { opacity: 0.6 },
  gameTop: { flexDirection: 'row', gap: 14 },
  gameIcon: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  comingSoonOverlay: {
    position: 'absolute', bottom: 0, right: 0, width: 24, height: 24,
    borderRadius: 12, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  gameMeta: { flex: 1, justifyContent: 'center', gap: 4 },
  gameNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gameName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  soonBadge: { backgroundColor: Colors.surfaceAlt, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  soonText: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  gameCategory: { fontSize: 12, color: Colors.textSecondary },
  gameStats: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  diffText: { fontSize: 11, fontWeight: '700' },
  gameStat: { fontSize: 11, color: Colors.textMuted },
  gameBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12,
  },
  rewardLabel: { fontSize: 11, color: Colors.textSecondary },
  rewardAmount: { fontSize: 18, fontWeight: '800', color: Colors.success },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
  },
  playBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  playBtnDisabled: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  playBtnTextDisabled: { color: Colors.textMuted, fontWeight: '700', fontSize: 14 },
});
