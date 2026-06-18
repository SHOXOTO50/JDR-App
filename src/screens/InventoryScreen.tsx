import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import {
  addItem, updateItem, deleteItem, toggleEquipped, updateQuantity,
} from '../store/slices/inventorySlice';
import { InventoryItem, ItemCategory, ItemRarity } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { generateId, getRarityColor, getRarityLabel, getCategoryLabel } from '../utils/helpers';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FAB } from '../components/common/FAB';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { ThemedScreen } from '../components/ThemedScreen';

const CATEGORIES: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'arme', label: '⚔️ Armes' },
  { key: 'armure', label: '🛡️ Armures' },
  { key: 'consommable', label: '🧪 Consom.' },
  { key: 'magique', label: '✨ Magie' },
  { key: 'ressource', label: '💎 Res.' },
  { key: 'quete', label: '📜 Quête' },
  { key: 'autre', label: '📦 Autre' },
];

const RARITIES: ItemRarity[] = ['commun', 'peu_commun', 'rare', 'tres_rare', 'legendaire', 'artefact'];

const defaultItem = (characterId: string): InventoryItem => ({
  id: generateId(),
  characterId,
  name: '',
  description: '',
  quantity: 1,
  value: 0,
  weight: 0,
  rarity: 'commun',
  category: 'autre',
  equipped: false,
  notes: '',
  properties: [],
});

