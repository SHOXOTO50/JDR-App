import { ScrollView, View, Text, TouchableOpacity, Alert, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S } from '../theme';
import { useGame, useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';
import { totalXpForLevel } from '../engine/xp';
import { STAT_LABELS, STAT_ICONS, StatKey } from '../types';
import AppearView from '../components/anim/AppearView';
import Bouncy from '../components/anim/Bouncy';

export default function Stats() {
  const s = useGame();
  const dispatch = useAppDispatch();
  const completed = Object.values(s.questProgress).filter((p) => p.status === 'completed' || p.lastDone).length;
  const totalXp = totalXpForLevel(s.level) + s.xp;
  const topStat = (Object.keys(s.stats) as StatKey[]).sort((a, b) => s.stats[b] - s.stats[a])[0];

  const handleReset = () => {
    Alert.alert('Réinitialiser', 'Toute ta progression sera perdue. Es-tu sûr ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Recommencer', style: 'destructive', onPress: () => dispatch(gameActions.resetGame()) },
    ]);
  };

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppearView delay={0}>
          <Text style={styles.brand}>📊 Statistiques</Text>
        </AppearView>

        <AppearView delay={50}>
          <View style={styles.bigGrid}>
            {[
              { label: 'Niveau', val: s.level },
              { label: 'XP total', val: totalXp },
              { label: 'Quêtes', val: completed },
              { label: 'Série record', val: `${s.bestStreak}j` },
              { label: 'Réputation', val: s.reputation },
              { label: 'Objets', val: s.unlockedItems.length },
            ].map((item) => (
              <View key={item.label} style={[S.card, styles.bigCard]}>
                <Text style={styles.bigNum}>{item.val}</Text>
                <Text style={S.sm}>{item.label}</Text>
              </View>
            ))}
          </View>
        </AppearView>

        <AppearView delay={120}>
          <Text style={S.sectionTitle}>Stat dominante</Text>
          <View style={[S.card, S.row, { gap: 12 }]}>
            <Text style={{ fontSize: 30 }}>{STAT_ICONS[topStat]}</Text>
            <View style={{ flex: 1 }}>
              <Text style={S.h3}>{STAT_LABELS[topStat]}</Text>
              <Text style={S.sm}>Ton point le plus fort : {s.stats[topStat]} pts.</Text>
            </View>
          </View>
        </AppearView>

        <AppearView delay={180}>
          <Text style={S.sectionTitle}>Journal</Text>
          <View style={S.card}>
            {s.log.length === 0 && <Text style={[S.sm, S.textCenter]}>Rien encore. Accomplis ta première quête !</Text>}
            {s.log.slice(0, 15).map((e) => (
              <View key={e.id} style={[S.spread, styles.logRow]}>
                <Text style={[S.body, { fontSize: 13, flex: 1 }]}>{e.text}</Text>
                {e.xp ? <Text style={{ fontSize: 12, color: C.gold, fontWeight: '700' }}>+{e.xp}</Text> : null}
              </View>
            ))}
          </View>
        </AppearView>

        {s.sexModeUnlocked && (
          <AppearView delay={220}>
            <Text style={S.sectionTitle}>Zone secrète</Text>
            <View style={[S.card, S.spread, { borderColor: 'rgba(251,113,133,0.4)' }]}>
              <View style={{ flex: 1 }}>
                <Text style={S.h3}>🔞 Mode Alcôve</Text>
                <Text style={S.sm}>Quêtes intimes visibles dans le journal.</Text>
              </View>
              <Switch
                value={s.sexMode}
                onValueChange={(v) => { dispatch(gameActions.toggleSexMode(v)); }}
                trackColor={{ false: C.border, true: '#fb7185' }}
                thumbColor={C.text}
              />
            </View>
          </AppearView>
        )}

        <AppearView delay={260}>
          <Bouncy onPress={handleReset} style={[S.btn, { marginTop: 24, borderColor: C.red }]}>
            <Text style={[S.btnText, { color: C.red }]}>♻️ Réinitialiser l'aventure</Text>
          </Bouncy>
        </AppearView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  brand: { fontSize: 20, fontWeight: '900', color: C.text, marginBottom: 14 },
  bigGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bigCard: { width: '47%', alignItems: 'center', paddingVertical: 20 },
  bigNum: { fontSize: 30, fontWeight: '900', color: C.gold },
  logRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
});
