import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  TextInput, Platform, ScrollView, KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const REACTIONS = ['🔥', '🎉', '💎', '👑', '💸', '🚀'];

const GAME_ICONS: Record<string, string> = {
  'Lucky Spin': 'sync',
  'Coin Rush': 'logo-bitcoin',
  'Quiz Master': 'help-circle',
};

const GAME_COLORS: Record<string, readonly [string, string]> = {
  'Lucky Spin': Colors.gradPurple,
  'Coin Rush': Colors.gradGold,
  'Quiz Master': Colors.gradCyan,
};

const AUTO_POSTS = [
  { user: 'CryptoKing', avatar: '💎', game: 'Lucky Spin', amount: '$10.00', msg: 'JACKPOT!! Can\'t believe it 🤯', gradient: Colors.gradGoldSoft, glow: Colors.neonGold },
  { user: 'NightWolf', avatar: '🐺', game: 'Coin Rush', amount: '$1.90', msg: 'Heads again! 3rd flip in a row 🐺', gradient: Colors.gradPurple, glow: Colors.neonPurple },
  { user: 'StarBlaze', avatar: '⭐', game: 'Quiz Master', amount: '$0.75', msg: 'Perfect score! Geography is my thing 🌍', gradient: Colors.gradCyan, glow: Colors.neonCyan },
  { user: 'LuckyFox', avatar: '🦊', game: 'Lucky Spin', amount: '$5.00', msg: 'This game is INSANE 🦊🔥', gradient: Colors.gradPink, glow: Colors.neonPink },
  { user: 'AcePlayer', avatar: '🃏', game: 'Coin Rush', amount: '$0.95', msg: 'Slow and steady wins the race 😤', gradient: Colors.gradGreen, glow: Colors.neonGreen },
  { user: 'ZenMaster', avatar: '🧘', game: 'Quiz Master', amount: '$0.50', msg: 'Knowledge pays off literally 📚', gradient: Colors.gradCyan, glow: Colors.neonCyan },
  { user: 'StormBolt', avatar: '⚡', game: 'Lucky Spin', amount: '$2.00', msg: 'Double or nothing, got double ⚡', gradient: Colors.gradGold, glow: Colors.neonGold },
  { user: 'ShadowAce', avatar: '🌑', game: 'Coin Rush', amount: '$1.90', msg: 'Called it with my eyes closed 🎯', gradient: Colors.gradPurple, glow: Colors.neonPurple },
];

type Reaction = { emoji: string; count: number };
type Post = {
  id: string;
  user: string;
  avatar: string;
  game: string;
  amount: string;
  msg: string;
  gradient: readonly [string, string];
  glow: string;
  reactions: Reaction[];
  time: string;
  isMe?: boolean;
};

function timeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 10) return 'just now';
  if (sec < 60) return `${sec}s ago`;
  return `${Math.floor(sec / 60)}m ago`;
}

function makeSeed(): Post[] {
  const now = Date.now();
  return AUTO_POSTS.slice(0, 5).map((p, i) => ({
    id: `seed-${i}`,
    ...p,
    reactions: REACTIONS.map(e => ({ emoji: e, count: Math.floor(Math.random() * 12) })),
    time: new Date(now - (i + 1) * 45000).toISOString(),
  }));
}