const ItemCard = ({
  item,
  onPress,
  onToggleEquip,
  onQuantityChange,
}: {
  item: InventoryItem;
  onPress: () => void;
  onToggleEquip: () => void;
  onQuantityChange: (d: number) => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.itemCard} activeOpacity={0.8}>
    <View style={[styles.rarityBar, { backgroundColor: getRarityColor(item.rarity) }]} />
    <View style={styles.itemContent}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.equipped && <Badge label="Équipé" color={colors.success} size="sm" />}
      </View>
      <View style={styles.itemMeta}>
        <Text style={styles.itemCategory}>{getCategoryLabel(item.category)}</Text>
        <Text style={styles.itemDot}>·</Text>
        <Text style={[styles.itemRarity, { color: getRarityColor(item.rarity) }]}>{getRarityLabel(item.rarity)}</Text>
        {item.damage && <><Text style={styles.itemDot}>·</Text><Text style={styles.itemDamage}>{item.damage}</Text></>}
      </View>
      {item.description ? <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text> : null}
      <View style={styles.itemFooter}>
        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.qBtn} onPress={() => onQuantityChange(-1)}>
            <Text style={styles.qBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qValue}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qBtn} onPress={() => onQuantityChange(1)}>
            <Text style={styles.qBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemStats}>
          {item.value > 0 && <Text style={styles.itemStat}>💰 {item.value}po</Text>}
          {item.weight > 0 && <Text style={styles.itemStat}>⚖️ {item.weight}kg</Text>}
        </View>
        {item.category === 'arme' || item.category === 'armure' ? (
          <TouchableOpacity onPress={onToggleEquip} style={[styles.equipBtn, item.equipped && styles.equipBtnActive]}>
            <Text style={[styles.equipBtnText, item.equipped && styles.equipBtnTextActive]}>
              {item.equipped ? '✓ Équipé' : 'Équiper'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);

const ItemForm = ({
  item,
  onChange,
}: {
  item: InventoryItem;
  onChange: (item: InventoryItem) => void;
}) => (
  <>
    <Input label="Nom *" value={item.name} onChangeText={(v) => onChange({ ...item, name: v })} placeholder="Épée longue, Potion de soin..." />
    <Input label="Description" value={item.description} onChangeText={(v) => onChange({ ...item, description: v })} multiline numberOfLines={3} />
    {item.category === 'arme' && (
      <Input label="Dégâts" value={item.damage ?? ''} onChangeText={(v) => onChange({ ...item, damage: v })} placeholder="1D8+3" />
    )}
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Input label="Quantité" value={String(item.quantity)} onChangeText={(v) => onChange({ ...item, quantity: parseInt(v) || 1 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
      <Input label="Valeur (po)" value={String(item.value)} onChangeText={(v) => onChange({ ...item, value: parseFloat(v) || 0 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
      <Input label="Poids (kg)" value={String(item.weight)} onChangeText={(v) => onChange({ ...item, weight: parseFloat(v) || 0 })} keyboardType="numeric" containerStyle={{ flex: 1 }} />
    </View>
    <Text style={styles.fieldLabel}>Catégorie</Text>
    <View style={styles.selectRow}>
      {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
        <TouchableOpacity
          key={cat.key}
          onPress={() => onChange({ ...item, category: cat.key as ItemCategory })}
          style={[styles.selectChip, item.category === cat.key && styles.selectChipActive]}
        >
          <Text style={[styles.selectChipText, item.category === cat.key && styles.selectChipTextActive]}>{cat.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <Text style={styles.fieldLabel}>Rareté</Text>
    <View style={styles.selectRow}>
      {RARITIES.map((r) => (
        <TouchableOpacity
          key={r}
          onPress={() => onChange({ ...item, rarity: r })}
          style={[styles.selectChip, { borderColor: item.rarity === r ? getRarityColor(r) : colors.border }, item.rarity === r && { backgroundColor: getRarityColor(r) + '22' }]}
        >
          <Text style={[styles.selectChipText, { color: item.rarity === r ? getRarityColor(r) : colors.textMuted }]}>{getRarityLabel(r)}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <Input label="Notes" value={item.notes} onChangeText={(v) => onChange({ ...item, notes: v })} multiline numberOfLines={2} />
  </>
);

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const InventoryScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const currentId = useAppSelector((s) => s.characters.currentCharacterId) ?? '';
  const allItems = useAppSelector((s) => s.inventory.items);
  const items = allItems.filter((i) => i.characterId === currentId);

  const [category, setCategory] = useState<ItemCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filtered = useMemo(() => {
    let list = items;
    if (category !== 'all') list = list.filter((i) => i.category === category);
    if (search) list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [items, category, search]);

  const totalWeight = items.reduce((s, i) => s + i.weight * i.quantity, 0);
  const totalValue = items.reduce((s, i) => s + i.value * i.quantity, 0);

  const openCreate = () => {
    setEditingItem(defaultItem(currentId));
    setModalVisible(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem({ ...item });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!editingItem) return;
    if (!editingItem.name.trim()) { Alert.alert('Champ requis', 'Le nom est obligatoire'); return; }
    if (items.find((i) => i.id === editingItem.id)) {
      dispatch(updateItem(editingItem));
    } else {
      dispatch(addItem(editingItem));
    }
    setModalVisible(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer cet objet ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => dispatch(deleteItem(id)) },
    ]);
  };

  return (
    <ThemedScreen>
    <View style={styles.container}>
      {/* Search + Library button */}
      <View style={styles.topBar}>
        <View style={[styles.searchBar, { flex: 1, margin: 0, marginRight: spacing.sm }]}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un objet..."
            placeholderTextColor={colors.textMuted}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearch}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EquipmentLibrary')} style={styles.libraryBtn}>
          <Text style={styles.libraryBtnText}>📚</Text>
          <Text style={styles.libraryBtnLabel}>Biblio.</Text>
        </TouchableOpacity>
      </View>

      {/* Category tabs */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(c) => c.key}
        contentContainerStyle={styles.catList}
        renderItem={({ item: cat }) => (
          <TouchableOpacity
            onPress={() => setCategory(cat.key)}
            style={[styles.catTab, category === cat.key && styles.catTabActive]}
          >
            <Text style={[styles.catTabText, category === cat.key && styles.catTabTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statBarText}>{filtered.length} objet{filtered.length !== 1 ? 's' : ''}</Text>
        <View style={styles.statBarRight}>
          <Text style={styles.statBarStat}>⚖️ {totalWeight.toFixed(1)} kg</Text>
          <Text style={styles.statBarStat}>💰 {totalValue} po</Text>
        </View>
      </View>

      {/* Items list */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => openEdit(item)}
            onToggleEquip={() => dispatch(toggleEquipped(item.id))}
            onQuantityChange={(d) => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + d }))}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🎒"
            title="Inventaire vide"
            subtitle="Ajoutez des objets à votre inventaire"
            actionLabel="Ajouter un objet"
            onAction={openCreate}
          />
        }
      />

      <FAB onPress={openCreate} />

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title={editingItem && items.find((i) => i.id === editingItem.id) ? 'Modifier l\'objet' : 'Nouvel objet'}>
        {editingItem && (
          <>
            <ItemForm item={editingItem} onChange={setEditingItem} />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              {items.find((i) => i.id === editingItem.id) && (
                <Button
                  label="Supprimer"
                  variant="danger"
                  onPress={() => { handleDelete(editingItem.id); setModalVisible(false); }}
                  style={{ flex: 1 }}
                />
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
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    margin: spacing.md, marginBottom: spacing.sm,
  },
  libraryBtn: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary + '22', borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.primary,
    paddingHorizontal: 10, paddingVertical: 4, minWidth: 52,
  },
  libraryBtnText: { fontSize: 18 },
  libraryBtnLabel: { ...typography.caption, color: colors.primary, fontWeight: '700', fontSize: 9 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 10, fontSize: 14 },
  clearSearch: { padding: 4 },
  clearSearchText: { color: colors.textMuted, fontSize: 14 },
  catList: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: 8 },
  catTab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
  },
  catTabActive: { backgroundColor: colors.primaryDark + '44', borderColor: colors.primary },
  catTabText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  catTabTextActive: { color: colors.primary },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  statBarText: { ...typography.bodySmall, color: colors.textMuted },
  statBarRight: { flexDirection: 'row', gap: 12 },
  statBarStat: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  list: { paddingHorizontal: spacing.md, paddingBottom: 80 },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.small,
  },
  rarityBar: { width: 4 },
  itemContent: { flex: 1, padding: spacing.sm },
  itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { ...typography.h5, color: colors.text, flex: 1, marginRight: 8 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4, gap: 4 },
  itemCategory: { ...typography.bodySmall, color: colors.textSecondary },
  itemDot: { color: colors.textMuted },
  itemRarity: { ...typography.bodySmall, fontWeight: '700' },
  itemDamage: { ...typography.bodySmall, color: colors.warning, fontWeight: '700' },
  itemDesc: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 8 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qBtn: {
    width: 28, height: 28, borderRadius: borderRadius.round,
    backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qBtnText: { color: colors.primary, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  qValue: { ...typography.body, color: colors.text, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  itemStats: { flexDirection: 'row', gap: 8 },
  itemStat: { ...typography.bodySmall, color: colors.textSecondary },
  equipBtn: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border,
  },
  equipBtnActive: { borderColor: colors.success, backgroundColor: colors.success + '22' },
  equipBtnText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  equipBtnTextActive: { color: colors.success },
  fieldLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8 },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  selectChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.round,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceVariant,
  },
  selectChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark + '33' },
  selectChipText: { ...typography.bodySmall, color: colors.textMuted, fontWeight: '600' },
  selectChipTextActive: { color: colors.primary },
});
