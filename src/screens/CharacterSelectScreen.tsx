import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector, useAppDispatch } from '../store';
import { selectCharacter, deleteCharacter } from '../store/slices/charactersSlice';
import { deleteItemsByCharacter } from '../store/slices/inventorySlice';
import { deleteNotesByCharacter } from '../store/slices/notesSlice';
import { deleteQuestsByCharacter } from '../store/slices/questsSlice';
import { Character } from '../types';
import { colors, borderRadius, shadows, spacing, typography } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CharacterCard = ({
  character,
  onSelect,
  onEdit,
  onDelete,
}: {
  character: Character;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <TouchableOpacity
    onPress={onSelect}
    onLongPress={() =>
      Alert.alert(character.name, 'Que souhaitez-vous faire ?', [
        { text: 'Modifier', onPress: onEdit },
        { text: 'Supprimer', onPress: onDelete, style: 'destructive' },
        { text: 'Annuler', style: 'cancel' },
      ])
    }
    style={styles.card}
    activeOpacity={0.8}
  >
    <View style={styles.cardInner}>
      {character.portrait ? (
        <Image source={{ uri: character.portrait }} style={styles.portrait} />
      ) : (
        <View style={styles.portraitPlaceholder}>
          <Text style={styles.portraitEmoji}>⚔️</Text>
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{character.name}</Text>
        <Text style={styles.cardClass}>
          {character.characterClass} {character.subclass ? `(${character.subclass})` : ''}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>Niv. {character.level}</Text>
          <Text style={styles.cardDot}>·</Text>
          <Text style={styles.cardMetaText}>{character.race}</Text>
          <Text style={styles.cardDot}>·</Text>
          <Text style={styles.cardSystem}>{character.system}</Text>
        </View>
        <View style={styles.hpRow}>
          <Text style={styles.hpLabel}>PV </Text>
          <Text style={styles.hpValue}>{character.currentHP}/{character.maxHP}</Text>
        </View>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </View>
    <View style={styles.cardBorder} />
  </TouchableOpacity>
);

export const CharacterSelectScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const characters = useAppSelector((s) => s.characters.characters);

  const handleSelect = (character: Character) => {
    dispatch(selectCharacter(character.id));
  };

  const handleDelete = (character: Character) => {
    Alert.alert(
      'Supprimer le personnage',
      `Êtes-vous sûr de vouloir supprimer ${character.name} ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteCharacter(character.id));
            dispatch(deleteItemsByCharacter(character.id));
            dispatch(deleteNotesByCharacter(character.id));
            dispatch(deleteQuestsByCharacter(character.id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <LinearGradient
        colors={[colors.background, colors.surfaceVariant, colors.background]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titleDecorator}>✦ ✦ ✦</Text>
          <Text style={styles.appTitle}>DiceQuest</Text>
          <Text style={styles.appSubtitle}>Aventures sans Limites</Text>
          <Text style={styles.titleDecorator}>✦ ✦ ✦</Text>
        </View>

        {/* Character list */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            {characters.length === 0 ? 'Aucun personnage' : `${characters.length} Personnage${characters.length > 1 ? 's' : ''}`}
          </Text>
          <FlatList
            data={characters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CharacterCard
                character={item}
                onSelect={() => handleSelect(item)}
                onEdit={() => navigation.navigate('CreateCharacter', { characterId: item.id })}
                onDelete={() => handleDelete(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🗺️</Text>
                <Text style={styles.emptyTitle}>Aucun aventurier</Text>
                <Text style={styles.emptySubtitle}>
                  Créez votre premier personnage pour commencer votre aventure
                </Text>
              </View>
            }
          />
        </View>

        {/* Create button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateCharacter')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primaryDark, colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createGradient}
            >
              <Text style={styles.createIcon}>⚔️</Text>
              <Text style={styles.createLabel}>Créer un Personnage</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.hint}>Appui long sur un personnage pour le modifier ou le supprimer</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  titleDecorator: {
    color: colors.primaryDark,
    fontSize: 14,
    letterSpacing: 8,
    marginVertical: 4,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 4,
    textShadowColor: colors.primaryDark,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  appSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  cardInner: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  portrait: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  portraitPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitEmoji: { fontSize: 28 },
  cardInfo: { flex: 1, marginLeft: spacing.md },
  cardName: {
    ...typography.h5,
    color: colors.text,
    marginBottom: 2,
  },
  cardClass: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  cardMetaText: { ...typography.bodySmall, color: colors.textSecondary },
  cardDot: { ...typography.bodySmall, color: colors.textMuted, marginHorizontal: 4 },
  cardSystem: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontWeight: '600',
  },
  hpRow: { flexDirection: 'row', alignItems: 'center' },
  hpLabel: { ...typography.caption, color: colors.textMuted },
  hpValue: { ...typography.bodySmall, color: colors.hp, fontWeight: '700' },
  arrow: { paddingLeft: spacing.sm },
  arrowText: { color: colors.primary, fontSize: 24, fontWeight: '300' },
  cardBorder: {
    height: 2,
    backgroundColor: colors.primaryDark,
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.h4, color: colors.textSecondary, marginBottom: spacing.sm },
  emptySubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  createButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.gold,
  },
  createGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: spacing.sm,
  },
  createIcon: { fontSize: 22 },
  createLabel: {
    ...typography.h5,
    color: colors.background,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
