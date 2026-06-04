import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const TRANSACTIONS = [
  { id: '1', type: 'win', description: 'Lucky Spin Win', amount: +1.00, date: 'Today, 2:34 PM', icon: 'trophy', colors: [Colors.success, Colors.successLight] as const },
  { id: '2', type: 'win', description: 'Quiz Master Win', amount: +0.75, date: 'Today, 11:20 AM', icon: 'help-circle', colors: [Colors.secondary, '#3B82F6'] as const },
  { id: '3', type: 'withdraw', description: 'PayPal Withdrawal', amount: -10.00, date: 'Yesterday', icon: 'arrow-up-circle', colors: [Colors.error, '#F87171'] as const },
  { id: '4', type: 'win', description: 'Coin Flip Win', amount: +0.50, date: 'Yesterday', icon: 'logo-bitcoin', colors: [Colors.gold, '#EF4444'] as const },
  { id: '5', type: 'bonus', description: 'Daily Login Bonus', amount: +0.10, date: 'Yesterday', icon: 'gift', colors: [Colors.accent, '#A78BFA'] as const },
  { id: '6', type: 'win', description: 'Coin Flip Win', amount: +0.25, date: 'Jun 2', icon: 'logo-bitcoin', colors: [Colors.gold, '#EF4444'] as const },
  { id: '7', type: 'withdraw', description: 'Venmo Withdrawal', amount: -5.00, date: 'Jun 1', icon: 'arrow-up-circle', colors: [Colors.error, '#F87171'] as const },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('PayPal');

  const handleWithdraw = () => {
    const num = parseFloat(amount);
    if (!num || num < 1) { Alert.alert('Minimum $1.00', 'Enter at least $1.00'); return; }
    if (num > 24.75) { Alert.alert('Insufficient Balance'); return; }
    setShowWithdraw(false);
    setAmount('');
    Alert.alert('🎉 Withdrawal Initiated', `$${num.toFixed(2)} via ${method} · Arrives in 1-3 days`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.background, Colors.surface]}
          style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 16 }]}
        >
          <Text style={styles.title}>Wallet</Text>
          <TouchableOpacity style={styles.historyBtn}>
            <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Balance card */}
        <LinearGradient colors={['#7C3AED', '#4F46E5', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
          <View style={styles.balanceGlowDot} />
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceAmount}>$24.75</Text>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowWithdraw(true)}>
              <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.actionGrad}>
                <Ionicons name="arrow-up" size={18} color={Colors.white} />
                <Text style={styles.actionText}>Withdraw</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']} style={styles.actionGrad}>
                <Ionicons name="people" size={18} color={Colors.white} />
                <Text style={styles.actionText}>Refer & Earn</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total Earned', value: '$47.25', icon: 'trending-up', gradient: [Colors.success, Colors.successLight] as const },
            { label: 'Withdrawn', value: '$22.50', icon: 'cash', gradient: Colors.gradientPrimary },
            { label: 'Pending', value: '$0.00', icon: 'time', gradient: [Colors.gold, '#EF4444'] as const },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <LinearGradient colors={s.gradient} style={styles.statIcon}>
                <Ionicons name={s.icon as any} size={16} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Payout methods */}
        <Text style={styles.sectionTitle}>Payout Methods</Text>
        <View style={styles.methodsRow}>
          {[
            { label: 'PayPal', icon: 'logo-paypal', colors: ['#003087', '#009CDE'] as const },
            { label: 'Venmo', icon: 'phone-portrait', colors: ['#3D95CE', '#008CFF'] as const },
            { label: 'Gift Card', icon: 'card', colors: ['#F59E0B', '#EF4444'] as const },
          ].map(m => (
            <TouchableOpacity key={m.label} onPress={() => setMethod(m.label)} style={styles.methodBtn}>
              {method === m.label ? (
                <LinearGradient colors={m.colors} style={styles.methodActive}>
                  <Ionicons name={m.icon as any} size={18} color={Colors.white} />
                  <Text style={styles.methodActiveText}>{m.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.methodInactive}>
                  <Ionicons name={m.icon as any} size={18} color={Colors.textMuted} />
                  <Text style={styles.methodInactiveText}>{m.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.txList}>
          {TRANSACTIONS.map((tx, i) => (
            <View key={tx.id} style={[styles.txRow, i < TRANSACTIONS.length - 1 && styles.txBorder]}>
              <LinearGradient colors={tx.colors} style={styles.txIcon}>
                <Ionicons name={tx.icon as any} size={16} color={Colors.white} />
              </LinearGradient>
              <View style={styles.txInfo}>
                <Text style={styles.txDesc}>{tx.description}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.amount > 0 ? Colors.success : Colors.error }]}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal visible={showWithdraw} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <LinearGradient colors={['#7C3AED', '#4F46E5']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setShowWithdraw(false)}>
                <Ionicons name="close" size={22} color={Colors.white} />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalBody}>
              <Text style={styles.modalBalance}>💰 Available: $24.75</Text>
              <Text style={styles.inputLabel}>Amount (min $1.00)</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.methodsRow}>
                {['PayPal', 'Venmo', 'Gift Card'].map(m => (
                  <TouchableOpacity key={m} onPress={() => setMethod(m)} style={styles.methodBtn}>
                    {method === m ? (
                      <LinearGradient colors={Colors.gradientPrimary} style={styles.methodActive}>
                        <Text style={styles.methodActiveText}>{m}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.methodInactive}>
                        <Text style={styles.methodInactiveText}>{m}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={handleWithdraw} activeOpacity={0.9}>
                <LinearGradient colors={Colors.gradientPrimary} style={styles.confirmBtn}>
                  <Text style={styles.confirmText}>Confirm Withdrawal</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: 28, fontWeight: '900', color: Colors.text },
  historyBtn: { padding: 8, backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  balanceCard: { margin: 20, borderRadius: 26, padding: 26, overflow: 'hidden', position: 'relative' },
  balanceGlowDot: {
    position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  balanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, fontWeight: '600', marginBottom: 6 },
  balanceAmount: { fontSize: 48, fontWeight: '900', color: Colors.white, letterSpacing: -1, marginBottom: 20 },
  balanceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 18 },
  balanceActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, borderRadius: 18, overflow: 'hidden' },
  actionGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13 },
  actionText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 18, padding: 14, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border },
  statIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 15, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', fontWeight: '500' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginHorizontal: 20, marginBottom: 12 },
  methodsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 8, marginBottom: 24 },
  methodBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  methodActive: { paddingVertical: 10, alignItems: 'center', gap: 4, borderRadius: 14 },
  methodActiveText: { fontSize: 12, fontWeight: '800', color: Colors.white },
  methodInactive: {
    paddingVertical: 10, alignItems: 'center', gap: 4, borderRadius: 14,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  methodInactiveText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  txList: { marginHorizontal: 20, backgroundColor: Colors.surface, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 14, fontWeight: '700', color: Colors.text },
  txDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.white },
  modalBody: { padding: 20, gap: 14, paddingBottom: 40 },
  modalBalance: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16,
  },
  inputPrefix: { fontSize: 22, color: Colors.textSecondary, fontWeight: '700', marginRight: 4 },
  input: { flex: 1, fontSize: 22, color: Colors.text, paddingVertical: 14, fontWeight: '700' },
  confirmBtn: { borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  confirmText: { fontSize: 16, fontWeight: '900', color: Colors.white },
});
