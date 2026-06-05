import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Modal, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const TX = [
  { id: '1', type: 'win', label: 'Lucky Spin Jackpot', amount: +10.00, date: 'Today, 3:22 PM', icon: 'sync', gradient: Colors.gradPurple },
  { id: '2', type: 'win', label: 'Quiz Master Win', amount: +0.75, date: 'Today, 11:08 AM', icon: 'help-circle', gradient: Colors.gradCyan },
  { id: '3', type: 'withdraw', label: 'PayPal Withdrawal', amount: -10.00, date: 'Yesterday', icon: 'arrow-up-circle', gradient: ['#EF4444', '#DC2626'] as const },
  { id: '4', type: 'win', label: 'Coin Rush Win', amount: +0.50, date: 'Yesterday', icon: 'logo-bitcoin', gradient: Colors.gradGold },
  { id: '5', type: 'bonus', label: 'Daily Login Bonus', amount: +0.25, date: 'Jun 4', icon: 'gift', gradient: Colors.gradPink },
  { id: '6', type: 'win', label: 'Coin Rush Win', amount: +1.90, date: 'Jun 3', icon: 'logo-bitcoin', gradient: Colors.gradGold },
  { id: '7', type: 'withdraw', label: 'Venmo Withdrawal', amount: -5.00, date: 'Jun 2', icon: 'arrow-up-circle', gradient: ['#EF4444', '#DC2626'] as const },
];

const METHODS = [
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal', gradient: ['#003087', '#009CDE'] as const, glow: '#009CDE' },
  { id: 'venmo', label: 'Venmo', icon: 'phone-portrait', gradient: ['#3D95CE', '#008CFF'] as const, glow: '#008CFF' },
  { id: 'gift', label: 'Gift Card', icon: 'card', gradient: Colors.gradGold, glow: Colors.neonGold },
];