function PostCard({ post, onReact }: { post: Post; onReact: (id: string, emoji: string) => void }) {
  const slideIn = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [times, setTimes] = useState(timeAgo(new Date(post.time)));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideIn, { toValue: 0, friction: 8, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    const t = setInterval(() => setTimes(timeAgo(new Date(post.time))), 15000);
    return () => clearInterval(t);
  }, []);

  const gs = Platform.OS === 'web' ? {
    boxShadow: `0 4px 20px ${post.glow}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
  } as any : {};

  return (
    <Animated.View style={{ transform: [{ translateY: slideIn }], opacity }}>
      <View style={[
        styles.card,
        post.isMe && { borderColor: Colors.neonCyan + '66' },
        gs,
      ]}>
        {/* Header row */}
        <View style={styles.cardHeader}>
          <LinearGradient colors={post.gradient} style={styles.cardAvatar}>
            <Text style={styles.cardAvatarTxt}>{post.avatar}</Text>
          </LinearGradient>
          <View style={styles.cardMeta}>
            <View style={styles.cardNameRow}>
              <Text style={[styles.cardName, post.isMe && { color: Colors.neonCyan }]}>{post.user}</Text>
              {post.isMe && (
                <View style={styles.youPill}>
                  <Text style={styles.youPillTxt}>YOU</Text>
                </View>
              )}
            </View>
            <View style={styles.cardGameRow}>
              <LinearGradient colors={GAME_COLORS[post.game] ?? Colors.gradPurple} style={styles.gameChip}>
                <Ionicons name={(GAME_ICONS[post.game] ?? 'game-controller') as any} size={9} color={Colors.white} />
                <Text style={styles.gameChipTxt}>{post.game}</Text>
              </LinearGradient>
              <Text style={styles.cardTime}>{times}</Text>
            </View>
          </View>
          {/* Win badge */}
          <LinearGradient colors={Colors.gradGreen} style={styles.winBadge}>
            <Text style={styles.winBadgeTxt}>+{post.amount}</Text>
          </LinearGradient>
        </View>

        {/* Message */}
        <Text style={styles.cardMsg}>{post.msg}</Text>

        {/* Reactions */}
        <View style={styles.reactRow}>
          {post.reactions.filter(r => r.count > 0 || true).slice(0, 6).map(r => (
            <ReactionButton key={r.emoji} reaction={r} onPress={() => onReact(post.id, r.emoji)} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

function ReactionButton({ reaction, onPress }: { reaction: Reaction; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [count, setCount] = useState(reaction.count);
  const [tapped, setTapped] = useState(false);

  const handlePress = () => {
    if (tapped) return;
    setTapped(true);
    setCount(c => c + 1);
    onPress();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.5, friction: 4, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const gs = tapped && Platform.OS === 'web' ? {
    boxShadow: `0 0 12px ${Colors.neonPurple}66`,
  } as any : {};

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View style={[
        styles.reaction,
        tapped && styles.reactionTapped,
        { transform: [{ scale }] },
        gs,
      ]}>
        <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
        {count > 0 && <Text style={[styles.reactionCount, tapped && { color: Colors.neonPurple }]}>{count}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
}

function FloatingEmoji({ emoji, x }: { emoji: string; x: number }) {
  const ty = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ty, { toValue: -60, duration: 900, useNativeDriver: true }),
      Animated.timing(op, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ position: 'absolute', left: x, bottom: 40, transform: [{ translateY: ty }], opacity: op, zIndex: 99 }} pointerEvents="none">
      <Text style={{ fontSize: 24 }}>{emoji}</Text>
    </Animated.View>
  );
}

interface SocialFeedProps {
  maxVisible?: number;
  showCompose?: boolean;
}

export default function SocialFeed({ maxVisible = 8, showCompose = true }: SocialFeedProps) {
  const [posts, setPosts] = useState<Post[]>(makeSeed);
  const [input, setInput] = useState('');
  const [floaters, setFloaters] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const nextIdx = useRef(5);
  const scrollRef = useRef<ScrollView>(null);

  // Auto-generate new posts
  useEffect(() => {
    const tick = () => {
      const template = AUTO_POSTS[nextIdx.current % AUTO_POSTS.length];
      nextIdx.current++;
      const newPost: Post = {
        id: `auto-${Date.now()}`,
        ...template,
        reactions: REACTIONS.map(e => ({ emoji: e, count: Math.floor(Math.random() * 8) })),
        time: new Date().toISOString(),
      };
      setPosts(prev => [newPost, ...prev].slice(0, maxVisible));
    };

    const delay = 5000 + Math.random() * 4000;
    const t = setTimeout(function loop() {
      tick();
      const next = setTimeout(loop, 5000 + Math.random() * 5000);
      return next;
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const handleReact = useCallback((id: string, emoji: string) => {
    const x = Math.random() * 200 + 40;
    const floatId = `${id}-${emoji}-${Date.now()}`;
    setFloaters(f => [...f, { id: floatId, emoji, x }]);
    setTimeout(() => setFloaters(f => f.filter(fl => fl.id !== floatId)), 1000);
  }, []);

  const submitPost = () => {
    const text = input.trim();
    if (!text) return;
    const myPost: Post = {
      id: `me-${Date.now()}`,
      user: 'Player (You)',
      avatar: '👤',
      game: 'Lucky Spin',
      amount: '$1.00',
      msg: text,
      gradient: Colors.gradCyan,
      glow: Colors.neonCyan,
      reactions: REACTIONS.map(e => ({ emoji: e, count: 0 })),
      time: new Date().toISOString(),
      isMe: true,
    };
    setPosts(prev => [myPost, ...prev].slice(0, maxVisible));
    setInput('');
  };

  return (
    <View style={styles.container}>
      {/* Floating emojis */}
      {floaters.map(f => <FloatingEmoji key={f.id} emoji={f.emoji} x={f.x} />)}

      {/* Compose box */}
      {showCompose && (
        <View style={styles.compose}>
          <View style={styles.composeAvatar}>
            <Text style={styles.composeAvatarTxt}>👤</Text>
          </View>
          <View style={styles.composeInput}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Share a win or reaction..."
              placeholderTextColor={Colors.textMuted}
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={submitPost}
              maxLength={120}
            />
          </View>
          <TouchableOpacity onPress={submitPost} disabled={!input.trim()}>
            <LinearGradient
              colors={input.trim() ? Colors.gradPurple : [Colors.surfaceAlt, Colors.surface] as any}
              style={styles.sendBtn}
            >
              <Ionicons name="send" size={16} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Feed */}
      <View style={styles.feed}>
        {posts.map(p => (
          <PostCard key={p.id} post={p} onReact={handleReact} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },

  compose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderBright,
    padding: 10,
    ...(Platform.OS === 'web' ? {
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
    } as any : {}),
  },
  composeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  composeAvatarTxt: { fontSize: 18 },
  composeInput: { flex: 1 },
  input: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: Platform.OS === 'web' ? 6 : 4,
    outlineStyle: 'none',
  } as any,
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  feed: { gap: 10, paddingHorizontal: 16 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardAvatarTxt: { fontSize: 20 },
  cardMeta: { flex: 1 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  youPill: {
    backgroundColor: Colors.neonCyan + '22',
    borderWidth: 1,
    borderColor: Colors.neonCyan + '55',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  youPillTxt: { fontSize: 8, fontWeight: '900', color: Colors.neonCyan, letterSpacing: 1 },
  cardGameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  gameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gameChipTxt: { fontSize: 9, fontWeight: '800', color: Colors.white },
  cardTime: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  winBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexShrink: 0,
  },
  winBadgeTxt: { fontSize: 12, fontWeight: '900', color: Colors.white },
  cardMsg: { fontSize: 14, color: Colors.textSec, fontWeight: '500', lineHeight: 20 },
  reactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  reactionTapped: {
    backgroundColor: Colors.neonPurple + '22',
    borderColor: Colors.neonPurple + '55',
  },
  reactionEmoji: { fontSize: 14 },
  reactionCount: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
});
