import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S } from '../theme';
import { useAppSelector } from '../store/hooks';
import { ITEMS } from '../data/items';
import AppearView from '../components/anim/AppearView';
import type { ItemType } from '../types';

const FILTERS: { id: ItemType | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tout' }, { id: 'badge', label: 'Badges' },
  { id: 'relique', label: 'Reliques' }, { id: 'trophée', label: 'Trophées' },
  { id: 'cosmétique', label: 'Cosmétiques' }, { id: 'compagnon', label: 'Compagnons' },
];

export default function Inventory() {
  const unlocked = useAppSelector((s) => s.game.unlockedItems);
  const [filter, setFilter] = useState<ItemType | 'tous'>('tous');
  const list = filter === 'tous' ? ITEMS : ITEMS.filter((i) => i.type === filter);

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <View style={[S.spread, { padding: 16, paddingBottom: 8 }]}>
        <Text style={styles.brand}>🎒 Inventaire</Text>
        <View style={S.chip}><Text style={[S.chipText, S.chipGoldText]}>{unlocked.length}/{ITEMS.length}</Text></View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52 }} contentContainerStyle={styles.tabs}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f.id} style={[styles.tab, filter === f.id && styles.tabActive]} onPress={() => setFilter(f.id)}>
            <Text style={[styles.tabTxt, filter === f.id && styles.tabTxtActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[S.sm, { marginBottom: 14 }]}>Récompenses symboliques — aucun avantage payant.</Text>
        <View style={styles.grid}>
          {list.map((item, i) => {
            const has = unlocked.includes(item.id);
            const rarColor = (C.rarities as any)[item.rarity] ?? C.muted;
            return (
              <AppearView key={item.id} delay={Math.min(i, 12) * 30} from={14} style={styles.itemWrap}>
                <View style={[styles.itemCard, !has && styles.locked]}>
                  <Text style={{ fontSize: 34 }}>{has ? item.icon : '❔'}</Text>
                  <Text style={styles.itemName} numberOfLines={1}>{has ? item.name : '???'}</Text>
                  <Text style={[styles.rar, { color: rarColor }]}>{item.rarity}</Text>
                </View>
              </AppearView>
            );
          })}
        </View>

        <Text style={S.sectionTitle}>À débloquer</Text>
        {ITEMS.filter((i) => !unlocked.includes(i.id)).slice(0, 6).map((i) => {
          const rarColor = (C.rarities as any)[i.rarity] ?? C.muted;
          return (
            <View key={i.id} style={[S.card, { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 10, padding: 12, opacity: 0.7 }]}>
              <Text style={{ fontSize: 26 }}>{i.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={S.h3}>{i.name} <Text style={[S.xs, { color: rarColor }]}>· {i.rarity}</Text></Text>
                <Text style={S.sm}>{i.desc}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: { fontSize: 20, fontWeight: '900', color: C.text },
  tabs: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  tab: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border },
  tabActive: { borderColor: 'rgba(245,197,66,0.5)', backgroundColor: 'rgba(245,197,66,0.08)' },
  tabTxt: { fontSize: 12, fontWeight: '700', color: C.muted },
  tabTxtActive: { color: C.gold },
  scroll: { padding: 16, paddingBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  itemWrap: { width: '30%' },
  itemCard: { width: '100%', backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4 },
  locked: { opacity: 0.35 },
  itemName: { fontSize: 11, fontWeight: '700', color: C.text, textAlign: 'center' },
  rar: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
});
