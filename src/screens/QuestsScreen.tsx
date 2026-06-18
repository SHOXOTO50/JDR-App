import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import {
  addQuest, updateQuest, deleteQuest, updateQuestStatus, toggleObjective,
} from '../store/slices/questsSlice';
import { Quest, QuestStatus, QuestType, QuestObjective } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, formatDate, getQuestStatusLabel, getQuestStatusColor } from '../utils/helpers';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FAB } from '../components/common/FAB';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { SectionHeader } from '../components/common/SectionHeader';
import { ThemedScreen } from '../components/ThemedScreen';
import { useCampaignMode } from '../hooks/useCampaignMode';
import { DB_QUEST_TEMPLATES } from '../data/dragonBallQuests';

const STATUS_TABS: { key: QuestStatus | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Toutes', icon: '📜' },
  { key: 'active', label: 'Actives', icon: '⚔️' },
  { key: 'secondaire', label: 'Secondaires', icon: '📌' },
  { key: 'terminee', label: 'Terminées', icon: '✅' },
  { key: 'echouee', label: 'Échouées', icon: '💀' },
];

const QUEST_TYPE_LABELS: Record<QuestType, string> = {
  principale: 'Principale',
  secondaire: 'Secondaire',
};

const defaultQuest = (characterId: string): Quest => ({
  id: generateId(),
  characterId,
  title: '',
  description: '',
  reward: '',
  status: 'active',
  type: 'principale',
  objectives: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const ObjectiveItem = ({
  obj,
  questId,
  onToggle,
}: {
  obj: QuestObjective;
  questId: string;
  onToggle: () => void;
}) => (
  <TouchableOpacity onPress={onToggle} style={styles.objectiveRow}>
    <View style={[styles.objCheck, obj.completed && styles.objCheckDone]}>
      {obj.completed && <Text style={styles.objCheckMark}>✓</Text>}
    </View>
    <Text style={[styles.objText, obj.completed && styles.objTextDone]}>{obj.description}</Text>
  </TouchableOpacity>
);

const QuestCard = ({
  quest,
  onPress,
  onStatusChange,
}: {
  quest: Quest;
  onPress: () => void;
  onStatusChange: (status: QuestStatus) => void;
}) => {
  const statusColor = getQuestStatusColor(quest.status);
  const completed = quest.objectives.filter((o) => o.completed).length;
  const total = quest.objectives.length;

  return (
    <TouchableOpacity onPress={onPress} style={styles.questCard} activeOpacity={0.85}>
      <View style={[styles.questStatusBar, { backgroundColor: statusColor }]} />
      <View style={styles.questContent}>
        <View style={styles.questHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <View style={styles.questMeta}>
              <Badge label={QUEST_TYPE_LABELS[quest.type]} color={statusColor} size="sm" />
              <Text style={styles.questDate}>{formatDate(quest.createdAt)}</Text>
            </View>
          </View>
          <Badge label={getQuestStatusLabel(quest.status)} color={statusColor} />
        </View>
        {quest.description ? (
          <Text style={styles.questDesc} numberOfLines={2}>{quest.description}</Text>
        ) : null}
        {total > 0 && (
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(completed / total) * 100}%`, backgroundColor: statusColor }]} />
            </View>
            <Text style={styles.progressText}>{completed}/{total}</Text>
          </View>
        )}
        {quest.reward ? (
          <Text style={styles.rewardText}>🏆 {quest.reward}</Text>
        ) : null}
        {quest.status === 'active' && (
          <View style={styles.quickActions}>
            <TouchableOpacity onPress={() => onStatusChange('terminee')} style={styles.quickBtn}>
              <Text style={styles.quickBtnText}>✅ Terminer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onStatusChange('echouee')} style={[styles.quickBtn, styles.quickBtnFail]}>
              <Text style={[styles.quickBtnText, styles.quickBtnFailText]}>💀 Échouer</Text>
            </TouchableOpacity>
          </View>
        )}
        {quest.status !== 'active' && (
          <TouchableOpacity onPress={() => onStatusChange('active')} style={[styles.quickBtn, { alignSelf: 'flex-start', marginTop: 8 }]}>
            <Text style={styles.quickBtnText}>↩️ Réactiver</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const QuestsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentId = useAppSelector((s) => s.characters.currentCharacterId) ?? '';
  const allQuests = useAppSelector((s) => s.quests.quests);
  const quests = allQuests.filter((q) => q.characterId === currentId);
  const { isDB } = useCampaignMode();

  const loadDBQuests = () => {
    const existing = new Set(quests.map((q) => q.title));
    const now = new Date().toISOString();
    let added = 0;
    DB_QUEST_TEMPLATES.forEach((t) => {
      if (!existing.has(t.title)) {
        dispatch(addQuest({
          id: generateId(),
          characterId: currentId,
          title: t.title,
          description: t.description,
          reward: t.reward,
          status: 'active',
          type: t.type,
          objectives: t.objectives.map((o) => ({ id: generateId(), description: o, completed: false })),
          createdAt: now,
          updatedAt: now,
        }));
        added++;
      }
    });
    if (added === 0) {
      Alert.alert('Quêtes DB déjà chargées', 'Toutes les quêtes Dragon Ball sont déjà dans votre liste.');
    } else {
      Alert.alert('🐉 Quêtes Dragon Ball !', `${added} quête${added > 1 ? 's' : ''} Dragon Ball ajoutée${added > 1 ? 's' : ''}.`);
    }
  };

  const [statusFilter, setStatusFilter] = useState<QuestStatus | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [newObjective, setNewObjective] = useState('');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return quests;
    return quests.filter((q) => q.status === statusFilter);
  }, [quests, statusFilter]);

  const openCreate = () => {
    setEditingQuest(defaultQuest(currentId));
    setModalVisible(true);
  };

  const openEdit = (quest: Quest) => {
    setEditingQuest({ ...quest, objectives: [...quest.objectives] });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!editingQuest) return;
    if (!editingQuest.title.trim()) { Alert.alert('Champ requis', 'Le titre est obligatoire'); return; }
    const now = new Date().toISOString();
    if (quests.find((q) => q.id === editingQuest.id)) {
      dispatch(updateQuest({ ...editingQuest, updatedAt: now }));
    } else {
      dispatch(addQuest({ ...editingQuest, createdAt: now, updatedAt: now }));
    }
    setModalVisible(false);
    setEditingQuest(null);
  };

  const handleDelete = () => {
    if (!editingQuest) return;
    Alert.alert('Supprimer', 'Supprimer cette quête ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: () => { dispatch(deleteQuest(editingQuest.id)); setModalVisible(false); setEditingQuest(null); },
      },
    ]);
  };

  const addObjectiveToQuest = () => {
    if (!editingQuest || !newObjective.trim()) return;
    const obj: QuestObjective = { id: generateId(), description: newObjective.trim(), completed: false };
    setEditingQuest({ ...editingQuest, objectives: [...editingQuest.objectives, obj] });
    setNewObjective('');
  };

  const toggleObjInEdit = (id: string) => {
    if (!editingQuest) return;
    setEditingQuest({
      ...editingQuest,
      objectives: editingQuest.objectives.map((o) => o.id === id ? { ...o, completed: !o.completed } : o),
    });
  };

  const removeObjFromEdit = (id: string) => {
    if (!editingQuest) return;
    setEditingQuest({ ...editingQuest, objectives: editingQuest.objectives.filter((o) => o.id !== id) });
  };

  const counts = {
    all: quests.length,
    active: quests.filter((q) => q.status === 'active').length,
    secondaire: quests.filter((q) => q.status === 'secondaire').length,
    terminee: quests.filter((q) => q.status === 'terminee').length,
    echouee: quests.filter((q) => q.status === 'echouee').length,
  };

  return (
    <ThemedScreen>
    <View style={styles.container}>
      {/* Status tabs */}
      <FlatList
        data={STATUS_TABS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t.key}
        contentContainerStyle={styles.tabList}
        renderItem={({ item: t }) => (
          <TouchableOpacity
            onPress={() => setStatusFilter(t.key)}
            style={[styles.statusTab, statusFilter === t.key && { borderColor: getQuestStatusColor(t.key === 'all' ? 'active' : t.key) }]}
          >
            <Text style={[styles.statusTabText, statusFilter === t.key && { color: getQuestStatusColor(t.key === 'all' ? 'active' : t.key) }]}>
              {t.icon} {t.label}
            </Text>
            <Text style={styles.statusCount}>{counts[t.key]}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(q) => q.id}
        renderItem={({ item }) => (
          <QuestCard
            quest={item}
            onPress={() => openEdit(item)}
            onStatusChange={(status) => dispatch(updateQuestStatus({ id: item.id, status }))}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="📜"
            title="Aucune quête"
            subtitle="Commencez votre aventure en créant une quête"
            actionLabel="Créer une quête"
            onAction={openCreate}
          />
        }
      />

      {isDB && (
        <TouchableOpacity style={styles.dbQuestsBtn} onPress={loadDBQuests}>
          <Text style={styles.dbQuestsBtnText}>🐉 Charger les quêtes Dragon Ball</Text>
        </TouchableOpacity>
      )}

      <FAB onPress={openCreate} />

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={editingQuest && quests.find((q) => q.id === editingQuest?.id) ? 'Modifier la quête' : 'Nouvelle quête'}>
        {editingQuest && (
          <>
            <Input label="Titre *" value={editingQuest.title} onChangeText={(v) => setEditingQuest({ ...editingQuest, title: v })} placeholder="Titre de la quête..." />
            <Input label="Description" value={editingQuest.description} onChangeText={(v) => setEditingQuest({ ...editingQuest, description: v })} multiline numberOfLines={3} />
            <Input label="Récompense" value={editingQuest.reward} onChangeText={(v) => setEditingQuest({ ...editingQuest, reward: v })} placeholder="500po, Épée légendaire..." />

            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.typeRow}>
              {(['principale', 'secondaire'] as QuestType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setEditingQuest({ ...editingQuest, type: t })}
                  style={[styles.typeChip, editingQuest.type === t && styles.typeChipActive]}
                >
                  <Text style={[styles.typeChipText, editingQuest.type === t && styles.typeChipTextActive]}>
                    {QUEST_TYPE_LABELS[t]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Statut</Text>
            <View style={styles.typeRow}>
              {(['active', 'secondaire', 'terminee', 'echouee'] as QuestStatus[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setEditingQuest({ ...editingQuest, status: s })}
                  style={[styles.typeChip, editingQuest.status === s && { borderColor: getQuestStatusColor(s), backgroundColor: getQuestStatusColor(s) + '22' }]}
                >
                  <Text style={[styles.typeChipText, editingQuest.status === s && { color: getQuestStatusColor(s) }]}>
                    {getQuestStatusLabel(s)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <SectionHeader title={`Objectifs (${editingQuest.objectives.length})`} />
            {editingQuest.objectives.map((obj) => (
              <View key={obj.id} style={styles.editObjRow}>
                <TouchableOpacity onPress={() => toggleObjInEdit(obj.id)} style={[styles.objCheck, obj.completed && styles.objCheckDone]}>
                  {obj.completed && <Text style={styles.objCheckMark}>✓</Text>}
                </TouchableOpacity>
                <Text style={[styles.objText, obj.completed && styles.objTextDone]}>{obj.description}</Text>
                <TouchableOpacity onPress={() => removeObjFromEdit(obj.id)}>
                  <Text style={{ color: colors.error, fontSize: 16, padding: 4 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addObjRow}>
              <Input
                value={newObjective}
                onChangeText={setNewObjective}
                placeholder="Nouvel objectif..."
                containerStyle={{ flex: 1, marginBottom: 0 }}
              />
              <TouchableOpacity onPress={addObjectiveToQuest} style={styles.addObjBtn}>
                <Text style={styles.addObjBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
              {quests.find((q) => q.id === editingQuest.id) && (
                <Button label="Supprimer" variant="danger" onPress={handleDelete} style={{ flex: 1 }} />
              )}
              <Button label="Enregistrer" onPress={handleSave} style={{ flex: 1 }} />
            </View>
          </>
        )}
      </Modal>
    </View>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  statusTab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  statusTabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  statusCount: {
    fontSize: 10, fontWeight: '800', color: colors.textMuted,
    backgroundColor: colors.border, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: 80 },
  questCard: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.lg,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadows.small,
  },
  questStatusBar: { width: 4 },
  questContent: { flex: 1, padding: spacing.sm },
  questHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 8 },
  questTitle: { ...typography.h5, color: colors.text, marginBottom: 4 },
  questMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questDate: { ...typography.caption, color: colors.textMuted },
  questDesc: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 8, lineHeight: 18 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  progressBar: {
    flex: 1, height: 4, backgroundColor: colors.border,
    borderRadius: borderRadius.round, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: borderRadius.round },
  progressText: { ...typography.caption, color: colors.textMuted, minWidth: 30, textAlign: 'right' },
  rewardText: { ...typography.bodySmall, color: colors.gold, fontWeight: '600', marginBottom: 6 },
  quickActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  quickBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.round,
    backgroundColor: colors.success + '22', borderWidth: 1, borderColor: colors.success,
  },
  quickBtnFail: { backgroundColor: colors.error + '22', borderColor: colors.error },
  quickBtnText: { ...typography.bodySmall, color: colors.success, fontWeight: '700' },
  quickBtnFailText: { color: colors.error },
  dbQuestsBtn: {
    marginHorizontal: spacing.md, marginBottom: spacing.sm,
    backgroundColor: '#1A0010', borderRadius: borderRadius.lg,
    paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#FFD700',
  },
  dbQuestsBtnText: { color: '#FFD700', fontWeight: '700', fontSize: 14 },
  objectiveRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  objCheck: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  objCheckDone: { backgroundColor: colors.success, borderColor: colors.success },
  objCheckMark: { color: colors.background, fontSize: 11, fontWeight: '900' },
  objText: { ...typography.body, color: colors.text, flex: 1 },
  objTextDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  typeChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  typeChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  typeChipText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  typeChipTextActive: { color: colors.primary },
  editObjRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  addObjRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  addObjBtn: {
    width: 44, height: 44, borderRadius: borderRadius.round,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 0,
  },
  addObjBtnText: { color: colors.background, fontSize: 24, fontWeight: '700' },
});