function BalanceCard() {
  const shimmer = useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.balanceOuter}>
      <LinearGradient colors={['#1A0A3D', '#0D1A3D', '#041A1A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
        <View style={styles.balanceGlowOrb} />
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.balanceLbl}>AVAILABLE BALANCE</Text>
            <Text style={styles.balanceAmt}>$24.75</Text>
          </View>
          <LinearGradient colors={Colors.gradGoldSoft} style={styles.vipBadge}>
            <Ionicons name="shield" size={10} color={Colors.bg} />
            <Text style={styles.vipTxt}>GOLD VIP</Text>
          </LinearGradient>
        </View>
        <View style={styles.balanceMeta}>
          <View style={styles.metaItem}><Text style={styles.metaV}>$47.25</Text><Text style={styles.metaL}>Total Earned</Text></View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}><Text style={styles.metaV}>$22.50</Text><Text style={styles.metaL}>Withdrawn</Text></View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}><Text style={styles.metaV}>$0.00</Text><Text style={styles.metaL}>Pending</Text></View>
        </View>
        <View style={styles.balanceActions}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => Alert.alert('Withdraw', 'Coming up!')}>
            <LinearGradient colors={Colors.gradPurple} style={styles.actionBtn}>
              <Ionicons name="arrow-up" size={16} color={Colors.white} />
              <Text style={styles.actionTxt}>Withdraw</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }}>
            <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']} style={styles.actionBtn}>
              <Ionicons name="people" size={16} color={Colors.white} />
              <Text style={styles.actionTxt}>Refer & Earn</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState('paypal');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  const doWithdraw = () => {
    const n = parseFloat(amount);
    if (!n || n < 1) { Alert.alert('Min $1.00', 'Enter at least $1.00 to withdraw.'); return; }
    if (n > 24.75) { Alert.alert('Insufficient Balance'); return; }
    setShowWithdraw(false);
    setAmount('');
    setTimeout(() => Alert.alert('🎉 Withdrawal Sent!', `$${n.toFixed(2)} on its way. Arrives in 1–3 days.`), 400);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <LinearGradient colors={[Colors.bgAlt, Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 12 }]}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity onPress={() => setShowWithdraw(true)}>
            <LinearGradient colors={Colors.gradPurple} style={styles.withdrawBtn}>
              <Ionicons name="arrow-up" size={14} color={Colors.white} />
              <Text style={styles.withdrawBtnTxt}>Withdraw</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <BalanceCard />

        {/* Payout Methods */}
        <Text style={styles.sectionLbl}>💳 Payout Methods</Text>
        <View style={styles.methodsRow}>
          {METHODS.map(m => {
            const gs = method === m.id && Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${m.glow}55` } as any : {};
            return (
              <TouchableOpacity key={m.id} style={{ flex: 1 }} onPress={() => setMethod(m.id)}>
                {method === m.id
                  ? <LinearGradient colors={m.gradient} style={[styles.methodActive, gs]}><Ionicons name={m.icon as any} size={20} color={Colors.white} /><Text style={styles.methodActiveTxt}>{m.label}</Text></LinearGradient>
                  : <View style={styles.methodInactive}><Ionicons name={m.icon as any} size={20} color={Colors.textMuted} /><Text style={styles.methodInactiveTxt}>{m.label}</Text></View>
                }
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Transaction History */}
        <Text style={styles.sectionLbl}>📋 Transaction History</Text>
        <View style={styles.txList}>
          {TX.map((tx, i) => {
            const gs = Platform.OS === 'web' ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' } as any : {};
            return (
              <View key={tx.id} style={[styles.txRow, i < TX.length - 1 && styles.txBorder, gs]}>
                <LinearGradient colors={tx.gradient} style={styles.txIcon}>
                  <Ionicons name={tx.icon as any} size={16} color={Colors.white} />
                </LinearGradient>
                <View style={styles.txInfo}>
                  <Text style={styles.txLabel}>{tx.label}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmt, { color: tx.amount > 0 ? Colors.neonGreen : Colors.neonRed }]}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal visible={showWithdraw} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <LinearGradient colors={Colors.gradPurple} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setShowWithdraw(false)}>
                <Ionicons name="close" size={22} color={Colors.white} />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalBody}>
              <View style={styles.modalBalance}>
                <Ionicons name="wallet" size={16} color={Colors.neonGreen} />
                <Text style={styles.modalBalanceTxt}>Available: <Text style={{ color: Colors.neonGreen, fontWeight: '800' }}>$24.75</Text></Text>
              </View>
              <Text style={styles.inputLbl}>Amount (min $1.00)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={Colors.textMuted} keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
              </View>
              <Text style={styles.inputLbl}>Payment Method</Text>
              <View style={styles.methodsRow}>
                {METHODS.map(m => (
                  <TouchableOpacity key={m.id} style={{ flex: 1 }} onPress={() => setMethod(m.id)}>
                    {method === m.id
                      ? <LinearGradient colors={m.gradient} style={styles.methodActive}><Text style={styles.methodActiveTxt}>{m.label}</Text></LinearGradient>
                      : <View style={styles.methodInactive}><Text style={styles.methodInactiveTxt}>{m.label}</Text></View>}
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={doWithdraw} activeOpacity={0.9}>
                <LinearGradient colors={Colors.gradPurple} style={styles.confirmBtn}>
                  <Text style={styles.confirmTxt}>Confirm Withdrawal</Text>
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
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  withdrawBtnTxt: { fontSize: 13, fontWeight: '800', color: Colors.white },
  balanceOuter: { marginHorizontal: 16, marginBottom: 20 },
  balanceCard: { borderRadius: 26, padding: 24, overflow: 'hidden', position: 'relative', gap: 16, borderWidth: 1, borderColor: Colors.borderPurple },
  balanceGlowOrb: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.neonPurple, opacity: 0.06 },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceLbl: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: '700', marginBottom: 6 },
  balanceAmt: { fontSize: 50, fontWeight: '900', color: Colors.white, letterSpacing: -1 },
  vipBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  vipTxt: { fontSize: 9, fontWeight: '900', color: Colors.bg, letterSpacing: 1 },
  balanceMeta: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 14, overflow: 'hidden' },
  metaItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  metaDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 8 },
  metaV: { fontSize: 15, fontWeight: '800', color: Colors.white },
  metaL: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: '500' },
  balanceActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 14 },
  actionTxt: { fontSize: 14, fontWeight: '800', color: Colors.white },
  sectionLbl: { fontSize: 16, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 12 },
  methodsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 24 },
  methodActive: { borderRadius: 16, paddingVertical: 12, alignItems: 'center', gap: 5 },
  methodActiveTxt: { fontSize: 12, fontWeight: '800', color: Colors.white },
  methodInactive: { borderRadius: 16, paddingVertical: 12, alignItems: 'center', gap: 5, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  methodInactiveTxt: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  txList: { marginHorizontal: 16, backgroundColor: Colors.surface, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: '700', color: Colors.text },
  txDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txAmt: { fontSize: 16, fontWeight: '900' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderPurple },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 22 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.white },
  modalBody: { padding: 22, gap: 14, paddingBottom: 44 },
  modalBalance: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.surfaceAlt, padding: 12, borderRadius: 14 },
  modalBalanceTxt: { fontSize: 14, color: Colors.textSec, fontWeight: '600' },
  inputLbl: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderBright, paddingHorizontal: 16 },
  inputPrefix: { fontSize: 24, color: Colors.textSec, fontWeight: '700', marginRight: 4 },
  input: { flex: 1, fontSize: 24, color: Colors.text, paddingVertical: 14, fontWeight: '700' },
  confirmBtn: { borderRadius: 18, paddingVertical: 17, alignItems: 'center' },
  confirmTxt: { fontSize: 16, fontWeight: '900', color: Colors.white },
});
