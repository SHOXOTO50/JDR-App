import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import {
  addNPC, updateNPC, deleteNPC,
  addMonster, updateMonster, deleteMonster,
  addFaction, updateFaction, deleteFaction, updateFactionReputation,
  addLocation, updateLocation, deleteLocation,
} from '../store/slices/gmSlice';
import { NPC, Monster, Faction, Location, NPCDisposition, LocationType } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import {
  generateId, formatDate, getDispositionColor, getDispositionLabel, getLocationTypeLabel,
} from '../utils/helpers';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FAB } from '../components/common/FAB';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';

type GMTab = 'npcs' | 'monsters' | 'factions' | 'locations';

const TABS: { key: GMTab; label: string; icon: string }[] = [
  { key: 'npcs', label: 'PNJ', icon: '👤' },
  { key: 'monsters', label: 'Monstres', icon: '👹' },
  { key: 'factions', label: 'Factions', icon: '⚑' },
  { key: 'locations', label: 'Lieux', icon: '🏰' },
];

const DISPOSITIONS: NPCDisposition[] = ['amical', 'neutre', 'hostile'];
const LOCATION_TYPES: LocationType[] = ['ville', 'donjon', 'village', 'royaume', 'foret', 'autre'];

const NPCCard = ({ npc, onPress }: { npc: NPC; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{npc.name}</Text>
        <Text style={styles.cardSubtitle}>{npc.race} · {npc.role}</Text>
      </View>
      <Badge label={getDispositionLabel(npc.disposition)} color={getDispositionColor(npc.disposition)} size="sm" />
    </View>
    {npc.description ? <Text style={styles.cardDesc} numberOfLines={2}>{npc.description}</Text> : null}
    {npc.location && <Text style={styles.cardMeta}>📍 {npc.location}</Text>}
  </TouchableOpacity>
);

const MonsterCard = ({ monster, onPress }: { monster: Monster; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{monster.name}</Text>
        <Text style={styles.cardSubtitle}>{monster.type}</Text>
      </View>
      <View style={styles.crBadge}>
        <Text style={styles.crLabel}>FP</Text>
        <Text style={styles.crValue}>{monster.cr}</Text>
      </View>
    </View>
    <View style={styles.monsterStats}>
      <Text style={styles.monsterStat}>❤️ {monster.hp} PV</Text>
      <Text style={styles.monsterStat}>🛡️ CA {monster.ac}</Text>
      <Text style={styles.monsterStat}>⚡ {monster.speed}</Text>
    </View>
    {monster.description ? <Text style={styles.cardDesc} numberOfLines={1}>{monster.description}</Text> : null}
  </TouchableOpacity>
);

const FactionCard = ({ faction, onPress, onReputationChange }: {
  faction: Faction;
  onPress: () => void;
  onReputationChange: (delta: number) => void;
}) => {
  const repColor = faction.reputation >= 50 ? colors.success : faction.reputation >= 0 ? colors.warning : colors.error;
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{faction.name}</Text>
          {faction.leader && <Text style={styles.cardSubtitle}>Chef: {faction.leader}</Text>}
        </View>
        <View style={styles.repContainer}>
          <Text style={[styles.repValue, { color: repColor }]}>{faction.reputation > 0 ? '+' : ''}{faction.reputation}</Text>
          <View style={styles.repButtons}>
            <TouchableOpacity onPress={() => onReputationChange(10)} style={styles.repBtn}>
              <Text style={{ color: colors.success, fontWeight: '700' }}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onReputationChange(-10)} style={styles.repBtn}>
              <Text style={{ color: colors.error, fontWeight: '700' }}>−</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.repBar}>
        <View style={[
          styles.repFill,
          {
            width: `${((faction.reputation + 100) / 200) * 100}%`,
            backgroundColor: repColor,
          }
        ]} />
        <View style={styles.repZero} />
      </View>
      {faction.description ? <Text style={styles.cardDesc} numberOfLines={2}>{faction.description}</Text> : null}
    </TouchableOpacity>
  );
};

