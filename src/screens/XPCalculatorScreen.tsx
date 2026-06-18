import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

const XP_THRESHOLDS: Record<number, { easy: number; medium: number; hard: number; deadly: number; toNext: number }> = {
  1:  { easy: 25,    medium: 50,    hard: 75,    deadly: 100,   toNext: 300 },
  2:  { easy: 50,    medium: 100,   hard: 150,   deadly: 200,   toNext: 900 },
  3:  { easy: 75,    medium: 150,   hard: 225,   deadly: 400,   toNext: 2700 },
  4:  { easy: 125,   medium: 250,   hard: 375,   deadly: 500,   toNext: 6500 },
  5:  { easy: 250,   medium: 500,   hard: 750,   deadly: 1100,  toNext: 14000 },
  6:  { easy: 300,   medium: 600,   hard: 900,   deadly: 1400,  toNext: 23000 },
  7:  { easy: 350,   medium: 750,   hard: 1100,  deadly: 1700,  toNext: 34000 },
  8:  { easy: 450,   medium: 900,   hard: 1400,  deadly: 2100,  toNext: 48000 },
  9:  { easy: 550,   medium: 1100,  hard: 1600,  deadly: 2400,  toNext: 64000 },
  10: { easy: 600,   medium: 1200,  hard: 1900,  deadly: 2800,  toNext: 85000 },
  11: { easy: 800,   medium: 1600,  hard: 2400,  deadly: 3600,  toNext: 100000 },
  12: { easy: 1000,  medium: 2000,  hard: 3000,  deadly: 4500,  toNext: 120000 },
  13: { easy: 1100,  medium: 2200,  hard: 3400,  deadly: 5100,  toNext: 140000 },
  14: { easy: 1250,  medium: 2500,  hard: 3800,  deadly: 5700,  toNext: 165000 },
  15: { easy: 1400,  medium: 2800,  hard: 4300,  deadly: 6400,  toNext: 195000 },
  16: { easy: 1600,  medium: 3200,  hard: 4800,  deadly: 7200,  toNext: 225000 },
  17: { easy: 2000,  medium: 3900,  hard: 5900,  deadly: 8800,  toNext: 265000 },
  18: { easy: 2100,  medium: 4200,  hard: 6300,  deadly: 9500,  toNext: 305000 },
  19: { easy: 2400,  medium: 4900,  hard: 7300,  deadly: 10900, toNext: 355000 },
  20: { easy: 2800,  medium: 5700,  hard: 8500,  deadly: 12700, toNext: 0 },
};

const CR_XP: Array<{ cr: string; xp: number }> = [
  { cr: '0', xp: 10 }, { cr: '1/8', xp: 25 }, { cr: '1/4', xp: 50 }, { cr: '1/2', xp: 100 },
  { cr: '1', xp: 200 }, { cr: '2', xp: 450 }, { cr: '3', xp: 700 }, { cr: '4', xp: 1100 },
  { cr: '5', xp: 1800 }, { cr: '6', xp: 2300 }, { cr: '7', xp: 2900 }, { cr: '8', xp: 3900 },
  { cr: '9', xp: 5000 }, { cr: '10', xp: 5900 }, { cr: '11', xp: 7200 }, { cr: '12', xp: 8400 },
  { cr: '13', xp: 10000 }, { cr: '14', xp: 11500 }, { cr: '15', xp: 13000 }, { cr: '16', xp: 15000 },
  { cr: '17', xp: 18000 }, { cr: '18', xp: 20000 }, { cr: '19', xp: 22000 }, { cr: '20', xp: 25000 },
  { cr: '21', xp: 33000 }, { cr: '22', xp: 41000 }, { cr: '23', xp: 50000 }, { cr: '24', xp: 62000 },
  { cr: '25', xp: 75000 }, { cr: '26', xp: 90000 }, { cr: '27', xp: 105000 }, { cr: '28', xp: 120000 },
  { cr: '29', xp: 135000 }, { cr: '30', xp: 155000 },
];

const MULTIPLIERS: Record<number, number> = { 1: 1, 2: 1.5, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2.5, 8: 2.5, 9: 2.5, 10: 2.5, 11: 3, 15: 4 };

function getMultiplier(count: number): number {
  if (count <= 1) return 1;
  if (count <= 2) return 1.5;
  if (count <= 6) return 2;
  if (count <= 10) return 2.5;
  if (count <= 14) return 3;
  return 4;
}

