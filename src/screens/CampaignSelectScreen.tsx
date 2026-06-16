import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, StatusBar, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector, useAppDispatch } from '../store';
import {
  addCampaign, setActiveCampaign, deleteCampaign,
} from '../store/slices/campaignSlice';
import { deletePlayersByCampaign, claimPendingPlayers } from '../store/slices/playersSlice';
import { deleteMapsByCampaign } from '../store/slices/mapsSlice';
import { setAppMode } from '../store/slices/appModeSlice';
import { Campaign } from '../types';
import { colors, borderRadius, shadows, spacing, typography } from '../theme';
import { generateId, formatDate } from '../utils/helpers';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const SYSTEMS = ['D&D 5e', 'Pathfinder', 'Pathfinder 2e', 'Warhammer', 'Call of Cthulhu', 'Personnalisé'];

const makeCampaign = (): Campaign => ({
  id: generateId(),
  name: '',
  description: '',
  system: 'D&D 5e',
  gmName: '',
  gmNotes: '',
  players: [],
  characterIds: [],
  sessionCount: 0,
  sessions: [],
  npcIds: [],
  locationIds: [],
  active: true,
  inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const CampaignSelectScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector((s) => s.campaign.campaigns);
  const character = useAppSelector((s) => {
    const id = s.characters.currentCharacterId;
    return id ? s.characters.characters.find((c) => c.id === id) : null;
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [draft, setDraft] = useState<Campaign>(makeCampaign());

  const openCreate = () => {
    setDraft(makeCampaign());
    setModalVisible(true);
  };

  const handleCreate = () => {
    if (!draft.name.trim()) { Alert.alert('Nom requis', 'Donnez un nom à votre campagne.'); return; }
    dispatch(addCampaign(draft));
    dispatch(setActiveCampaign(draft.id));
    dispatch(claimPendingPlayers(draft.id));
    setModalVisible(false);
  };

  const handlePick = (campaign: Campaign) => {
    dispatch(setActiveCampaign(campaign.id));
    dispatch(claimPendingPlayers(campaign.id));
  };

  const handleDelete = (campaign: Campaign) => {
    Alert.alert('Supprimer la campagne', `Supprimer « ${campaign.name} » et toutes ses données (joueurs, cartes) ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: () => {
          dispatch(deleteCampaign(campaign.id));
          dispatch(deletePlayersByCampaign(campaign.id));
          dispatch(deleteMapsByCampaign(campaign.id));
        },
      },
    ]);
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
        <View style={styles.header}>
          <Text style={styles.titleDecorator}>✦ ✦ ✦</Text>
          <Text style={styles.appTitle}>Choisir une Campagne</Text>
          {character && (
            <Text style={styles.appSubtitle}>Aventurier : {character.name}</Text>
          )}
          <Text style={styles.titleDecorator}>✦ ✦ ✦</Text>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            {campaigns.length === 0 ? 'Aucune campagne' : `${campaigns.length} Campagne${campaigns.length > 1 ? 's' : ''}`}
          </Text>
          <FlatList
            data={campaigns}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePick(item)}
                onLongPress={() => handleDelete(item)}
                style={styles.card}
                activeOpacity={0.85}
              >
                <View style={styles.cardInner}>
                  <View style={styles.cardIcon}>
                    <Text style={styles.cardIconText}>🗺️</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardSystem}>{item.system}</Text>
                    <View style={styles.cardMeta}>
                      <Text style={styles.cardMetaText}>🎮 {item.sessionCount} session{item.sessionCount !== 1 ? 's' : ''}</Text>
                      <Text style={styles.cardDot}>·</Text>
                      <Text style={styles.cardMetaText}>Créée le {formatDate(item.createdAt)}</Text>
                    </View>
                  </View>
                  <Text style={styles.arrowText}>›</Text>
                </View>
                <View style={styles.cardBorder} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏕️</Text>
                <Text style={styles.emptyTitle}>Pas encore de campagne</Text>
                <Text style={styles.emptySubtitle}>
                  Créez une campagne pour démarrer votre aventure. Le Maître du Jeu pourra gérer plusieurs campagnes selon le groupe.
                </Text>
              </View>
            }
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.createButton} onPress={openCreate} activeOpacity={0.85}>
            <LinearGradient
              colors={[colors.primaryDark, colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createGradient}
            >
              <Text style={styles.createIcon}>🗺️</Text>
              <Text style={styles.createLabel}>Créer une Campagne</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(setAppMode(null))} style={styles.backLink}>
            <Text style={styles.backLinkText}>⟵ Changer de mode</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Appui long sur une campagne pour la supprimer</Text>
        </View>
      </SafeAreaView>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Nouvelle campagne">
        <Input label="Nom de la campagne *" value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder="La Malédiction de Strahd..." />
        <Input label="Description" value={draft.description} onChangeText={(v) => setDraft({ ...draft, description: v })} multiline numberOfLines={3} placeholder="Résumé de la campagne..." />
        <Input label="Maître du Jeu" value={draft.gmName ?? ''} onChangeText={(v) => setDraft({ ...draft, gmName: v })} placeholder="Nom du MJ" />
        <Text style={styles.fieldLabel}>Système de jeu</Text>
        <View style={styles.selectRow}>
          {SYSTEMS.map((s) => (
            <TouchableOpacity key={s} onPress={() => setDraft({ ...draft, system: s })}
              style={[styles.selectChip, draft.system === s && styles.selectChipActive]}>
              <Text style={[styles.selectChipText, draft.system === s && styles.selectChipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button label="Créer et commencer" onPress={handleCreate} fullWidth />
      </Modal>
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
  sectionTitle: {
    ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5,
    marginBottom: spacing.sm, paddingHorizontal: spacing.md,
  },
  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, marginBottom: spacing.sm,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadows.small,
  },
  cardInner: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  cardIcon: {
    width: 56, height: 56, borderRadius: borderRadius.lg, backgroundColor: colors.secondary + '22',
    borderWidth: 1, borderColor: colors.secondary, alignItems: 'center', justifyContent: 'center',
  },
  cardIconText: { fontSize: 28 },
  cardInfo: { flex: 1, marginLeft: spacing.md },
  cardName: { ...typography.h5, color: colors.text, marginBottom: 2 },
  cardSystem: { ...typography.bodySmall, color: colors.secondary, fontWeight: '700', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  cardMetaText: { ...typography.caption, color: colors.textSecondary },
  cardDot: { ...typography.caption, color: colors.textMuted, marginHorizontal: 6 },
  arrowText: { color: colors.primary, fontSize: 24, fontWeight: '300', paddingLeft: spacing.sm },
  cardBorder: { height: 2, backgroundColor: colors.primaryDark, opacity: 0.5 },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  emptyIcon: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.h4, color: colors.textSecondary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, paddingTop: spacing.md },
  createButton: { borderRadius: borderRadius.lg, overflow: 'hidden', ...shadows.gold },
  createGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: spacing.sm },
  createIcon: { fontSize: 22 },
  createLabel: { ...typography.h5, color: colors.background, fontWeight: '800', letterSpacing: 0.5 },
  backLink: { alignItems: 'center', marginTop: spacing.md },
  backLinkText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  hint: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  selectChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  selectChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  selectChipText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  selectChipTextActive: { color: colors.primary },
});
