import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Colors from '@/constants/colors';

const ACHIEVEMENTS = [
  { id: '1', name: 'First Win', icon: 'star', gradient: ['#F59E0B', '#EF4444'] as const, unlocked: true },
  { id: '2', name: '10 Games', icon: 'game-controller', gradient: Colors.gradientPrimary, unlocked: true },
  { id: '3', name: '$10 Earned', icon: 'cash', gradient: [Colors.success, Colors.successLight] as const, unlocked: true },
  { id: '4', name: '5-Day Streak', icon: 'flame', gradient: ['#F97316', '#EF4444'] as const, unlocked: false },
  { id: '5', name: 'Top 10%', icon: 'trophy', gradient: [Colors.accent, '#A78BFA'] as const, unlocked: false },
  { id: '6', name: '$50 Earned', icon: 'wallet', gradient: Colors.gradientCyan, unlocked: false },
];

const MENU_ITEMS = [
  { label: 'Invite Friends', icon: 'people', gradient: [Colors.success, Colors.successLight] as const },
  { label: 'Help & Support', icon: 'help-circle', gradient: Colors.gradientCyan },
  { label: 'Privacy Policy', icon: 'document-text', gradient: [Colors.textMuted, Colors.textMuted] as const },
  { label: 'Terms of Service', icon: 'shield', gradient: [Colors.textMuted, Colors.textMuted] as const },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header background */}
      <LinearGradient
        colors={['#7C3AED', '#4F46E5', Colors.background]}
        style={[styles.headerGrad, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 16 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <LinearGradient colors={['#F59E0B', '#EC4899', '#7C3AED']} style={styles.avatarGradRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>P</Text>
              </View>
            </LinearGradient>
            <View style={styles.levelBadge}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.levelGrad}>
                <Text style={styles.levelText}>Lv 7</Text>
              </LinearGradient>
            </View>
          </View>
          <Text style={styles.profileName}>Player</Text>
          <Text style={styles.profileEmail}>player@playncash.com</Text>
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.memberBadge}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.white} />
            <Text style={styles.memberText}>Gold Member</Text>
          </LinearGradient>
        </View>

        {/* XP bar */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP Progress to Level 8</Text>
            <Text style={styles.xpValue}>750 / 1000</Text>
          </View>
          <View style={styles.xpTrack}>
            <LinearGradient colors={['#F59E0B', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.xpFill, { width: '75%' }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Games', value: '47', icon: 'game-controller', gradient: Colors.gradientPrimary },
          { label: 'Wins', value: '32', icon: 'trophy', gradient: ['#F59E0B', '#EF4444'] as const },
          { label: 'Win Rate', value: '68%', icon: 'trending-up', gradient: [Colors.success, Colors.successLight] as const },
          { label: 'Streak', value: '8 🔥', icon: 'flame', gradient: ['#F97316', '#EF4444'] as const },
        ].map(s => (
          <LinearGradient key={s.label} colors={s.gradient} style={styles.statCard}>
            <Ionicons name={s.icon as any} size={18} color="rgba(255,255,255,0.7)" />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Achievements */}
      <Text style={styles.sectionTitle}>Achievements</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achieveScroll}>
        {ACHIEVEMENTS.map(a => (
          <View key={a.id} style={[styles.achieveCard, !a.unlocked && styles.achieveLocked]}>
            {a.unlocked ? (
              <LinearGradient colors={a.gradient} style={styles.achieveIcon}>
                <Ionicons name={a.icon as any} size={22} color={Colors.white} />
              </LinearGradient>
            ) : (
              <View style={[styles.achieveIcon, { backgroundColor: Colors.surfaceAlt }]}>
                <Ionicons name="lock-closed" size={18} color={Colors.textMuted} />
              </View>
            )}
            <Text style={[styles.achieveName, !a.unlocked && { color: Colors.textMuted }]}>{a.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Settings */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <LinearGradient colors={Colors.gradientPrimary} style={styles.settingIcon}>
            <Ionicons name="notifications" size={14} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications}
            trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
            thumbColor={notifications ? Colors.primary : Colors.textMuted}
          />
        </View>
        <View style={styles.settingDivider} />
        <View style={styles.settingRow}>
          <LinearGradient colors={['#F97316', '#EF4444']} style={styles.settingIcon}>
            <Ionicons name="volume-high" size={14} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.settingText}>Sound Effects</Text>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled}
            trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
            thumbColor={soundEnabled ? Colors.primary : Colors.textMuted}
          />
        </View>
        <View style={styles.settingDivider} />
        {MENU_ITEMS.map((item, i) => (
          <View key={item.label}>
            <TouchableOpacity style={styles.settingRow}>
              <LinearGradient colors={item.gradient} style={styles.settingIcon}>
                <Ionicons name={item.icon as any} size={14} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.settingText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
            {i < MENU_ITEMS.length - 1 && <View style={styles.settingDivider} />}
          </View>
        ))}
      </View>

      {/* Sign out */}
      <TouchableOpacity
        style={styles.signOutWrap}
        onPress={() => Alert.alert('Sign Out', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive' },
        ])}
      >
        <LinearGradient colors={[Colors.error + '22', Colors.error + '11']} style={styles.signOutBtn}>
          <Ionicons name="log-out" size={18} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerGrad: { paddingBottom: 24 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '900', color: Colors.white },
  settingsBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarSection: { alignItems: 'center', gap: 8, marginBottom: 20 },
  avatarRing: { position: 'relative', marginBottom: 4 },
  avatarGradRing: { width: 92, height: 92, borderRadius: 46, padding: 3 },
  avatar: { flex: 1, borderRadius: 43, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 38, fontWeight: '900', color: Colors.text },
  levelBadge: { position: 'absolute', bottom: -4, right: -4, borderRadius: 12, overflow: 'hidden' },
  levelGrad: { paddingHorizontal: 8, paddingVertical: 3 },
  levelText: { fontSize: 11, fontWeight: '900', color: Colors.white },
  profileName: { fontSize: 22, fontWeight: '800', color: Colors.white },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  memberText: { fontSize: 12, fontWeight: '800', color: Colors.white },
  xpCard: { marginHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 16, gap: 10 },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  xpValue: { fontSize: 12, color: Colors.white, fontWeight: '800' },
  xpTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 20, gap: 10, paddingVertical: 16 },
  statCard: { width: '47.5%', borderRadius: 18, padding: 16, gap: 6, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: Colors.white },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginHorizontal: 20, marginBottom: 12 },
  achieveScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4, marginBottom: 24 },
  achieveCard: { alignItems: 'center', gap: 8, width: 72 },
  achieveLocked: { opacity: 0.45 },
  achieveIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  achieveName: { fontSize: 10, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  settingsCard: {
    marginHorizontal: 20, backgroundColor: Colors.surface, borderRadius: 22,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  settingIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  settingText: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '600' },
  settingDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 58 },
  signOutWrap: { marginHorizontal: 20 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 18 },
  signOutText: { fontSize: 15, fontWeight: '800', color: Colors.error },
});
