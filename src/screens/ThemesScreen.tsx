import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import { setTheme, AppTheme, tapSecretCampaign } from '../store/slices/themeSlice';
import { addCampaign } from '../store/slices/campaignSlice';
import { DRAGON_BALL_CAMPAIGN } from '../data/dragonBallCampaign';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { triggerEffect } from '../utils/effectSystem';
import { ThemedScreen } from '../components/ThemedScreen';

interface ThemeDef {
  id: AppTheme;
  name: string;
  description: string;
  icon: string;
  preview: { bg: string; primary: string; secondary: string; card: string };
  secret?: boolean;
}

const THEMES: ThemeDef[] = [
  {
    id: 'dark',
    name: 'Sombre Fantasy',
    description: 'Le thème par défaut — sombre, médiéval, mystérieux.',
    icon: '🌙',
    preview: { bg: '#0D0D0F', primary: '#C9A84C', secondary: '#7C3AED', card: '#1A1A1F' },
  },
  {
    id: 'parchment',
    name: 'Parchemin Ancien',
    description: 'Teintes chaudes d\'un grimoire elfique.',
    icon: '📜',
    preview: { bg: '#2C2416', primary: '#D4A853', secondary: '#8B4513', card: '#3A2E1E' },
  },
  {
    id: 'modern',
    name: 'Moderne Arcanique',
    description: 'Bleu acier et lignes épurées pour l\'aventurier urbain.',
    icon: '⚡',
    preview: { bg: '#0A0F1A', primary: '#3B82F6', secondary: '#06B6D4', card: '#111827' },
  },
];

const SECRET_THEME: ThemeDef = {
  id: 'legendary',
  name: 'Guerrier Légendaire',
  description: 'Pour les combattants qui ont transcendé leurs limites.',
  icon: '🔥',
  preview: { bg: '#0A0005', primary: '#FFD700', secondary: '#FF4400', card: '#1A0010' },
  secret: true,
};

