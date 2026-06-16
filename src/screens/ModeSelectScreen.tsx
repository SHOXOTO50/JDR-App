import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector, useAppDispatch } from '../store';
import { setAppMode, AppMode } from '../store/slices/appModeSlice';
import { selectCharacter } from '../store/slices/charactersSlice';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';

const MODES: {
  mode: AppMode;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}[] = [
  {
    mode: 'solo',
    icon: '🧙',
    title: 'Solo',
    subtitle: 'Jouez seul, à votre rythme. Choisissez ensuite votre campagne.',
    color: colors.primary,
  },
  {
    mode: 'local',
    icon: '📡',
    title: 'Multijoueur Local (LAN)',
    subtitle: 'Plusieurs appareils sur le même Wi-Fi : hébergez ou rejoignez une partie.',
    color: colors.mana,
  },
  {
    mode: 'passplay',
    icon: '🎲',
    title: 'Multijoueur Pass-and-Play',
    subtitle: 'Un seul appareil pour tout le groupe : ajoutez les joueurs et leurs personnages.',
    color: colors.success,
  },
];

export const ModeSelectScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const character = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return id ? s.characters.characters.find((c) => c.id === id) : null;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <LinearGradient
        colors={[colors.background, colors.surfaceVariant, colors.background]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.titleDecorator}>✦ ✦ ✦</Text>
          <Text style={styles.appTitle}>Mode de Jeu</Text>
          {character && (
            <Text style={styles.appSubtitle}>Aventurier : {character.name}</Text>
          )}
          <Text style={styles.titleDecorator}>✦ ✦ ✦</Text>
        </View>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.mode}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => dispatch(setAppMode(m.mode))}
            >
              <View style={[styles.cardIcon, { backgroundColor: m.color + '22', borderColor: m.color }]}>
                <Text style={styles.cardIconText}>{m.icon}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{m.title}</Text>
                <Text style={styles.cardSubtitle}>{m.subtitle}</Text>
              </View>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => dispatch(selectCharacter(null))}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>⟵ Changer de personnage</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  header: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg },
  titleDecorator: { color: colors.primaryDark, fontSize: 14, letterSpacing: 8, marginVertical: 4 },
  appTitle: {
    fontSize: 30, fontWeight: '900', color: colors.primary, letterSpacing: 2, textAlign: 'center',
    textShadowColor: colors.primaryDark, textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  appSubtitle: { ...typography.body, color: colors.textSecondary, letterSpacing: 1, marginTop: 6 },
  list: { padding: spacing.lg, paddingBottom: spacing.lg },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: spacing.md, ...shadows.small,
  },
  cardIcon: {
    width: 56, height: 56, borderRadius: borderRadius.lg, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  cardIconText: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardTitle: { ...typography.h4, color: colors.text, marginBottom: 4 },
  cardSubtitle: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 18 },
  arrowText: { color: colors.primary, fontSize: 24, fontWeight: '300' },
  backLink: { alignItems: 'center', marginBottom: spacing.lg },
  backLinkText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
});
