import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';
import { C } from '../../theme';
import { useAppSelector } from '../../store/hooks';

const EMOJIS = ['✨', '🎉', '⭐', '💫', '🏆', '⚔️', '🔥', '👑'];

interface Particle { emoji: string; dx: number; dy: number; rot: string; size: number; }

function makeParticles(count = 14): Particle[] {
  const { width } = Dimensions.get('window');
  const radius = Math.min(width * 0.45, 190);
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist = radius * (0.6 + Math.random() * 0.6);
    return {
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      rot: `${Math.round(Math.random() * 360 - 180)}deg`,
      size: 18 + Math.random() * 16,
    };
  });
}

/** Célébration plein écran quand un niveau est franchi. */
export default function LevelUpOverlay() {
  const level = useAppSelector((s) => s.game.level);
  const notifications = useAppSelector((s) => s.game.notifications);
  const levelNotif = notifications.find((n) => n.kind === 'level');

  const [shownId, setShownId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const backdrop = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.2)).current;
  const burst = useRef(new Animated.Value(0)).current;

  const particles = useMemo(() => makeParticles(), [shownId]);

  useEffect(() => {
    if (!levelNotif || levelNotif.id === shownId) return;
    setShownId(levelNotif.id);
    setVisible(true);
    backdrop.setValue(0);
    textScale.setValue(0.2);
    burst.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(backdrop, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(textScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
        Animated.timing(burst, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
      Animated.delay(1100),
      Animated.timing(backdrop, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start(() => setVisible(false));
  }, [levelNotif?.id]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: backdrop }]} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.Text
          key={i}
          style={{
            position: 'absolute',
            fontSize: p.size,
            opacity: burst.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
              { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, p.dy] }) },
              { rotate: p.rot },
            ],
          }}
        >
          {p.emoji}
        </Animated.Text>
      ))}
      <Animated.View style={[styles.badge, { transform: [{ scale: textScale }] }]}>
        <Text style={styles.up}>⬆️ LEVEL UP</Text>
        <Text style={styles.level}>Niveau {level}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12,10,26,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  badge: { alignItems: 'center', gap: 6 },
  up: { fontSize: 16, fontWeight: '900', color: C.accent, letterSpacing: 4 },
  level: { fontSize: 44, fontWeight: '900', color: C.gold, textShadowColor: 'rgba(245,197,66,0.6)', textShadowRadius: 22 },
});
