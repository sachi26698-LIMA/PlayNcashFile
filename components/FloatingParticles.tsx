import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  anim: Animated.Value;
  animX: Animated.Value;
}

const COLORS = ['#7C3AED', '#06B6D4', '#F472B6', '#F59E0B', '#10B981'];
const COUNT = 12;

function createParticle(): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 2 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 3000 + Math.random() * 5000,
    anim: new Animated.Value(Math.random()),
    animX: new Animated.Value(0),
  };
}

const particles = Array.from({ length: COUNT }, createParticle);

export default function FloatingParticles() {
  useEffect(() => {
    particles.forEach(p => {
      const loopY = () => {
        p.anim.setValue(1);
        Animated.timing(p.anim, {
          toValue: 0,
          duration: p.speed,
          useNativeDriver: true,
        }).start(loopY);
      };
      const loopX = () => {
        Animated.sequence([
          Animated.timing(p.animX, { toValue: 1, duration: p.speed * 0.7, useNativeDriver: true }),
          Animated.timing(p.animX, { toValue: -1, duration: p.speed * 0.7, useNativeDriver: true }),
        ]).start(loopX);
      };
      loopY();
      loopX();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({ inputRange: [0, 1], outputRange: [p.y + 60, p.y - 60] });
        const translateX = p.animX.interpolate({ inputRange: [-1, 0, 1], outputRange: [-20, 0, 20] });
        const opacity = p.anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.6, 0.6, 0] });
        return (
          <Animated.View
            key={i}
            style={[styles.particle, {
              left: p.x, top: p.y,
              width: p.size, height: p.size, borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: [{ translateY }, { translateX }],
              opacity,
            }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: 'absolute' },
});
