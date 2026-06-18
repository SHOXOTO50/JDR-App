import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { addItem } from '../store/slices/inventorySlice';
import {
  EQUIPMENT_LIBRARY, CATEGORY_LABELS, RARITY_COLORS, CATEGORY_ICONS,
  ITEM_CATEGORIES_ORDER, LibraryItem, ItemCategory, Rarity,
} from '../data/equipmentLibrary';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId } from '../utils/helpers';

const RARITY_ORDER: Rarity[] = ['standard', 'commun', 'peu commun', 'rare', 'très rare', 'légendaire'];

export const EquipmentLibraryScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentId = useAppSelector((s) => s.characters.currentCharacterId);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [detailItem, setDetailItem] = useState<LibraryItem | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return EQUIPMENT_LIBRARY.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, selectedCategory, selectedRarity]);

  const rarityMap: Record<string, import('../types').ItemRarity> = {
    'standard': 'commun', 'commun': 'commun', 'peu commun': 'peu_commun',
    'rare': 'rare', 'très rare': 'tres_rare', 'légendaire': 'legendaire',
  };
  const categoryMap: Record<string, import('../types').ItemCategory> = {
    'arme_simple': 'arme', 'arme_martiale': 'arme',
    'armure_legere': 'armure', 'armure_moyenne': 'armure', 'armure_lourde': 'armure', 'bouclier': 'armure',
    'consommable': 'consommable', 'aventure': 'autre',
    'magique_commun': 'magique', 'magique_peu_commun': 'magique', 'magique_rare': 'magique',
    'magique_tres_rare': 'magique', 'magique_legendaire': 'magique',
  };

  const handleAdd = (item: LibraryItem) => {
    if (!currentId) { Alert.alert('Aucun personnage', 'Sélectionnez un personnage actif.'); return; }
    dispatch(addItem({
      id: generateId(),
      characterId: currentId,
      name: item.name,
      description: item.description + (item.damage ? ` Dégâts: ${item.damage}.` : '') + (item.ac ? ` CA: ${item.ac}.` : '') + (item.properties?.length ? ` Propriétés: ${item.properties.join(', ')}.` : ''),
      quantity: 1,
      weight: item.weight === '—' ? 0 : parseFloat(String(item.weight).replace(',', '.')) || 0,
      value: 0,
      rarity: rarityMap[item.rarity] ?? 'commun',
      equipped: false,
      category: categoryMap[item.category] ?? 'autre',
      damage: item.damage,
      notes: `Coût indicatif : ${item.cost}`,
      properties: item.properties ?? [],
    }));
    setAddedIds((prev) => new Set([...prev, item.id]));
    setDetailItem(null);
    Alert.alert('Ajouté !', `"${item.name}" ajouté à l'inventaire de votre personnage.`);
  };

  const usedCategories = useMemo(() => {
    const cats = new Set(filtered.map((i) => i.category));
    return ITEM_CATEGORIES_ORDER.filter((c) => cats.has(c));
  }, [filtered]);

  const rarityColor = (r: Rarity) => RARITY_COLORS[r] ?? colors.textMuted;

  const renderItem = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity onPress={() => setDetailItem(item)} style={styles.itemRow} activeOpacity={0.8}>
      <Text style={styles.itemIcon}>{CATEGORY_ICONS[item.category]}</Text>
      <View style={styles.itemInfo}>
        <View style={styles.itemNameRow}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.rarityDot, { color: rarityColor(item.rarity) }]}>●</Text>
        </View>
        <Text style={styles.itemMeta} numberOfLines={1}>
          {item.damage ? `${item.damage} · ` : ''}{item.ac ? `CA ${item.ac} · ` : ''}{item.cost}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleAdd(item)} style={[styles.addBtn, addedIds.has(item.id) && styles.addBtnDone]}>
        <Text style={styles.addBtnText}>{addedIds.has(item.id) ? '✓' : '+'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un objet..."
          placeholderTextColor={colors.textMuted}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Rarity filter */}
      <FlatList
        horizontal
        data={(['all', ...RARITY_ORDER] as const)}
        keyExtractor={(r) => r}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        renderItem={({ item: r }) => (
          <TouchableOpacity
            onPress={() => setSelectedRarity(r)}
            style={[styles.filterChip, selectedRarity === r && { borderColor: r === 'all' ? colors.primary : rarityColor(r as Rarity), backgroundColor: (r === 'all' ? colors.primary : rarityColor(r as Rarity)) + '22' }]}
          >
            <Text style={[styles.filterChipText, selectedRarity === r && { color: r === 'all' ? colors.primary : rarityColor(r as Rarity) }]}>
              {r === 'all' ? 'Toutes raretés' : r.charAt(0).toUpperCase() + r.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Category filter */}
      <FlatList
        horizontal
        data={(['all', ...ITEM_CATEGORIES_ORDER] as const)}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        renderItem={({ item: c }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(c)}
            style={[styles.filterChip, selectedCategory === c && styles.filterChipActive]}
          >
            <Text style={styles.filterChipIcon}>{c === 'all' ? '🔍' : CATEGORY_ICONS[c]}</Text>
            <Text style={[styles.filterChipText, selectedCategory === c && styles.filterChipTextActive]}>
              {c === 'all' ? 'Tout' : CATEGORY_LABELS[c].split(' ')[0]}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Count */}
      <Text style={styles.count}>{filtered.length} objet{filtered.length !== 1 ? 's' : ''}</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Aucun objet trouvé.</Text>}
      />

      {/* Detail modal */}
      <Modal visible={!!detailItem} transparent animationType="slide" onRequestClose={() => setDetailItem(null)}>
        {detailItem && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{detailItem.name}</Text>
                <TouchableOpacity onPress={() => setDetailItem(null)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.modalRarity, { color: rarityColor(detailItem.rarity) }]}>
                {CATEGORY_ICONS[detailItem.category]} {CATEGORY_LABELS[detailItem.category]} · {detailItem.rarity}
              </Text>
              <Text style={styles.modalDesc}>{detailItem.description}</Text>
              {detailItem.damage && <Text style={styles.modalStat}>⚔️ Dégâts : {detailItem.damage}</Text>}
              {detailItem.ac && <Text style={styles.modalStat}>🛡️ Classe d'armure : {detailItem.ac}</Text>}
              {detailItem.properties && detailItem.properties.length > 0 && (
                <Text style={styles.modalStat}>📋 Propriétés : {detailItem.properties.join(', ')}</Text>
              )}
              <Text style={styles.modalStat}>💰 Coût : {detailItem.cost}</Text>
              <Text style={styles.modalStat}>⚖️ Poids : {detailItem.weight}</Text>
              <TouchableOpacity onPress={() => handleAdd(detailItem)} style={[styles.modalAddBtn, addedIds.has(detailItem.id) && styles.addBtnDone]}>
                <Text style={styles.modalAddBtnText}>
                  {addedIds.has(detailItem.id) ? '✓ Ajouté à l\'inventaire' : '+ Ajouter à l\'inventaire'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: { flexDirection: 'row', alignItems: 'center', margin: spacing.md, gap: 8 },
  search: {
    flex: 1, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10,
    color: colors.text, fontSize: 14,
  },
  clearBtn: { padding: 8 },
  clearBtnText: { color: colors.textMuted, fontSize: 16 },
  filterScroll: { paddingHorizontal: spacing.md, paddingBottom: 8, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.card, borderRadius: borderRadius.round,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '22' },
  filterChipIcon: { fontSize: 12 },
  filterChipText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: colors.primary },
  count: { ...typography.caption, color: colors.textMuted, marginHorizontal: spacing.md, marginBottom: 4 },
  list: { paddingHorizontal: spacing.md, paddingBottom: 32 },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.card, borderRadius: borderRadius.lg,
    padding: spacing.sm, marginBottom: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  itemIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  itemInfo: { flex: 1 },
  itemNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemName: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  rarityDot: { fontSize: 12 },
  itemMeta: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  addBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary + '33', borderWidth: 1, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnDone: { backgroundColor: colors.success + '33', borderColor: colors.success },
  addBtnText: { color: colors.primary, fontWeight: '900', fontSize: 18 },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.xl },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border, maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  modalTitle: { ...typography.h4, color: colors.primary, flex: 1 },
  modalClose: { color: colors.textMuted, fontSize: 20, padding: 4 },
  modalRarity: { ...typography.bodySmall, fontWeight: '700', marginBottom: spacing.sm },
  modalDesc: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.sm },
  modalStat: { ...typography.bodySmall, color: colors.text, marginBottom: 4 },
  modalAddBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.lg,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.md,
  },
  modalAddBtnText: { ...typography.body, color: colors.background, fontWeight: '800' },
});
