import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../store';
import { addCampaign } from '../store/slices/campaignSlice';
import { setActiveCampaign } from '../store/slices/campaignSlice';
import { PLAYER_TUTORIAL, GM_TUTORIAL, BASE_CAMPAIGN_DATA, TUTORIAL_CAMPAIGN_DATA } from '../data/tutorialContent';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId } from '../utils/helpers';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ThemedScreen } from '../components/ThemedScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type TutorialType = 'player' | 'gm' | null;

export const TutorialScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const [type, setType] = useState<TutorialType>(null);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);

  const sections = type === 'player' ? PLAYER_TUTORIAL : type === 'gm' ? GM_TUTORIAL : [];
  const section = sections[sectionIdx];
  const page = section?.pages[pageIdx];

  const totalPages = sections.reduce((sum, s) => sum + s.pages.length, 0);
  const currentPageGlobal = sections.slice(0, sectionIdx).reduce((sum, s) => sum + s.pages.length, 0) + pageIdx + 1;

  const handleNext = () => {
    if (!section) return;
    if (pageIdx < section.pages.length - 1) {
      setPageIdx(pageIdx + 1);
    } else if (sectionIdx < sections.length - 1) {
      setSectionIdx(sectionIdx + 1);
      setPageIdx(0);
    } else {
      Alert.alert('Tutoriel terminé !', 'Vous avez terminé ce tutoriel. Bonne aventure !', [
        { text: 'Fermer', onPress: () => setType(null) },
      ]);
    }
  };

  const handlePrev = () => {
    if (pageIdx > 0) {
      setPageIdx(pageIdx - 1);
    } else if (sectionIdx > 0) {
      const prevSection = sections[sectionIdx - 1];
      setSectionIdx(sectionIdx - 1);
      setPageIdx(prevSection.pages.length - 1);
    }
  };

  const handleSkip = () => {
    Alert.alert('Quitter le tutoriel', 'Êtes-vous sûr de vouloir quitter ?', [
      { text: 'Continuer le tuto', style: 'cancel' },
      { text: 'Quitter', onPress: () => setType(null) },
    ]);
  };

  const handleLoadCampaign = (campaignData: typeof BASE_CAMPAIGN_DATA) => {
    const id = generateId();
    dispatch(addCampaign({
      id,
      name: campaignData.name,
      description: campaignData.description,
      system: 'D&D 5e',
      gmNotes: campaignData.gmNotes,
      players: [],
      characterIds: [],
      sessionCount: campaignData.sessions.length,
      sessions: campaignData.sessions.map((s, i) => ({
        id: generateId(),
        number: i + 1,
        title: (s as any).name ?? `Session ${i + 1}`,
        date: s.date,
        summary: (s as any).notes ?? '',
        participants: [],
      })),
      npcIds: [],
      locationIds: [],
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    Alert.alert('Campagne créée !', `"${campaignData.name}" a été ajoutée à vos campagnes.`, [
      { text: 'OK' },
    ]);
  };

  if (!type) {
    return (
      <ThemedScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tutoriels & Campagnes</Text>
        <Text style={styles.subtitle}>Apprenez à jouer ou chargez une campagne prête à l'emploi</Text>

        <Text style={styles.sectionHeader}>📖 Tutoriels interactifs</Text>

        <TouchableOpacity onPress={() => { setType('player'); setSectionIdx(0); setPageIdx(0); }} style={styles.tutCard} activeOpacity={0.8}>
          <Text style={styles.tutIcon}>⚔️</Text>
          <View style={styles.tutInfo}>
            <Text style={styles.tutTitle}>Tutoriel Joueur</Text>
            <Text style={styles.tutDesc}>Apprenez les règles de D&D 5e : dés, stats, combat, sorts. Pour les débutants complets.</Text>
            <Text style={styles.tutMeta}>{PLAYER_TUTORIAL.reduce((s, sec) => s + sec.pages.length, 0)} pages · ~15 min</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setType('gm'); setSectionIdx(0); setPageIdx(0); }} style={styles.tutCard} activeOpacity={0.8}>
          <Text style={styles.tutIcon}>🏰</Text>
          <View style={styles.tutInfo}>
            <Text style={styles.tutTitle}>Tutoriel Maître du Jeu</Text>
            <Text style={styles.tutDesc}>Comment mener une partie : préparer, arbitrer, improviser. Pour les futurs MJ.</Text>
            <Text style={styles.tutMeta}>{GM_TUTORIAL.reduce((s, sec) => s + sec.pages.length, 0)} pages · ~10 min</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>🗺️ Campagnes intégrées</Text>

        <View style={styles.campaignCard}>
          <Text style={styles.campaignIcon}>🐉</Text>
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignTitle}>{BASE_CAMPAIGN_DATA.name}</Text>
            <Text style={styles.campaignDesc}>{BASE_CAMPAIGN_DATA.description}</Text>
          </View>
          <TouchableOpacity onPress={() => handleLoadCampaign(BASE_CAMPAIGN_DATA)} style={styles.loadBtn}>
            <Text style={styles.loadBtnText}>Charger</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.campaignCard}>
          <Text style={styles.campaignIcon}>📚</Text>
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignTitle}>{TUTORIAL_CAMPAIGN_DATA.name}</Text>
            <Text style={styles.campaignDesc}>{TUTORIAL_CAMPAIGN_DATA.description}</Text>
          </View>
          <TouchableOpacity onPress={() => handleLoadCampaign(TUTORIAL_CAMPAIGN_DATA)} style={styles.loadBtn}>
            <Text style={styles.loadBtnText}>Charger</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </ThemedScreen>
    );
  }

  if (!section || !page) return null;

  return (
    <ThemedScreen>
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentPageGlobal / totalPages) * 100}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.tutHeader}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>✕ Quitter</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>{currentPageGlobal}/{totalPages}</Text>
      </View>

      <ScrollView style={styles.tutContent} contentContainerStyle={styles.tutContentPadding} showsVerticalScrollIndicator={false}>
        {/* Section label */}
        <Text style={styles.sectionLabel}>{section.icon} {section.title}</Text>

        {/* Page icon + title */}
        <Text style={styles.pageIcon}>{page.icon}</Text>
        <Text style={styles.pageTitle}>{page.title}</Text>

        {/* Content */}
        <Text style={styles.pageContent}>{page.content}</Text>

        {/* Example */}
        {page.example && (
          <View style={styles.exampleBox}>
            <Text style={styles.exampleLabel}>📝 Exemple</Text>
            <Text style={styles.exampleText}>{page.example}</Text>
          </View>
        )}

        {/* Tip */}
        {page.tip && (
          <View style={styles.tipBox}>
            <Text style={styles.tipLabel}>💡 Astuce</Text>
            <Text style={styles.tipText}>{page.tip}</Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={handlePrev}
          style={[styles.navBtn, (sectionIdx === 0 && pageIdx === 0) && styles.navBtnDisabled]}
          disabled={sectionIdx === 0 && pageIdx === 0}
        >
          <Text style={styles.navBtnText}>← Précédent</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={[styles.navBtn, styles.navBtnNext]}>
          <Text style={styles.navBtnNextText}>
            {currentPageGlobal === totalPages ? '✓ Terminer' : 'Suivant →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 48 },
  title: { ...typography.h3, color: colors.primary, textAlign: 'center', marginBottom: 4 },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  sectionHeader: { ...typography.h5, color: colors.secondary, marginBottom: spacing.sm, marginTop: spacing.md },
  tutCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.card, borderRadius: borderRadius.xl,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border, ...shadows.small,
  },
  tutIcon: { fontSize: 36 },
  tutInfo: { flex: 1 },
  tutTitle: { ...typography.h5, color: colors.text, marginBottom: 2 },
  tutDesc: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 4 },
  tutMeta: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  arrow: { color: colors.primary, fontSize: 22 },
  campaignCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.card, borderRadius: borderRadius.xl,
    padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.secondary + '44', ...shadows.small,
  },
  campaignIcon: { fontSize: 36 },
  campaignInfo: { flex: 1 },
  campaignTitle: { ...typography.h5, color: colors.text, marginBottom: 2 },
  campaignDesc: { ...typography.bodySmall, color: colors.textSecondary },
  loadBtn: {
    backgroundColor: colors.secondary, borderRadius: borderRadius.md,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  loadBtnText: { ...typography.bodySmall, color: colors.text, fontWeight: '700' },
  // Tutorial reader
  progressBar: { height: 3, backgroundColor: colors.border },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  tutHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  skipBtn: { padding: 4 },
  skipText: { ...typography.bodySmall, color: colors.error },
  progressText: { ...typography.caption, color: colors.textMuted },
  tutContent: { flex: 1 },
  tutContentPadding: { padding: spacing.md, paddingBottom: 24 },
  sectionLabel: { ...typography.label, color: colors.secondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  pageIcon: { fontSize: 40, textAlign: 'center', marginBottom: spacing.sm },
  pageTitle: { ...typography.h3, color: colors.primary, textAlign: 'center', marginBottom: spacing.md },
  pageContent: { ...typography.body, color: colors.text, lineHeight: 26, marginBottom: spacing.md },
  exampleBox: {
    backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.md,
    borderLeftWidth: 3, borderLeftColor: colors.secondary,
  },
  exampleLabel: { ...typography.label, color: colors.secondary, fontWeight: '700', marginBottom: 6 },
  exampleText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  tipBox: {
    backgroundColor: colors.primaryDark + '22', borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.md,
    borderLeftWidth: 3, borderLeftColor: colors.primary,
  },
  tipLabel: { ...typography.label, color: colors.primary, fontWeight: '700', marginBottom: 6 },
  tipText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  navRow: {
    flexDirection: 'row', gap: spacing.sm, padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  navBtn: {
    flex: 1, paddingVertical: 14, borderRadius: borderRadius.lg,
    alignItems: 'center', backgroundColor: colors.surfaceVariant,
    borderWidth: 1, borderColor: colors.border,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnNext: { backgroundColor: colors.primary, borderColor: colors.primary },
  navBtnText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  navBtnNextText: { ...typography.body, color: colors.background, fontWeight: '800' },
});
