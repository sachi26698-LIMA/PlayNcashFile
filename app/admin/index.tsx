import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const TABS = ['Overview', 'Users', 'Transactions', 'Reports'];

const STATS = [
  { label: 'Total Users', value: '5,030', delta: '+124 today', icon: 'people', gradient: Colors.gradPurple, glow: Colors.neonPurple },
  { label: 'Revenue', value: '$12,450', delta: '+$847 today', icon: 'trending-up', gradient: Colors.gradGreen, glow: Colors.neonGreen },
  { label: 'Active Games', value: '3', delta: '3 live now', icon: 'game-controller', gradient: Colors.gradCyan, glow: Colors.neonCyan },
  { label: 'Withdrawals', value: '$2,150', delta: '+$320 today', icon: 'cash', gradient: Colors.gradGold, glow: Colors.neonGold },
  { label: 'Win Rate', value: '62%', delta: '+2% vs last wk', icon: 'podium', gradient: Colors.gradPink, glow: Colors.neonPink },
  { label: 'Avg Session', value: '8.4 min', delta: '+1.2 min', icon: 'time', gradient: Colors.gradPurple, glow: Colors.neonPurple },
];

const USERS = [
  { name: 'CryptoKing', email: 'crypto@example.com', balance: '$1,247', status: 'active', role: 'User', joined: 'Jan 2025' },
  { name: 'NightWolf', email: 'wolf@example.com', balance: '$987', status: 'active', role: 'User', joined: 'Feb 2025' },
  { name: 'Player (You)', email: 'player@playncash.com', balance: '$24.75', status: 'active', role: 'Admin', joined: 'Jun 2025' },
  { name: 'FlaggedUser1', email: 'flag@example.com', balance: '$0.00', status: 'suspended', role: 'User', joined: 'Mar 2025' },
  { name: 'StarBlaze', email: 'star@example.com', balance: '$754', status: 'active', role: 'Supervisor', joined: 'Apr 2025' },
];

const TRANSACTIONS = [
  { user: 'CryptoKing', type: 'Win', amount: '+$10.00', game: 'Lucky Spin', time: '2m ago', status: 'completed' },
  { user: 'NightWolf', type: 'Withdraw', amount: '-$25.00', game: 'PayPal', time: '8m ago', status: 'pending' },
  { user: 'StarBlaze', type: 'Win', amount: '+$1.90', game: 'Coin Rush', time: '12m ago', status: 'completed' },
  { user: 'AcePlayer', type: 'Win', amount: '+$0.75', game: 'Quiz Master', time: '18m ago', status: 'completed' },
  { user: 'FlaggedUser1', type: 'Withdraw', amount: '-$50.00', game: 'Venmo', time: '1h ago', status: 'flagged' },
];

const ACTIVITY_LOG = [
  { event: 'User FlaggedUser1 suspended', level: 'warning', time: '30m ago' },
  { event: 'New withdrawal request: $50.00', level: 'info', time: '1h ago' },
  { event: 'Game "Lucky Spin" jackpot hit: $10.00', level: 'success', time: '2h ago' },
  { event: 'System: 5,000 user milestone reached', level: 'success', time: '3h ago' },
  { event: 'Suspicious activity detected on account', level: 'error', time: '5h ago' },
];

