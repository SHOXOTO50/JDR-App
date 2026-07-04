import { useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { C, S } from '../theme';
import { useGame, useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';
import { CLASSES, TITLES } from '../data/classes';
import { xpToNext } from '../engine/xp';
import XPBar from '../components/XPBar';
import CoachCard from '../components/CoachCard';
import QuestCard from '../components/QuestCard';
import AppearView from '../components/anim/AppearView';
import Bouncy from '../components/anim/Bouncy';
import Pulse from '../components/anim/Pulse';

function today() { return new Date().toISOString().slice(0, 10); }

export default function Dashboard() {
  const s = useGame();
  const dispatch = useAppDispatch();
  const nav = useNavigation<any>();
  const cls = CLASSES.find((c) => c.id === s.classId) ?? CLASSES[0];
  const title = TITLES.find((t) => t.id === s.titleId);
  const dailies = s.quests.filter((q) => q.type === 'quotidienne' && (!q.nsfw || s.sexMode));
  const doneToday = dailies.filter((q) => s.questProgress[q.id]?.lastDone === today()).length;

  // Easter egg : 7 taps rapides sur le logo → mode Alcôve 🔞.
  const taps = useRef({ count: 0, last: 0 });
  const onBrandTap = () => {
    const now = Date.now();
    taps.current.count = now - taps.current.last < 1500 ? taps.current.count + 1 : 1;
    taps.current.last = now;
    if (taps.current.count >= 7) {
      taps.current.count = 0;
      dispatch(gameActions.unlockSexMode());
    }
  };

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppearView delay={0}>
          <View style={[S.spread, { marginBottom: 14 }]}>
            <TouchableOpacity activeOpacity={0.9} onPress={onBrandTap}>
              <Text style={styles.brand}>⚔️ LifeQuest{s.sexMode ? ' 🔞' : ''}</Text>
            </TouchableOpacity>
            <Bouncy style={S.chip} onPress={() => nav.navigate('Stats')}>
              <Text style={[S.chipText, S.chipGoldText]}>🔥 {s.bestStreak}j · ⭐ {s.reputation}</Text>
            </Bouncy>
          </View>
        </AppearView>

        <AppearView delay={60}>
          <View style={S.card}>
            <View style={S.row}>
              <Pulse to={1.04} duration={1400}>
                <View style={styles.avatar}><Text style={{ fontSize: 40 }}>{cls.icon}</Text></View>
              </Pulse>
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
        </AppearView>

        <View style={{ height: 14 }} />
        <AppearView delay={120}>
          <CoachCard />
        </AppearView>

        <AppearView delay={180}>
          <Text style={S.sectionTitle}>Quêtes du jour — {doneToday}/{dailies.length}</Text>
        </AppearView>
        {dailies.map((q, i) => (
          <AppearView key={q.id} delay={220 + Math.min(i, 8) * 45}>
            <QuestCard quest={q} />
          </AppearView>
        ))}

        <AppearView delay={300}>
          <View style={[S.row, { gap: 10, marginTop: 8 }]}>
            <Bouncy style={[S.btn, S.btnAccent, { flex: 1 }]} onPress={() => nav.navigate('Quêtes')}>
              <Text style={S.btnAccentText}>📜 Toutes les quêtes</Text>
            </Bouncy>
            <Bouncy style={[S.btn, { flex: 1 }]} onPress={() => nav.navigate('Monde')}>
              <Text style={S.btnText}>🗺️ Mon royaume</Text>
            </Bouncy>
          </View>
        </AppearView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  brand: { fontSize: 20, fontWeight: '900', color: C.text },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: C.panel2, borderWidth: 3, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
});
