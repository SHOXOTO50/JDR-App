import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppDispatch } from '../store';
import { setTutorialSeen } from '../store/slices/appModeSlice';
import { addCampaign, setActiveCampaign } from '../store/slices/campaignSlice';
import { TUTORIAL_CAMPAIGN_DATA } from '../data/tutorialContent';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId } from '../utils/helpers';
import { ThemedScreen } from '../components/ThemedScreen';

export const TutorialOfferScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleSkip = () => {
    dispatch(setTutorialSeen());
  };

  const handleStartTutorial = () => {
    const id = generateId();
    dispatch(addCampaign({
      id,
      name: TUTORIAL_CAMPAIGN_DATA.name,
      description: TUTORIAL_CAMPAIGN_DATA.description,
      system: 'D&D 5e',
      gmNotes: TUTORIAL_CAMPAIGN_DATA.gmNotes,
      players: [],
      characterIds: [],
      sessionCount: TUTORIAL_CAMPAIGN_DATA.sessions.length,
      sessions: TUTORIAL_CAMPAIGN_DATA.sessions.map((s: any, i: number) => ({
        id: generateId(),
        number: i + 1,
        title: s.name ?? `Session ${i + 1}`,
        date: s.date,
        summary: s.notes ?? '',
        participants: [],
      })),
      npcIds: [],
      locationIds: [],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    dispatch(setActiveCampaign(id));
    dispatch(setTutorialSeen());
  };

  return (
    <ThemedScreen>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>⚔️</Text>
          </View>
          <Text style={styles.title}>Première aventure ?</Text>
          <Text style={styles.subtitle}>
            DiceQuest inclut une campagne tutoriel complète avec des quêtes, des PNJ, des combats et des explications contextuelles.
          </Text>

          <View style={styles.featuresBox}>
            <Text style={styles.featureRow}>🎲 Apprenez les dés et les statistiques</Text>
            <Text style={styles.featureRow}>⚔️ Premier combat guidé étape par étape</Text>
            <Text style={styles.featureRow}>🗺️ Exploration de la Forêt de Sylvane</Text>
            <Text style={styles.featureRow}>📜 Quêtes avec objectifs et récompenses</Text>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartTutorial} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>⚔️ Commencer le tutoriel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.secondaryBtnText}>Je connais déjà D&D — ignorer</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Vous pourrez accéder au tutoriel plus tard depuis le menu Plus → Tutoriels & Campagnes
          </Text>
        </View>
      </SafeAreaView>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xl,
  },
  iconBox: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primary + '22', borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
    ...shadows.gold,
  },
  icon: { fontSize: 48 },
  title: { ...typography.h2, color: colors.primary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  featuresBox: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    alignSelf: 'stretch', marginBottom: spacing.xl, gap: 10,
  },
  featureRow: { ...typography.body, color: colors.text },
  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg,
    paddingVertical: 16, paddingHorizontal: spacing.xl, alignSelf: 'stretch',
    alignItems: 'center', marginBottom: spacing.md, ...shadows.gold,
  },
  primaryBtnText: { ...typography.h5, color: colors.background, fontWeight: '800' },
  secondaryBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  secondaryBtnText: { ...typography.body, color: colors.textSecondary, textDecorationLine: 'underline' },
  hint: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg, lineHeight: 16 },
});
