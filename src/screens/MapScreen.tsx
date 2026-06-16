import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Pressable,
  LayoutChangeEvent, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppSelector, useAppDispatch } from '../store';
import {
  addMap, deleteMap, addMarker, updateMarker, removeMarker,
} from '../store/slices/mapsSlice';
import { GameMap, MapMarker } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId } from '../utils/helpers';
import { MAP_PRESETS, MapPreset, resolvePresetUri } from '../data/mapPresets';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

const MARKER_COLORS = [colors.error, colors.primary, colors.secondary, colors.success, colors.mana, colors.warning];
const MARKER_ICONS = ['📍', '⚔️', '💀', '🏰', '💰', '🚪', '⭐', '🔥', '🛖', '👹', '❓', '🗝️'];

export const MapScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeCampaignId = useAppSelector((s) => s.campaign.activeCampaignId);
  const activeCampaign = useAppSelector((s) =>
    s.campaign.campaigns.find((c) => c.id === s.campaign.activeCampaignId) ?? null
  );
  const maps = useAppSelector((s) => s.maps.maps.filter((m) => m.campaignId === activeCampaignId));

  const [selectedMapId, setSelectedMapId] = useState<string | null>(maps[0]?.id ?? null);
  const [addMode, setAddMode] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 1, height: 1 });
  const [markerModal, setMarkerModal] = useState(false);
  const [editingMarker, setEditingMarker] = useState<MapMarker | null>(null);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [newMapModal, setNewMapModal] = useState(false);

  const selectedMap = maps.find((m) => m.id === selectedMapId) ?? maps[0] ?? null;

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission requise', 'Autorisez l\'accès aux photos pour importer une carte.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (res.canceled || !res.assets?.length) return;
    if (!activeCampaignId) return;
    const newMap: GameMap = {
      id: generateId(),
      campaignId: activeCampaignId,
      name: `Carte ${maps.length + 1}`,
      imageUri: res.assets[0].uri,
      markers: [],
      createdAt: new Date().toISOString(),
    };
    dispatch(addMap(newMap));
    setSelectedMapId(newMap.id);
    setNewMapModal(false);
  };

  const pickPreset = (preset: MapPreset) => {
    if (!activeCampaignId) return;
    const newMap: GameMap = {
      id: generateId(),
      campaignId: activeCampaignId,
      name: preset.name,
      imageUri: resolvePresetUri(preset.source),
      markers: [],
      createdAt: new Date().toISOString(),
    };
    dispatch(addMap(newMap));
    setSelectedMapId(newMap.id);
    setNewMapModal(false);
  };

  const handleImagePress = (e: any) => {
    if (!addMode || !selectedMap) return;
    const { locationX, locationY } = e.nativeEvent;
    const x = Math.max(0, Math.min(1, locationX / imgSize.width));
    const y = Math.max(0, Math.min(1, locationY / imgSize.height));
    setPendingPos({ x, y });
    setEditingMarker({ id: generateId(), x, y, label: '', color: MARKER_COLORS[0], icon: MARKER_ICONS[0] });
    setMarkerModal(true);
  };

  const handleSaveMarker = () => {
    if (!selectedMap || !editingMarker) return;
    const exists = selectedMap.markers.find((m) => m.id === editingMarker.id);
    if (exists) {
      dispatch(updateMarker({ mapId: selectedMap.id, marker: editingMarker }));
    } else {
      dispatch(addMarker({ mapId: selectedMap.id, marker: editingMarker }));
    }
    setMarkerModal(false);
    setEditingMarker(null);
    setPendingPos(null);
    setAddMode(false);
  };

  const handleDeleteMarker = () => {
    if (!selectedMap || !editingMarker) return;
    dispatch(removeMarker({ mapId: selectedMap.id, markerId: editingMarker.id }));
    setMarkerModal(false);
    setEditingMarker(null);
  };

  const handleDeleteMap = () => {
    if (!selectedMap) return;
    Alert.alert('Supprimer la carte', `Supprimer « ${selectedMap.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: () => {
          dispatch(deleteMap(selectedMap.id));
          const remaining = maps.filter((m) => m.id !== selectedMap.id);
          setSelectedMapId(remaining[0]?.id ?? null);
        },
      },
    ]);
  };

  const onImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setImgSize({ width, height });
  };

  const renderNewMapModal = () => (
    <Modal visible={newMapModal} onClose={() => setNewMapModal(false)} title="Nouvelle carte">
      <Button label="📷 Importer une photo" onPress={pickImage} fullWidth />
      <Text style={styles.presetsLabel}>Ou choisissez un modèle</Text>
      <View style={styles.presetsGrid}>
        {MAP_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            onPress={() => pickPreset(preset)}
            style={styles.presetCard}
            activeOpacity={0.8}
          >
            <Image source={preset.source} style={styles.presetThumb} resizeMode="cover" />
            <Text style={styles.presetName} numberOfLines={2}>{preset.icon} {preset.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );

  if (maps.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerLabel}>CAMPAGNE</Text>
          <Text style={styles.bannerName} numberOfLines={1}>🗺️ {activeCampaign?.name ?? '—'}</Text>
        </View>
        <EmptyState
          icon="🗺️"
          title="Aucune carte"
          subtitle="Importez une image ou choisissez un modèle de donjon/ville et placez des marqueurs dessus."
          actionLabel="Ajouter une carte"
          onAction={() => setNewMapModal(true)}
        />
        {renderNewMapModal()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>CAMPAGNE</Text>
        <Text style={styles.bannerName} numberOfLines={1}>🗺️ {activeCampaign?.name ?? '—'}</Text>
      </View>

      {/* Map selector */}
      <FlatList
        data={maps}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.mapTabs}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedMapId(item.id)}
            style={[styles.mapTab, selectedMap?.id === item.id && styles.mapTabActive]}
          >
            <Text style={[styles.mapTabText, selectedMap?.id === item.id && styles.mapTabTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity onPress={() => setNewMapModal(true)} style={styles.addMapTab}>
            <Text style={styles.addMapText}>+ Carte</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.mapScroll} maximumZoomScale={3} minimumZoomScale={1}>
        {selectedMap && (
          <Pressable onPress={handleImagePress}>
            <Image
              source={{ uri: selectedMap.imageUri }}
              style={styles.mapImage}
              resizeMode="contain"
              onLayout={onImageLayout}
            />
            {selectedMap.markers.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => { setEditingMarker({ ...m }); setMarkerModal(true); }}
                style={[
                  styles.marker,
                  {
                    left: m.x * imgSize.width - 16,
                    top: m.y * imgSize.height - 16,
                    borderColor: m.color,
                    backgroundColor: m.color + '33',
                  },
                ]}
              >
                <Text style={styles.markerIcon}>{m.icon}</Text>
                {m.label ? <Text style={[styles.markerLabel, { color: m.color }]} numberOfLines={1}>{m.label}</Text> : null}
              </TouchableOpacity>
            ))}
          </Pressable>
        )}
      </ScrollView>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => setAddMode((v) => !v)}
          style={[styles.toolBtn, addMode && styles.toolBtnActive]}
        >
          <Text style={[styles.toolBtnText, addMode && styles.toolBtnTextActive]}>
            {addMode ? '✓ Touchez la carte' : '📍 Ajouter un marqueur'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteMap} style={styles.toolBtnDanger}>
          <Text style={styles.toolBtnDangerText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={markerModal}
        onClose={() => { setMarkerModal(false); setAddMode(false); }}
        title={editingMarker && selectedMap?.markers.find((m) => m.id === editingMarker.id) ? 'Modifier le marqueur' : 'Nouveau marqueur'}
      >
        {editingMarker && (
          <>
            <Input
              label="Nom du lieu / note"
              value={editingMarker.label}
              onChangeText={(v) => setEditingMarker({ ...editingMarker, label: v })}
              placeholder="Entrée du donjon, Piège, Trésor..."
            />
            <Text style={styles.fieldLabel}>Icône</Text>
            <View style={styles.iconRow}>
              {MARKER_ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setEditingMarker({ ...editingMarker, icon: ic })}
                  style={[styles.iconChip, editingMarker.icon === ic && styles.iconChipActive]}
                >
                  <Text style={styles.iconChipText}>{ic}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Couleur</Text>
            <View style={styles.colorRow}>
              {MARKER_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setEditingMarker({ ...editingMarker, color: c })}
                  style={[styles.colorDot, { backgroundColor: c }, editingMarker.color === c && styles.colorDotActive]}
                />
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.md }}>
              {selectedMap?.markers.find((m) => m.id === editingMarker.id) && (
                <Button label="Supprimer" variant="danger" onPress={handleDeleteMarker} style={{ flex: 1 }} />
              )}
              <Button label="Enregistrer" onPress={handleSaveMarker} style={{ flex: 1 }} />
            </View>
          </>
        )}
      </Modal>

      {renderNewMapModal()}
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
  mapTabs: { padding: spacing.sm, gap: 8 },
  mapTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  mapTabActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  mapTabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  mapTabTextActive: { color: colors.primary },
  addMapTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.round,
    backgroundColor: colors.secondary + '22', borderWidth: 1, borderColor: colors.secondary,
  },
  addMapText: { ...typography.bodySmall, color: colors.secondary, fontWeight: '700' },
  mapScroll: { flexGrow: 1, justifyContent: 'center' },
  mapImage: { width: '100%', aspectRatio: 1, backgroundColor: colors.surface },
  marker: {
    position: 'absolute', minWidth: 32, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4, paddingVertical: 2, borderRadius: borderRadius.md, borderWidth: 2,
  },
  markerIcon: { fontSize: 18 },
  markerLabel: { ...typography.caption, fontWeight: '800', maxWidth: 90 },
  toolbar: {
    flexDirection: 'row', gap: 8, padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface,
  },
  toolBtn: {
    flex: 1, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center',
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  toolBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  toolBtnText: { ...typography.body, color: colors.textSecondary, fontWeight: '700' },
  toolBtnTextActive: { color: colors.primary },
  toolBtnDanger: {
    width: 52, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center',
    backgroundColor: colors.error + '22', borderWidth: 1, borderColor: colors.error,
  },
  toolBtnDangerText: { fontSize: 18 },
  presetsLabel: {
    ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1,
    marginTop: spacing.lg, marginBottom: spacing.sm, textAlign: 'center',
  },
  presetsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between' },
  presetCard: {
    width: '48%', backgroundColor: colors.card, borderRadius: borderRadius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm,
  },
  presetThumb: { width: '100%', aspectRatio: 1, backgroundColor: colors.surface },
  presetName: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', padding: spacing.sm },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  iconChip: {
    width: 44, height: 44, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  iconChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  iconChipText: { fontSize: 22 },
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: spacing.md },
  colorDot: { width: 36, height: 36, borderRadius: borderRadius.round, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: colors.text },
});