function OverviewTab() {
  return (
    <>
      {/* Stats grid */}
      <Text style={styles.sectionLbl}>📊 Live Statistics</Text>
      <View style={styles.statsGrid}>
        {STATS.map(s => {
          const gs = Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${s.glow}33` } as any : {};
          return (
            <LinearGradient key={s.label} colors={s.gradient} style={[styles.statCard, gs]}>
              <Ionicons name={s.icon as any} size={18} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statV}>{s.value}</Text>
              <Text style={styles.statL}>{s.label}</Text>
              <View style={styles.statDelta}>
                <Text style={styles.statDeltaTxt}>{s.delta}</Text>
              </View>
            </LinearGradient>
          );
        })}
      </View>

      {/* Activity Log */}
      <Text style={styles.sectionLbl}>📋 Activity Log</Text>
      <View style={styles.logCard}>
        {ACTIVITY_LOG.map((log, i) => {
          const color = log.level === 'error' ? Colors.neonRed : log.level === 'warning' ? Colors.neonGold : log.level === 'success' ? Colors.neonGreen : Colors.neonCyan;
          return (
            <View key={i} style={[styles.logRow, i < ACTIVITY_LOG.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
              <View style={[styles.logDot, { backgroundColor: color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logEvent}>{log.event}</Text>
                <Text style={styles.logTime}>{log.time}</Text>
              </View>
              <View style={[styles.logLevel, { backgroundColor: `${color}22`, borderColor: `${color}44` }]}>
                <Text style={[styles.logLevelTxt, { color }]}>{log.level}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionLbl}>⚡ Quick Actions</Text>
      <View style={styles.actionsRow}>
        {[
          { label: 'Broadcast', icon: 'megaphone', gradient: Colors.gradPurple, action: () => Alert.alert('Broadcast', 'Send notification to all users?') },
          { label: 'Maintenance', icon: 'construct', gradient: Colors.gradCyan, action: () => Alert.alert('Maintenance', 'Enable maintenance mode?') },
          { label: 'Export Data', icon: 'download', gradient: Colors.gradGreen, action: () => Alert.alert('Export', 'CSV export started') },
          { label: 'Settings', icon: 'settings', gradient: Colors.gradGold, action: () => Alert.alert('Settings', 'Admin settings') },
        ].map(a => {
          const gs = Platform.OS === 'web' ? { boxShadow: `0 4px 16px ${Colors.neonPurple}22` } as any : {};
          return (
            <TouchableOpacity key={a.label} style={{ flex: 1 }} onPress={a.action}>
              <LinearGradient colors={a.gradient} style={[styles.actionCard, gs]}>
                <Ionicons name={a.icon as any} size={22} color={Colors.white} />
                <Text style={styles.actionLbl}>{a.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

function UsersTab() {
  return (
    <>
      <Text style={styles.sectionLbl}>👥 User Management</Text>
      <View style={styles.tableCard}>
        {USERS.map((u, i) => (
          <View key={i} style={[styles.userRow, i < USERS.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
            <LinearGradient
              colors={u.role === 'Admin' ? Colors.gradPurple : u.role === 'Supervisor' ? Colors.gradCyan : Colors.gradGreen}
              style={styles.userAvatar}
            >
              <Text style={styles.userAvatarTxt}>{u.name[0]}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{u.name}</Text>
                <View style={[styles.rolePill, { backgroundColor: u.role === 'Admin' ? Colors.neonPurple + '33' : Colors.neonCyan + '22' }]}>
                  <Text style={[styles.roleTxt, { color: u.role === 'Admin' ? Colors.neonPurple : u.role === 'Supervisor' ? Colors.neonCyan : Colors.textMuted }]}>{u.role}</Text>
                </View>
              </View>
              <Text style={styles.userEmail}>{u.email}</Text>
              <Text style={styles.userJoined}>Joined {u.joined}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={styles.userBalance}>{u.balance}</Text>
              <View style={[styles.statusPill, { backgroundColor: u.status === 'active' ? Colors.neonGreen + '22' : Colors.neonRed + '22' }]}>
                <Text style={[styles.statusTxt, { color: u.status === 'active' ? Colors.neonGreen : Colors.neonRed }]}>{u.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

function TransactionsTab() {
  return (
    <>
      <Text style={styles.sectionLbl}>💸 Recent Transactions</Text>
      <View style={styles.tableCard}>
        {TRANSACTIONS.map((tx, i) => {
          const statusColor = tx.status === 'completed' ? Colors.neonGreen : tx.status === 'pending' ? Colors.neonGold : Colors.neonRed;
          return (
            <View key={i} style={[styles.txRow, i < TRANSACTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.txUser}>{tx.user}</Text>
                <Text style={styles.txGame}>{tx.type} · {tx.game}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={[styles.txAmount, { color: tx.amount.startsWith('+') ? Colors.neonGreen : Colors.neonRed }]}>{tx.amount}</Text>
                <View style={[styles.statusPill, { backgroundColor: `${statusColor}22` }]}>
                  <Text style={[styles.statusTxt, { color: statusColor }]}>{tx.status}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
}

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1A001A', '#0A000A', Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <View style={styles.headerMeta}>
              <View style={styles.greenDot} />
              <Text style={styles.headerSubtitle}>System Operational</Text>
            </View>
          </View>
          <LinearGradient colors={Colors.gradPink} style={styles.adminBadge}>
            <Ionicons name="shield" size={10} color={Colors.white} />
            <Text style={styles.adminBadgeTxt}>ADMIN</Text>
          </LinearGradient>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 16 }}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              {activeTab === tab
                ? <LinearGradient colors={Colors.gradPink} style={styles.tabActive}><Text style={styles.tabActiveTxt}>{tab}</Text></LinearGradient>
                : <View style={styles.tabInactive}><Text style={styles.tabInactiveTxt}>{tab}</Text></View>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}>
        {activeTab === 'Overview' && <OverviewTab />}
        {activeTab === 'Users' && <UsersTab />}
        {activeTab === 'Transactions' && <TransactionsTab />}
        {activeTab === 'Reports' && (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Ionicons name="bar-chart" size={60} color={Colors.textMuted} />
            <Text style={{ color: Colors.textMuted, marginTop: 12, fontSize: 15 }}>Advanced reports coming soon</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.white },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.neonGreen },
  headerSubtitle: { fontSize: 11, color: Colors.neonGreen, fontWeight: '600' },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginLeft: 'auto' },
  adminBadgeTxt: { fontSize: 9, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  tabActive: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  tabActiveTxt: { fontSize: 12, fontWeight: '800', color: Colors.white },
  tabInactive: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  tabInactiveTxt: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  sectionLbl: { fontSize: 16, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 20 },
  statCard: { width: '47.5%', borderRadius: 18, padding: 14, gap: 4, alignItems: 'center' },
  statV: { fontSize: 20, fontWeight: '900', color: Colors.white },
  statL: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  statDelta: { backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statDeltaTxt: { fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  logCard: { marginHorizontal: 16, backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  logDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  logEvent: { fontSize: 13, color: Colors.text, fontWeight: '600' },
  logTime: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  logLevel: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  logLevelTxt: { fontSize: 10, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 20 },
  actionCard: { borderRadius: 18, padding: 16, alignItems: 'center', gap: 8 },
  actionLbl: { fontSize: 11, fontWeight: '700', color: Colors.white },
  tableCard: { marginHorizontal: 16, backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  userAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userAvatarTxt: { fontSize: 18, fontWeight: '800', color: Colors.white },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  rolePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  roleTxt: { fontSize: 10, fontWeight: '700' },
  userEmail: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  userJoined: { fontSize: 10, color: Colors.textMuted },
  userBalance: { fontSize: 13, fontWeight: '800', color: Colors.neonGreen },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusTxt: { fontSize: 10, fontWeight: '700' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  txUser: { fontSize: 14, fontWeight: '700', color: Colors.text },
  txGame: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txTime: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  txAmount: { fontSize: 15, fontWeight: '900' },
});
