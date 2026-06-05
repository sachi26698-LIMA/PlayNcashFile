import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const RESET_HOURS = 24;

type Challenge = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  reward: string;
  rewardVal: number;
  goal: number;
  progress: number;
  gradient: readonly [string, string];
  glow: string;
  claimed: boolean;
};

const INITIAL: Challenge[] = [
  {
    id: 'c1',
    title: 'Coin Flipper',
    desc: 'Win 3 Coin Rush games today',
    icon: 'logo-bitcoin',
    reward: '+$0.50',
    rewardVal: 0.50,
    goal: 3,
    progress: 2,
    gradient: ['#F59E0B', '#DC2626'],
    glow: Colors.neonGold,
    claimed: false,
  },
  {
    id: 'c2',
    title: 'Quiz Ace',
    desc: 'Score 100% on any quiz',
    icon: 'help-circle',
    reward: '+$0.75',
    rewardVal: 0.75,
    goal: 1,
    progress: 0,
    gradient: Colors.gradCyan,
    glow: Colors.neonCyan,
    claimed: false,
  },
  {
    id: 'c3',
    title: 'High Roller',
    desc: 'Play Lucky Spin 5 times',
    icon: 'sync',
    reward: '+$1.00',
    rewardVal: 1.00,
    goal: 5,
    progress: 3,
    gradient: Colors.gradPurple,
    glow: Colors.neonPurple,
    claimed: false,
  },
  {
    id: 'c4',
    title: 'Big Earner',
    desc: 'Earn $2.00 or more today',
    icon: 'cash',
    reward: '+$1.50',
    rewardVal: 1.50,
    goal: 200,
    progress: 145,
    gradient: Colors.gradGreen,
    glow: Colors.neonGreen,
    claimed: false,
  },
  {
    id: 'c5',
    title: 'Hot Streak',
    desc: 'Win 2 games in a row',
    icon: 'flame',
    reward: '+$0.25',
    rewardVal: 0.25,
    goal: 2,
    progress: 2,
    gradient: ['#F97316', '#EC4899'],
    glow: Colors.neonPink,
    claimed: false,
  },
];

function ProgressBar({
  progress,
  goal,
  gradient,
  complete,
}: {
  progress: number;
  goal: number;
  gradient: readonly [string, string];
  complete: boolean;
}) {
  const pct = Math.min(progress / goal, 1);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.trackOuter}>
      <View style={styles.track}>
        <Animated.View style={{ width, overflow: 'hidden', borderRadius: 6 }}>
          <LinearGradient
            colors={complete ? [Colors.neonGreen, '#059669'] : gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>
      <Text style={styles.pctTxt}>
        {complete ? '✓' : `${Math.round(pct * 100)}%`}
      </Text>
    </View>
  );
}

