import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S } from '../theme';
import { useGame } from '../store/gameStore';
import { CLASSES, TITLES } from '../data/classes';
import { STAT_LABELS, STAT_ICONS, StatKey } from '../types';
import { xpToNext } from '../engine/xp';
import XPBar from '../components/XPBar';

export default function Character() {
  const s = useGame();
  const setTitle = useGame((st) => st.setTitle);
  const cls = CLASSES.find((c) => c.id === s.classId) ?? CLASSES[0];

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={S.sectionTitle}>Personnage</Text>

        <View style={[S.card, { alignItems: 'center', gap: 10 }]}>
          <View style={styles.avatar}><Text style={{ fontSize: 42 }}>{cls.icon}</Text></View>
          <Text style={S.h2}>{s.name}</Text>
          <Text style={S.sm}>{cls.name} · {cls.tagline}</Text>
          <View style={[S.row, { gap: 8, flexWrap: 'wrap', justifyContent: 'center' }]}>
            <View style={S.chip}><Text style={[S.chipText, S.chipGoldText]}>Niveau {s.level}</Text></View>
            <View style={S.chip}><Text style={S.chipText}>⭐ {s.reputation}</Text></View>
            <View style={S.chip}><Text style={S.chipText}>🔥 {s.bestStreak}j</Text></View>
          </View>
          <View style={{ width: '100%', gap: 4 }}>
            <XPBar value={s.xp} max={xpToNext(s.level)} />
            <Text style={[S.xs, S.textCenter]}>{s.xp} / {xpToNext(s.level)} XP</Text>
          </View>
        </View>

        <Text style={S.sectionTitle}>Statistiques</Text>
        <View style={[S.card, { gap: 0 }]}>
          <View style={styles.statGrid}>
            {(Object.keys(STAT_LABELS) as StatKey[]).map((k) => (
              <View key={k} style={styles.stat}>
                <Text style={{ fontSize: 22 }}>{STAT_ICONS[k]}</Text>
                <View>
                  <Text style={S.xs}>{STAT_LABELS[k]}</Text>
                  <Text style={[S.h2, { color: C.gold }]}>{s.stats[k]}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={S.sectionTitle}>Titres</Text>
        <View style={S.card}>
          {TITLES.map((t) => {
            const unlocked = s.unlockedTitles.includes(t.id);
            const active = s.titleId === t.id;
            return (
              <TouchableOpacity key={t.id} onPress={() => unlocked && setTitle(t.id)} disabled={!unlocked}
                style={[styles.titleRow, active && { backgroundColor: 'rgba(245,197,66,0.08)' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[S.h3, !unlocked && { color: C.muted }]}>{unlocked ? '' : '🔒 '}{t.name}</Text>
                  <Text style={S.xs}>{t.requirement}</Text>
                </View>
                {active && <View style={S.chip}><Text style={[S.chipText, S.chipGoldText]}>Équipé</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: C.panel2, borderWidth: 3, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '46%', backgroundColor: C.bg2, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: C.border },
  titleRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center' },
});
