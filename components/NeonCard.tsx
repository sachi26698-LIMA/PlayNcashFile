import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface NeonCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  gradient?: readonly [string, string, ...string[]];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  borderColor?: string;
  noBorder?: boolean;
}

export default function NeonCard({
  children,
  style,
  glowColor = Colors.neonPurple,
  glowIntensity = 'medium',
  gradient,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  borderColor,
  noBorder = false,
}: NeonCardProps) {
  const glowRadius = glowIntensity === 'low' ? 8 : glowIntensity === 'medium' ? 16 : 28;
  const glowOpacity = glowIntensity === 'low' ? 0.25 : glowIntensity === 'medium' ? 0.45 : 0.7;

  const glowStyle = Platform.OS === 'web' ? {
    boxShadow: `0 0 ${glowRadius}px ${glowColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}, 0 0 ${glowRadius * 2}px ${glowColor}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
  } as any : {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowOpacity,
    shadowRadius: glowRadius,
    elevation: 12,
  };

  const borderStyle = !noBorder ? {
    borderWidth: 1,
    borderColor: borderColor || `${glowColor}55`,
  } : {};

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        start={gradientStart}
        end={gradientEnd}
        style={[styles.base, borderStyle, glowStyle, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.base, styles.dark, borderStyle, glowStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 20, overflow: 'hidden' },
  dark: { backgroundColor: Colors.surface },
});