function ChallengeCard({
  challenge,
  onClaim,
}: {
  challenge: Challenge;
  onClaim: (id: string) => void;
}) {
  const complete = challenge.progress >= challenge.goal;
  const claimable = complete && !challenge.claimed;
  const scale = useRef(new Animated.Value(1)).current;
  const claimPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!claimable) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(claimPulse, { toValue: 1.04, duration: 700, useNativeDriver: true }),
        Animated.timing(claimPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [claimable]);

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const gs =
    Platform.OS === 'web'
      ? ({
          boxShadow: claimable
            ? `0 0 24px ${challenge.glow}66, 0 4px 20px ${challenge.glow}33`
            : `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
        } as any)
      : {};

  const borderColor = challenge.claimed
    ? Colors.border
    : claimable
    ? `${challenge.glow}88`
    : `${challenge.glow}33`;

  const displayProg =
    challenge.id === 'c4'
      ? `$${(challenge.progress / 100).toFixed(2)} / $${(challenge.goal / 100).toFixed(2)}`
      : `${challenge.progress} / ${challenge.goal}`;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        disabled={challenge.claimed || !claimable}
        onPress={() => claimable && onClaim(challenge.id)}
      >
        <LinearGradient
          colors={
            challenge.claimed
              ? (['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)'] as any)
              : claimable
              ? ([`${challenge.glow}22`, `${challenge.glow}08`] as any)
              : (['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)'] as any)
          }
          style={[styles.card, { borderColor }, gs]}
        >
          {/* Left icon */}
          <LinearGradient
            colors={challenge.claimed ? [Colors.surfaceAlt, Colors.surface] as any : challenge.gradient}
            style={[styles.iconBox, challenge.claimed && { opacity: 0.4 }]}
          >
            <Ionicons
              name={challenge.icon as any}
              size={22}
              color={Colors.white}
            />
          </LinearGradient>

          {/* Middle info */}
          <View style={styles.middle}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, challenge.claimed && { color: Colors.textMuted }]}>
                {challenge.title}
              </Text>
              {claimable && (
                <View style={[styles.readyBadge, { backgroundColor: `${challenge.glow}33`, borderColor: `${challenge.glow}66` }]}>
                  <Text style={[styles.readyTxt, { color: challenge.glow }]}>READY!</Text>
                </View>
              )}
              {challenge.claimed && (
                <View style={styles.doneBadge}>
                  <Text style={styles.doneTxt}>DONE</Text>
                </View>
              )}
            </View>
            <Text style={styles.desc}>{challenge.desc}</Text>
            <ProgressBar
              progress={challenge.progress}
              goal={challenge.goal}
              gradient={challenge.gradient}
              complete={complete}
            />
            <Text style={styles.progTxt}>{displayProg}</Text>
          </View>

          {/* Right reward */}
          <Animated.View style={{ transform: [{ scale: claimPulse }] }}>
            {challenge.claimed ? (
              <View style={styles.claimedBox}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.neonGreen} />
                <Text style={styles.claimedTxt}>Claimed</Text>
              </View>
            ) : (
              <LinearGradient
                colors={
                  claimable
                    ? challenge.gradient
                    : [Colors.surfaceAlt, Colors.surface] as any
                }
                style={styles.rewardBox}
              >
                <Ionicons
                  name="cash"
                  size={12}
                  color={claimable ? Colors.white : Colors.textMuted}
                />
                <Text style={[styles.rewardTxt, !claimable && { color: Colors.textMuted }]}>
                  {challenge.reward}
                </Text>
              </LinearGradient>
            )}
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function CountdownTimer() {
  const [secs, setSecs] = useState(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  });

  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const fmt = (n: number) => String(n).padStart(2, '0');

  return (
    <View style={styles.timer}>
      <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
      <Text style={styles.timerTxt}>Resets in </Text>
      <Text style={styles.timerVal}>{fmt(h)}:{fmt(m)}:{fmt(s)}</Text>
    </View>
  );
}

interface DailyChallengesProps {
  onBalanceChange?: (delta: number) => void;
}

export default function DailyChallenges({ onBalanceChange }: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL);

  const totalReward = challenges.reduce(
    (sum, c) => sum + (c.claimed ? 0 : c.claimable ? 0 : 0) + c.rewardVal,
    0
  );
  const completed = challenges.filter(c => c.progress >= c.goal).length;
  const claimed = challenges.filter(c => c.claimed).length;
  const totalRewardAvail = challenges.reduce((s, c) => s + c.rewardVal, 0);

  const handleClaim = (id: string) => {
    const ch = challenges.find(c => c.id === id);
    if (!ch) return;
    setChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, claimed: true } : c))
    );
    onBalanceChange?.(ch.rewardVal);
    const gs =
      Platform.OS === 'web'
        ? `🎉 +${ch.reward} added to your balance!`
        : `+${ch.reward} added!`;
    Alert.alert('Reward Claimed!', gs);
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient colors={Colors.gradGold} style={styles.headerIcon}>
            <Ionicons name="flash" size={14} color={Colors.bg} />
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>Daily Missions</Text>
            <Text style={styles.headerSub}>
              {completed}/{challenges.length} complete · ${totalRewardAvail.toFixed(2)} available
            </Text>
          </View>
        </View>
        <CountdownTimer />
      </View>

      {/* Overall progress bar */}
      <View style={styles.overallTrack}>
        <LinearGradient
          colors={Colors.gradGoldSoft}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.overallFill, { width: `${(claimed / challenges.length) * 100}%` as any }]}
        />
        <Text style={styles.overallLabel}>
          {claimed} claimed · {challenges.length - completed} remaining
        </Text>
      </View>

      {/* Challenge cards */}
      <View style={styles.list}>
        {challenges.map(c => (
          <ChallengeCard key={c.id} challenge={c} onClaim={handleClaim} />
        ))}
      </View>

      {/* Bonus banner: claim all */}
      {claimed === challenges.length ? (
        <LinearGradient colors={Colors.gradGold} style={styles.bonusBanner}>
          <Text style={styles.bonusEmoji}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bonusTitle}>All missions complete!</Text>
            <Text style={styles.bonusSub}>Come back tomorrow for new challenges</Text>
          </View>
          <Text style={styles.bonusAmt}>+${totalRewardAvail.toFixed(2)}</Text>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['rgba(245,158,11,0.12)', 'rgba(245,158,11,0.04)']}
          style={[styles.bonusBanner, { borderColor: Colors.neonGold + '33' }]}
        >
          <Text style={styles.bonusEmoji}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bonusTitle, { color: Colors.neonGoldLight }]}>
              Complete all 5 to unlock bonus
            </Text>
            <Text style={styles.bonusSub}>Extra +$1.00 when all are claimed</Text>
          </View>
          <LinearGradient colors={Colors.gradGoldSoft} style={styles.bonusProgress}>
            <Text style={styles.bonusProgressTxt}>{claimed}/5</Text>
          </LinearGradient>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  headerSub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },

  timer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerTxt: { fontSize: 11, color: Colors.textMuted },
  timerVal: { fontSize: 12, fontWeight: '800', color: Colors.neonGold, letterSpacing: 0.5 },

  overallTrack: {
    height: 28,
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    position: 'relative',
  },
  overallFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  overallLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSec,
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },

  list: { gap: 10, paddingHorizontal: 16, marginBottom: 12 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  middle: { flex: 1, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 14, fontWeight: '800', color: Colors.text, flex: 1 },

  readyBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  readyTxt: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },

  doneBadge: {
    backgroundColor: Colors.neonGreen + '22',
    borderWidth: 1,
    borderColor: Colors.neonGreen + '44',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  doneTxt: { fontSize: 9, fontWeight: '900', color: Colors.neonGreen, letterSpacing: 0.8 },

  desc: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },

  trackOuter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
  pctTxt: { fontSize: 11, fontWeight: '800', color: Colors.textSec, width: 28, textAlign: 'right' },

  progTxt: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },

  rewardBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 3,
    minWidth: 56,
  },
  rewardTxt: { fontSize: 12, fontWeight: '900', color: Colors.white },

  claimedBox: { alignItems: 'center', gap: 3, paddingHorizontal: 4 },
  claimedTxt: { fontSize: 10, color: Colors.neonGreen, fontWeight: '700' },

  bonusBanner: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.neonGold + '44',
  },
  bonusEmoji: { fontSize: 28 },
  bonusTitle: { fontSize: 13, fontWeight: '800', color: Colors.white },
  bonusSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  bonusAmt: { fontSize: 20, fontWeight: '900', color: Colors.white },
  bonusProgress: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bonusProgressTxt: { fontSize: 13, fontWeight: '900', color: Colors.bg },
});
