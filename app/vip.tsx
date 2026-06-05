import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

const TIERS = [
  { name: 'Bronze', icon: '🥉', gradient: ['#CD7F32', '#A0522D'] as const, glow: '#CD7F32', price: 'Free', perks: ['Access to all games', 'Daily login bonus', 'Basic support'], current: false },
  { name: 'Gold', icon: '💛', gradient: Colors.gradGoldSoft, glow: Colors.neonGold, price: 'Current', perks: ['2x win multiplier', 'Priority withdrawals', 'VIP badge', 'Weekly bonus $2.50'], current: true },
  { name: 'Platinum', icon: '💎', gradient: ['#E0E0FF', '#A0A0FF'] as const, glow: '#A0A0FF', price: '$9.99/mo', perks: ['5x win multiplier', 'Instant withdrawals', 'Exclusive games', 'Monthly bonus $15.00', '24/7 priority support'], current: false },
  { name: 'Diamond', icon: '💠', gradient: Colors.gradCyan, glow: Colors.neonCyan, price: '$29.99/mo', perks: ['10x win multiplier', 'Zero fees', 'Diamond-only games', 'Monthly bonus $50.00', 'Personal VIP manager', 'Custom avatar frame'], current: false },
];

const REWARDS = [
  { label: 'Daily Login', value: '+$0.25', icon: 'calendar', gradient: Colors.gradPurple, claimed: true },
  { label: 'Weekly Bonus', value: '+$2.50', icon: 'gift', gradient: Colors.gradGold, claimed: false },
  { label: 'Win Streak (5)', value: '+$1.00', icon: 'flame', gradient: Colors.gradPink, claimed: false },
  { label: 'Monthly Prize', value: '+$10.00', icon: 'trophy', gradient: Colors.gradGreen, claimed: false },
];

