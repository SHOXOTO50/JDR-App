import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import { NAME_CATEGORIES, NameCategory, generateName, generateMultiple } from '../data/nameGenerator';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export const NameGeneratorScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<NameCategory>('male');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    setResults(generateMultiple(selectedCategory, 8));
  };

  const handleCopy = (name: string) => {
    Clipboard.setString(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Générateur de noms</Text>
      <Text style={styles.subtitle}>Créez des noms pour vos PNJ, villes et tavernes</Text>

      <View style={styles.categoryGrid}>
        {NAME_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => { setSelectedCategory(cat.key); setResults([]); }}
            style={[styles.categoryBtn, selectedCategory === cat.key && styles.categoryBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[styles.categoryLabel, selectedCategory === cat.key && styles.categoryLabelActive]} numberOfLines={2}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleGenerate} style={styles.generateBtn} activeOpacity={0.8}>
        <Text style={styles.generateBtnText}>🎲 Générer des noms</Text>
      </TouchableOpacity>

      {results.length > 0 && (
        <View style={styles.resultsBox}>
          <Text style={styles.resultsTitle}>Résultats</Text>
          {results.map((name, i) => (
            <TouchableOpacity key={i} onPress={() => handleCopy(name)} style={styles.resultRow} activeOpacity={0.7}>
              <Text style={styles.resultName}>{name}</Text>
              <Text style={styles.copyHint}>{copied === name ? '✓ Copié' : 'Toucher pour copier'}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={handleGenerate} style={styles.regenerateBtn}>
            <Text style={styles.regenerateBtnText}>↺ Régénérer</Text>
          </TouchableOpacity>
        </View>
      )}

      {results.length === 0 && (
        <View style={styles.emptyHint}>
          <Text style={styles.emptyHintText}>Sélectionnez une catégorie et appuyez sur Générer</Text>
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
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing.lg },
  categoryBtn: {
    width: '31%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  categoryBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  categoryIcon: { fontSize: 24, marginBottom: 4 },
  categoryLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  categoryLabelActive: { color: colors.primary },
  generateBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.gold,
  },
  generateBtnText: { ...typography.h5, color: colors.background, fontWeight: '900' },
  resultsBox: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  resultsTitle: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '44',
  },
  resultName: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  copyHint: { ...typography.caption, color: colors.textMuted, marginLeft: 8 },
  regenerateBtn: { marginTop: spacing.md, alignItems: 'center', paddingVertical: 8 },
  regenerateBtnText: { ...typography.body, color: colors.secondary, fontWeight: '700' },
  emptyHint: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyHintText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
