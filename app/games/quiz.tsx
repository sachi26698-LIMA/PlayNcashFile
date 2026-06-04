import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

type Question = {
  q: string;
  options: string[];
  answer: number;
  category: string;
};

const QUESTIONS: Question[] = [
  { q: 'What is the capital of Japan?', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'], answer: 2, category: 'Geography' },
  { q: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: 1, category: 'Math' },
  { q: 'What gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 2, category: 'Science' },
  { q: 'Who painted the Mona Lisa?', options: ['Picasso', 'Van Gogh', 'Michelangelo', 'Leonardo da Vinci'], answer: 3, category: 'Art' },
  { q: 'What is the largest planet in our solar system?', options: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'], answer: 2, category: 'Science' },
  { q: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: 2, category: 'History' },
  { q: 'What is 15% of 200?', options: ['25', '30', '35', '40'], answer: 1, category: 'Math' },
  { q: 'Which element has the symbol "O"?', options: ['Osmium', 'Oxygen', 'Gold', 'Silver'], answer: 1, category: 'Science' },
  { q: 'How many continents are on Earth?', options: ['5', '6', '7', '8'], answer: 2, category: 'Geography' },
  { q: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Leopard', 'Horse'], answer: 1, category: 'Nature' },
  { q: 'What year did the iPhone first release?', options: ['2005', '2006', '2007', '2008'], answer: 2, category: 'Tech' },
  { q: 'What is the chemical symbol for gold?', options: ['Gd', 'Go', 'Au', 'Ag'], answer: 2, category: 'Science' },
  { q: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3, category: 'Geography' },
  { q: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '7'], answer: 2, category: 'Music' },
  { q: 'What is the square root of 144?', options: ['11', '12', '13', '14'], answer: 1, category: 'Math' },
];

const ROUND_SIZE = 5;
const TIME_PER_QUESTION = 15;
const REWARD_PER_CORRECT = 0.15;

type Phase = 'intro' | 'playing' | 'result';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizGame() {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [balance, setBalance] = useState(24.75);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  const startGame = () => {
    const q = shuffle(QUESTIONS).slice(0, ROUND_SIZE);
    setQuestions(q);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setAnswers([]);
    setPhase('playing');
    setTimeLeft(TIME_PER_QUESTION);
    startTimer();
  };

  const startTimer = () => {
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: TIME_PER_QUESTION * 1000,
      useNativeDriver: false,
    }).start();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    setSelected(-1);
    setStreak(0);
    setAnswers(prev => [...prev, null]);
    setTimeout(() => advance(), 1200);
  };

  const handleSelect = (idx: number) => {
    if (selected !== null || phase !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelected(idx);
    const correct = idx === questions[current].answer;
    setAnswers(prev => [...prev, idx]);

    feedbackAnim.setValue(0);
    Animated.spring(feedbackAnim, { toValue: 1, useNativeDriver: true }).start();

    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => advance(), 1400);
  };

  const advance = () => {
    setCurrent(c => {
      const next = c + 1;
      if (next >= ROUND_SIZE) {
        finishGame();
        return c;
      }
      setSelected(null);
      setTimeLeft(TIME_PER_QUESTION);
      progressAnim.setValue(1);
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: TIME_PER_QUESTION * 1000,
        useNativeDriver: false,
      }).start();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return next;
    });
  };

  const finishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('result');
  };

  useEffect(() => {
    if (phase === 'result') {
      const earned = score * REWARD_PER_CORRECT;
      setBalance(prev => Math.round((prev + earned) * 100) / 100);
    }
  }, [phase]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const timerColor = timeLeft > 8 ? Colors.success : timeLeft > 4 ? Colors.gold : Colors.error;
  const earned = score * REWARD_PER_CORRECT;

  if (phase === 'intro') {
    return (
      <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Quiz Master</Text>
          <View style={styles.balancePill}>
            <Ionicons name="wallet" size={14} color={Colors.gold} />
            <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.introContent}>
          <View style={styles.introIcon}>
            <Ionicons name="help-circle" size={64} color={Colors.secondary} />
          </View>
          <Text style={styles.introTitle}>Quiz Master</Text>
          <Text style={styles.introSubtitle}>Answer {ROUND_SIZE} questions correctly to earn cash rewards!</Text>

          <View style={styles.rulesCard}>
            {[
              { icon: 'timer', text: `${TIME_PER_QUESTION} seconds per question`, color: Colors.gold },
              { icon: 'cash', text: `$${REWARD_PER_CORRECT.toFixed(2)} per correct answer`, color: Colors.success },
              { icon: 'star', text: `Bonus for streaks!`, color: Colors.accent },
              { icon: 'gift', text: `Free to play — no entry fee`, color: Colors.primary },
            ].map(r => (
              <View key={r.text} style={styles.ruleRow}>
                <View style={[styles.ruleIcon, { backgroundColor: r.color + '22' }]}>
                  <Ionicons name={r.icon as any} size={18} color={r.color} />
                </View>
                <Text style={styles.ruleText}>{r.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.maxEarn}>
            <Text style={styles.maxEarnLabel}>Maximum earnings</Text>
            <Text style={styles.maxEarnValue}>${(ROUND_SIZE * REWARD_PER_CORRECT).toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <Ionicons name="play" size={20} color={Colors.white} />
            <Text style={styles.startBtnText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (phase === 'result') {
    const pct = Math.round((score / ROUND_SIZE) * 100);
    return (
      <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Results</Text>
          <View style={styles.balancePill}>
            <Ionicons name="wallet" size={14} color={Colors.gold} />
            <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
          <View style={styles.resultIcon}>
            <Text style={styles.resultEmoji}>{pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : pct >= 40 ? '📚' : '💪'}</Text>
          </View>
          <Text style={styles.resultTitle}>
            {pct >= 80 ? 'Amazing!' : pct >= 60 ? 'Well Done!' : pct >= 40 ? 'Good Try!' : 'Keep Practicing!'}
          </Text>
          <Text style={styles.resultScore}>{score}/{ROUND_SIZE} correct</Text>

          <View style={styles.earnedCard}>
            <Text style={styles.earnedLabel}>You earned</Text>
            <Text style={styles.earnedAmount}>${earned.toFixed(2)}</Text>
            <Text style={styles.earnedSub}>Added to your wallet</Text>
          </View>

          <View style={styles.answerReview}>
            <Text style={styles.reviewTitle}>Review</Text>
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === q.answer;
              return (
                <View key={i} style={[styles.reviewItem, { borderLeftColor: correct ? Colors.success : userAnswer === null ? Colors.gold : Colors.error }]}>
                  <Text style={styles.reviewQ} numberOfLines={2}>{q.q}</Text>
                  <Text style={[styles.reviewResult, { color: correct ? Colors.success : Colors.error }]}>
                    {correct ? '✓ Correct' : userAnswer === null ? '⏱ Time up' : `✗ ${q.options[q.answer]}`}
                  </Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <Ionicons name="refresh" size={20} color={Colors.white} />
            <Text style={styles.startBtnText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={() => router.back()}>
            <Text style={styles.homeBtnText}>Back to Games</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const q = questions[current];

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if (timerRef.current) clearInterval(timerRef.current); router.back(); }} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Question {current + 1}/{ROUND_SIZE}</Text>
        <View style={styles.balancePill}>
          <Ionicons name="wallet" size={14} color={Colors.gold} />
          <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: timerColor }]} />
      </View>

      {/* Timer + Category */}
      <View style={styles.metaRow}>
        <View style={[styles.categoryBadge]}>
          <Text style={styles.categoryText}>{q.category}</Text>
        </View>
        <View style={[styles.timerBadge, { backgroundColor: timerColor + '22' }]}>
          <Ionicons name="timer" size={14} color={timerColor} />
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreRow}>
        {Array.from({ length: ROUND_SIZE }).map((_, i) => (
          <View key={i} style={[
            styles.scoreDot,
            i < answers.length
              ? answers[i] === questions[i]?.answer ? styles.scoreDotCorrect : styles.scoreDotWrong
              : i === current ? styles.scoreDotCurrent : styles.scoreDotEmpty,
          ]} />
        ))}
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{q.q}</Text>
      </View>

      {/* Options */}
      <View style={styles.options}>
        {q.options.map((opt, i) => {
          let btnStyle = styles.optionBtn;
          let textStyle = styles.optionText;
          if (selected !== null) {
            if (i === q.answer) {
              btnStyle = { ...btnStyle, ...styles.optionCorrect };
              textStyle = { ...textStyle, color: Colors.white };
            } else if (i === selected) {
              btnStyle = { ...btnStyle, ...styles.optionWrong };
              textStyle = { ...textStyle, color: Colors.white };
            } else {
              btnStyle = { ...btnStyle, opacity: 0.4 } as any;
            }
          }
          return (
            <TouchableOpacity key={i} style={btnStyle} onPress={() => handleSelect(i)} disabled={selected !== null}>
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>{['A', 'B', 'C', 'D'][i]}</Text>
              </View>
              <Text style={textStyle} numberOfLines={2}>{opt}</Text>
              {selected !== null && i === q.answer && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              )}
              {selected !== null && i === selected && i !== q.answer && (
                <Ionicons name="close-circle" size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {streak >= 2 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak} answer streak! +bonus</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  backBtn: { padding: 8, backgroundColor: Colors.surface, borderRadius: 12 },
  title: { fontSize: 16, fontWeight: '800', color: Colors.text },
  balancePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  balanceText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  progressTrack: { height: 6, backgroundColor: Colors.surfaceAlt, marginHorizontal: 20, borderRadius: 3, marginBottom: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  categoryBadge: { backgroundColor: Colors.primary + '22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  categoryText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  timerText: { fontSize: 14, fontWeight: '800' },
  scoreRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16, paddingHorizontal: 20 },
  scoreDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  scoreDotCorrect: { backgroundColor: Colors.success, borderColor: Colors.success },
  scoreDotWrong: { backgroundColor: Colors.error, borderColor: Colors.error },
  scoreDotCurrent: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  scoreDotEmpty: {},
  questionCard: {
    marginHorizontal: 20, backgroundColor: Colors.surface, borderRadius: 20,
    padding: 24, marginBottom: 20, minHeight: 100, justifyContent: 'center',
  },
  questionText: { fontSize: 20, fontWeight: '700', color: Colors.text, lineHeight: 28, textAlign: 'center' },
  options: { paddingHorizontal: 20, gap: 10 },
  optionBtn: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  optionCorrect: { backgroundColor: Colors.success, borderColor: Colors.success },
  optionWrong: { backgroundColor: Colors.error, borderColor: Colors.error },
  optionLetter: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center',
  },
  optionLetterText: { fontSize: 13, fontWeight: '800', color: Colors.textSecondary },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text },
  streakBadge: {
    marginHorizontal: 20, marginTop: 14, backgroundColor: Colors.warning + '22',
    borderRadius: 12, padding: 10, alignItems: 'center',
  },
  streakText: { fontSize: 14, fontWeight: '700', color: Colors.warning },
  introContent: { flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', gap: 16 },
  introIcon: { width: 100, height: 100, borderRadius: 30, backgroundColor: Colors.secondary + '22', alignItems: 'center', justifyContent: 'center' },
  introTitle: { fontSize: 32, fontWeight: '900', color: Colors.text },
  introSubtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  rulesCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: 20, padding: 20, gap: 14 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ruleIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  ruleText: { fontSize: 14, color: Colors.text, fontWeight: '500', flex: 1 },
  maxEarn: { alignItems: 'center', backgroundColor: Colors.success + '22', padding: 16, borderRadius: 16, width: '100%' },
  maxEarnLabel: { fontSize: 13, color: Colors.textSecondary },
  maxEarnValue: { fontSize: 32, fontWeight: '900', color: Colors.success },
  startBtn: {
    width: '100%', backgroundColor: Colors.primary, borderRadius: 20,
    paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  startBtnText: { fontSize: 17, fontWeight: '800', color: Colors.white },
  resultContent: { paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center', gap: 16 },
  resultIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.gold + '22', alignItems: 'center', justifyContent: 'center' },
  resultEmoji: { fontSize: 52 },
  resultTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  resultScore: { fontSize: 18, color: Colors.textSecondary, fontWeight: '600' },
  earnedCard: { backgroundColor: Colors.success + '22', padding: 20, borderRadius: 20, alignItems: 'center', width: '100%' },
  earnedLabel: { fontSize: 14, color: Colors.textSecondary },
  earnedAmount: { fontSize: 40, fontWeight: '900', color: Colors.success },
  earnedSub: { fontSize: 13, color: Colors.textSecondary },
  answerReview: { width: '100%', gap: 10 },
  reviewTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  reviewItem: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    borderLeftWidth: 4, gap: 4,
  },
  reviewQ: { fontSize: 13, color: Colors.text, fontWeight: '600' },
  reviewResult: { fontSize: 12, fontWeight: '700' },
  homeBtn: { width: '100%', borderRadius: 20, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  homeBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
});