export const XPCalculatorScreen: React.FC = () => {
  const [partyLevel, setPartyLevel] = useState(1);
  const [partySize, setPartySize] = useState(4);
  const [monsters, setMonsters] = useState<Array<{ cr: string; count: number }>>([]);
  const [tab, setTab] = useState<'encounter' | 'xpneeds'>('encounter');

  const totalMonsterXP = monsters.reduce((sum, m) => {
    const crData = CR_XP.find((c) => c.cr === m.cr);
    return sum + (crData?.xp ?? 0) * m.count;
  }, 0);

  const monsterCount = monsters.reduce((sum, m) => sum + m.count, 0);
  const multiplier = getMultiplier(monsterCount);
  const adjustedXP = Math.round(totalMonsterXP * multiplier);

  const threshold = XP_THRESHOLDS[partyLevel];
  const xpPerPlayer = Math.round(adjustedXP / partySize);

  const getDifficultyLabel = () => {
    if (!threshold || adjustedXP === 0) return null;
    if (adjustedXP < threshold.easy) return { label: 'Trivial', color: '#6b7280' };
    if (adjustedXP < threshold.medium) return { label: 'Facile', color: '#22c55e' };
    if (adjustedXP < threshold.hard) return { label: 'Moyen', color: '#f59e0b' };
    if (adjustedXP < threshold.deadly) return { label: 'Difficile', color: '#ef4444' };
    return { label: 'MORTEL', color: '#7c3aed' };
  };

  const difficulty = getDifficultyLabel();

  const addMonster = (cr: string) => {
    const existing = monsters.findIndex((m) => m.cr === cr);
    if (existing >= 0) {
      setMonsters((prev) => prev.map((m, i) => i === existing ? { ...m, count: m.count + 1 } : m));
    } else {
      setMonsters((prev) => [...prev, { cr, count: 1 }]);
    }
  };

  const removeMonster = (cr: string) => {
    setMonsters((prev) => {
      const existing = prev.find((m) => m.cr === cr);
      if (!existing) return prev;
      if (existing.count <= 1) return prev.filter((m) => m.cr !== cr);
      return prev.map((m) => m.cr === cr ? { ...m, count: m.count - 1 } : m);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('encounter')} style={[styles.tab, tab === 'encounter' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'encounter' && styles.tabTextActive]}>⚔️ Rencontre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('xpneeds')} style={[styles.tab, tab === 'xpneeds' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'xpneeds' && styles.tabTextActive]}>📈 Niveaux</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tab === 'encounter' && (
          <>
            {/* Party config */}
            <View style={styles.partyConfig}>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Niveau du groupe</Text>
                <View style={styles.configRow}>
                  <TouchableOpacity onPress={() => setPartyLevel(Math.max(1, partyLevel - 1))} style={styles.adjBtn}><Text style={styles.adjBtnText}>−</Text></TouchableOpacity>
                  <Text style={styles.configValue}>{partyLevel}</Text>
                  <TouchableOpacity onPress={() => setPartyLevel(Math.min(20, partyLevel + 1))} style={styles.adjBtn}><Text style={styles.adjBtnText}>+</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Taille du groupe</Text>
                <View style={styles.configRow}>
                  <TouchableOpacity onPress={() => setPartySize(Math.max(1, partySize - 1))} style={styles.adjBtn}><Text style={styles.adjBtnText}>−</Text></TouchableOpacity>
                  <Text style={styles.configValue}>{partySize}</Text>
                  <TouchableOpacity onPress={() => setPartySize(Math.min(10, partySize + 1))} style={styles.adjBtn}><Text style={styles.adjBtnText}>+</Text></TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Seuils */}
            {threshold && (
              <View style={styles.thresholdRow}>
                {[
                  { label: 'Facile', val: threshold.easy, color: '#22c55e' },
                  { label: 'Moyen', val: threshold.medium, color: '#f59e0b' },
                  { label: 'Difficile', val: threshold.hard, color: '#ef4444' },
                  { label: 'Mortel', val: threshold.deadly, color: '#7c3aed' },
                ].map((t) => (
                  <View key={t.label} style={styles.thresholdItem}>
                    <Text style={[styles.thresholdVal, { color: t.color }]}>{t.val.toLocaleString()}</Text>
                    <Text style={styles.thresholdLabel}>{t.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Monsters added */}
            {monsters.length > 0 && (
              <View style={styles.monstersBox}>
                <Text style={styles.sectionLabel}>Monstres ajoutés</Text>
                {monsters.map((m) => {
                  const crData = CR_XP.find((c) => c.cr === m.cr);
                  return (
                    <View key={m.cr} style={styles.monsterRow}>
                      <Text style={styles.monsterCR}>CR {m.cr}</Text>
                      <Text style={styles.monsterXP}>{((crData?.xp ?? 0) * m.count).toLocaleString()} XP</Text>
                      <View style={styles.monsterAdj}>
                        <TouchableOpacity onPress={() => removeMonster(m.cr)} style={styles.adjBtn}><Text style={styles.adjBtnText}>−</Text></TouchableOpacity>
                        <Text style={styles.configValue}>{m.count}</Text>
                        <TouchableOpacity onPress={() => addMonster(m.cr)} style={styles.adjBtn}><Text style={styles.adjBtnText}>+</Text></TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
                <TouchableOpacity onPress={() => setMonsters([])} style={styles.clearMonstersBtn}>
                  <Text style={styles.clearMonstersBtnText}>Effacer tout</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Result */}
            {adjustedXP > 0 && difficulty && (
              <View style={[styles.resultBox, { borderColor: difficulty.color }]}>
                <Text style={[styles.difficultyLabel, { color: difficulty.color }]}>{difficulty.label}</Text>
                <Text style={styles.resultXP}>{adjustedXP.toLocaleString()} XP ajustés</Text>
                <Text style={styles.resultDetail}>(×{multiplier} pour {monsterCount} monstre{monsterCount > 1 ? 's' : ''})</Text>
                <Text style={styles.resultPerPlayer}>≈ {xpPerPlayer.toLocaleString()} XP / joueur</Text>
              </View>
            )}

            {/* CR quick add */}
            <Text style={styles.sectionLabel}>Ajouter des monstres par CR</Text>
            <View style={styles.crGrid}>
              {CR_XP.slice(0, 20).map((c) => (
                <TouchableOpacity key={c.cr} onPress={() => addMonster(c.cr)} style={styles.crBtn} activeOpacity={0.7}>
                  <Text style={styles.crBtnCR}>CR {c.cr}</Text>
                  <Text style={styles.crBtnXP}>{c.xp.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {tab === 'xpneeds' && (
          <>
            <Text style={styles.tableTitle}>XP nécessaire par niveau</Text>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => {
              const th = XP_THRESHOLDS[lvl];
              return (
                <View key={lvl} style={[styles.levelRow, lvl === partyLevel && styles.levelRowActive]}>
                  <Text style={[styles.levelNum, lvl === partyLevel && styles.levelNumActive]}>Niv. {lvl}</Text>
                  <Text style={styles.levelXP}>{th.toNext > 0 ? `${th.toNext.toLocaleString()} XP` : '—'}</Text>
                  {lvl === partyLevel && <Text style={styles.levelCurrent}>← votre niveau</Text>}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  content: { padding: spacing.md, paddingBottom: 40 },
  partyConfig: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  configItem: { flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  configLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 8 },
  configRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  configValue: { ...typography.h4, color: colors.text, width: 32, textAlign: 'center' },
  adjBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  adjBtnText: { color: colors.primary, fontWeight: '900', fontSize: 18 },
  thresholdRow: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  thresholdItem: { flex: 1, alignItems: 'center', padding: spacing.sm, borderRightWidth: 1, borderRightColor: colors.border },
  thresholdVal: { fontSize: 14, fontWeight: '800' },
  thresholdLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  monstersBox: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  sectionLabel: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  monsterRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border + '44' },
  monsterCR: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  monsterXP: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, textAlign: 'center' },
  monsterAdj: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clearMonstersBtn: { marginTop: spacing.sm, alignItems: 'center' },
  clearMonstersBtnText: { ...typography.bodySmall, color: colors.error },
  resultBox: { backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 2, alignItems: 'center', marginBottom: spacing.lg, ...shadows.medium },
  difficultyLabel: { fontSize: 24, fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
  resultXP: { ...typography.h3, color: colors.text, marginBottom: 2 },
  resultDetail: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 4 },
  resultPerPlayer: { ...typography.body, color: colors.primary, fontWeight: '700' },
  crGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  crBtn: { backgroundColor: colors.card, borderRadius: borderRadius.md, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border, minWidth: 72 },
  crBtnCR: { ...typography.bodySmall, color: colors.primary, fontWeight: '700' },
  crBtnXP: { ...typography.caption, color: colors.textMuted },
  tableTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  levelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border + '44' },
  levelRowActive: { backgroundColor: colors.primaryDark + '22', borderRadius: borderRadius.sm },
  levelNum: { ...typography.body, color: colors.textSecondary, width: 70, fontWeight: '600' },
  levelNumActive: { color: colors.primary, fontWeight: '800' },
  levelXP: { flex: 1, ...typography.body, color: colors.text, fontWeight: '700' },
  levelCurrent: { ...typography.caption, color: colors.primary, fontWeight: '600' },
});
