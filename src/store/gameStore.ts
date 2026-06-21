import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Stats, StatKey, Quest, QuestProgress, SkillProgress, CoachMessage, GameLogEntry } from '../types';
import { STARTER_QUESTS } from '../data/quests';
import { SKILLS } from '../data/skills';
import { ITEMS } from '../data/items';
import { CLASSES, TITLES } from '../data/classes';
import { applyXp, applySkillXp } from '../engine/xp';
import { coachAdvise } from '../engine/coach';
import { generateQuests } from '../engine/questGenerator';

const BASE_STATS: Stats = {
  force: 5, endurance: 5, intelligence: 5, creativite: 5,
  charisme: 5, discipline: 5, sagesse: 5, confiance: 5,
};

function today(): string { return new Date().toISOString().slice(0, 10); }
function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
function nid(): string { return 'n-' + Math.random().toString(36).slice(2, 9); }

interface Notification { id: string; kind: 'xp'|'level'|'item'|'skill'; text: string; }

export interface GameState {
  initialized: boolean;
  name: string; classId: string; titleId: string; reputation: number;
  level: number; xp: number; stats: Stats;
  quests: Quest[]; questProgress: Record<string, QuestProgress>;
  skillProgress: Record<string, SkillProgress>;
  unlockedItems: string[]; unlockedTitles: string[];
  coachMessages: CoachMessage[]; log: GameLogEntry[];
  lastActiveDay: string; bestStreak: number;
  notifications: Notification[];
  createCharacter: (name: string, classId: string) => void;
  completeQuest: (id: string) => void;
  toggleStep: (questId: string, stepIndex: number) => void;
  addCustomQuest: (q: Omit<Quest, 'id'>) => void;
  generateAutoQuests: () => void;
  setTitle: (titleId: string) => void;
  askCoach: () => void;
  dismissNotification: (id: string) => void;
  resetGame: () => void;
}

