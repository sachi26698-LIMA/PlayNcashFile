import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const TRANSACTIONS = [
  { id: '1', type: 'win', description: 'Lucky Spin Win', amount: +1.00, date: 'Today, 2:34 PM', game: 'Lucky Spin' },
  { id: '2', type: 'win', description: 'Quiz Master Win', amount: +0.75, date: 'Today, 11:20 AM', game: 'Quiz Master' },
  { id: '3', type: 'withdraw', description: 'PayPal Withdrawal', amount: -10.00, date: 'Yesterday', game: null },
  { id: '4', type: 'win', description: 'Coin Rush Win', amount: +0.50, date: 'Yesterday', game: 'Coin Rush' },
  { id: '5', type: 'bonus', description: 'Daily Login Bonus', amount: +0.10, date: 'Yesterday', game: null },
  { id: '6', type: 'win', description: 'Card Battle Win', amount: +0.25, date: 'Jun 2', game: 'Card Battle' },
  { id: '7', type: 'withdraw', description: 'Venmo Withdrawal', amount: -5.00, date: 'Jun 1', game: null },
];

const ICONS: Record<string, { icon: string; color: string }> = {
  win: { icon: 'trophy', color: Colors.success },
  withdraw: { icon: 'arrow-up-circle', color: Colors.error },
  bonus: { icon: 'gift', color: Colors.gold },
};

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('PayPal');

  const handleWithdraw = () => {
    const num = parseFloat(amount);
    if (!num || num < 1) {
      Alert.alert('Minimum Withdrawal', 'Minimum withdrawal is $1.00');
      return;
    }
    if (num > 24.75) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough balance.');
      return;
    }
    setShowWithdraw(false);
    setAmount('');
    Alert.alert('Success!', `$${num.toFixed(2)} withdrawal initiated via ${method}. Arrives in 1-3 business days.`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 16 }]}>
          <Text style={styles.title}>Wallet</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>$24.75</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowWithdraw(true)}>
              <Ionicons name="arrow-up" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Ionicons name="share-social" size={20} color={Colors.white} />
              <Text style={styles.actionBtnText}>Refer & Earn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total Earned', value: '$47.25', icon: 'trending-up', color: Colors.success },
            { label: 'Total Withdrawn', value: '$22.50', icon: 'cash', color: Colors.primary },
            { label: 'Pending', value: '$0.00', icon: 'time', color: Colors.gold },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={18} color={s.color} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Payout Methods */}
        <Text style={styles.sectionTitle}>Payout Methods</Text>
        <View style={styles.methodsRow}>
          {['PayPal', 'Venmo', 'Gift Card'].map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.methodBtn, method === m && styles.methodBtnActive]}
              onPress={() => setMethod(m)}
            >
              <Ionicons
                name={m === 'PayPal' ? 'logo-paypal' : m === 'Venmo' ? 'phone-portrait' : 'card'}
                size={18}
                color={method === m ? Colors.white : Colors.textSecondary}
              />
              <Text style={[styles.methodText, method === m && styles.methodTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction History */}
        <Text style={styles.sectionTitle}>Transaction History</Text>
        <View style={styles.transactions}>
          {TRANSACTIONS.map(tx => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: ICONS[tx.type].color + '22' }]}>
                <Ionicons name={ICONS[tx.type].icon as any} size={18} color={ICONS[tx.type].color} />
              </View>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setShowWithdraw(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalBalance}>Available: $24.75</Text>
            <Text style={styles.inputLabel}>Amount (min $1.00)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.inputLabel}>Payment Method</Text>
            <View style={styles.methodsRow}>
              {['PayPal', 'Venmo', 'Gift Card'].map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodBtn, method === m && styles.methodBtnActive]}
                  onPress={() => setMethod(m)}
                >
                  <Text style={[styles.methodText, method === m && styles.methodTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.withdrawConfirmBtn} onPress={handleWithdraw}>
              <Text style={styles.withdrawConfirmText}>Confirm Withdrawal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  balanceCard: { margin: 20, backgroundColor: Colors.primary, borderRadius: 24, padding: 24 },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  balanceAmount: { fontSize: 48, fontWeight: '800', color: Colors.white, marginBottom: 20 },
  balanceActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.white + '22', paddingVertical: 12, borderRadius: 16 },
  actionBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 12, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 15, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginHorizontal: 20, marginBottom: 12 },
  methodsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 24 },
  methodBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.surface, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: Colors.border },
  methodBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  methodText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  methodTextActive: { color: Colors.white },
  transactions: { marginHorizontal: 20, backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 14, fontWeight: '600', color: Colors.text },
  txDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  modalBalance: { fontSize: 14, color: Colors.textSecondary },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  input: { backgroundColor: Colors.background, borderRadius: 14, padding: 16, fontSize: 18, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  withdrawConfirmBtn: { backgroundColor: Colors.primary, borderRadius: 16, padding: 16, alignItems: 'center' },
  withdrawConfirmText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
});