const LocationCard = ({ location, onPress }: { location: Location; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{location.name}</Text>
        <Text style={styles.cardSubtitle}>{getLocationTypeLabel(location.type)}</Text>
      </View>
      {location.danger && <Badge label={`⚠️ ${location.danger}`} color={colors.warning} size="sm" />}
    </View>
    {location.description ? <Text style={styles.cardDesc} numberOfLines={2}>{location.description}</Text> : null}
    {location.inhabitants && <Text style={styles.cardMeta}>👥 {location.inhabitants}</Text>}
  </TouchableOpacity>
);

export const GMScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { npcs, monsters, factions, locations } = useAppSelector((s) => s.gm);

  const [activeTab, setActiveTab] = useState<GMTab>('npcs');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const defaultNPC = (): NPC => ({
    id: generateId(), name: '', race: '', role: '', description: '',
    disposition: 'neutre', notes: '', createdAt: new Date().toISOString(),
  });

  const defaultMonster = (): Monster => ({
    id: generateId(), name: '', type: '', cr: '1', hp: 10, ac: 10, speed: '9 m',
    stats: { FOR: 10, DEX: 10, CON: 10, INT: 10, SAG: 10, CHA: 10 },
    attacks: [], description: '', createdAt: new Date().toISOString(),
  });

  const defaultFaction = (): Faction => ({
    id: generateId(), name: '', description: '', reputation: 0, notes: '', createdAt: new Date().toISOString(),
  });

  const defaultLocation = (): Location => ({
    id: generateId(), name: '', type: 'ville', description: '', notes: '', createdAt: new Date().toISOString(),
  });

  const openCreate = () => {
    const defaults: Record<GMTab, () => any> = { npcs: defaultNPC, monsters: defaultMonster, factions: defaultFaction, locations: defaultLocation };
    setEditingItem(defaults[activeTab]());
    setModalVisible(true);
  };

  const openEdit = (item: any) => {
    setEditingItem({ ...item });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!editingItem?.name?.trim()) { Alert.alert('Nom requis'); return; }
    const isNew = !{
      npcs: npcs, monsters: monsters, factions: factions, locations: locations,
    }[activeTab].find((i: any) => i.id === editingItem.id);

    const actions: Record<GMTab, { add: any; update: any }> = {
      npcs: { add: addNPC, update: updateNPC },
      monsters: { add: addMonster, update: updateMonster },
      factions: { add: addFaction, update: updateFaction },
      locations: { add: addLocation, update: updateLocation },
    };
    dispatch(isNew ? actions[activeTab].add(editingItem) : actions[activeTab].update(editingItem));
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (!editingItem) return;
    Alert.alert('Supprimer', 'Supprimer cet élément ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: () => {
          const delActions: Record<GMTab, any> = { npcs: deleteNPC, monsters: deleteMonster, factions: deleteFaction, locations: deleteLocation };
          dispatch(delActions[activeTab](editingItem.id));
          setModalVisible(false);
          setEditingItem(null);
        },
      },
    ]);
  };

  const data: Record<GMTab, any[]> = { npcs, monsters, factions, locations };
  const currentData = data[activeTab];

  const renderNPCForm = () => editingItem && (
    <>
      <Input label="Nom *" value={editingItem.name} onChangeText={(v) => setEditingItem({ ...editingItem, name: v })} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Input label="Race" value={editingItem.race} onChangeText={(v) => setEditingItem({ ...editingItem, race: v })} containerStyle={{ flex: 1 }} />
        <Input label="Rôle" value={editingItem.role} onChangeText={(v) => setEditingItem({ ...editingItem, role: v })} containerStyle={{ flex: 1 }} />
      </View>
      <Input label="Localisation" value={editingItem.location ?? ''} onChangeText={(v) => setEditingItem({ ...editingItem, location: v })} />
      <Input label="Description" value={editingItem.description} onChangeText={(v) => setEditingItem({ ...editingItem, description: v })} multiline numberOfLines={3} />
      <Text style={styles.fieldLabel}>Disposition</Text>
      <View style={styles.selectRow}>
        {DISPOSITIONS.map((d) => (
          <TouchableOpacity key={d} onPress={() => setEditingItem({ ...editingItem, disposition: d })}
            style={[styles.selectChip, editingItem.disposition === d && { borderColor: getDispositionColor(d), backgroundColor: getDispositionColor(d) + '22' }]}>
            <Text style={[styles.selectChipText, editingItem.disposition === d && { color: getDispositionColor(d) }]}>{getDispositionLabel(d)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Input label="Notes" value={editingItem.notes} onChangeText={(v) => setEditingItem({ ...editingItem, notes: v })} multiline numberOfLines={2} />
    </>
  );

  const renderMonsterForm = () => editingItem && (
    <>
      <Input label="Nom *" value={editingItem.name} onChangeText={(v) => setEditingItem({ ...editingItem, name: v })} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Input label="Type" value={editingItem.type} onChangeText={(v) => setEditingItem({ ...editingItem, type: v })} containerStyle={{ flex: 1 }} />
        <Input label="FP / CR" value={editingItem.cr} onChangeText={(v) => setEditingItem({ ...editingItem, cr: v })} containerStyle={{ flex: 1 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Input label="PV" value={String(editingItem.hp)} onChangeText={(v) => setEditingItem({ ...editingItem, hp: parseInt(v) || 0 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
        <Input label="CA" value={String(editingItem.ac)} onChangeText={(v) => setEditingItem({ ...editingItem, ac: parseInt(v) || 0 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
        <Input label="Vitesse" value={editingItem.speed} onChangeText={(v) => setEditingItem({ ...editingItem, speed: v })} containerStyle={{ flex: 1 }} />
      </View>
      <Input label="Description" value={editingItem.description} onChangeText={(v) => setEditingItem({ ...editingItem, description: v })} multiline numberOfLines={3} />
    </>
  );

  const renderFactionForm = () => editingItem && (
    <>
      <Input label="Nom *" value={editingItem.name} onChangeText={(v) => setEditingItem({ ...editingItem, name: v })} />
      <Input label="Chef / Leader" value={editingItem.leader ?? ''} onChangeText={(v) => setEditingItem({ ...editingItem, leader: v })} />
      <Input label="Description" value={editingItem.description} onChangeText={(v) => setEditingItem({ ...editingItem, description: v })} multiline numberOfLines={3} />
      <Input label="Objectifs" value={editingItem.goals ?? ''} onChangeText={(v) => setEditingItem({ ...editingItem, goals: v })} multiline numberOfLines={2} />
      <Input label="Notes" value={editingItem.notes} onChangeText={(v) => setEditingItem({ ...editingItem, notes: v })} multiline numberOfLines={2} />
    </>
  );

  const renderLocationForm = () => editingItem && (
    <>
      <Input label="Nom *" value={editingItem.name} onChangeText={(v) => setEditingItem({ ...editingItem, name: v })} />
      <Text style={styles.fieldLabel}>Type</Text>
      <View style={styles.selectRow}>
        {LOCATION_TYPES.map((t) => (
          <TouchableOpacity key={t} onPress={() => setEditingItem({ ...editingItem, type: t })}
            style={[styles.selectChip, editingItem.type === t && styles.selectChipActive]}>
            <Text style={[styles.selectChipText, editingItem.type === t && styles.selectChipTextActive]}>{getLocationTypeLabel(t)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Input label="Description" value={editingItem.description} onChangeText={(v) => setEditingItem({ ...editingItem, description: v })} multiline numberOfLines={3} />
      <Input label="Habitants / Factions" value={editingItem.inhabitants ?? ''} onChangeText={(v) => setEditingItem({ ...editingItem, inhabitants: v })} />
      <Input label="Niveau de danger" value={editingItem.danger ?? ''} onChangeText={(v) => setEditingItem({ ...editingItem, danger: v })} placeholder="Faible, Moyen, Élevé..." />
      <Input label="Notes" value={editingItem.notes} onChangeText={(v) => setEditingItem({ ...editingItem, notes: v })} multiline numberOfLines={2} />
    </>
  );

  const forms: Record<GMTab, () => React.ReactNode> = {
    npcs: renderNPCForm,
    monsters: renderMonsterForm,
    factions: renderFactionForm,
    locations: renderLocationForm,
  };

  const tabTitles: Record<GMTab, { create: string; edit: string }> = {
    npcs: { create: 'Nouveau PNJ', edit: 'Modifier PNJ' },
    monsters: { create: 'Nouveau Monstre', edit: 'Modifier Monstre' },
    factions: { create: 'Nouvelle Faction', edit: 'Modifier Faction' },
    locations: { create: 'Nouveau Lieu', edit: 'Modifier Lieu' },
  };

  const isEditing = editingItem && currentData.find((i: any) => i.id === editingItem.id);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <FlatList
        data={TABS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t.key}
        contentContainerStyle={styles.tabList}
        renderItem={({ item: t }) => (
          <TouchableOpacity
            onPress={() => setActiveTab(t.key)}
            style={[styles.gmTab, activeTab === t.key && styles.gmTabActive]}
          >
            <Text style={styles.gmTabIcon}>{t.icon}</Text>
            <Text style={[styles.gmTabText, activeTab === t.key && styles.gmTabTextActive]}>{t.label}</Text>
            <View style={styles.gmTabBadge}>
              <Text style={styles.gmTabBadgeText}>{data[t.key].length}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={currentData}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          if (activeTab === 'npcs') return <NPCCard npc={item} onPress={() => openEdit(item)} />;
          if (activeTab === 'monsters') return <MonsterCard monster={item} onPress={() => openEdit(item)} />;
          if (activeTab === 'factions') return (
            <FactionCard
              faction={item}
              onPress={() => openEdit(item)}
              onReputationChange={(delta) => dispatch(updateFactionReputation({ id: item.id, reputation: item.reputation + delta }))}
            />
          );
          return <LocationCard location={item} onPress={() => openEdit(item)} />;
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={TABS.find((t) => t.key === activeTab)?.icon ?? '📜'}
            title={`Aucun ${activeTab === 'npcs' ? 'PNJ' : activeTab === 'monsters' ? 'monstre' : activeTab === 'factions' ? 'faction' : 'lieu'}`}
            subtitle="Créez des éléments pour enrichir votre monde"
            actionLabel="Créer"
            onAction={openCreate}
          />
        }
      />

      <FAB onPress={openCreate} />

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={isEditing ? tabTitles[activeTab].edit : tabTitles[activeTab].create}
      >
        {forms[activeTab]()}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
          {isEditing && <Button label="Supprimer" variant="danger" onPress={handleDelete} style={{ flex: 1 }} />}
          <Button label="Enregistrer" onPress={handleSave} style={{ flex: 1 }} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  gmTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  gmTabActive: { borderColor: colors.secondary, backgroundColor: colors.secondary + '22' },
  gmTabIcon: { fontSize: 16 },
  gmTabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  gmTabTextActive: { color: colors.secondary },
  gmTabBadge: {
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  gmTabBadgeText: { fontSize: 10, fontWeight: '800', color: colors.textMuted },
  list: { padding: spacing.md, paddingBottom: 80 },
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.small,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 8 },
  cardTitle: { ...typography.h5, color: colors.text, marginBottom: 2 },
  cardSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
  cardDesc: { ...typography.bodySmall, color: colors.textMuted, marginTop: 6, lineHeight: 18 },
  cardMeta: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  crBadge: {
    width: 44, height: 44, borderRadius: borderRadius.round,
    backgroundColor: colors.error + '22', borderWidth: 1, borderColor: colors.error,
    alignItems: 'center', justifyContent: 'center',
  },
  crLabel: { ...typography.caption, color: colors.error, fontSize: 8, textTransform: 'uppercase' },
  crValue: { fontSize: 14, fontWeight: '900', color: colors.error },
  monsterStats: { flexDirection: 'row', gap: 12, marginTop: 6 },
  monsterStat: { ...typography.bodySmall, color: colors.textSecondary },
  repContainer: { alignItems: 'center', gap: 4 },
  repValue: { fontSize: 18, fontWeight: '900' },
  repButtons: { flexDirection: 'row', gap: 8 },
  repBtn: {
    width: 28, height: 28, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  repBar: {
    height: 6, backgroundColor: colors.border, borderRadius: borderRadius.round,
    marginVertical: 8, position: 'relative', overflow: 'hidden',
  },
  repFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: borderRadius.round },
  repZero: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: colors.textMuted },
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
