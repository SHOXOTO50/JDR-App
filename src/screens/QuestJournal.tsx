import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S } from '../theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';
import QuestCard from '../components/QuestCard';
import type { QuestType, Difficulty, Quest } from '../types';

const TABS: { id: QuestType | 'toutes'; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'quotidienne', label: 'Quotidiennes' },
  { id: 'secondaire', label: 'Secondaires' },
  { id: 'principale', label: 'Principales' },
  { id: 'auto', label: 'Coach IA' },
];

export default function QuestJournal() {
  const quests = useAppSelector((s) => s.game.quests);
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<QuestType | 'toutes'>('toutes');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = tab === 'toutes' ? quests : quests.filter((q) => q.type === tab);
  const order: Record<QuestType, number> = { principale: 0, secondaire: 1, quotidienne: 2, auto: 3 };
  const sorted = [...filtered].sort((a, b) => order[a.type] - order[b.type]);

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <View style={styles.topbar}>
        <Text style={styles.brand}>📜 Quêtes</Text>
        <TouchableOpacity style={[S.btn, S.btnGold, { paddingHorizontal: 12, paddingVertical: 8 }]} onPress={() => setShowAdd(true)}>
          <Text style={S.btnGoldText}>+ Quête</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 52 }} contentContainerStyle={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.id} style={[styles.tab, tab === t.id && styles.tabActive]} onPress={() => setTab(t.id)}>
            <Text style={[styles.tabTxt, tab === t.id && styles.tabTxtActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {(tab === 'auto' || tab === 'toutes') && (
          <TouchableOpacity style={[S.btn, S.btnAccent, { marginBottom: 14 }]} onPress={() => dispatch(gameActions.generateAutoQuests())}>
            <Text style={S.btnAccentText}>🪄 Générer des quêtes (Coach IA)</Text>
          </TouchableOpacity>
        )}
        {sorted.length === 0 && <Text style={[S.sm, S.textCenter]}>Aucune quête. Crées-en une !</Text>}
        {sorted.map((q) => <QuestCard key={q.id} quest={q} />)}
      </ScrollView>

      <AddQuestModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(q) => dispatch(gameActions.addCustomQuest(q))}
      />
    </SafeAreaView>
  );
}

function AddQuestModal({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (q: Omit<Quest, 'id'>) => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('moyenne');
  const [type, setType] = useState<QuestType>('secondaire');
  const xpByDiff: Record<Difficulty, number> = { facile: 15, moyenne: 35, difficile: 60, épique: 120 };

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ type, title: title.trim(), desc: desc.trim() || 'Quête personnelle.', difficulty, xp: xpByDiff[difficulty], statRewards: { discipline: 1 }, repeatable: type === 'quotidienne' });
    setTitle(''); setDesc(''); onClose();
  };

  const DIFFS: Difficulty[] = ['facile', 'moyenne', 'difficile', 'épique'];
  const TYPES: { id: QuestType; label: string }[] = [
    { id: 'quotidienne', label: 'Quotidienne' }, { id: 'secondaire', label: 'Secondaire' }, { id: 'principale', label: 'Principale' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[S.flex1, { backgroundColor: C.bg, padding: 20 }]}>
        <View style={[S.spread, { marginBottom: 20 }]}>
          <Text style={S.h2}>Nouvelle quête</Text>
          <TouchableOpacity onPress={onClose}><Text style={{ color: C.muted, fontSize: 22 }}>✕</Text></TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput style={[S.input, { marginBottom: 12 }]} placeholder="Titre" placeholderTextColor={C.muted} value={title} onChangeText={setTitle} />
          <TextInput style={[S.input, { marginBottom: 12, minHeight: 70 }]} placeholder="Description (optionnel)" placeholderTextColor={C.muted} value={desc} onChangeText={setDesc} multiline />

          <Text style={S.sectionTitle}>Type</Text>
          <View style={[S.row, { gap: 8, marginBottom: 12 }]}>
            {TYPES.map((t) => (
              <TouchableOpacity key={t.id} style={[styles.pill, type === t.id && styles.pillActive]} onPress={() => setType(t.id)}>
                <Text style={[styles.pillTxt, type === t.id && { color: C.gold }]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={S.sectionTitle}>Difficulté</Text>
          <View style={[S.row, { gap: 8, marginBottom: 20 }]}>
            {DIFFS.map((d) => (
              <TouchableOpacity key={d} style={[styles.pill, difficulty === d && styles.pillActive]} onPress={() => setDifficulty(d)}>
                <Text style={[styles.pillTxt, difficulty === d && { color: C.gold }]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[S.btn, S.btnGold]} onPress={submit}>
            <Text style={S.btnGoldText}>Ajouter la quête</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  brand: { fontSize: 20, fontWeight: '900', color: C.text },
  tabs: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border },
  tabActive: { borderColor: 'rgba(245,197,66,0.5)', backgroundColor: 'rgba(245,197,66,0.08)' },
  tabTxt: { fontSize: 13, fontWeight: '700', color: C.muted },
  tabTxtActive: { color: C.gold },
  list: { padding: 16, paddingTop: 4, paddingBottom: 32 },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border },
  pillActive: { borderColor: 'rgba(245,197,66,0.5)', backgroundColor: 'rgba(245,197,66,0.08)' },
  pillTxt: { fontSize: 13, fontWeight: '700', color: C.muted },
});
