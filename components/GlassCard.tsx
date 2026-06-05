import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
  noGlow?: boolean;
}

export default function GlassCard({ children, style, borderColor = Colors.borderBright, noGlow = false }: GlassCardProps) {
  const glowStyle = !noGlow && Platform.OS === 'web' ? {
    backdropFilter: 'blur(12px)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)',
  } as any : {};

  return (
    <View style={[styles.card, { borderColor }, glowStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceGlass,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
