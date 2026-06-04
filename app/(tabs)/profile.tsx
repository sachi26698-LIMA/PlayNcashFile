import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Colors from '@/constants/colors';

const ACHIEVEMENTS = [
  { id: '1', name: 'First Win', icon: 'star', color: Colors.gold, unlocked: true },
  { id: '2', name: '10 Games', icon: 'game-controller', color: Colors.primary, unlocked: true },
  { id: '3', name: '$10 Earned', icon: 'cash', color: Colors.success, unlocked: true },
  { id: '4', name: '5-Day Streak', icon: 'flame', color: Colors.warning, unlocked: false },
  { id: '5', name: 'Top 10%', icon: 'trophy', color: Colors.accent, unlocked: false },
  { id: '6', name: '$50 Earned', icon: 'wallet', color: Colors.secondary, unlocked: false },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed out') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 16 }]}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>P</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv 7</Text>
          </View>
        </View>
        <Text style={styles.profileName}>Player</Text>
        <Text style={styles.profileEmail}>player@playncash.com</Text>
        <View style={styles.memberBadge}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.gold} />
          <Text style={styles.memberText}>Gold Member</Text>
        </View>

        {/* XP Progress */}
        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP Progress</Text>
            <Text style={styles.xpValue}>750 / 1000 XP</Text>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: '75%' }]} />
          </View>
          <Text style={styles.xpNext}>250 XP to Level 8</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Games Played', value: '47' },
          { label: 'Games Won', value: '32' },
          { label: 'Win Rate', value: '68%' },
          { label: 'Best Streak', value: '8' },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Achievements */}
      <Text style={styles.sectionTitle}>Achievements</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
        {ACHIEVEMENTS.map(a => (
          <View key={a.id} style={[styles.achievementCard, !a.unlocked && styles.achievementLocked]}>
            <View style={[styles.achievementIcon, { backgroundColor: a.unlocked ? a.color + '22' : Colors.surfaceAlt }]}>
              <Ionicons name={a.icon as any} size={24} color={a.unlocked ? a.color : Colors.textMuted} />
            </View>
            <Text style={[styles.achievementName, !a.unlocked && styles.achievementNameLocked]}>{a.name}</Text>
            {!a.unlocked && <Ionicons name="lock-closed" size={12} color={Colors.textMuted} style={{ marginTop: 2 }} />}
          </View>
        ))}
      </ScrollView>

      {/* Settings */}
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingsSection}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={18} color={Colors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
            thumbColor={notifications ? Colors.primary : Colors.textMuted}
          />
        </View>
        <View style={styles.settingDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="volume-high" size={18} color={Colors.primary} />
            <Text style={styles.settingText}>Sound Effects</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
            thumbColor={soundEnabled ? Colors.primary : Colors.textMuted}
          />
        </View>
        <View style={styles.settingDivider} />
        {[
          { label: 'Invite Friends', icon: 'people', color: Colors.success },
          { label: 'Help & Support', icon: 'help-circle', color: Colors.secondary },
          { label: 'Privacy Policy', icon: 'document-text', color: Colors.textSecondary },
          { label: 'Terms of Service', icon: 'shield', color: Colors.textSecondary },
        ].map((item, i) => (
          <View key={item.label}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
                <Text style={styles.settingText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
            {i < 3 && <View style={styles.settingDivider} />}
          </View>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out" size={18} color={Colors.error} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  settingsBtn: { padding: 10, backgroundColor: Colors.surface, borderRadius: 12 },
  profileCard: { margin: 20, backgroundColor: Colors.surface, borderRadius: 24, padding: 24, alignItems: 'center', gap: 8 },
  avatarContainer: { position: 'relative', marginBottom: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 36, fontWeight: '800', color: Colors.white },
  levelBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.gold, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  levelText: { fontSize: 11, fontWeight: '800', color: Colors.black },
  profileName: { fontSize: 22, fontWeight: '800', color: Colors.text },
  profileEmail: { fontSize: 13, color: Colors.textSecondary },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gold + '22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  memberText: { fontSize: 12, fontWeight: '700', color: Colors.gold },
  xpSection: { width: '100%', gap: 6, marginTop: 8 },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  xpValue: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  xpBar: { height: 8, backgroundColor: Colors.surfaceAlt, borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  xpNext: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 20, gap: 10, marginBottom: 24 },
  statCard: { width: '47.5%', backgroundColor: Colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginHorizontal: 20, marginBottom: 12 },
  achievementsScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 4, marginBottom: 24 },
  achievementCard: { alignItems: 'center', gap: 8, width: 80 },
  achievementLocked: { opacity: 0.5 },
  achievementIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  achievementName: { fontSize: 11, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  achievementNameLocked: { color: Colors.textMuted },
  settingsSection: { marginHorizontal: 20, backgroundColor: Colors.surface, borderRadius: 20, padding: 4, marginBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  settingDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, padding: 16, backgroundColor: Colors.error + '22', borderRadius: 16 },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
});
