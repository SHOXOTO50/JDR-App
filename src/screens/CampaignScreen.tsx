import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import {
  addCampaign, updateCampaign, deleteCampaign, setActiveCampaign,
  addSession, updateSession, deleteSession,
} from '../store/slices/campaignSlice';
import { Campaign, CampaignSession } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, formatDate } from '../utils/helpers';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FAB } from '../components/common/FAB';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { SectionHeader } from '../components/common/SectionHeader';
import { ThemedScreen } from '../components/ThemedScreen';

const SYSTEMS = ['D&D 5e', 'Pathfinder', 'Pathfinder 2e', 'Warhammer', 'Call of Cthulhu', 'Personnalisé'];

const defaultCampaign = (): Campaign => ({
  id: generateId(),
  name: '',
  description: '',
  system: 'D&D 5e',
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

const defaultSession = (number: number): CampaignSession => ({
  id: generateId(),
  number,
  title: '',
  date: new Date().toISOString().split('T')[0],
  summary: '',
  participants: [],
  highlights: [],
});

const CampaignCard = ({
  campaign,
  onPress,
  onActivate,
}: {
  campaign: Campaign;
  onPress: () => void;
  onActivate: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{campaign.name}</Text>
        <Text style={styles.cardSystem}>{campaign.system}</Text>
      </View>
      <Badge label={campaign.active ? '⚔️ Active' : '⏸️ En pause'} color={campaign.active ? colors.success : colors.textMuted} />
    </View>
    {campaign.description ? <Text style={styles.cardDesc} numberOfLines={2}>{campaign.description}</Text> : null}
    <View style={styles.campaignStats}>
      <Text style={styles.statChip}>🎮 {campaign.sessionCount} session{campaign.sessionCount !== 1 ? 's' : ''}</Text>
      <Text style={styles.statChip}>👥 {campaign.players.length} joueur{campaign.players.length !== 1 ? 's' : ''}</Text>
      <Text style={styles.statChip}>📜 Code: {campaign.inviteCode}</Text>
    </View>
    <Text style={styles.cardDate}>Créée le {formatDate(campaign.createdAt)}</Text>
  </TouchableOpacity>
);

const SessionCard = ({
  session,
  onPress,
}: {
  session: CampaignSession;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.sessionCard} activeOpacity={0.85}>
    <View style={styles.sessionNumber}>
      <Text style={styles.sessionNum}>#{session.number}</Text>
    </View>
    <View style={styles.sessionInfo}>
      <Text style={styles.sessionTitle}>{session.title || `Session ${session.number}`}</Text>
      <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
      {session.summary ? <Text style={styles.sessionSummary} numberOfLines={2}>{session.summary}</Text> : null}
      {session.highlights && session.highlights.length > 0 && (
        <View style={styles.highlightsRow}>
          {session.highlights.slice(0, 2).map((h, i) => (
            <Text key={i} style={styles.highlight}>⭐ {h}</Text>
          ))}
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export const CampaignScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector((s) => s.campaign.campaigns);
  const activeCampaignId = useAppSelector((s) => s.campaign.activeCampaignId);

  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignModal, setCampaignModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editingSession, setEditingSession] = useState<CampaignSession | null>(null);
  const [highlightInput, setHighlightInput] = useState('');

  const openCreateCampaign = () => {
    setEditingCampaign(defaultCampaign());
    setCampaignModal(true);
  };

  const openEditCampaign = (campaign: Campaign) => {
    setEditingCampaign({ ...campaign });
    setCampaignModal(true);
  };

  const handleSaveCampaign = () => {
    if (!editingCampaign?.name.trim()) { Alert.alert('Nom requis'); return; }
    const now = new Date().toISOString();
    if (campaigns.find((c) => c.id === editingCampaign.id)) {
      dispatch(updateCampaign({ ...editingCampaign, updatedAt: now }));
      if (selectedCampaign?.id === editingCampaign.id) setSelectedCampaign({ ...editingCampaign, updatedAt: now });
    } else {
      dispatch(addCampaign(editingCampaign));
    }
    setCampaignModal(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = () => {
    if (!editingCampaign) return;
    Alert.alert('Supprimer', 'Supprimer cette campagne ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: () => {
          dispatch(deleteCampaign(editingCampaign.id));
          if (selectedCampaign?.id === editingCampaign.id) { setView('list'); setSelectedCampaign(null); }
          setCampaignModal(false);
        },
      },
    ]);
  };

  const openDetail = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setView('detail');
  };

  const openCreateSession = () => {
    if (!selectedCampaign) return;
    setEditingSession(defaultSession(selectedCampaign.sessions.length + 1));
    setSessionModal(true);
  };

  const openEditSession = (session: CampaignSession) => {
    setEditingSession({ ...session, highlights: [...(session.highlights ?? [])] });
    setSessionModal(true);
  };

  const handleSaveSession = () => {
    if (!editingSession || !selectedCampaign) return;
    if (!editingSession.title.trim() && !editingSession.summary.trim()) {
      Alert.alert('Session vide', 'Ajoutez un titre ou un résumé');
      return;
    }
    const currentSessions = selectedCampaign.sessions;
    if (currentSessions.find((s) => s.id === editingSession.id)) {
      dispatch(updateSession({ campaignId: selectedCampaign.id, session: editingSession }));
    } else {
      dispatch(addSession({ campaignId: selectedCampaign.id, session: editingSession }));
    }
    const updatedCampaign = campaigns.find((c) => c.id === selectedCampaign.id);
    if (updatedCampaign) setSelectedCampaign(updatedCampaign);
    setSessionModal(false);
    setEditingSession(null);
  };

  const handleDeleteSession = () => {
    if (!editingSession || !selectedCampaign) return;
    Alert.alert('Supprimer', 'Supprimer cette session ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: () => {
          dispatch(deleteSession({ campaignId: selectedCampaign.id, sessionId: editingSession.id }));
          setSessionModal(false);
        },
      },
    ]);
  };

  const addHighlight = () => {
    if (!editingSession || !highlightInput.trim()) return;
    setEditingSession({ ...editingSession, highlights: [...(editingSession.highlights ?? []), highlightInput.trim()] });
    setHighlightInput('');
  };

  // Detail view
  if (view === 'detail' && selectedCampaign) {
    const campaign = campaigns.find((c) => c.id === selectedCampaign.id) ?? selectedCampaign;
    return (
      <ThemedScreen>
      <View style={styles.container}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setView('list')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>⟵ Campagnes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEditCampaign(campaign)} style={styles.editBtn}>
            <Text style={styles.editBtnText}>✏️ Modifier</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContent}>
          <Text style={styles.detailTitle}>{campaign.name}</Text>
          <Text style={styles.detailSystem}>{campaign.system}</Text>
          {campaign.description ? <Text style={styles.detailDesc}>{campaign.description}</Text> : null}

          <View style={styles.campaignInfoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{campaign.sessionCount}</Text>
              <Text style={styles.infoLabel}>Sessions</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{campaign.players.length}</Text>
              <Text style={styles.infoLabel}>Joueurs</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>{campaign.characterIds.length}</Text>
              <Text style={styles.infoLabel}>Persos</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoValue, { color: colors.primary }]}>{campaign.inviteCode}</Text>
              <Text style={styles.infoLabel}>Code invit.</Text>
            </View>
          </View>

          <SectionHeader
            title={`Sessions (${campaign.sessions.length})`}
            action={{ label: '+ Ajouter', onPress: openCreateSession }}
          />

          {campaign.sessions.length === 0 ? (
            <Text style={styles.emptyText}>Aucune session enregistrée</Text>
          ) : (
            [...campaign.sessions]
              .sort((a, b) => b.number - a.number)
              .map((session) => (
                <SessionCard key={session.id} session={session} onPress={() => openEditSession(session)} />
              ))
          )}
        </ScrollView>

        <FAB onPress={openCreateSession} icon="+" />

        {/* Session modal */}
        <Modal
          visible={sessionModal}
          onClose={() => setSessionModal(false)}
          title={editingSession && campaign.sessions.find((s) => s.id === editingSession?.id) ? 'Modifier la session' : 'Nouvelle session'}
        >
          {editingSession && (
            <>
              <Input label="Titre" value={editingSession.title} onChangeText={(v) => setEditingSession({ ...editingSession, title: v })} placeholder={`Session ${editingSession.number}`} />
              <Input label="Date" value={editingSession.date} onChangeText={(v) => setEditingSession({ ...editingSession, date: v })} placeholder="YYYY-MM-DD" />
              <Input label="Résumé" value={editingSession.summary} onChangeText={(v) => setEditingSession({ ...editingSession, summary: v })} multiline numberOfLines={4} />
              <Text style={styles.fieldLabel}>Moments forts</Text>
              {(editingSession.highlights ?? []).map((h, i) => (
                <View key={i} style={styles.highlightItem}>
                  <Text style={styles.highlightText}>⭐ {h}</Text>
                  <TouchableOpacity onPress={() => setEditingSession({
                    ...editingSession,
                    highlights: (editingSession.highlights ?? []).filter((_, j) => j !== i),
                  })}>
                    <Text style={{ color: colors.error }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Input
                  value={highlightInput}
                  onChangeText={setHighlightInput}
                  placeholder="Moment fort..."
                  containerStyle={{ flex: 1, marginBottom: 0 }}
                />
                <TouchableOpacity onPress={addHighlight} style={styles.addHighlightBtn}>
                  <Text style={styles.addHighlightText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
                {campaign.sessions.find((s) => s.id === editingSession.id) && (
                  <Button label="Supprimer" variant="danger" onPress={handleDeleteSession} style={{ flex: 1 }} />
                )}
                <Button label="Enregistrer" onPress={handleSaveSession} style={{ flex: 1 }} />
              </View>
            </>
          )}
        </Modal>

        <Modal visible={campaignModal} onClose={() => setCampaignModal(false)} title="Modifier la campagne">
          {editingCampaign && (
            <>
              <Input label="Nom *" value={editingCampaign.name} onChangeText={(v) => setEditingCampaign({ ...editingCampaign, name: v })} />
              <Input label="Description" value={editingCampaign.description} onChangeText={(v) => setEditingCampaign({ ...editingCampaign, description: v })} multiline numberOfLines={3} />
              <Text style={styles.fieldLabel}>Système</Text>
              <View style={styles.selectRow}>
                {SYSTEMS.map((s) => (
                  <TouchableOpacity key={s} onPress={() => setEditingCampaign({ ...editingCampaign, system: s })}
                    style={[styles.selectChip, editingCampaign.system === s && styles.selectChipActive]}>
                    <Text style={[styles.selectChipText, editingCampaign.system === s && styles.selectChipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
                <Button label="Supprimer" variant="danger" onPress={handleDeleteCampaign} style={{ flex: 1 }} />
                <Button label="Enregistrer" onPress={handleSaveCampaign} style={{ flex: 1 }} />
              </View>
            </>
          )}
        </Modal>
      </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen>
    <View style={styles.container}>
      <FlatList
        data={campaigns}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CampaignCard campaign={item} onPress={() => openDetail(item)} onActivate={() => dispatch(setActiveCampaign(item.id))} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🗺️"
            title="Aucune campagne"
            subtitle="Créez votre première campagne et invitez vos joueurs"
            actionLabel="Créer une campagne"
            onAction={openCreateCampaign}
          />
        }
      />

      <FAB onPress={openCreateCampaign} />

      <Modal visible={campaignModal} onClose={() => setCampaignModal(false)} title="Nouvelle campagne">
        {editingCampaign && (
          <>
            <Input label="Nom de la campagne *" value={editingCampaign.name} onChangeText={(v) => setEditingCampaign({ ...editingCampaign, name: v })} placeholder="La Chute de Neverwinter..." />
            <Input label="Description" value={editingCampaign.description} onChangeText={(v) => setEditingCampaign({ ...editingCampaign, description: v })} multiline numberOfLines={3} placeholder="Résumé de la campagne..." />
            <Input label="MJ / Game Master" value={editingCampaign.gmName ?? ''} onChangeText={(v) => setEditingCampaign({ ...editingCampaign, gmName: v })} />
            <Text style={styles.fieldLabel}>Système de jeu</Text>
            <View style={styles.selectRow}>
              {SYSTEMS.map((s) => (
                <TouchableOpacity key={s} onPress={() => setEditingCampaign({ ...editingCampaign, system: s })}
                  style={[styles.selectChip, editingCampaign.system === s && styles.selectChipActive]}>
                  <Text style={[styles.selectChipText, editingCampaign.system === s && styles.selectChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.inviteCodeRow}>
              <Text style={styles.inviteCodeLabel}>Code d'invitation:</Text>
              <Text style={styles.inviteCode}>{editingCampaign.inviteCode}</Text>
            </View>
            <Button label="Créer la campagne" onPress={handleSaveCampaign} fullWidth />
          </>
        )}
      </Modal>
    </View>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md, paddingBottom: 80 },
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.small,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 8 },
  cardTitle: { ...typography.h5, color: colors.text, marginBottom: 2 },
  cardSystem: { ...typography.bodySmall, color: colors.secondary, fontWeight: '700' },
  cardDesc: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 8, lineHeight: 18 },
  campaignStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  statChip: { ...typography.bodySmall, color: colors.textSecondary },
  cardDate: { ...typography.caption, color: colors.textMuted },
  detailHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: { padding: 4 },
  backBtnText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  editBtn: { padding: 4 },
  editBtnText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  detailContent: { padding: spacing.md, paddingBottom: 80 },
  detailTitle: { ...typography.h2, color: colors.text, marginBottom: 4 },
  detailSystem: { ...typography.body, color: colors.secondary, fontWeight: '700', marginBottom: spacing.sm },
  detailDesc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 22 },
  campaignInfoGrid: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  infoItem: { alignItems: 'center' },
  infoValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  infoLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  sessionCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.sm, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border, gap: spacing.sm,
  },
  sessionNumber: {
    width: 44, height: 44, borderRadius: borderRadius.round,
    backgroundColor: colors.secondary + '22', borderWidth: 1, borderColor: colors.secondary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  sessionNum: { ...typography.body, color: colors.secondary, fontWeight: '900' },
  sessionInfo: { flex: 1 },
  sessionTitle: { ...typography.h5, color: colors.text, marginBottom: 2 },
  sessionDate: { ...typography.caption, color: colors.textMuted, marginBottom: 4 },
  sessionSummary: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 18 },
  highlightsRow: { marginTop: 4, gap: 2 },
  highlight: { ...typography.bodySmall, color: colors.primary },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center', padding: spacing.xl },
  highlightItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  highlightText: { ...typography.bodySmall, color: colors.primary, flex: 1 },
  addHighlightBtn: {
    width: 44, height: 44, borderRadius: borderRadius.round,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  addHighlightText: { color: colors.background, fontSize: 22, fontWeight: '700' },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  selectChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  selectChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  selectChipText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  selectChipTextActive: { color: colors.primary },
  inviteCodeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  inviteCodeLabel: { ...typography.body, color: colors.textSecondary },
  inviteCode: { ...typography.h4, color: colors.primary, letterSpacing: 4, fontWeight: '900' },
});
