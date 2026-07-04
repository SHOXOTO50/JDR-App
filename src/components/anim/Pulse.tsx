import { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface Props {
  children: React.ReactNode;
  /** Amplitude de la pulsation (1.08 par défaut). */
  to?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pulsation douce en boucle — pour attirer l'œil (coach, nœud de carte, etc.). */
export default function Pulse({ children, to = 1.08, duration = 900, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: to, duration, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>;
}
