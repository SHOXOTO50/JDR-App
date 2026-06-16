import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import { selectCharacter } from '../store/slices/charactersSlice';
import { setActiveCampaign } from '../store/slices/campaignSlice';
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
  const activeCampaign = useAppSelector((s) =>
    s.campaign.campaigns.find((c) => c.id === s.campaign.activeCampaignId) ?? null
  );
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

  const handleSwitchCampaign = () => {
    Alert.alert('Changer de campagne', 'Retourner à la sélection de campagne ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Changer', onPress: () => dispatch(setActiveCampaign(null)) },
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
          {activeCampaign && (
            <Text style={styles.summaryCampaign}>🗺️ {activeCampaign.name}</Text>
          )}
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
      <MenuCard
        icon="👥"
        title="Multijoueur Local"
        subtitle="Gérez le groupe sur un seul appareil"
        color={colors.success}
        onPress={() => navigation.navigate('Multiplayer')}
      />
      <MenuCard
        icon="🧭"
        title="Carte Interactive"
        subtitle="Importez une carte et placez des marqueurs"
        color={colors.mana}
        onPress={() => navigation.navigate('Map')}
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
      <MenuCard
        icon="🗺️"
        title="Changer de campagne"
        subtitle={activeCampaign ? activeCampaign.name : 'Retour à la sélection'}
        color={colors.secondary}
        onPress={handleSwitchCampaign}
      />

      <Text style={styles.version}>JDR App v1.1.0 · Fait avec ❤️ pour les aventuriers</Text>
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
  summaryClass: { ...typography.body, color: colors.textSecondary, marginBottom: 4 },
  summaryCampaign: { ...typography.bodySmall, color: colors.secondary, fontWeight: '700', marginBottom: spacing.md },
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
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
