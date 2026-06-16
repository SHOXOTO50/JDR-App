import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../store';
import { addPlayer, updatePlayer, deletePlayer } from '../store/slices/playersSlice';
import { selectCharacter } from '../store/slices/charactersSlice';
import { Player, Character } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, getHPColor } from '../utils/helpers';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FAB } from '../components/common/FAB';
import { EmptyState } from '../components/common/EmptyState';

const PLAYER_COLORS = [colors.primary, colors.secondary, colors.success, colors.error, colors.mana, colors.warning];

export const MultiplayerScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeCampaignId = useAppSelector((s) => s.campaign.activeCampaignId);
  const activeCampaign = useAppSelector((s) =>
    s.campaign.campaigns.find((c) => c.id === s.campaign.activeCampaignId) ?? null
  );
  const currentCharacterId = useAppSelector((s) => s.characters.currentCharacterId);
  const characters = useAppSelector((s) => s.characters.characters);
  const players = useAppSelector((s) => s.players.players.filter((p) => p.campaignId === activeCampaignId));

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);

  const charById = (id?: string): Character | undefined => characters.find((c) => c.id === id);

  const openCreate = () => {
    setEditing({
      id: generateId(),
      campaignId: activeCampaignId ?? '',
      name: '',
      characterId: undefined,
      color: PLAYER_COLORS[players.length % PLAYER_COLORS.length],
      isGM: false,
      createdAt: new Date().toISOString(),
    });
    setModalVisible(true);
  };

  const openEdit = (p: Player) => {
    setEditing({ ...p });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!editing?.name.trim()) { Alert.alert('Nom requis', 'Indiquez le nom du joueur.'); return; }
    const exists = players.find((p) => p.id === editing.id);
    dispatch(exists ? updatePlayer(editing) : addPlayer(editing));
    setModalVisible(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!editing) return;
    dispatch(deletePlayer(editing.id));
    setModalVisible(false);
    setEditing(null);
  };

  const handlePlayAs = (p: Player) => {
    if (!p.characterId) {
      Alert.alert('Aucun personnage', 'Liez d\'abord un personnage à ce joueur.');
      return;
    }
    dispatch(selectCharacter(p.characterId));
    Alert.alert('Au tour de ' + p.name, 'Le personnage actif est maintenant celui de ' + p.name + '. Passez le téléphone !');
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>GROUPE · CAMPAGNE</Text>
        <Text style={styles.bannerName} numberOfLines={1}>🗺️ {activeCampaign?.name ?? '—'}</Text>
        <Text style={styles.bannerHint}>
          Jeu local sur un seul appareil : ajoutez les joueurs, liez leur personnage, puis passez le téléphone à tour de rôle.
        </Text>
      </View>

      <FlatList
        data={players}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const char = charById(item.characterId);
          const isCurrent = char && char.id === currentCharacterId;
          return (
            <View style={[styles.card, { borderColor: isCurrent ? item.color : colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: item.color + '22', borderColor: item.color }]}>
                  <Text style={styles.avatarText}>{item.isGM ? '👑' : '🧑'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.playerName}>{item.name}</Text>
                    {item.isGM && <Text style={styles.gmTag}>MJ</Text>}
                    {isCurrent && <Text style={[styles.currentTag, { color: item.color }]}>● actif</Text>}
                  </View>
                  {char ? (
                    <>
                      <Text style={styles.charName}>{char.name} · {char.characterClass} Niv.{char.level}</Text>
                      <Text style={[styles.charHP, { color: getHPColor(char.currentHP, char.maxHP) }]}>
                        ❤️ {char.currentHP}/{char.maxHP} PV · 🛡️ CA {char.armorClass}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.noChar}>Aucun personnage lié</Text>
                  )}
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>✏️ Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handlePlayAs(item)}
                  style={[styles.actionBtnPrimary, { backgroundColor: item.color }]}
                >
                  <Text style={styles.actionBtnPrimaryText}>🎮 Jouer</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="👥"
            title="Aucun joueur"
            subtitle="Ajoutez les membres du groupe et liez chacun à son personnage."
            actionLabel="Ajouter un joueur"
            onAction={openCreate}
          />
        }
      />

      <FAB onPress={openCreate} />

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editing && players.find((p) => p.id === editing.id) ? 'Modifier le joueur' : 'Nouveau joueur'}
      >
        {editing && (
          <>
            <Input
              label="Nom du joueur *"
              value={editing.name}
              onChangeText={(v) => setEditing({ ...editing, name: v })}
              placeholder="Alex, Marie..."
            />

            <Text style={styles.fieldLabel}>Rôle</Text>
            <View style={styles.selectRow}>
              <TouchableOpacity
                onPress={() => setEditing({ ...editing, isGM: false })}
                style={[styles.selectChip, !editing.isGM && styles.selectChipActive]}
              >
                <Text style={[styles.selectChipText, !editing.isGM && styles.selectChipTextActive]}>🧑 Joueur</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditing({ ...editing, isGM: true })}
                style={[styles.selectChip, editing.isGM && styles.selectChipActive]}
              >
                <Text style={[styles.selectChipText, editing.isGM && styles.selectChipTextActive]}>👑 Maître du Jeu</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Couleur</Text>
            <View style={styles.colorRow}>
              {PLAYER_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setEditing({ ...editing, color: c })}
                  style={[styles.colorDot, { backgroundColor: c }, editing.color === c && styles.colorDotActive]}
                />
              ))}
            </View>

            <Text style={styles.fieldLabel}>Personnage lié</Text>
            <View style={styles.selectRow}>
              <TouchableOpacity
                onPress={() => setEditing({ ...editing, characterId: undefined })}
                style={[styles.selectChip, !editing.characterId && styles.selectChipActive]}
              >
                <Text style={[styles.selectChipText, !editing.characterId && styles.selectChipTextActive]}>Aucun</Text>
              </TouchableOpacity>
              {characters.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setEditing({ ...editing, characterId: c.id })}
                  style={[styles.selectChip, editing.characterId === c.id && styles.selectChipActive]}
                >
                  <Text style={[styles.selectChipText, editing.characterId === c.id && styles.selectChipTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
              {players.find((p) => p.id === editing.id) && (
                <Button label="Supprimer" variant="danger" onPress={handleDelete} style={{ flex: 1 }} />
              )}
              <Button label="Enregistrer" onPress={handleSave} style={{ flex: 1 }} />
            </View>
          </>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  banner: {
    backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  bannerLabel: { ...typography.caption, color: colors.textMuted, letterSpacing: 1.5 },
  bannerName: { ...typography.h5, color: colors.secondary, marginTop: 2 },
  bannerHint: { ...typography.bodySmall, color: colors.textMuted, marginTop: 6, lineHeight: 17 },
  list: { padding: spacing.md, paddingBottom: 80 },
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, ...shadows.small,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 52, height: 52, borderRadius: borderRadius.round, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 24 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  playerName: { ...typography.h5, color: colors.text },
  gmTag: {
    ...typography.caption, color: colors.primary, fontWeight: '800',
    borderWidth: 1, borderColor: colors.primary, borderRadius: borderRadius.round,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  currentTag: { ...typography.caption, fontWeight: '800' },
  charName: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  charHP: { ...typography.bodySmall, fontWeight: '700', marginTop: 2 },
  noChar: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  actionBtn: {
    flex: 1, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center',
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  actionBtnText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '700' },
  actionBtnPrimary: { flex: 1, paddingVertical: 10, borderRadius: borderRadius.md, alignItems: 'center' },
  actionBtnPrimaryText: { ...typography.bodySmall, color: colors.background, fontWeight: '800' },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  selectChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  selectChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  selectChipText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  selectChipTextActive: { color: colors.primary },
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: spacing.md },
  colorDot: { width: 36, height: 36, borderRadius: borderRadius.round, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: colors.text },
});
