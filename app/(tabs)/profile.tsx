import { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Switch, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const ACHIEVEMENTS = [
  { name: 'First Win', icon: 'star', gradient: Colors.gradGold, unlocked: true },
  { name: '10 Games', icon: 'game-controller', gradient: Colors.gradPurple, unlocked: true },
  { name: '$10 Earned', icon: 'cash', gradient: Colors.gradGreen, unlocked: true },
  { name: '5 Streak', icon: 'flame', gradient: Colors.gradPink, unlocked: true },
  { name: 'Top 10%', icon: 'trophy', gradient: Colors.gradCyan, unlocked: false },
  { name: '$100 Earned', icon: 'wallet', gradient: Colors.gradGold, unlocked: false },
];

function HolographicVIP() {
  const shimmer = useRef(new Animated.Value(0)).current;
  const hue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(shimmer, { toValue: 1, duration: 2500, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(hue, { toValue: 1, duration: 3000, useNativeDriver: false }),
      Animated.timing(hue, { toValue: 0, duration: 3000, useNativeDriver: false }),
    ])).start();
  }, []);

  const shimX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-300, 300] });

  const gs = Platform.OS === 'web' ? {
    boxShadow: '0 8px 48px rgba(245,158,11,0.4), 0 0 80px rgba(139,92,246,0.2)',
  } as any : {};

  return (
    <View style={[styles.vipCard, gs]}>
      <LinearGradient colors={['#1A0A00', '#0A001A', '#001A1A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.vipInner}>
        {/* Shimmer */}
        <Animated.View style={[styles.vipShimmer, { transform: [{ translateX: shimX }] }]} />

        {/* Grid lines */}
        {[...Array(8)].map((_, i) => (
          <View key={i} style={[styles.vipLine, { top: i * 22 }]} />
        ))}

        <View style={styles.vipContent}>
          <View style={styles.vipLeft}>
            <LinearGradient colors={Colors.gradGoldSoft} style={styles.vipBadge}>
              <Ionicons name="diamond" size={10} color={Colors.bg} />
              <Text style={styles.vipBadgeTxt}>GOLD VIP</Text>
            </LinearGradient>
            <Text style={styles.vipName}>Player</Text>
            <Text style={styles.vipId}>ID: #PLY-00142</Text>
            <Text style={styles.vipSince}>Member since Jun 2025</Text>
          </View>
          <View style={styles.vipRight}>
            <LinearGradient colors={Colors.gradGoldSoft} style={styles.vipAvatarRing}>
              <View style={styles.vipAvatar}>
                <Text style={styles.vipAvatarTxt}>P</Text>
              </View>
            </LinearGradient>
            <Text style={styles.vipLevel}>Lv.7</Text>
          </View>
        </View>

        <View style={styles.vipStats}>
          {[{ v: '$47.25', l: 'Earned' }, { v: '47', l: 'Games' }, { v: '68%', l: 'Win Rate' }].map((s, i) => (
            <View key={i} style={[styles.vipStat, i > 0 && { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)' }]}>
              <Text style={styles.vipStatV}>{s.v}</Text>
              <Text style={styles.vipStatL}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Card number dots */}
        <View style={styles.cardDots}>
          {['••••', '••••', '••••', '1247'].map((g, i) => (
            <Text key={i} style={styles.cardDotGroup}>{g}</Text>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

function XPBar() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 0.75, duration: 1200, useNativeDriver: false }).start();
  }, []);
  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.xpWrap}>
      <View style={styles.xpHeader}>
        <Text style={styles.xpLbl}>XP to Level 8</Text>
        <Text style={styles.xpVal}>750 / 1000</Text>
      </View>
      <View style={styles.xpTrack}>
        <Animated.View style={{ width }}>
          <LinearGradient colors={Colors.gradGold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.xpFill} />
        </Animated.View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#1A0A3D', '#0A0A20', Colors.bg]} style={[styles.header, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingBtn}>
            <Ionicons name="settings-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={['#F59E0B', '#EC4899', '#8B5CF6']} style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>P</Text>
            </View>
          </LinearGradient>
          <View style={styles.levelBubble}>
            <LinearGradient colors={Colors.gradGoldSoft} style={styles.levelGrad}>
              <Text style={styles.levelTxt}>Lv.7</Text>
            </LinearGradient>
          </View>
        </View>
        <Text style={styles.profileName}>Player</Text>
        <Text style={styles.profileEmail}>player@playncash.com</Text>
        <LinearGradient colors={Colors.gradGoldSoft} style={styles.goldBadge}>
          <Ionicons name="shield-checkmark" size={12} color={Colors.bg} />
          <Text style={styles.goldBadgeTxt}>Gold VIP Member</Text>
        </LinearGradient>

        <XPBar />
      </LinearGradient>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Games', value: '47', gradient: Colors.gradPurple, glow: Colors.neonPurple },
          { label: 'Wins', value: '32', gradient: Colors.gradGold, glow: Colors.neonGold },
          { label: 'Win Rate', value: '68%', gradient: Colors.gradGreen, glow: Colors.neonGreen },
          { label: 'Best Streak', value: '12🔥', gradient: Colors.gradPink, glow: Colors.neonPink },
        ].map(s => {
          const gs = Platform.OS === 'web' ? { boxShadow: `0 4px 20px ${s.glow}33` } as any : {};
          return (
            <LinearGradient key={s.label} colors={s.gradient} style={[styles.statCard, gs]}>
              <Text style={styles.statV}>{s.value}</Text>
              <Text style={styles.statL}>{s.label}</Text>
            </LinearGradient>
          );
        })}
      </View>

      {/* VIP Card */}
      <Text style={styles.sectionLbl}>💎 VIP Card</Text>
      <HolographicVIP />

      {/* Go VIP button */}
      <TouchableOpacity onPress={() => router.push('/vip')} style={styles.goVipWrap}>
        <LinearGradient colors={Colors.gradGoldSoft} style={styles.goVipBtn}>
          <Ionicons name="diamond" size={16} color={Colors.bg} />
          <Text style={styles.goVipTxt}>Upgrade to Platinum VIP</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.bg} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Achievements */}
      <Text style={styles.sectionLbl}>🏆 Achievements</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}>
        {ACHIEVEMENTS.map((a, i) => {
          const gs = a.unlocked && Platform.OS === 'web' ? { boxShadow: `0 4px 16px ${Colors.neonPurple}33` } as any : {};
          return (
            <View key={i} style={[styles.achieveCard, !a.unlocked && styles.achieveLocked, gs]}>
              {a.unlocked
                ? <LinearGradient colors={a.gradient} style={styles.achieveIcon}><Ionicons name={a.icon as any} size={22} color={Colors.white} /></LinearGradient>
                : <View style={[styles.achieveIcon, { backgroundColor: Colors.surfaceAlt }]}><Ionicons name="lock-closed" size={18} color={Colors.textMuted} /></View>}
              <Text style={[styles.achieveName, !a.unlocked && { color: Colors.textMuted }]}>{a.name}</Text>
              {a.unlocked && <View style={styles.achieveCheck}><Ionicons name="checkmark" size={10} color={Colors.white} /></View>}
            </View>
          );
        })}
      </ScrollView>

      {/* Settings */}
      <Text style={styles.sectionLbl}>⚙️ Settings</Text>
      <View style={styles.settingsCard}>
        {[
          { icon: 'notifications', label: 'Notifications', gradient: Colors.gradPurple, toggle: notifications, setToggle: setNotifications },
          { icon: 'volume-high', label: 'Sound Effects', gradient: Colors.gradPink, toggle: sound, setToggle: setSound },
        ].map((s, i) => (
          <View key={s.label}>
            {i > 0 && <View style={styles.divider} />}
            <View style={styles.settingRow}>
              <LinearGradient colors={s.gradient} style={styles.settingIcon}>
                <Ionicons name={s.icon as any} size={14} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.settingLbl}>{s.label}</Text>
              <Switch value={s.toggle} onValueChange={s.setToggle}
                trackColor={{ false: Colors.surface, true: Colors.neonPurple + '66' }}
                thumbColor={s.toggle ? Colors.neonPurple : Colors.textMuted} />
            </View>
          </View>
        ))}
        {[
          { icon: 'podium', label: 'Leaderboard', route: '/(tabs)/leaderboard', gradient: Colors.gradCyan },
          { icon: 'shield', label: 'Admin Panel', route: '/admin', gradient: Colors.gradPink },
          { icon: 'help-circle', label: 'Help & Support', route: null, gradient: Colors.gradGreen },
        ].map((item, i) => (
          <View key={item.label}>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => item.route ? router.push(item.route as any) : null}>
              <LinearGradient colors={item.gradient} style={styles.settingIcon}>
                <Ionicons name={item.icon as any} size={14} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.settingLbl}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={() => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', style: 'destructive' }])} style={styles.signOutWrap}>
        <LinearGradient colors={[Colors.neonRed + '22', Colors.neonRed + '11']} style={styles.signOutBtn}>
          <Ionicons name="log-out" size={18} color={Colors.neonRed} />
          <Text style={styles.signOutTxt}>Sign Out</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 24, gap: 10, alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  settingBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  avatarSection: { position: 'relative', marginTop: 8 },
  avatarRing: { width: 88, height: 88, borderRadius: 44, padding: 3 },
  avatar: { flex: 1, borderRadius: 41, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 36, fontWeight: '900', color: Colors.text },
  levelBubble: { position: 'absolute', bottom: -4, right: -4, borderRadius: 14, overflow: 'hidden' },
  levelGrad: { paddingHorizontal: 8, paddingVertical: 3 },
  levelTxt: { fontSize: 10, fontWeight: '900', color: Colors.bg },
  profileName: { fontSize: 22, fontWeight: '800', color: Colors.white },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  goldBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  goldBadgeTxt: { fontSize: 12, fontWeight: '800', color: Colors.bg },
  xpWrap: { width: '100%', gap: 6 },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLbl: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  xpVal: { fontSize: 11, color: Colors.white, fontWeight: '800' },
  xpTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, paddingVertical: 16 },
  statCard: { width: '47.5%', borderRadius: 18, padding: 16, alignItems: 'center', gap: 4 },
  statV: { fontSize: 22, fontWeight: '900', color: Colors.white },
  statL: { fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  sectionLbl: { fontSize: 16, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginBottom: 12 },
  vipCard: { marginHorizontal: 16, marginBottom: 12, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: Colors.neonGold + '44' },
  vipInner: { padding: 22, gap: 16, position: 'relative', overflow: 'hidden' },
  vipShimmer: { position: 'absolute', top: 0, bottom: 0, width: 80, backgroundColor: 'rgba(255,255,255,0.05)', transform: [{ skewX: '-20deg' }] } as any,
  vipLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  vipContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  vipLeft: { gap: 4 },
  vipBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  vipBadgeTxt: { fontSize: 9, fontWeight: '900', color: Colors.bg, letterSpacing: 1 },
  vipName: { fontSize: 22, fontWeight: '900', color: Colors.white },
  vipId: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  vipSince: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  vipRight: { alignItems: 'center', gap: 6 },
  vipAvatarRing: { width: 58, height: 58, borderRadius: 29, padding: 2 },
  vipAvatar: { flex: 1, borderRadius: 27, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  vipAvatarTxt: { fontSize: 24, fontWeight: '900', color: Colors.text },
  vipLevel: { fontSize: 12, fontWeight: '900', color: Colors.neonGoldLight },
  vipStats: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, overflow: 'hidden' },
  vipStat: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  vipStatV: { fontSize: 13, fontWeight: '800', color: Colors.white },
  vipStatL: { fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: '600' },
  cardDots: { flexDirection: 'row', gap: 8 },
  cardDotGroup: { fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: '600' },
  goVipWrap: { marginHorizontal: 16, marginBottom: 24, borderRadius: 18, overflow: 'hidden' },
  goVipBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  goVipTxt: { fontSize: 14, fontWeight: '900', color: Colors.bg },
  achieveCard: { alignItems: 'center', gap: 8, width: 72, position: 'relative' },
  achieveLocked: { opacity: 0.4 },
  achieveIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  achieveName: { fontSize: 10, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  achieveCheck: { position: 'absolute', top: 0, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.neonGreen, alignItems: 'center', justifyContent: 'center' },
  settingsCard: { marginHorizontal: 16, backgroundColor: Colors.surface, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  settingIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  settingLbl: { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 58 },
  signOutWrap: { marginHorizontal: 16 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 18 },
  signOutTxt: { fontSize: 15, fontWeight: '800', color: Colors.neonRed },
});
