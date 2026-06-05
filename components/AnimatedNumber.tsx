import { useEffect, useRef } from 'react';
import { Animated, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: TextStyle;
  duration?: number;
}

export default function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 2, style, duration = 900 }: AnimatedNumberProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const prev = useRef(0);

  useEffect(() => {
    anim.setValue(prev.current);
    Animated.timing(anim, { toValue: value, duration, useNativeDriver: false }).start();
    prev.current = value;
  }, [value]);

  const text = anim.interpolate({
    inputRange: [0, Math.max(value, 0.01)],
    outputRange: [`${prefix}0.${'0'.repeat(decimals)}${suffix}`, `${prefix}${value.toFixed(decimals)}${suffix}`],
  });

  return <Animated.Text style={style}>{text}</Animated.Text>;
}
