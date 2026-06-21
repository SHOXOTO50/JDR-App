import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S } from '../theme';
import { useGame } from '../store/gameStore';
import { SKILLS } from '../data/skills';
import { STAT_LABELS } from '../types';
import { skillXpToNext } from '../engine/xp';
import XPBar from '../components/XPBar';

export default function SkillTree() {
  const skillProgress = useGame((s) => s.skillProgress);
  const sorted = [...SKILLS].sort((a, b) => (skillProgress[b.id]?.level ?? 1) - (skillProgress[a.id]?.level ?? 1));

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>🌳 Compétences</Text>
        <Text style={[S.sm, { marginBottom: 14 }]}>Chaque compétence évolue de 1 à 100 et débloque son archétype.</Text>
        <View style={S.card}>
          {sorted.map((sk, i) => {
            const p = skillProgress[sk.id] ?? { level: 1, xp: 0 };
            const mastered = p.level >= 100;
            const max = mastered ? 1 : skillXpToNext(p.level);
            return (
              <View key={sk.id} style={[styles.row, i < sorted.length - 1 && styles.rowBorder]}>
                <Text style={{ fontSize: 28, width: 40, textAlign: 'center' }}>{sk.icon}</Text>
                <View style={{ flex: 1 }}>
                  <View style={S.spread}>
                    <Text style={S.h3}>{sk.name}</Text>
                    <Text style={{ fontWeight: '800', color: C.gold, fontSize: 14 }}>
                      {mastered ? '★ MAÎTRE' : `Niv. ${p.level}`}
                    </Text>
                  </View>
                  <Text style={[S.xs, { marginBottom: 6 }]}>{sk.archetype} · {STAT_LABELS[sk.primaryStat]}</Text>
                  <XPBar value={mastered ? 1 : p.xp} max={max} skill />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  brand: { fontSize: 20, fontWeight: '900', color: C.text, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
});
