import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradientColors?: readonly [string, string, ...string[]];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  intensity?: 'low' | 'mid' | 'high';
}

export default function GlassCard({
  children,
  style,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  intensity = 'mid',
}: GlassCardProps) {
  const overlayOpacity = intensity === 'low' ? 0.03 : intensity === 'mid' ? 0.06 : 0.10;

  if (gradientColors) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[styles.base, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.base, styles.glass, style]}>
      <View style={[StyleSheet.absoluteFillObject, styles.glassTint, { backgroundColor: `rgba(255,255,255,${overlayOpacity})` }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  glass: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  glassTint: {
    borderRadius: 20,
  },
});
