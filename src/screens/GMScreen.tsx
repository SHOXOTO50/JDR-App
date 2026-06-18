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
import { setCampaignGMNotes } from '../store/slices/campaignSlice';
import { useLan } from '../net/LanContext';
import { NetPlayer } from '../net/lanProtocol';
import { NPC, Monster, Faction, Location, NPCDisposition, LocationType } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import {
  generateId, getDispositionColor, getDispositionLabel, getLocationTypeLabel, getHPColor,
} from '../utils/helpers';
import { generateDungeon, GeneratedDungeon } from '../data/dungeonGenerator';
import { rollWeather, WeatherResult, SEASONS, REGIONS } from '../data/weatherTables';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FAB } from '../components/common/FAB';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';

type GMTab = 'npcs' | 'monsters' | 'factions' | 'locations' | 'notes' | 'tools' | 'group';

const TABS: { key: GMTab; label: string; icon: string }[] = [
  { key: 'npcs', label: 'PNJ', icon: '👤' },
  { key: 'monsters', label: 'Monstres', icon: '👹' },
  { key: 'factions', label: 'Factions', icon: '⚑' },
  { key: 'locations', label: 'Lieux', icon: '🏰' },
  { key: 'notes', label: 'Notes MJ', icon: '📝' },
  { key: 'tools', label: 'Outils', icon: '🧰' },
];

const GROUP_TAB: { key: GMTab; label: string; icon: string } = { key: 'group', label: 'Groupe', icon: '👥' };

