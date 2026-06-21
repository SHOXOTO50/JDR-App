import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';

export default function Toasts() {
  const notifications = useAppSelector((s) => s.game.notifications);
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!notifications.length) return;
    const timers = notifications.map((n) => setTimeout(() => dispatch(gameActions.dismissNotification(n.id)), 3000));
    return () => timers.forEach(clearTimeout);
  }, [notifications]);

  if (!notifications.length) return null;

  return (
    <View style={[styles.container, { top: insets.top + 8 }]} pointerEvents="box-none">
      {notifications.slice(-3).map((n) => (
        <TouchableOpacity
          key={n.id}
          style={[styles.toast, n.kind === 'level' && styles.toastLevel, n.kind === 'item' && styles.toastItem]}
          onPress={() => dispatch(gameActions.dismissNotification(n.id))}
        >
          <Text style={styles.toastText}>{n.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 16, right: 16, zIndex: 999, gap: 8 },
  toast: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.goldDim, borderRadius: 12, padding: 12 },
  toastLevel: { borderColor: C.gold, backgroundColor: 'rgba(245,197,66,0.15)' },
  toastItem: { borderColor: C.accent },
  toastText: { color: C.text, fontWeight: '700', fontSize: 14 },
});
