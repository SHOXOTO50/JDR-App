import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, S } from '../theme';
import { useAppSelector } from '../store/hooks';
import { WORLD_NODES } from '../data/world';
import AppearView from '../components/anim/AppearView';
import Pulse from '../components/anim/Pulse';

export default function WorldMap() {
  const level = useAppSelector((s) => s.game.level);
  const unlockedCount = WORLD_NODES.filter((n) => level >= n.unlockLevel).length;
  const next = WORLD_NODES.find((n) => level < n.unlockLevel);

  return (
    <SafeAreaView style={[S.flex1, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={S.spread}>
          <Text style={styles.brand}>🗺️ Mon royaume</Text>
          <View style={S.chip}><Text style={[S.chipText, S.chipGoldText]}>{unlockedCount}/{WORLD_NODES.length}</Text></View>
        </View>
        <Text style={[S.sm, { marginBottom: 14 }]}>Ton monde grandit à chaque niveau franchi.</Text>

        <AppearView delay={0}>
        <View style={styles.mapContainer}>
          {WORLD_NODES.map((n) => {
            const unlocked = level >= n.unlockLevel;
            const isLatest = unlocked && !WORLD_NODES.some((m) => m.unlockLevel > n.unlockLevel && level >= m.unlockLevel);
            const node = (
              <>
                <Text style={styles.nodeIcon}>{unlocked ? n.icon : '🔒'}</Text>
                <Text style={styles.nodeLabel}>{unlocked ? n.name : `Niv.${n.unlockLevel}`}</Text>
              </>
            );
            return (
              <View key={n.id} style={[styles.node, { left: `${n.x}%` as any, top: `${n.y}%` as any }, !unlocked && styles.nodeLocked]}>
                {isLatest ? <Pulse to={1.15} duration={800} style={{ alignItems: 'center' }}>{node}</Pulse> : node}
              </View>
            );
          })}
        </View>
        </AppearView>

        {next && (
          <View style={[S.card, { marginBottom: 14 }]}>
            <Text style={S.xs}>Prochain déblocage</Text>
            <View style={[S.spread, { marginTop: 4 }]}>
              <Text style={S.h3}>{next.icon} {next.name}</Text>
              <View style={S.chip}><Text style={S.chipText}>Niveau {next.unlockLevel}</Text></View>
            </View>
            <Text style={[S.sm, { marginTop: 6 }]}>{next.desc}</Text>
          </View>
        )}

        <Text style={S.sectionTitle}>Lieux découverts</Text>
        {WORLD_NODES.filter((n) => level >= n.unlockLevel).map((n) => (
          <View key={n.id} style={[S.card, { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, padding: 12 }]}>
            <Text style={{ fontSize: 26 }}>{n.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={S.h3}>{n.name} <Text style={S.xs}>· {n.type}</Text></Text>
              <Text style={S.sm}>{n.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },
  brand: { fontSize: 20, fontWeight: '900', color: C.text },
  mapContainer: { width: '100%', aspectRatio: 1, borderRadius: 18, backgroundColor: '#10231a', borderWidth: 1, borderColor: C.border, marginBottom: 14, position: 'relative', overflow: 'hidden' },
  node: { position: 'absolute', alignItems: 'center', transform: [{ translateX: -30 }, { translateY: -30 }] },
  nodeLocked: { opacity: 0.3 },
  nodeIcon: { fontSize: 24 },
  nodeLabel: { fontSize: 8, fontWeight: '700', color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, textAlign: 'center', maxWidth: 60 },
});
