import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const NEON_COLORS = [
  'rgba(139,92,246,0.6)',
  'rgba(6,182,212,0.6)',
  'rgba(245,158,11,0.6)',
  'rgba(236,72,153,0.6)',
  'rgba(16,185,129,0.6)',
];

const COUNT = 18;

export default function FloatingParticles() {
  const particles = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1.5 + Math.random() * 4,
    color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    speed: 4000 + Math.random() * 6000,
    driftX: (Math.random() - 0.5) * 60,
    animY: new Animated.Value(0),
    animX: new Animated.Value(0),
    animO: new Animated.Value(Math.random()),
  })), []);

  useEffect(() => {
    particles.forEach(p => {
      const loopY = () => {
        p.animY.setValue(0);
        Animated.timing(p.animY, { toValue: 1, duration: p.speed, useNativeDriver: true }).start(loopY);
      };
      const loopX = () => {
        Animated.sequence([
          Animated.timing(p.animX, { toValue: 1, duration: p.speed * 0.6, useNativeDriver: true }),
          Animated.timing(p.animX, { toValue: -1, duration: p.speed * 0.6, useNativeDriver: true }),
        ]).start(loopX);
      };
      const loopO = () => {
        Animated.sequence([
          Animated.timing(p.animO, { toValue: 0.1, duration: p.speed * 0.4, useNativeDriver: true }),
          Animated.timing(p.animO, { toValue: 0.8, duration: p.speed * 0.4, useNativeDriver: true }),
        ]).start(loopO);
      };
      loopY(); loopX(); loopO();
    });
    return () => particles.forEach(p => { p.animY.stopAnimation(); p.animX.stopAnimation(); p.animO.stopAnimation(); });
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map(p => {
        const ty = p.animY.interpolate({ inputRange: [0, 1], outputRange: [p.y, p.y - height * 0.35] });
        const tx = p.animX.interpolate({ inputRange: [-1, 0, 1], outputRange: [-p.driftX, 0, p.driftX] });
        return (
          <Animated.View
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x, top: 0,
              width: p.size, height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: [{ translateY: ty }, { translateX: tx }],
              opacity: p.animO,
            }}
          />
        );
      })}
    </View>
  );
}