function initSkillProgress(): Record<string, SkillProgress> {
  return Object.fromEntries(SKILLS.map((s) => [s.id, { level: 1, xp: 0 }]));
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      initialized: false,
      name: 'Aventurier', classId: 'aventurier', titleId: 't0', reputation: 0,
      level: 1, xp: 0, stats: { ...BASE_STATS },
      quests: STARTER_QUESTS, questProgress: {},
      skillProgress: initSkillProgress(),
      unlockedItems: [], unlockedTitles: ['t0'],
      coachMessages: [], log: [],
      lastActiveDay: today(), bestStreak: 0,
      notifications: [],

      createCharacter: (name, classId) => {
        const cls = CLASSES.find((c) => c.id === classId) ?? CLASSES[0];
        const stats = { ...BASE_STATS };
        for (const [k, v] of Object.entries(cls.bonus)) stats[k as StatKey] += v as number;
        set({ initialized: true, name: name.trim() || 'Aventurier', classId, stats, lastActiveDay: today() });
        get().askCoach();
      },

      completeQuest: (id) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === id);
        if (!quest) return;
        const prev = state.questProgress[id];
        const td = today();
        if (quest.repeatable && prev?.lastDone === td) return;

        const notifs: Notification[] = [];
        const { level, xp, levelsGained } = applyXp(state.level, state.xp, quest.xp);
        notifs.push({ id: nid(), kind: 'xp', text: `+${quest.xp} XP — ${quest.title}` });

        const stats = { ...state.stats };
        for (const [k, v] of Object.entries(quest.statRewards)) stats[k as StatKey] += v as number;

        const skillProgress = { ...state.skillProgress };
        if (quest.skillId && quest.skillXp) {
          const sp = skillProgress[quest.skillId] ?? { level: 1, xp: 0 };
          const res = applySkillXp(sp.level, sp.xp, quest.skillXp);
          skillProgress[quest.skillId] = { level: res.level, xp: res.xp };
          if (res.levelsGained > 0) {
            const sk = SKILLS.find((s) => s.id === quest.skillId);
            notifs.push({ id: nid(), kind: 'skill', text: `${sk?.icon} ${sk?.name} niveau ${res.level} !` });
          }
        }

        let streak = prev?.streak ?? 0;
        if (quest.repeatable) {
          streak = prev?.lastDone && daysBetween(prev.lastDone, td) === 1 ? streak + 1 : 1;
        }
        const bestStreak = Math.max(state.bestStreak, streak || 1);

        const questProgress = { ...state.questProgress };
        questProgress[id] = { status: quest.repeatable ? 'active' : 'completed', completedAt: Date.now(), lastDone: td, streak };

        let reputation = state.reputation + Math.ceil(quest.xp / 10);
        if (levelsGained > 0) {
          notifs.push({ id: nid(), kind: 'level', text: `Niveau ${level} atteint ! 🎉` });
          reputation += levelsGained * 5;
        }

        const log: GameLogEntry[] = [{ id: nid(), at: Date.now(), text: `Quête : ${quest.title}`, xp: quest.xp }, ...state.log].slice(0, 100);

        set({ level, xp, stats, skillProgress, questProgress, reputation, bestStreak, lastActiveDay: td, notifications: [...state.notifications, ...notifs], log });
        reconcileUnlocks(get, set);
      },

      toggleStep: (questId, stepIndex) => {
        const state = get();
        const quest = state.quests.find((q) => q.id === questId);
        if (!quest?.steps) return;
        const qp = state.questProgress[questId];
        const steps = qp?.steps ? [...qp.steps] : quest.steps.map(() => false);
        steps[stepIndex] = !steps[stepIndex];
        const questProgress = { ...state.questProgress };
        questProgress[questId] = { ...(qp ?? { status: 'active' }), steps };
        set({ questProgress });
        if (steps.every(Boolean) && qp?.status !== 'completed') get().completeQuest(questId);
      },

      addCustomQuest: (q) => {
        const quest: Quest = { ...q, id: 'custom-' + Math.random().toString(36).slice(2, 9) };
        set({ quests: [quest, ...get().quests] });
      },

      generateAutoQuests: () => {
        const state = get();
        const fresh = generateQuests(state.skillProgress, 3);
        const filtered = state.quests.filter((q) => q.type !== 'auto' || state.questProgress[q.id]?.status === 'completed');
        set({ quests: [...fresh, ...filtered] });
        get().askCoach();
      },

      setTitle: (titleId) => { if (get().unlockedTitles.includes(titleId)) set({ titleId }); },

      askCoach: () => {
        const state = get();
        const td = today();
        const todayCompleted = Object.values(state.questProgress)
          .filter((p) => p.lastDone === td || (p.completedAt && new Date(p.completedAt).toISOString().slice(0, 10) === td)).length;
        const message = coachAdvise({ name: state.name, level: state.level, todayCompleted, bestStreak: state.bestStreak, daysSinceActive: Math.max(0, daysBetween(state.lastActiveDay, td)), totalQuests: Object.values(state.questProgress).filter((p) => p.status === 'completed' || p.lastDone).length });
        set({ coachMessages: [message, ...state.coachMessages].slice(0, 30) });
      },

      dismissNotification: (id) => set({ notifications: get().notifications.filter((n) => n.id !== id) }),

      resetGame: () => set({
        initialized: false, name: 'Aventurier', classId: 'aventurier', titleId: 't0', reputation: 0,
        level: 1, xp: 0, stats: { ...BASE_STATS }, quests: STARTER_QUESTS, questProgress: {},
        skillProgress: initSkillProgress(), unlockedItems: [], unlockedTitles: ['t0'],
        coachMessages: [], log: [], lastActiveDay: today(), bestStreak: 0, notifications: [],
      }),
    }),
    {
      name: 'lifequest-save-v2',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

function reconcileUnlocks(get: () => GameState, set: (p: Partial<GameState>) => void) {
  const state = get();
  const newNotifs: Notification[] = [];
  const completedCount = Object.values(state.questProgress).filter((p) => p.status === 'completed' || p.lastDone).length;

  const unlockedTitles = [...state.unlockedTitles];
  for (const t of TITLES) {
    if (state.level >= t.unlockLevel && !unlockedTitles.includes(t.id)) unlockedTitles.push(t.id);
  }

  const unlockedItems = [...state.unlockedItems];
  for (const item of ITEMS) {
    if (unlockedItems.includes(item.id) || !item.unlock) continue;
    const u = item.unlock;
    let ok = false;
    if (u.kind === 'level') ok = state.level >= u.value;
    else if (u.kind === 'quests') ok = completedCount >= u.value;
    else if (u.kind === 'streak') ok = state.bestStreak >= u.value;
    else if (u.kind === 'skill' && u.skillId) ok = (state.skillProgress[u.skillId]?.level ?? 1) >= u.value;
    if (ok) {
      unlockedItems.push(item.id);
      newNotifs.push({ id: nid(), kind: 'item', text: `${item.icon} ${item.name} débloqué !` });
    }
  }
  set({ unlockedTitles, unlockedItems, notifications: [...get().notifications, ...newNotifs] });
}