export default function VIPScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Hero */}
      <LinearGradient colors={['#1A0A00', '#0A001A', '#001A1A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 12 }]}>
        {/* Grid lines */}
        {[...Array(8)].map((_, i) => <View key={i} style={[styles.gridLine, { top: i * 30 }]} />)}

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.heroCenter}>
          <LinearGradient colors={Colors.gradGoldSoft} style={styles.heroCrown}>
            <Text style={styles.heroCrownTxt}>👑</Text>
          </LinearGradient>
          <Text style={styles.heroTitle}>VIP MEMBERSHIP</Text>
          <Text style={styles.heroSub}>Unlock premium rewards & exclusive games</Text>

          <View style={styles.heroStats}>
            {[{ v: '5x', l: 'Max Multiplier' }, { v: '$50', l: 'Monthly Bonus' }, { v: '0%', l: 'Withdrawal Fee' }].map((s, i) => (
              <View key={i} style={styles.heroStat}>
                <Text style={styles.heroStatV}>{s.v}</Text>
                <Text style={styles.heroStatL}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Current tier banner */}
      <LinearGradient colors={Colors.gradGoldSoft} style={styles.currentBanner}>
        <Ionicons name="shield-checkmark" size={18} color={Colors.bg} />
        <Text style={styles.currentTxt}>You are currently on Gold VIP · <Text style={{ fontWeight: '900' }}>Level 7</Text></Text>
      </LinearGradient>

      {/* Tier cards */}
      <Text style={styles.sectionLbl}>🏅 Membership Tiers</Text>
      {TIERS.map(tier => {
        const gs = Platform.OS === 'web' ? { boxShadow: tier.current ? `0 8px 32px ${tier.glow}55, 0 0 40px ${tier.glow}22` : 'none' } as any : {};
        return (
          <View key={tier.name} style={[styles.tierCard, tier.current && { borderColor: `${tier.glow}66`, borderWidth: 2 }, gs]}>
            <LinearGradient colors={tier.gradient} style={styles.tierHeader}>
              <View style={styles.tierHeaderLeft}>
                <Text style={styles.tierIcon}>{tier.icon}</Text>
                <View>
                  <Text style={styles.tierName}>{tier.name} VIP</Text>
                  <Text style={styles.tierPrice}>{tier.price}</Text>
                </View>
              </View>
              {tier.current && (
                <View style={styles.currentPill}>
                  <Text style={styles.currentPillTxt}>CURRENT</Text>
                </View>
              )}
            </LinearGradient>
            <View style={styles.tierPerks}>
              {tier.perks.map((p, i) => (
                <View key={i} style={styles.perkRow}>
                  <LinearGradient colors={tier.gradient} style={styles.perkCheck}>
                    <Ionicons name="checkmark" size={10} color={tier.current ? Colors.bg : Colors.white} />
                  </LinearGradient>
                  <Text style={styles.perkTxt}>{p}</Text>
                </View>
              ))}
              {!tier.current && (
                <TouchableOpacity style={styles.upgradeWrap}>
                  <LinearGradient colors={tier.gradient} style={styles.upgradeBtn}>
                    <Text style={styles.upgradeTxt}>{tier.price === 'Free' ? 'Downgrade' : `Upgrade to ${tier.name}`}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      {/* Available Rewards */}
      <Text style={styles.sectionLbl}>🎁 Available Rewards</Text>
      <View style={styles.rewardsGrid}>
        {REWARDS.map(r => {
          const gs = !r.claimed && Platform.OS === 'web' ? { boxShadow: `0 4px 16px rgba(139,92,246,0.3)` } as any : {};
          return (
            <View key={r.label} style={[styles.rewardCard, r.claimed && styles.rewardClaimed, gs]}>
              <LinearGradient colors={r.claimed ? [Colors.surfaceAlt, Colors.surface] as any : r.gradient} style={styles.rewardIcon}>
                <Ionicons name={r.icon as any} size={20} color={r.claimed ? Colors.textMuted : Colors.white} />
              </LinearGradient>
              <Text style={[styles.rewardVal, r.claimed && { color: Colors.textMuted }]}>{r.value}</Text>
              <Text style={styles.rewardLbl}>{r.label}</Text>
              {r.claimed
                ? <View style={styles.claimedBadge}><Text style={styles.claimedTxt}>Claimed</Text></View>
                : <TouchableOpacity><LinearGradient colors={r.gradient} style={styles.claimBtn}><Text style={styles.claimTxt}>Claim</Text></LinearGradient></TouchableOpacity>
              }
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { paddingHorizontal: 20, paddingBottom: 30, position: 'relative', overflow: 'hidden' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heroCenter: { alignItems: 'center', gap: 12 },
  heroCrown: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  heroCrownTxt: { fontSize: 36 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: Colors.white, letterSpacing: 2 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },
  heroStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', width: '100%' },
  heroStat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  heroStatV: { fontSize: 22, fontWeight: '900', color: Colors.neonGoldLight },
  heroStatL: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginTop: 2 },
  currentBanner: { marginHorizontal: 16, marginTop: 16, marginBottom: 4, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14 },
  currentTxt: { fontSize: 13, color: Colors.bg, fontWeight: '600' },
  sectionLbl: { fontSize: 16, fontWeight: '800', color: Colors.text, paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  tierCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  tierHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  tierHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tierIcon: { fontSize: 28 },
  tierName: { fontSize: 16, fontWeight: '900', color: Colors.white },
  tierPrice: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  currentPill: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  currentPillTxt: { fontSize: 10, fontWeight: '900', color: Colors.white, letterSpacing: 1 },
  tierPerks: { padding: 16, gap: 10 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkCheck: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  perkTxt: { fontSize: 13, color: Colors.textSec, fontWeight: '500' },
  upgradeWrap: { marginTop: 4, borderRadius: 14, overflow: 'hidden' },
  upgradeBtn: { paddingVertical: 12, alignItems: 'center' },
  upgradeTxt: { fontSize: 14, fontWeight: '900', color: Colors.white },
  rewardsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 10 },
  rewardCard: { width: '47.5%', backgroundColor: Colors.surface, borderRadius: 20, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border },
  rewardClaimed: { opacity: 0.6 },
  rewardIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rewardVal: { fontSize: 18, fontWeight: '900', color: Colors.neonGreen },
  rewardLbl: { fontSize: 12, fontWeight: '600', color: Colors.textSec, textAlign: 'center' },
  claimedBadge: { backgroundColor: Colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  claimedTxt: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  claimBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 12 },
  claimTxt: { fontSize: 12, fontWeight: '800', color: Colors.white },
});
