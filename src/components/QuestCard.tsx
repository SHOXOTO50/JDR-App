import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, S } from '../theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { gameActions } from '../store/slices/gameSlice';
import { STAT_ICONS } from '../types';
import { SKILL_BY_ID } from '../data/skills';
import Bouncy from './anim/Bouncy';
import type { Quest } from '../types';

function today() { return new Date().toISOString().slice(0, 10); }

const DIFF_COLOR: Record<string, string> = {
  facile: C.green, moyenne: C.blue, difficile: '#fbbf24', épique: '#fb7185',
};

export default function QuestCard({ quest }: { quest: Quest }) {
  const progress = useAppSelector((s) => s.game.questProgress[quest.id]);
  const dispatch = useAppDispatch();

  const isDailyDoneToday = quest.repeatable && progress?.lastDone === today();
  const isCompleted = !quest.repeatable && progress?.status === 'completed';
  const done = isDailyDoneToday || isCompleted;

  const steps = quest.steps;
  const stepStates = progress?.steps ?? steps?.map(() => false);

  return (
    <View style={[styles.card, done && { opacity: 0.55 }]}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        {!steps && (
          <Bouncy
            style={[styles.check, done && styles.checkDone]}
            scaleTo={0.8}
            onPress={() => !done && dispatch(gameActions.completeQuest(quest.id))}
            disabled={done}
          >
            <Text style={{ fontSize: 14, color: done ? '#2a2008' : C.gold }}>{done ? '✓' : ''}</Text>
          </Bouncy>
        )}
        <View style={{ flex: 1 }}>
          <View style={S.spread}>
            <Text style={[S.h3, { flex: 1, marginRight: 8 }]}>{quest.nsfw ? '🔞 ' : ''}{quest.title}</Text>
            <Text style={[styles.diff, { color: DIFF_COLOR[quest.difficulty] }]}>{quest.difficulty}</Text>
          </View>
          <Text style={[S.sm, { marginTop: 3 }]}>{quest.desc}</Text>

          {steps && (
            <View style={{ marginTop: 10, gap: 6 }}>
              {steps.map((step, i) => {
                const on = stepStates?.[i] ?? false;
                return (
                  <TouchableOpacity key={i} style={styles.step} onPress={() => dispatch(gameActions.toggleStep({ questId: quest.id, stepIndex: i }))}>
                    <View style={[styles.stepBox, on && styles.stepBoxOn]}>
                      {on && <Text style={{ fontSize: 10, color: '#fff' }}>✓</Text>}
                    </View>
                    <Text style={[S.body, { fontSize: 13, flex: 1 }, on && { color: C.muted, textDecorationLine: 'line-through' }]}>
                      {step.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.rewards}>
            <Text style={styles.pill}>+{quest.xp} XP</Text>
            {Object.entries(quest.statRewards).map(([k, v]) => (
              <Text key={k} style={styles.pill}>{STAT_ICONS[k as keyof typeof STAT_ICONS]} +{v}</Text>
            ))}
            {quest.skillId && <Text style={styles.pillSkill}>{SKILL_BY_ID[quest.skillId]?.icon} +{quest.skillXp}</Text>}
            {isDailyDoneToday && progress?.streak ? <Text style={styles.pill}>🔥 {progress.streak}j</Text> : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 10 },
  check: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: C.goldDim, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: C.gold, borderColor: C.gold },
  diff: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  rewards: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  pill: { fontSize: 11, fontWeight: '700', color: C.gold, backgroundColor: 'rgba(245,197,66,0.08)', borderWidth: 1, borderColor: 'rgba(245,197,66,0.25)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  pillSkill: { fontSize: 11, fontWeight: '700', color: C.accent, backgroundColor: 'rgba(139,92,246,0.1)', borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  stepBoxOn: { backgroundColor: C.accent, borderColor: C.accent },
});
