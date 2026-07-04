import { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface Props {
  children: React.ReactNode;
  /** Délai avant l'animation (pour le stagger entre sections). */
  delay?: number;
  /** Distance du slide vertical d'entrée. */
  from?: number;
  style?: StyleProp<ViewStyle>;
}

/** Entrée fade + slide-up, utilisée pour faire apparaître les sections en cascade. */
export default function AppearView({ children, delay = 0, from = 24, style }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 420, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
