import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, S } from '../theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';
import Pulse from './anim/Pulse';

export default function CoachCard() {
  const messages = useAppSelector((s) => s.game.coachMessages);
  const dispatch = useAppDispatch();
  const latest = messages[0];
  return (
    <View style={styles.coach}>
      <Pulse to={1.1} duration={1000}>
        <Text style={styles.avatar}>🧝‍♀️</Text>
      </Pulse>
      <View style={{ flex: 1 }}>
        <Text style={styles.tone}>Coach · {latest?.tone ?? 'motivation'}</Text>
        <Text style={[S.body, { marginTop: 2 }]}>{latest?.text ?? 'Bienvenue, héros. Prêt à écrire ta légende ?'}</Text>
        <TouchableOpacity onPress={() => dispatch(gameActions.askCoach())} style={styles.btn}>
          <Text style={styles.btnTxt}>💬 Parler au Coach</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coach: {
    flexDirection: 'row', gap: 12,
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.4)',
    borderRadius: 16, padding: 14,
  },
  avatar: { fontSize: 32 },
  tone: { fontSize: 11, fontWeight: '800', color: C.accent, textTransform: 'uppercase', letterSpacing: 1 },
  btn: { marginTop: 10, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: C.border, alignSelf: 'flex-start' },
  btnTxt: { fontSize: 13, color: C.muted, fontWeight: '700' },
});
