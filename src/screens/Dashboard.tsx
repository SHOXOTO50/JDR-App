import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { C, S } from '../theme';
import { useGame } from '../store/gameStore';
import { CLASSES, TITLES } from '../data/classes';
import { xpToNext } from '../engine/xp';
import XPBar from '../components/XPBar';
import CoachCard from '../components/CoachCard';
import QuestCard from '../components/QuestCard';

function today() { return new Date().toISOString().slice(0, 10); }

export default function Dashboard() {
  const s = useGame();
  const nav = useNavigation<any>();
  const cls = CLASSES.find((c) => c.id === s.classId) ?? CLASSES[0];
  const title = TITLES.find((t) => t.id === s.titleId);
  const dailies = s.quests.filter((q) => q.type === 'quotidienne');
  const doneToday = dailies.filter((q) => s.questProgress[q.id]?.lastDone === today()).length;

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Topbar */}
        <View style={[S.spread, { marginBottom: 14 }]}>
          <Text style={styles.brand}>⚔️ LifeQuest</Text>
          <TouchableOpacity style={S.chip} onPress={() => nav.navigate('Stats')}>
            <Text style={[S.chipText, S.chipGoldText]}>🔥 {s.bestStreak}j · ⭐ {s.reputation}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <View style={S.card}>
          <View style={S.row}>
            <View style={styles.avatar}><Text style={{ fontSize: 40 }}>{cls.icon}</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={S.spread}>
                <Text style={S.h2}>{s.name}</Text>
                <View style={[S.chip, { borderColor: 'rgba(245,197,66,0.4)' }]}>
                  <Text style={[S.chipText, S.chipGoldText]}>Niv. {s.level}</Text>
                </View>
              </View>
              <Text style={S.sm}>{title?.name} · {cls.name}</Text>
              <View style={{ marginTop: 10, gap: 4 }}>
                <XPBar value={s.xp} max={xpToNext(s.level)} />
                <Text style={S.xs}>{s.xp} / {xpToNext(s.level)} XP</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 14 }} />
        <CoachCard />

        <Text style={S.sectionTitle}>Quêtes du jour — {doneToday}/{dailies.length}</Text>
        {dailies.map((q) => <QuestCard key={q.id} quest={q} />)}

        <View style={[S.row, { gap: 10, marginTop: 8 }]}>
          <TouchableOpacity style={[S.btn, S.btnAccent, { flex: 1 }]} onPress={() => nav.navigate('Quêtes')}>
            <Text style={S.btnAccentText}>📜 Toutes les quêtes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[S.btn, { flex: 1 }]} onPress={() => nav.navigate('Monde')}>
            <Text style={S.btnText}>🗺️ Mon royaume</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  brand: { fontSize: 20, fontWeight: '900', color: C.text },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: C.panel2, borderWidth: 3, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
});
