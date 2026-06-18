import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import { selectCharacter } from '../store/slices/charactersSlice';
import { deleteItemsByCharacter } from '../store/slices/inventorySlice';
import { deleteNotesByCharacter } from '../store/slices/notesSlice';
import { deleteQuestsByCharacter } from '../store/slices/questsSlice';
import { toggleEffects } from '../store/slices/themeSlice';
import { setEffectsEnabled } from '../utils/effectSystem';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { formatDate } from '../utils/helpers';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SettingRow = ({
  icon, title, subtitle, onPress, danger, value, rightElement,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  value?: string;
  rightElement?: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.settingRow}
    disabled={!onPress && !rightElement}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <Text style={styles.settingIcon}>{icon}</Text>
    <View style={styles.settingInfo}>
      <Text style={[styles.settingTitle, danger && styles.settingDanger]}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightElement ?? (value ? <Text style={styles.settingValue}>{value}</Text> : onPress ? <Text style={styles.settingArrow}>›</Text> : null)}
  </TouchableOpacity>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

export const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const characters = useAppSelector((s) => s.characters.characters);
  const currentId = useAppSelector((s) => s.characters.currentCharacterId);
  const currentCharacter = characters.find((c) => c.id === currentId);
  const itemCount = useAppSelector((s) => s.inventory.items.filter((i) => i.characterId === currentId).length);
  const noteCount = useAppSelector((s) => s.notes.notes.filter((n) => n.characterId === currentId).length);
  const questCount = useAppSelector((s) => s.quests.quests.filter((q) => q.characterId === currentId).length);
  const combatCount = useAppSelector((s) => s.combat.combats.length);
  const campaignCount = useAppSelector((s) => s.campaign.campaigns.length);
  const gmNPCCount = useAppSelector((s) => s.gm.npcs.length);
  const gmMonsterCount = useAppSelector((s) => s.gm.monsters.length);
  const effectsEnabled = useAppSelector((s) => s.theme.effectsEnabled);

  const handleExportCharacter = () => {
    if (!currentCharacter) return;
    const data = JSON.stringify(currentCharacter, null, 2);
    Share.share({
      title: `Personnage: ${currentCharacter.name}`,
      message: data,
    }).catch(() => Alert.alert('Erreur', 'Impossible de partager'));
  };

  const handleClearCharacterData = () => {
    if (!currentId) return;
    Alert.alert(
      'Effacer les données',
      `Supprimer tout l'inventaire, les notes et les quêtes de ${currentCharacter?.name} ? Le personnage sera conservé.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteItemsByCharacter(currentId));
            dispatch(deleteNotesByCharacter(currentId));
            dispatch(deleteQuestsByCharacter(currentId));
            Alert.alert('Données effacées', 'L\'inventaire, les notes et les quêtes ont été supprimés.');
          },
        },
      ]
    );
  };

  const handleToggleEffects = () => {
    dispatch(toggleEffects());
    setEffectsEnabled(!effectsEnabled);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Current character */}
      {currentCharacter && (
        <View style={styles.charCard}>
          <Text style={styles.charCardLabel}>Personnage actif</Text>
          <Text style={styles.charCardName}>{currentCharacter.name}</Text>
          <Text style={styles.charCardMeta}>
            {currentCharacter.characterClass} Niv.{currentCharacter.level} · {currentCharacter.race} · {currentCharacter.system}
          </Text>
          <Text style={styles.charCardDate}>Créé le {formatDate(currentCharacter.createdAt)}</Text>
          <View style={styles.charStats}>
            <View style={styles.charStat}>
              <Text style={styles.charStatValue}>{itemCount}</Text>
              <Text style={styles.charStatLabel}>Objets</Text>
            </View>
            <View style={styles.charStat}>
              <Text style={styles.charStatValue}>{noteCount}</Text>
              <Text style={styles.charStatLabel}>Notes</Text>
            </View>
            <View style={styles.charStat}>
              <Text style={styles.charStatValue}>{questCount}</Text>
              <Text style={styles.charStatLabel}>Quêtes</Text>
            </View>
          </View>
        </View>
      )}

      <SectionTitle title="Personnalisation" />
      <View style={styles.section}>
        <SettingRow
          icon="🎨"
          title="Thèmes visuels"
          subtitle="Changez l'apparence de l'application"
          onPress={() => navigation.navigate('Themes')}
        />
        <SettingRow
          icon="📋"
          title="Notes de mise à jour"
          subtitle="Voir l'historique des versions"
          onPress={() => navigation.navigate('PatchNotes')}
        />
        <SettingRow
          icon="🎬"
          title="Effets immersifs"
          subtitle="Vibrations et éclairs visuels sur les actions"
          rightElement={
            <Switch
              value={effectsEnabled}
              onValueChange={handleToggleEffects}
              trackColor={{ false: colors.border, true: colors.primary + '88' }}
              thumbColor={effectsEnabled ? colors.primary : colors.textMuted}
            />
          }
        />
      </View>

      <SectionTitle title="Données" />
      <View style={styles.section}>
        <SettingRow
          icon="📤"
          title="Exporter le personnage"
          subtitle="Partager les données du personnage (JSON)"
          onPress={handleExportCharacter}
        />
        <SettingRow
          icon="🔄"
          title="Changer de personnage"
          subtitle="Retourner à la sélection"
          onPress={() => dispatch(selectCharacter(null))}
        />
      </View>

      <SectionTitle title="Statistiques" />
      <View style={styles.section}>
        <SettingRow icon="👤" title="Personnages" value={String(characters.length)} />
        <SettingRow icon="⚔️" title="Combats enregistrés" value={String(combatCount)} />
        <SettingRow icon="🗺️" title="Campagnes" value={String(campaignCount)} />
        <SettingRow icon="👹" title="PNJ & Monstres" value={`${gmNPCCount + gmMonsterCount}`} />
      </View>

      <SectionTitle title="Danger" />
      <View style={styles.section}>
        <SettingRow
          icon="🗑️"
          title="Effacer les données du personnage"
          subtitle="Supprime l'inventaire, les notes et les quêtes"
          onPress={handleClearCharacterData}
          danger
        />
      </View>

      <SectionTitle title="À propos" />
      <View style={styles.section}>
        <SettingRow icon="🎲" title="DiceQuest" value="v2.0.0" />
        <SettingRow icon="⚔️" title="Compatible" subtitle="D&D 5e, Pathfinder, Warhammer et plus" />
        <SettingRow icon="🌙" title="Thème" subtitle="Mode sombre fantasy médiéval" />
        <SettingRow icon="💾" title="Stockage" subtitle="Sauvegarde locale automatique" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>⚔️ DiceQuest</Text>
        <Text style={styles.footerSub}>Version 2.0.0</Text>
        <Text style={styles.footerVersion}>Créé par SHOXOTO</Text>
        <Text style={styles.footerLove}>Créé avec ❤️ pour les aventuriers et les passionnés de D&D</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 48 },
  charCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.gold,
  },
  charCardLabel: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  charCardName: { ...typography.h3, color: colors.primary, marginVertical: 4 },
  charCardMeta: { ...typography.body, color: colors.textSecondary, marginBottom: 2 },
  charCardDate: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  charStats: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  charStat: { alignItems: 'center' },
  charStatValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  charStatLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  settingIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  settingInfo: { flex: 1 },
  settingTitle: { ...typography.body, color: colors.text, fontWeight: '600' },
  settingDanger: { color: colors.error },
  settingSubtitle: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  settingValue: { ...typography.body, color: colors.textSecondary, fontWeight: '700' },
  settingArrow: { color: colors.textMuted, fontSize: 20 },
  footer: { alignItems: 'center', paddingVertical: spacing.xl },
  footerText: { fontSize: 28, fontWeight: '900', color: colors.primary, letterSpacing: 3 },
  footerSub: { ...typography.body, color: colors.textMuted, letterSpacing: 2, marginTop: 4 },
  footerVersion: { ...typography.caption, color: colors.primary, fontWeight: '700', marginTop: spacing.sm },
  footerLove: { ...typography.caption, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
});
