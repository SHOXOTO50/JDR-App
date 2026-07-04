import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';
import type { Notification } from '../store/slices/gameSlice';

function Toast({ n, onPress }: { n: Notification; onPress: () => void }) {
  const slide = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.toast,
          n.kind === 'item' && styles.toastItem,
          n.kind === 'skill' && styles.toastSkill,
          { opacity, transform: [{ translateY: slide }] },
        ]}
      >
        <Text style={styles.toastText}>{n.text}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function Toasts() {
  const notifications = useAppSelector((s) => s.game.notifications);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!notifications.length) return;
    const timers = notifications.map((n) => setTimeout(() => dispatch(gameActions.dismissNotification(n.id)), 3000));
    return () => timers.forEach(clearTimeout);
  }, [notifications]);

  // Les level-up sont célébrés par LevelUpOverlay, pas en toast.
  const visible = notifications.filter((n) => n.kind !== 'level');
  if (!visible.length) return null;

  return (
    <View style={[styles.container, { top: insets.top + 8 }]} pointerEvents="box-none">
      {visible.slice(-3).map((n) => (
        <Toast key={n.id} n={n} onPress={() => dispatch(gameActions.dismissNotification(n.id))} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 16, right: 16, zIndex: 999, gap: 8 },
  toast: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.goldDim, borderRadius: 12, padding: 12 },
  toastItem: { borderColor: C.accent },
  toastSkill: { borderColor: C.blue },
  toastText: { color: C.text, fontWeight: '700', fontSize: 14 },
});
