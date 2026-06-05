import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const QUESTIONS = [
  { q: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], answer: 2, category: 'Geography' },
  { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 1, category: 'Science' },
  { q: 'What is 7 × 8?', options: ['54', '56', '58', '60'], answer: 1, category: 'Math' },
  { q: 'Who painted the Mona Lisa?', options: ['Picasso', 'Van Gogh', 'Da Vinci', 'Rembrandt'], answer: 2, category: 'Art' },
  { q: 'What year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: 2, category: 'History' },
];

const REWARDS = [0.05, 0.10, 0.15, 0.20, 0.25];
const TIME_LIMIT = 15;

type Phase = 'intro' | 'playing' | 'finished';

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressDots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[
          styles.dot,
          i < current && { backgroundColor: Colors.neonGreen },
          i === current && { backgroundColor: Colors.neonPurple, width: 20 },
          i > current && { backgroundColor: Colors.border },
        ]} />
      ))}
    </View>
  );
}

function TimerBar({ timeLeft, total }: { timeLeft: number; total: number }) {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pct = timeLeft / total;
    Animated.timing(anim, { toValue: pct, duration: 200, useNativeDriver: false }).start();
  }, [timeLeft]);

  const color = timeLeft > 8 ? Colors.neonGreen : timeLeft > 4 ? Colors.neonGold : Colors.neonRed;
  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.timerTrack}>
      <Animated.View style={{ width }}>
        <LinearGradient colors={timeLeft > 8 ? Colors.gradGreen : timeLeft > 4 ? [Colors.neonGold, Colors.neonGold] as const : [Colors.neonRed, Colors.neonRed] as const} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.timerFill} />
      </Animated.View>
    </View>
  );
}