const GroupOverview = ({ roster }: { roster: NetPlayer[] }) => {
  const players = roster.filter((p) => !p.isGM);
  if (players.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="Aucun joueur connecté"
        subtitle="Les joueurs connectés à votre partie LAN apparaîtront ici, avec leur fiche et leur inventaire."
      />
    );
  }
  return (
    <FlatList
      data={players}
      keyExtractor={(p) => p.peerId}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const c = item.character;
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.playerName}</Text>
                <Text style={styles.cardSubtitle}>
                  {c ? `${c.name} · ${c.characterClass} Niv.${c.level}` : 'Aucun personnage'}
                </Text>
              </View>
              {c && (
                <Text style={[styles.groupHP, { color: getHPColor(c.currentHP, c.maxHP) }]}>
                  ❤️ {c.currentHP}/{c.maxHP}
                </Text>
              )}
            </View>
            {c && (
              <Text style={styles.cardMeta}>🛡️ CA {c.armorClass}{c.conditions.length > 0 ? ` · ⚠️ ${c.conditions.join(', ')}` : ''}</Text>
            )}
            {c && c.inventory.length > 0 ? (
              <View style={styles.groupInventory}>
                {c.inventory.map((it) => (
                  <Text key={it.id} style={styles.groupItem}>
                    {it.equipped ? '🟢' : '⚪'} {it.name}{it.quantity > 1 ? ` ×${it.quantity}` : ''}
                  </Text>
                ))}
              </View>
            ) : c && (
              <Text style={styles.cardDesc}>Inventaire vide</Text>
            )}
          </View>
        );
      }}
    />
  );
};

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
  const lan = useLan();
  const gm = useAppSelector((s) => s.gm);
  const activeCampaignId = useAppSelector((s) => s.campaign.activeCampaignId);
  const activeCampaign = useAppSelector((s) =>
    s.campaign.campaigns.find((c) => c.id === s.campaign.activeCampaignId) ?? null
  );

  const showGroupTab = lan.mode === 'hosting';
  const visibleTabs = showGroupTab ? [...TABS, GROUP_TAB] : TABS;

  // GM content scoped to the active campaign
  const npcs = gm.npcs.filter((n) => n.campaignId === activeCampaignId);
  const monsters = gm.monsters.filter((m) => m.campaignId === activeCampaignId);
  const factions = gm.factions.filter((f) => f.campaignId === activeCampaignId);
  const locations = gm.locations.filter((l) => l.campaignId === activeCampaignId);

  const [activeTab, setActiveTab] = useState<GMTab>('npcs');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [notesDraft, setNotesDraft] = useState(activeCampaign?.gmNotes ?? '');
  const [dungeonResult, setDungeonResult] = useState<GeneratedDungeon | null>(null);
  const [weatherResult, setWeatherResult] = useState<WeatherResult | null>(null);
  const [weatherSeason, setWeatherSeason] = useState(0);
  const [weatherRegion, setWeatherRegion] = useState(0);

  const defaultNPC = (): NPC => ({
    id: generateId(), name: '', race: '', role: '', description: '',
    disposition: 'neutre', notes: '', campaignId: activeCampaignId ?? undefined,
    createdAt: new Date().toISOString(),
  });

  const defaultMonster = (): Monster => ({
    id: generateId(), name: '', type: '', cr: '1', hp: 10, ac: 10, speed: '9 m',
    stats: { FOR: 10, DEX: 10, CON: 10, INT: 10, SAG: 10, CHA: 10 },
    attacks: [], description: '', campaignId: activeCampaignId ?? undefined,
    createdAt: new Date().toISOString(),
  });

  const defaultFaction = (): Faction => ({
    id: generateId(), name: '', description: '', reputation: 0, notes: '',
    campaignId: activeCampaignId ?? undefined, createdAt: new Date().toISOString(),
  });

  const defaultLocation = (): Location => ({
    id: generateId(), name: '', type: 'ville', description: '', notes: '',
    campaignId: activeCampaignId ?? undefined, createdAt: new Date().toISOString(),
  });

  const openCreate = () => {
    const defaults: Record<string, () => any> = { npcs: defaultNPC, monsters: defaultMonster, factions: defaultFaction, locations: defaultLocation };
    setEditingItem(defaults[activeTab]());
    setModalVisible(true);
  };

  const openEdit = (item: any) => {
    setEditingItem({ ...item });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!editingItem?.name?.trim()) { Alert.alert('Nom requis'); return; }
    const lists: Record<string, any[]> = { npcs, monsters, factions, locations };
    const isNew = !lists[activeTab].find((i: any) => i.id === editingItem.id);

    const actions: Record<string, { add: any; update: any }> = {
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
          const delActions: Record<string, any> = { npcs: deleteNPC, monsters: deleteMonster, factions: deleteFaction, locations: deleteLocation };
          dispatch(delActions[activeTab](editingItem.id));
          setModalVisible(false);
          setEditingItem(null);
        },
      },
    ]);
  };

  const handleSaveNotes = () => {
    if (!activeCampaignId) return;
    dispatch(setCampaignGMNotes({ campaignId: activeCampaignId, notes: notesDraft }));
    Alert.alert('Notes enregistrées', 'Vos notes de MJ ont été sauvegardées.');
  };

  const data: Record<string, any[]> = { npcs, monsters, factions, locations };
  const currentData = data[activeTab] ?? [];

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

  const forms: Record<string, () => React.ReactNode> = {
    npcs: renderNPCForm,
    monsters: renderMonsterForm,
    factions: renderFactionForm,
    locations: renderLocationForm,
  };

  const tabTitles: Record<string, { create: string; edit: string }> = {
    npcs: { create: 'Nouveau PNJ', edit: 'Modifier PNJ' },
    monsters: { create: 'Nouveau Monstre', edit: 'Modifier Monstre' },
    factions: { create: 'Nouvelle Faction', edit: 'Modifier Faction' },
    locations: { create: 'Nouveau Lieu', edit: 'Modifier Lieu' },
  };

  const isEditing = editingItem && currentData.find((i: any) => i.id === editingItem.id);

  return (
    <View style={styles.container}>
      {/* Active campaign banner */}
      <View style={styles.campaignBanner}>
        <Text style={styles.campaignBannerLabel}>CAMPAGNE ACTIVE</Text>
        <Text style={styles.campaignBannerName} numberOfLines={1}>
          🗺️ {activeCampaign?.name ?? 'Aucune campagne'}
        </Text>
      </View>

      {/* Tabs */}
      <FlatList
        data={visibleTabs}
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
            {t.key !== 'notes' && t.key !== 'group' && (
              <View style={styles.gmTabBadge}>
                <Text style={styles.gmTabBadgeText}>{(data[t.key] ?? []).length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

      {activeTab === 'group' ? (
        <GroupOverview roster={lan.roster} />
      ) : activeTab === 'tools' ? (
        <ScrollView contentContainerStyle={styles.toolsContainer} showsVerticalScrollIndicator={false}>
          {/* Dungeon Generator */}
          <View style={styles.toolSection}>
            <Text style={styles.toolTitle}>🏚️ Générateur de Donjon</Text>
            <Button label="Générer un donjon" onPress={() => setDungeonResult(generateDungeon())} fullWidth />
            {dungeonResult && (
              <View style={styles.toolResult}>
                <Text style={styles.toolResultTitle}>{dungeonResult.title}</Text>
                <Text style={styles.toolResultSub}>{dungeonResult.entrance}</Text>
                {dungeonResult.rooms.map((room, i) => (
                  <View key={room.id} style={styles.dungeonRoom}>
                    <Text style={styles.dungeonRoomNum}>Salle {i + 1}</Text>
                    <Text style={styles.dungeonRoomName}>{room.isBossRoom ? '💀 ' : ''}{room.name}</Text>
                    <Text style={styles.dungeonRoomDesc}>{room.description}</Text>
                    {room.hasTrap && room.trap && <Text style={styles.dungeonTag}>⚠️ Piège: {room.trap.name} ({room.trap.difficulty})</Text>}
                    {room.hasTreasure && room.treasure && <Text style={styles.dungeonTag}>💰 Trésor: {room.treasure}</Text>}
                    {room.hasMonster && room.monster && <Text style={styles.dungeonTag}>👹 Monstre: {room.monster}</Text>}
                    {room.isBossRoom && room.bossName && (
                      <>
                        <Text style={[styles.dungeonTag, { color: colors.error, fontWeight: '700' }]}>👑 Boss: {room.bossName}</Text>
                        {room.bossReward && <Text style={styles.dungeonTag}>🏆 Récompense: {room.bossReward}</Text>}
                      </>
                    )}
                  </View>
                ))}
                <Text style={[styles.dungeonTag, { color: colors.secondary, marginTop: 4 }]}>🔍 Secret: {dungeonResult.secret}</Text>
              </View>
            )}
          </View>

          {/* Weather Generator */}
          <View style={styles.toolSection}>
            <Text style={styles.toolTitle}>🌦️ Générateur de Météo</Text>
            <Text style={styles.toolSubtitle}>Saison</Text>
            <View style={styles.pickerRow}>
              {SEASONS.map((s, i) => (
                <TouchableOpacity key={s.key} onPress={() => setWeatherSeason(i)}
                  style={[styles.pickerChip, weatherSeason === i && styles.pickerChipActive]}>
                  <Text style={[styles.pickerChipText, weatherSeason === i && styles.pickerChipTextActive]}>{s.icon} {s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.toolSubtitle}>Région</Text>
            <View style={styles.pickerRow}>
              {REGIONS.map((r, i) => (
                <TouchableOpacity key={r.key} onPress={() => setWeatherRegion(i)}
                  style={[styles.pickerChip, weatherRegion === i && styles.pickerChipActive]}>
                  <Text style={[styles.pickerChipText, weatherRegion === i && styles.pickerChipTextActive]}>{r.icon} {r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              label="Tirer la météo"
              onPress={() => setWeatherResult(rollWeather(SEASONS[weatherSeason].key, REGIONS[weatherRegion].key))}
              fullWidth
            />
            {weatherResult && (
              <View style={styles.toolResult}>
                <Text style={styles.weatherIcon}>{weatherResult.icon}</Text>
                <Text style={styles.weatherCondition}>{weatherResult.condition}</Text>
                <View style={styles.weatherDetails}>
                  <Text style={styles.weatherDetail}>🌡️ {weatherResult.temperature}</Text>
                  <Text style={styles.weatherDetail}>💨 {weatherResult.wind}</Text>
                  <Text style={styles.weatherDetail}>👁️ {weatherResult.visibility}</Text>
                </View>
                <Text style={styles.weatherEffect}>⚡ {weatherResult.effect}</Text>
                <Text style={styles.weatherAmbiance}>🎭 {weatherResult.ambiance}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : activeTab === 'notes' ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notesHint}>
            Notes privées du Maître du Jeu pour « {activeCampaign?.name ?? '—'} ». Intrigues, secrets, rebondissements...
          </Text>
          <Input
            value={notesDraft}
            onChangeText={setNotesDraft}
            multiline
            numberOfLines={14}
            placeholder="Écrivez vos notes de campagne ici..."
            containerStyle={{ flex: 0 }}
          />
          <Button label="Enregistrer les notes" onPress={handleSaveNotes} fullWidth />
        </View>
      ) : (
        <>
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
                subtitle="Créez des éléments pour enrichir cette campagne"
                actionLabel="Créer"
                onAction={openCreate}
              />
            }
          />
          <FAB onPress={openCreate} />
        </>
      )}

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={isEditing ? tabTitles[activeTab]?.edit : tabTitles[activeTab]?.create}
      >
        {forms[activeTab]?.()}
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
  campaignBanner: {
    backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  campaignBannerLabel: { ...typography.caption, color: colors.textMuted, letterSpacing: 1.5 },
  campaignBannerName: { ...typography.h5, color: colors.secondary, marginTop: 2 },
  tabList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  gmTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
    height: 40,
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
  notesContainer: { padding: spacing.md, gap: spacing.sm },
  notesHint: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 18, marginBottom: 4 },
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.small,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 8 },
  cardTitle: { ...typography.h5, color: colors.text, marginBottom: 2 },
  cardSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
  cardDesc: { ...typography.bodySmall, color: colors.textMuted, marginTop: 6, lineHeight: 18 },
  cardMeta: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  groupHP: { ...typography.bodySmall, fontWeight: '700' },
  groupInventory: { marginTop: spacing.sm, gap: 2 },
  groupItem: { ...typography.bodySmall, color: colors.textSecondary },
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
  toolsContainer: { padding: spacing.md, paddingBottom: 80, gap: spacing.lg },
  toolSection: { gap: spacing.sm },
  toolTitle: { ...typography.h5, color: colors.secondary, marginBottom: 4 },
  toolSubtitle: { ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginTop: 8 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  pickerChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  pickerChipActive: { borderColor: colors.secondary, backgroundColor: colors.secondary + '22' },
  pickerChipText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  pickerChipTextActive: { color: colors.secondary },
  toolResult: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, marginTop: spacing.sm,
  },
  toolResultTitle: { ...typography.h5, color: colors.primary, marginBottom: 4 },
  toolResultSub: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  dungeonRoom: {
    borderLeftWidth: 2, borderLeftColor: colors.border, paddingLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  dungeonRoomNum: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase' },
  dungeonRoomName: { ...typography.body, color: colors.text, fontWeight: '700', marginBottom: 2 },
  dungeonRoomDesc: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 4 },
  dungeonTag: { ...typography.bodySmall, color: colors.warning, marginTop: 2 },
  weatherIcon: { fontSize: 40, textAlign: 'center', marginBottom: 4 },
  weatherCondition: { ...typography.h4, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  weatherDetails: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.sm },
  weatherDetail: { ...typography.bodySmall, color: colors.textSecondary },
  weatherEffect: { ...typography.bodySmall, color: colors.warning, marginTop: 4 },
  weatherAmbiance: { ...typography.bodySmall, color: colors.secondary, marginTop: 2, fontStyle: 'italic' },
});
