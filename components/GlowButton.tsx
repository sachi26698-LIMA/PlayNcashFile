import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Platform, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface GlowButtonProps {
  label: string;
  onPress: () => void;
  gradient?: readonly [string, string, ...string[]];
  glowColor?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function GlowButton({
  label,
  onPress,
  gradient = Colors.gradPurple,
  glowColor = Colors.neonPurple,
  disabled = false,
  size = 'md',
  style,
  textStyle,
  icon,
}: GlowButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 8 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();

  const glow = Platform.OS === 'web' ? {
    boxShadow: disabled ? 'none' : `0 0 20px ${glowColor}66, 0 0 40px ${glowColor}33, 0 4px 15px rgba(0,0,0,0.4)`,
  } as any : {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: disabled ? 0 : 0.5,
    shadowRadius: 16,
    elevation: 10,
  };

  const padding = size === 'sm' ? 10 : size === 'md' ? 15 : 20;
  const fontSize = size === 'sm' ? 13 : size === 'md' ? 16 : 19;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, glow, style]}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
      >
        <LinearGradient
          colors={disabled ? [Colors.surfaceAlt, Colors.surface] as any : gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btn, { paddingVertical: padding, paddingHorizontal: padding * 1.5, borderRadius: size === 'sm' ? 12 : 18 }]}
        >
          {icon}
          <Text style={[styles.label, { fontSize }, textStyle]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { fontWeight: '900', color: Colors.white, letterSpacing: 0.5 },
});
