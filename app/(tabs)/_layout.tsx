import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

function TabIcon({ name, focused, label, color }: { name: any; focused: boolean; label: string; color: string }) {
  if (!focused) {
    return (
      <View style={styles.iconWrap}>
        <Ionicons name={name} size={20} color={Colors.textMuted} />
      </View>
    );
  }
  return (
    <View style={styles.iconWrap}>
      <LinearGradient colors={Colors.gradPurple} style={styles.activeIcon}>
        <Ionicons name={name} size={18} color={Colors.white} />
      </LinearGradient>
      <View style={styles.activeDot} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'web' ? 88 : 72,
          paddingBottom: Platform.OS === 'web' ? 28 : 14,
          paddingTop: 8,
          ...(Platform.OS === 'web' ? {
            boxShadow: '0 -4px 30px rgba(139,92,246,0.15)',
          } as any : {}),
        },
        tabBarActiveTintColor: Colors.neonPurple,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2, letterSpacing: 0.3 },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} label="Home" color={color} />,
      }} />
      <Tabs.Screen name="games" options={{
        title: 'Games',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'game-controller' : 'game-controller-outline'} focused={focused} label="Games" color={color} />,
      }} />
      <Tabs.Screen name="leaderboard" options={{
        title: 'Ranks',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'podium' : 'podium-outline'} focused={focused} label="Ranks" color={color} />,
      }} />
      <Tabs.Screen name="wallet" options={{
        title: 'Wallet',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'wallet' : 'wallet-outline'} focused={focused} label="Wallet" color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} label="Profile" color={color} />,
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', gap: 3 },
  activeIcon: { width: 38, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.neonPurple },
});