export default function QuizGame() {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('intro');
  const [balance, setBalance] = useState(24.75);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [answered, setAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const slideIn = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0)).current;

  const q = QUESTIONS[qIdx];

  const animateIn = () => {
    slideIn.setValue(40);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(slideIn, { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    animateIn();
    setTimeLeft(TIME_LIMIT);
    setSelected(null);
    setAnswered(false);
    resultScale.setValue(0);
  }, [qIdx, phase]);

  useEffect(() => {
    if (phase !== 'playing' || answered) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, answered]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelected(idx);
    const correct = idx === q.answer;
    if (correct) setScore(s => s + 1);
    else setWrongAnswers(w => w + 1);
    Animated.spring(resultScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();

    setTimeout(() => {
      if (qIdx < QUESTIONS.length - 1) setQIdx(i => i + 1);
      else {
        const earned = REWARDS.slice(0, score + (correct ? 1 : 0)).reduce((a, b) => a + b, 0);
        setBalance(p => Math.round((p + earned) * 100) / 100);
        setPhase('finished');
      }
    }, 1500);
  };

  const restart = () => {
    setQIdx(0); setScore(0); setWrongAnswers(0); setPhase('playing'); setSelected(null); setAnswered(false);
  };

  const totalEarned = REWARDS.slice(0, score).reduce((a, b) => a + b, 0);

  if (phase === 'intro') return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.bgAlt, Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Master</Text>
        <LinearGradient colors={Colors.gradCyan} style={styles.balancePill}>
          <Text style={styles.balanceTxt}>${balance.toFixed(2)}</Text>
        </LinearGradient>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.introContent}>
        <LinearGradient colors={Colors.gradCyan} style={styles.introIcon}>
          <Ionicons name="help-circle" size={52} color={Colors.white} />
        </LinearGradient>
        <Text style={styles.introTitle}>Quiz Master</Text>
        <Text style={styles.introSub}>Answer 5 questions correctly to earn cash rewards!</Text>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardCardTitle}>💰 Reward Structure</Text>
          {QUESTIONS.map((_, i) => (
            <View key={i} style={styles.rewardRow}>
              <LinearGradient colors={i < 3 ? Colors.gradCyan : Colors.gradGold} style={styles.qNumBadge}>
                <Text style={styles.qNumTxt}>Q{i + 1}</Text>
              </LinearGradient>
              <Text style={styles.rewardRowLbl}>Question {i + 1}</Text>
              <Text style={[styles.rewardRowAmt, { color: Colors.neonGreen }]}>+${REWARDS[i].toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalRewardRow}>
            <Text style={styles.totalRewardLbl}>Max Total</Text>
            <Text style={styles.totalRewardAmt}>$0.75</Text>
          </View>
        </View>

        <View style={styles.rulesCard}>
          {[
            { icon: 'timer', text: `${TIME_LIMIT} seconds per question` },
            { icon: 'close-circle', text: 'No penalty for wrong answers' },
            { icon: 'trophy', text: 'Score rewards on correct answers' },
            { icon: 'gift', text: 'Free to play — no bet required' },
          ].map((r, i) => (
            <View key={i} style={styles.ruleRow}>
              <LinearGradient colors={Colors.gradCyan} style={styles.ruleIcon}>
                <Ionicons name={r.icon as any} size={13} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.ruleText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => setPhase('playing')} activeOpacity={0.9}>
          <LinearGradient colors={Colors.gradCyan} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.startBtn}>
            <Ionicons name="play" size={20} color={Colors.white} />
            <Text style={styles.startBtnTxt}>Start Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  if (phase === 'finished') {
    const passed = score >= 3;
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.bgAlt, Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Results</Text>
          <LinearGradient colors={Colors.gradCyan} style={styles.balancePill}>
            <Text style={styles.balanceTxt}>${balance.toFixed(2)}</Text>
          </LinearGradient>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.introContent}>
          <LinearGradient colors={passed ? Colors.gradGreen : Colors.gradPurple} style={styles.introIcon}>
            <Text style={{ fontSize: 52 }}>{passed ? '🎉' : '👾'}</Text>
          </LinearGradient>
          <Text style={styles.introTitle}>{passed ? 'Well Played!' : 'Good Try!'}</Text>
          <Text style={styles.introSub}>{score}/{QUESTIONS.length} correct</Text>

          <LinearGradient colors={passed ? Colors.gradGreen : Colors.gradPurple} style={styles.earnedCard}>
            <Text style={styles.earnedLabel}>YOU EARNED</Text>
            <Text style={styles.earnedAmt}>+${totalEarned.toFixed(2)}</Text>
            <Text style={styles.earnedSub}>Added to your balance</Text>
          </LinearGradient>

          <View style={styles.scoreGrid}>
            {[
              { label: 'Correct', value: `${score}`, color: Colors.neonGreen },
              { label: 'Wrong', value: `${wrongAnswers}`, color: Colors.neonRed },
              { label: 'Earned', value: `$${totalEarned.toFixed(2)}`, color: Colors.neonCyan },
            ].map(s => (
              <View key={s.label} style={styles.scoreItem}>
                <Text style={[styles.scoreV, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.scoreL}>{s.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={restart} activeOpacity={0.9}>
            <LinearGradient colors={Colors.gradCyan} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.startBtn}>
              <Ionicons name="refresh" size={20} color={Colors.white} />
              <Text style={styles.startBtnTxt}>Play Again</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.backHomeBtn}>
            <Text style={styles.backHomeTxt}>Back to Games</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.bgAlt, Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Quiz Master</Text>
          <View style={styles.categoryRow}>
            <LinearGradient colors={Colors.gradCyan} style={styles.categoryBadge}>
              <Text style={styles.categoryTxt}>{q.category}</Text>
            </LinearGradient>
            <Text style={styles.qCounter}>Q{qIdx + 1} of {QUESTIONS.length}</Text>
          </View>
        </View>
        <View style={styles.timerPill}>
          <Ionicons name="timer" size={14} color={timeLeft <= 5 ? Colors.neonRed : Colors.neonCyan} />
          <Text style={[styles.timerTxt, { color: timeLeft <= 5 ? Colors.neonRed : Colors.neonCyan }]}>{timeLeft}s</Text>
        </View>
      </LinearGradient>

      <TimerBar timeLeft={timeLeft} total={TIME_LIMIT} />

      <View style={styles.progressRow}>
        <ProgressDots current={qIdx} total={QUESTIONS.length} />
        <Text style={styles.rewardHint}>+${REWARDS[qIdx].toFixed(2)} on correct</Text>
      </View>

      <Animated.View style={[styles.questionCard, { transform: [{ translateY: slideIn }], opacity }]}>
        <LinearGradient colors={['#0C0D2E', '#05050D']} style={styles.questionInner}>
          <View style={styles.questionMeta}>
            <View style={styles.qNumCircle}>
              <Text style={styles.qNumCircleTxt}>{qIdx + 1}</Text>
            </View>
          </View>
          <Text style={styles.questionTxt}>{q.q}</Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.answer;
          let border = Colors.border;
          let bg = Colors.surface;
          if (answered) {
            if (isCorrect) { border = Colors.neonGreen; bg = Colors.neonGreen + '18'; }
            else if (isSelected && !isCorrect) { border = Colors.neonRed; bg = Colors.neonRed + '18'; }
          } else if (isSelected) {
            border = Colors.neonCyan;
          }

          const gs = answered && (isCorrect || (isSelected && !isCorrect)) && Platform.OS === 'web'
            ? { boxShadow: `0 0 20px ${isCorrect ? Colors.neonGreen : Colors.neonRed}44` } as any : {};

          return (
            <TouchableOpacity key={i} onPress={() => handleAnswer(i)} disabled={answered} activeOpacity={0.85}>
              <View style={[styles.option, { borderColor: border, backgroundColor: bg }, gs]}>
                <View style={[styles.optionLetter, { borderColor: border, backgroundColor: `${border}22` }]}>
                  <Text style={[styles.optionLetterTxt, { color: border }]}>{['A', 'B', 'C', 'D'][i]}</Text>
                </View>
                <Text style={[styles.optionTxt, answered && isCorrect && { color: Colors.neonGreen }, answered && isSelected && !isCorrect && { color: Colors.neonRed }]}>{opt}</Text>
                {answered && isCorrect && <Ionicons name="checkmark-circle" size={22} color={Colors.neonGreen} />}
                {answered && isSelected && !isCorrect && <Ionicons name="close-circle" size={22} color={Colors.neonRed} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomBar}>
        {[{ label: 'Score', value: `${score}/${qIdx}`, color: Colors.neonCyan }, { label: 'Earned', value: `$${REWARDS.slice(0, score).reduce((a, b) => a + b, 0).toFixed(2)}`, color: Colors.neonGreen }].map((s, i) => (
          <View key={i} style={[styles.bottomStat, i > 0 && { borderLeftWidth: 1, borderLeftColor: Colors.border }]}>
            <Text style={[styles.bottomStatV, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.bottomStatL}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: Colors.text },
  balancePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  balanceTxt: { fontSize: 12, fontWeight: '900', color: Colors.white },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  categoryTxt: { fontSize: 9, fontWeight: '800', color: Colors.white, letterSpacing: 0.5 },
  qCounter: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  timerPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: Colors.border },
  timerTxt: { fontSize: 14, fontWeight: '900' },
  timerTrack: { height: 4, backgroundColor: Colors.surface, overflow: 'hidden' },
  timerFill: { height: '100%' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  progressDots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4, width: 8 },
  rewardHint: { fontSize: 12, color: Colors.neonGreen, fontWeight: '700' },
  questionCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderPurple },
  questionInner: { padding: 22 },
  questionMeta: { flexDirection: 'row', marginBottom: 12 },
  qNumCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.neonPurple + '22', borderWidth: 1, borderColor: Colors.neonPurple + '66', alignItems: 'center', justifyContent: 'center' },
  qNumCircleTxt: { fontSize: 14, fontWeight: '900', color: Colors.neonPurple },
  questionTxt: { fontSize: 20, fontWeight: '800', color: Colors.text, lineHeight: 28 },
  optionsContainer: { paddingHorizontal: 16, gap: 10, paddingBottom: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18, borderWidth: 1.5 },
  optionLetter: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 },
  optionLetterTxt: { fontSize: 13, fontWeight: '900' },
  optionTxt: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '600' },
  bottomBar: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, marginTop: 8, backgroundColor: Colors.surface, borderRadius: 18, borderWidth: 1, borderColor: Colors.border },
  bottomStat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  bottomStatV: { fontSize: 17, fontWeight: '800' },
  bottomStatL: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  introContent: { padding: 24, alignItems: 'center', gap: 18 },
  introIcon: { width: 90, height: 90, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  introTitle: { fontSize: 30, fontWeight: '900', color: Colors.text },
  introSub: { fontSize: 14, color: Colors.textSec, textAlign: 'center' },
  rewardCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: 22, padding: 18, gap: 12, borderWidth: 1, borderColor: Colors.border },
  rewardCardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qNumBadge: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  qNumTxt: { fontSize: 11, fontWeight: '900', color: Colors.white },
  rewardRowLbl: { flex: 1, fontSize: 13, color: Colors.textSec },
  rewardRowAmt: { fontSize: 14, fontWeight: '800' },
  totalRewardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  totalRewardLbl: { fontSize: 13, fontWeight: '700', color: Colors.text },
  totalRewardAmt: { fontSize: 15, fontWeight: '900', color: Colors.neonGreen },
  rulesCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: 22, padding: 18, gap: 12, borderWidth: 1, borderColor: Colors.border },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ruleIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  ruleText: { fontSize: 13, color: Colors.textSec, flex: 1 },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 50, paddingVertical: 17, borderRadius: 22, width: '100%', justifyContent: 'center' },
  startBtnTxt: { fontSize: 18, fontWeight: '900', color: Colors.white },
  earnedCard: { borderRadius: 22, padding: 24, alignItems: 'center', gap: 6, width: '100%' },
  earnedLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: 2 },
  earnedAmt: { fontSize: 50, fontWeight: '900', color: Colors.white, letterSpacing: -1 },
  earnedSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  scoreGrid: { flexDirection: 'row', width: '100%', backgroundColor: Colors.surface, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  scoreItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  scoreV: { fontSize: 22, fontWeight: '900' },
  scoreL: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  backHomeBtn: { paddingVertical: 14, alignItems: 'center' },
  backHomeTxt: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
});
