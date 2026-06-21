import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S } from '../theme';
import { useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';
import { CLASSES } from '../data/classes';
import { STAT_LABELS } from '../types';

export default function Onboarding() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('aventurier');

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>⚔️</Text>
        <Text style={[S.h1, S.textCenter, styles.title]}>LifeQuest</Text>
        <Text style={[S.sm, S.textCenter, { marginBottom: 24 }]}>
          Transforme ta vie réelle en une véritable aventure.
        </Text>

        <View style={[S.card, { marginBottom: 16 }]}>
          <Text style={S.sectionTitle}>Ton nom de héros</Text>
          <TextInput
            style={S.input}
            placeholder="Ex : Lyra, Kael, ton prénom…"
            placeholderTextColor={C.muted}
            value={name}
            maxLength={20}
            onChangeText={setName}
          />
        </View>

        <Text style={S.sectionTitle}>Choisis ta classe</Text>
        {CLASSES.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.classCard, classId === c.id && styles.classCardSel]}
            onPress={() => setClassId(c.id)}
          >
            <Text style={styles.classIcon}>{c.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={S.h3}>{c.name}</Text>
              <Text style={S.sm}>{c.tagline}</Text>
              <Text style={[S.xs, { color: C.gold, marginTop: 4 }]}>
                {Object.entries(c.bonus).map(([k, v]) => `+${v} ${STAT_LABELS[k as keyof typeof STAT_LABELS]}`).join(' · ')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[S.btn, S.btnGold, { marginTop: 20, paddingVertical: 16 }]}
          onPress={() => dispatch(gameActions.createCharacter({ name, classId }))}
        >
          <Text style={[S.btnGoldText, { fontSize: 17 }]}>Commencer l'aventure →</Text>
        </TouchableOpacity>
        <Text style={[S.xs, S.textCenter, { marginTop: 12 }]}>
          Ta progression est sauvegardée sur cet appareil.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  logo: { fontSize: 60, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 34, marginBottom: 8 },
  classCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 14, marginBottom: 10,
    backgroundColor: C.bg2, borderWidth: 2, borderColor: C.border,
  },
  classCardSel: { borderColor: C.gold, backgroundColor: 'rgba(245,197,66,0.08)' },
  classIcon: { fontSize: 30 },
});
