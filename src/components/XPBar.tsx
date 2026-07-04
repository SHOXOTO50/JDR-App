import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { S } from '../theme';

interface Props { value: number; max: number; skill?: boolean; }

export default function XPBar({ value, max, skill }: Props) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    // width n'est pas supporté par le native driver → animation JS.
    Animated.spring(anim, { toValue: pct, friction: 9, tension: 40, useNativeDriver: false }).start();
  }, [pct]);

  return (
    <View style={[S.xpTrack, skill && S.skillTrack]}>
      <Animated.View
        style={[
          S.xpFill,
          skill && S.skillFill,
          { width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
        ]}
      />
    </View>
  );
}
