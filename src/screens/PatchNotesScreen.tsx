import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PATCH_NOTES } from '../data/patchNotes';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

export const PatchNotesScreen: React.FC = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text style={styles.header}>Historique des versions</Text>
    {PATCH_NOTES.map((note, i) => (
      <View key={note.version} style={[styles.card, i === 0 && styles.cardLatest]}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.version, i === 0 && styles.versionLatest]}>v{note.version}</Text>
            <Text style={styles.date}>{note.date}</Text>
          </View>
          {i === 0 && <Text style={styles.latestBadge}>ACTUELLE</Text>}
        </View>
        <Text style={styles.highlights}>{note.highlights}</Text>
        <View style={styles.changesList}>
          {note.changes.map((change, j) => (
            <Text key={j} style={styles.change}>{change}</Text>
          ))}
        </View>
      </View>
    ))}
    <Text style={styles.footer}>DiceQuest — Créé avec ❤️ par SHOXOTO</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 48 },
  header: { ...typography.h3, color: colors.primary, textAlign: 'center', marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  cardLatest: { borderColor: colors.primary, ...shadows.gold },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  version: { ...typography.h4, color: colors.text },
  versionLatest: { color: colors.primary },
  date: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  latestBadge: {
    backgroundColor: colors.primary, borderRadius: borderRadius.round,
    paddingHorizontal: 10, paddingVertical: 4,
    ...typography.caption, color: colors.background, fontWeight: '900',
  },
  highlights: { ...typography.body, color: colors.secondary, fontWeight: '700', marginBottom: spacing.sm },
  changesList: { gap: 4 },
  change: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  footer: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
