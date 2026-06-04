import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function GamesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="coin-flip" />
      <Stack.Screen name="lucky-spin" />
      <Stack.Screen name="quiz" />
    </Stack>
  );
}
