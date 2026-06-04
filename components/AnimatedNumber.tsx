import { useEffect, useRef } from 'react';
import { Animated, Text, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  decimals?: number;
  style?: TextStyle;
  duration?: number;
}

export default function AnimatedNumber({
  value,
  prefix = '',
  decimals = 2,
  style,
  duration = 800,
}: AnimatedNumberProps) {
  const anim = useRef(new Animated.Value(value)).current;
  const displayRef = useRef(value);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const animatedText = anim.interpolate({
    inputRange: [0, value || 1],
    outputRange: [`${prefix}0.${'0'.repeat(decimals)}`, `${prefix}${value.toFixed(decimals)}`],
  });

  return <Animated.Text style={style}>{animatedText}</Animated.Text>;
}
