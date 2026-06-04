import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

function TabIcon({ name, focused, color }: { name: any; focused: boolean; color: string }) {
  if (!focused) return <Ionicons name={name} size={22} color={color} />;
  return (
    <LinearGradient colors={Colors.gradientPrimary} style={styles.activeTab}>
      <Ionicons name={name} size={20} color={Colors.white} />
    </LinearGradient>
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
          height: Platform.OS === 'web' ? 84 : 64,
          paddingBottom: Platform.OS === 'web' ? 34 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.primaryLight,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 4 },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="games" options={{
        title: 'Games',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'game-controller' : 'game-controller-outline'} focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="wallet" options={{
        title: 'Wallet',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'wallet' : 'wallet-outline'} focused={focused} color={color} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ focused, color }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />,
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    width: 40, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
});
