import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TERRAINS, DIFFICULTIES, LEVEL_RANGES, rollEncounter, Terrain, Difficulty, LevelRange, Encounter } from '../data/encounterTables';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export const EncounterTableScreen: React.FC = () => {
  const [terrain, setTerrain] = useState<Terrain>('foret');
  const [difficulty, setDifficulty] = useState<Difficulty>('moyen');
  const [levelRange, setLevelRange] = useState<LevelRange>('1-4');
  const [result, setResult] = useState<Encounter | null>(null);

  const handleRoll = () => {
    setResult(rollEncounter(terrain, levelRange, difficulty));
  };

  const diffColor = DIFFICULTIES.find((d) => d.key === difficulty)?.color ?? colors.primary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Table de Rencontres</Text>
      <Text style={styles.subtitle}>Générez une rencontre selon le terrain et le niveau</Text>

      <Text style={styles.sectionLabel}>Terrain</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
        {TERRAINS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTerrain(t.key)}
            style={[styles.chip, terrain === t.key && styles.chipActive]}
          >
            <Text style={styles.chipIcon}>{t.icon}</Text>
            <Text style={[styles.chipLabel, terrain === t.key && styles.chipLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>Niveau du groupe</Text>
      <View style={styles.row}>
        {LEVEL_RANGES.map((lr) => (
          <TouchableOpacity
            key={lr.key}
            onPress={() => setLevelRange(lr.key)}
            style={[styles.levelBtn, levelRange === lr.key && styles.levelBtnActive]}
          >
            <Text style={[styles.levelBtnText, levelRange === lr.key && styles.levelBtnTextActive]}>{lr.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Difficulté</Text>
      <View style={styles.row}>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d.key}
            onPress={() => setDifficulty(d.key)}
            style={[styles.diffBtn, { borderColor: d.color }, difficulty === d.key && { backgroundColor: d.color + '33' }]}
          >
            <Text style={[styles.diffBtnText, { color: d.color }]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleRoll} style={styles.rollBtn} activeOpacity={0.8}>
        <Text style={styles.rollBtnText}>🎲 Lancer une rencontre</Text>
      </TouchableOpacity>

      {result && (
        <View style={[styles.resultCard, { borderColor: diffColor }]}>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultName, { color: diffColor }]}>{result.name}</Text>
            <View style={styles.crBadge}>
              <Text style={styles.crText}>CR {result.cr}</Text>
            </View>
          </View>
          <Text style={styles.resultCount}>Nombre : {result.count}</Text>
          <Text style={styles.resultDesc}>{result.description}</Text>
          {result.loot && (
            <View style={styles.lootRow}>
              <Text style={styles.lootLabel}>💰 Butin probable :</Text>
              <Text style={styles.lootValue}>{result.loot}</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleRoll} style={styles.rerollBtn}>
            <Text style={styles.rerollText}>↺ Relancer</Text>
          </TouchableOpacity>
        </View>
      )}

      {!result && (
        <View style={styles.emptyHint}>
          <Text style={styles.emptyIcon}>⚔️</Text>
          <Text style={styles.emptyText}>Configurez les filtres et lancez une rencontre</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 48 },
  title: { ...typography.h3, color: colors.primary, textAlign: 'center', marginBottom: 4 },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  sectionLabel: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm, marginTop: spacing.sm },
  hScroll: { gap: 8, paddingBottom: spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.card, borderRadius: borderRadius.round,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  chipIcon: { fontSize: 16 },
  chipLabel: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  chipLabelActive: { color: colors.primary },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  levelBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.round,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  levelBtnActive: { borderColor: colors.secondary, backgroundColor: colors.secondary + '22' },
  levelBtnText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  levelBtnTextActive: { color: colors.secondary },
  diffBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.round,
    backgroundColor: colors.card, borderWidth: 1,
  },
  diffBtnText: { ...typography.bodySmall, fontWeight: '700' },
  rollBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg,
    paddingVertical: 16, alignItems: 'center',
    marginTop: spacing.md, marginBottom: spacing.lg, ...shadows.gold,
  },
  rollBtnText: { ...typography.h5, color: colors.background, fontWeight: '900' },
  resultCard: {
    backgroundColor: colors.card, borderRadius: borderRadius.xl,
    padding: spacing.md, borderWidth: 2, ...shadows.medium,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  resultName: { ...typography.h4, fontWeight: '800', flex: 1 },
  crBadge: { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.round, paddingHorizontal: 10, paddingVertical: 4 },
  crText: { ...typography.caption, color: colors.textSecondary, fontWeight: '700' },
  resultCount: { ...typography.body, color: colors.textSecondary, marginBottom: 8 },
  resultDesc: { ...typography.body, color: colors.text, lineHeight: 22, marginBottom: spacing.sm },
  lootRow: { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, padding: spacing.sm },
  lootLabel: { ...typography.caption, color: colors.primary, fontWeight: '700', marginBottom: 2 },
  lootValue: { ...typography.bodySmall, color: colors.textSecondary },
  rerollBtn: { marginTop: spacing.md, alignItems: 'center' },
  rerollText: { ...typography.body, color: colors.secondary, fontWeight: '700' },
  emptyHint: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