export const ThemesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTheme = useAppSelector((s) => s.theme.activeTheme);
  const secretUnlocked = useAppSelector((s) => s.theme.secretUnlocked);
  const secretCampaignTapCount = useAppSelector((s) => s.theme.secretCampaignTapCount);
  const secretCampaignUnlocked = useAppSelector((s) => s.theme.secretCampaignUnlocked);
  const campaigns = useAppSelector((s) => s.campaign.campaigns);

  const allThemes = secretUnlocked ? [...THEMES, SECRET_THEME] : THEMES;
  const dbCampaignLoaded = campaigns.some((c) => c.id === DRAGON_BALL_CAMPAIGN.id);

  const handleTapLegendary = () => {
    if (!secretUnlocked || activeTheme !== 'legendary') return;
    dispatch(tapSecretCampaign());
    if (secretCampaignTapCount >= 48) {
      triggerEffect('secret_unlock');
    }
  };

  const handleLoadDBCampaign = () => {
    if (dbCampaignLoaded) {
      Alert.alert('Déjà chargée', 'La campagne Dragon Ball est déjà dans votre liste de campagnes.');
      return;
    }
    dispatch(addCampaign(DRAGON_BALL_CAMPAIGN));
    Alert.alert('🐉 Campagne Chargée !', 'La campagne secrète "Dragon Ball: Le Tournoi du Pouvoir" a été ajoutée à vos campagnes. Bonne chance, guerrier !');
    triggerEffect('secret_unlock');
  };

  return (
    <ThemedScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Thèmes visuels</Text>
      <Text style={styles.subtitle}>Personnalisez l'apparence de l'application</Text>

      {!secretUnlocked && (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>🔐 Un thème secret est à découvrir... Cherchez un indice dans l'écran Plus.</Text>
        </View>
      )}

      {allThemes.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          onPress={() => {
            dispatch(setTheme(theme.id));
            if (theme.id === 'legendary' && secretUnlocked) handleTapLegendary();
          }}
          style={[styles.themeCard, activeTheme === theme.id && styles.themeCardActive, theme.secret && styles.themeCardSecret]}
          activeOpacity={0.8}
        >
          {theme.id === 'legendary' && (
            <Image
              source={require('../../assets/secret-bg.jpg')}
              style={styles.secretBg}
              resizeMode="cover"
            />
          )}
          <View style={[styles.themePreview, { backgroundColor: theme.preview.bg }]}>
            <View style={[styles.previewCard, { backgroundColor: theme.preview.card }]}>
              <View style={[styles.previewPrimary, { backgroundColor: theme.preview.primary }]} />
              <View style={[styles.previewSecondary, { backgroundColor: theme.preview.secondary }]} />
            </View>
          </View>
          <View style={styles.themeInfo}>
            <View style={styles.themeNameRow}>
              <Text style={styles.themeIcon}>{theme.icon}</Text>
              <Text style={[styles.themeName, theme.secret && styles.themeNameSecret]}>{theme.name}</Text>
              {theme.secret && <Text style={styles.secretBadge}>(Secret)</Text>}
            </View>
            <Text style={styles.themeDesc}>{theme.description}</Text>
          </View>
          {activeTheme === theme.id && (
            <View style={styles.activeMark}>
              <Text style={styles.activeMarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {secretCampaignUnlocked && (
        <View style={styles.dbUnlockBox}>
          <Text style={styles.dbUnlockTitle}>🐉 CAMPAGNE SECRÈTE DÉBLOQUÉE 🐉</Text>
          <Text style={styles.dbUnlockDesc}>
            "Dragon Ball: Le Tournoi du Pouvoir" est maintenant accessible.
            Guerriers de 8 univers s'affrontent dans un tournoi dont l'enjeu est la survie de leur monde.
          </Text>
          <TouchableOpacity
            style={[styles.dbLoadBtn, dbCampaignLoaded && styles.dbLoadBtnDone]}
            onPress={handleLoadDBCampaign}
          >
            <Text style={styles.dbLoadBtnText}>
              {dbCampaignLoaded ? '✓ Campagne chargée' : '⚡ Charger la campagne'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.note}>
        Note : Les thèmes personnalisent les couleurs de navigation et d'accentuation. Un redémarrage peut être nécessaire pour l'effet complet.
      </Text>
    </ScrollView>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 48 },
  title: { ...typography.h3, color: colors.primary, textAlign: 'center', marginBottom: 4 },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  hintBox: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  hintText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.small,
    gap: spacing.md,
  },
  themeCardActive: { borderColor: colors.primary, ...shadows.gold },
  themeCardSecret: { borderColor: '#FFD700' },
  secretBg: { position: 'absolute', width: '100%', height: '100%', opacity: 0.15 },
  themePreview: {
    width: 80, height: 80,
    alignItems: 'center', justifyContent: 'center', padding: 8,
  },
  previewCard: { width: 60, height: 60, borderRadius: 8, padding: 8, gap: 4 },
  previewPrimary: { height: 8, borderRadius: 4 },
  previewSecondary: { height: 6, borderRadius: 4, width: '70%' },
  themeInfo: { flex: 1, paddingVertical: spacing.md },
  themeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  themeIcon: { fontSize: 18 },
  themeName: { ...typography.h5, color: colors.text },
  themeNameSecret: { color: '#FFD700' },
  secretBadge: { ...typography.caption, color: '#FFD700', fontWeight: '700' },
  themeDesc: { ...typography.bodySmall, color: colors.textSecondary },
  tapHintRow: { marginTop: 6 },
  tapHintText: { ...typography.caption, color: '#FFD700', marginBottom: 4 },
  tapProgress: {
    height: 3, backgroundColor: colors.border + '44', borderRadius: 2, overflow: 'hidden',
  },
  tapFill: { height: '100%', backgroundColor: '#FFD700', borderRadius: 2 },
  activeMark: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  activeMarkText: { color: colors.background, fontWeight: '900', fontSize: 16 },
  dbUnlockBox: {
    backgroundColor: '#1A0010',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  dbUnlockTitle: { fontSize: 16, fontWeight: '900', color: '#FFD700', textAlign: 'center', marginBottom: spacing.sm },
  dbUnlockDesc: { ...typography.bodySmall, color: '#FF8800', textAlign: 'center', lineHeight: 20, marginBottom: spacing.md },
  dbLoadBtn: {
    backgroundColor: '#FFD700', borderRadius: borderRadius.round,
    paddingHorizontal: spacing.xl, paddingVertical: 12,
  },
  dbLoadBtnDone: { backgroundColor: colors.success },
  dbLoadBtnText: { color: '#0A0005', fontWeight: '900', fontSize: 15 },
  note: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
});
