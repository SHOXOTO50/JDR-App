import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import { selectCharacter } from '../store/slices/charactersSlice';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MenuCard = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.menuCard} activeOpacity={0.8}>
    <View style={[styles.menuIcon, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={styles.menuIconText}>{icon}</Text>
    </View>
    <View style={styles.menuInfo}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

export const MoreScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const character = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return id ? s.characters.characters.find((c) => c.id === id) : null;
  });
  const questCount = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return s.quests.quests.filter((q) => q.characterId === id && q.status === 'active').length;
  });
  const itemCount = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return s.inventory.items.filter((i) => i.characterId === id).length;
  });
  const noteCount = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return s.notes.notes.filter((n) => n.characterId === id).length;
  });

  const handleSwitchCharacter = () => {
    Alert.alert('Changer de personnage', 'Retourner à la sélection de personnage ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Changer', onPress: () => dispatch(selectCharacter(null)) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Character summary */}
      {character && (
        <View style={styles.charSummary}>
          <Text style={styles.summaryName}>{character.name}</Text>
          <Text style={styles.summaryClass}>
            {character.characterClass} Niv.{character.level} · {character.race}
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{questCount}</Text>
              <Text style={styles.summaryStatLabel}>Quêtes actives</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{itemCount}</Text>
              <Text style={styles.summaryStatLabel}>Objets</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{noteCount}</Text>
              <Text style={styles.summaryStatLabel}>Notes</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatValue, { color: character.currentHP < character.maxHP * 0.25 ? colors.error : colors.success }]}>
                {character.currentHP}/{character.maxHP}
              </Text>
              <Text style={styles.summaryStatLabel}>PV</Text>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.sectionLabel}>Fonctionnalités</Text>

      <MenuCard
        icon="⚔️"
        title="Gestion du Combat"
        subtitle="Initiative, PV, effets de combat"
        color={colors.error}
        onPress={() => navigation.navigate('Combat')}
      />
      <MenuCard
        icon="📜"
        title="Quêtes"
        subtitle={`${questCount} quête${questCount !== 1 ? 's' : ''} active${questCount !== 1 ? 's' : ''}`}
        color={colors.primary}
        onPress={() => navigation.navigate('Quests')}
      />
      <MenuCard
        icon="🏰"
        title="Mode Maître du Jeu"
        subtitle="PNJ, monstres, factions, lieux"
        color={colors.secondary}
        onPress={() => navigation.navigate('GM')}
      />
      <MenuCard
        icon="🗺️"
        title="Campagnes"
        subtitle="Gérez vos campagnes et sessions"
        color={colors.warning}
        onPress={() => navigation.navigate('Campaign')}
      />

      <Text style={styles.sectionLabel}>Gestion</Text>

      <MenuCard
        icon="⚙️"
        title="Paramètres"
        subtitle="Préférences et données"
        color={colors.textSecondary}
        onPress={() => navigation.navigate('Settings')}
      />
      <MenuCard
        icon="🔄"
        title="Changer de personnage"
        subtitle="Retour à la sélection"
        color={colors.textMuted}
        onPress={handleSwitchCharacter}
      />

      <Text style={styles.sectionLabel}>À venir</Text>

      <View style={styles.comingSoonCard}>
        <Text style={styles.comingSoonIcon}>🌐</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.comingSoonTitle}>Mode Multijoueur</Text>
          <Text style={styles.comingSoonText}>Rejoignez une campagne avec un code d'invitation</Text>
        </View>
        <View style={styles.comingSoonBadge}><Text style={styles.comingSoonBadgeText}>Bientôt</Text></View>
      </View>
      <View style={styles.comingSoonCard}>
        <Text style={styles.comingSoonIcon}>🤖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.comingSoonTitle}>Assistant IA</Text>
          <Text style={styles.comingSoonText}>Génération de PNJ, quêtes, donjons et plus</Text>
        </View>
        <View style={styles.comingSoonBadge}><Text style={styles.comingSoonBadgeText}>Bientôt</Text></View>
      </View>
      <View style={styles.comingSoonCard}>
        <Text style={styles.comingSoonIcon}>🗺️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.comingSoonTitle}>Cartes Interactives</Text>
          <Text style={styles.comingSoonText}>Import d'images, marqueurs et annotations</Text>
        </View>
        <View style={styles.comingSoonBadge}><Text style={styles.comingSoonBadgeText}>Bientôt</Text></View>
      </View>

      <Text style={styles.version}>JDR App v1.0.0 · Fait avec ❤️ pour les aventuriers</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 40 },
  charSummary: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.gold,
  },
  summaryName: { ...typography.h3, color: colors.primary, marginBottom: 2 },
  summaryClass: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryStat: { alignItems: 'center' },
  summaryStatValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  summaryStatLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
    gap: spacing.md,
  },
  menuIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconText: { fontSize: 26 },
  menuInfo: { flex: 1 },
  menuTitle: { ...typography.h5, color: colors.text, marginBottom: 2 },
  menuSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
  menuArrow: { color: colors.primary, fontSize: 22, fontWeight: '300' },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.7,
    gap: spacing.sm,
  },
  comingSoonIcon: { fontSize: 28 },
  comingSoonTitle: { ...typography.h5, color: colors.textSecondary, marginBottom: 2 },
  comingSoonText: { ...typography.bodySmall, color: colors.textMuted },
  comingSoonBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: colors.secondaryLight + '22',
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  comingSoonBadgeText: { ...typography.caption, color: colors.secondary, fontWeight: '700' },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
