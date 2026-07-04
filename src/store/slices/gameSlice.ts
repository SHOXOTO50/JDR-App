import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Stats, StatKey, Quest, QuestProgress, SkillProgress, CoachMessage, GameLogEntry } from '../../types';
import { STARTER_QUESTS } from '../../data/quests';
import { NSFW_QUESTS } from '../../data/nsfwQuests';
import { SKILLS } from '../../data/skills';
import { ITEMS } from '../../data/items';
import { CLASSES, TITLES } from '../../data/classes';
import { applyXp, applySkillXp } from '../../engine/xp';
import { coachAdvise } from '../../engine/coach';
import { generateQuests } from '../../engine/questGenerator';

const BASE_STATS: Stats = {
  force: 5, endurance: 5, intelligence: 5, creativite: 5,
  charisme: 5, discipline: 5, sagesse: 5, confiance: 5,
};

function today(): string { return new Date().toISOString().slice(0, 10); }
function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
function nid(): string { return 'n-' + Math.random().toString(36).slice(2, 9); }

export interface Notification { id: string; kind: 'xp' | 'level' | 'item' | 'skill'; text: string; }

function initSkillProgress(): Record<string, SkillProgress> {
  return Object.fromEntries(SKILLS.map((s) => [s.id, { level: 1, xp: 0 }]));
}

export interface GameState {
  initialized: boolean;
  name: string;
  classId: string;
  titleId: string;
  reputation: number;
  level: number;
  xp: number;
  stats: Stats;
  quests: Quest[];
  questProgress: Record<string, QuestProgress>;
  skillProgress: Record<string, SkillProgress>;
  unlockedItems: string[];
  unlockedTitles: string[];
  coachMessages: CoachMessage[];
  log: GameLogEntry[];
  lastActiveDay: string;
  bestStreak: number;
  notifications: Notification[];
  /** Easter egg : mode secret 🔞 « Alcôve ». */
  sexModeUnlocked: boolean;
  sexMode: boolean;
}

const initialState: GameState = {
  initialized: false,
  name: 'Aventurier', classId: 'aventurier', titleId: 't0', reputation: 0,
  level: 1, xp: 0, stats: { ...BASE_STATS },
  quests: STARTER_QUESTS, questProgress: {},
  skillProgress: initSkillProgress(),
  unlockedItems: [], unlockedTitles: ['t0'],
  coachMessages: [], log: [],
  lastActiveDay: today(), bestStreak: 0,
  notifications: [],
  sexModeUnlocked: false, sexMode: false,
};

function runAskCoach(state: GameState) {
  const td = today();
  const todayCompleted = Object.values(state.questProgress)
    .filter((p) => p.lastDone === td || (p.completedAt && new Date(p.completedAt).toISOString().slice(0, 10) === td)).length;
  const message = coachAdvise({
    name: state.name, level: state.level, todayCompleted, bestStreak: state.bestStreak,
    daysSinceActive: Math.max(0, daysBetween(state.lastActiveDay, td)),
    totalQuests: Object.values(state.questProgress).filter((p) => p.status === 'completed' || p.lastDone).length,
  });
  state.coachMessages = [message, ...state.coachMessages].slice(0, 30);
}

function runReconcileUnlocks(state: GameState) {
  const completedCount = Object.values(state.questProgress).filter((p) => p.status === 'completed' || p.lastDone).length;
  for (const t of TITLES) {
    if (state.level >= t.unlockLevel && !state.unlockedTitles.includes(t.id)) {
      state.unlockedTitles.push(t.id);
    }
  }
  for (const item of ITEMS) {
    if (state.unlockedItems.includes(item.id) || !item.unlock) continue;
    const u = item.unlock;
    let ok = false;
    if (u.kind === 'level') ok = state.level >= u.value;
    else if (u.kind === 'quests') ok = completedCount >= u.value;
    else if (u.kind === 'streak') ok = state.bestStreak >= u.value;
    else if (u.kind === 'skill' && u.skillId) ok = (state.skillProgress[u.skillId]?.level ?? 1) >= u.value;
    if (ok) {
      state.unlockedItems.push(item.id);
      state.notifications.push({ id: nid(), kind: 'item', text: `${item.icon} ${item.name} débloqué !` });
    }
  }
}

function doCompleteQuest(state: GameState, id: string) {
  const quest = state.quests.find((q) => q.id === id);
  if (!quest) return;
  const prev = state.questProgress[id];
  const td = today();
  if (quest.repeatable && prev?.lastDone === td) return;

  const { level, xp, levelsGained } = applyXp(state.level, state.xp, quest.xp);
  state.notifications.push({ id: nid(), kind: 'xp', text: `+${quest.xp} XP — ${quest.title}` });

  for (const [k, v] of Object.entries(quest.statRewards)) {
    (state.stats as any)[k] = ((state.stats as any)[k] ?? 0) + (v as number);
  }

  if (quest.skillId && quest.skillXp) {
    const sp = state.skillProgress[quest.skillId] ?? { level: 1, xp: 0 };
    const res = applySkillXp(sp.level, sp.xp, quest.skillXp);
    state.skillProgress[quest.skillId] = { level: res.level, xp: res.xp };
    if (res.levelsGained > 0) {
      const sk = SKILLS.find((s) => s.id === quest.skillId);
      state.notifications.push({ id: nid(), kind: 'skill', text: `${sk?.icon} ${sk?.name} niveau ${res.level} !` });
    }
  }

  let streak = prev?.streak ?? 0;
  if (quest.repeatable) {
    streak = prev?.lastDone && daysBetween(prev.lastDone, td) === 1 ? streak + 1 : 1;
  }
  state.bestStreak = Math.max(state.bestStreak, streak || 1);
  state.questProgress[id] = { status: quest.repeatable ? 'active' : 'completed', completedAt: Date.now(), lastDone: td, streak };

  state.level = level;
  state.xp = xp;
  state.reputation = state.reputation + Math.ceil(quest.xp / 10);
  if (levelsGained > 0) {
    state.notifications.push({ id: nid(), kind: 'level', text: `Niveau ${level} atteint ! 🎉` });
    state.reputation += levelsGained * 5;
  }

  state.log = [{ id: nid(), at: Date.now(), text: `Quête : ${quest.title}`, xp: quest.xp }, ...state.log].slice(0, 100);
  state.lastActiveDay = td;
  runReconcileUnlocks(state);
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    createCharacter: (state, action: PayloadAction<{ name: string; classId: string }>) => {
      const { name, classId } = action.payload;
      const cls = CLASSES.find((c) => c.id === classId) ?? CLASSES[0];
      const stats = { ...BASE_STATS };
      for (const [k, v] of Object.entries(cls.bonus)) (stats as any)[k] += v as number;
      state.initialized = true;
      state.name = name.trim() || 'Aventurier';
      state.classId = classId;
      state.stats = stats;
      state.lastActiveDay = today();
      runAskCoach(state);
    },

    completeQuest: (state, action: PayloadAction<string>) => {
      doCompleteQuest(state, action.payload);
    },

    toggleStep: (state, action: PayloadAction<{ questId: string; stepIndex: number }>) => {
      const { questId, stepIndex } = action.payload;
      const quest = state.quests.find((q) => q.id === questId);
      if (!quest?.steps) return;
      const qp = state.questProgress[questId];
      const steps = qp?.steps ? [...qp.steps] : quest.steps.map(() => false);
      steps[stepIndex] = !steps[stepIndex];
      state.questProgress[questId] = { ...(qp ?? { status: 'active' }), steps };
      if (steps.every(Boolean) && state.questProgress[questId]?.status !== 'completed') {
        doCompleteQuest(state, questId);
      }
    },

    addCustomQuest: (state, action: PayloadAction<Omit<Quest, 'id'>>) => {
      const quest: Quest = { ...action.payload, id: 'custom-' + Math.random().toString(36).slice(2, 9) };
      state.quests.unshift(quest);
    },

    generateAutoQuests: (state) => {
      const fresh = generateQuests(state.skillProgress, 3);
      state.quests = [
        ...fresh,
        ...state.quests.filter((q) => q.type !== 'auto' || state.questProgress[q.id]?.status === 'completed'),
      ];
      runAskCoach(state);
    },

    setTitle: (state, action: PayloadAction<string>) => {
      if (state.unlockedTitles.includes(action.payload)) state.titleId = action.payload;
    },

    askCoach: (state) => {
      runAskCoach(state);
    },

    dismissNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    /** Easter egg : 7 taps sur le logo → déblocage du mode Alcôve 🔞. */
    unlockSexMode: (state) => {
      if (state.sexModeUnlocked) {
        state.sexMode = !state.sexMode;
        state.notifications.push({
          id: nid(), kind: 'item',
          text: state.sexMode ? '🔞 Mode Alcôve activé…' : '🔒 Mode Alcôve désactivé.',
        });
        return;
      }
      state.sexModeUnlocked = true;
      state.sexMode = true;
      const existing = new Set(state.quests.map((q) => q.id));
      for (const q of NSFW_QUESTS) {
        if (!existing.has(q.id)) state.quests.push(q);
      }
      state.notifications.push({ id: nid(), kind: 'level', text: '🔞 Easter egg ! Mode Alcôve débloqué…' });
    },

    toggleSexMode: (state, action: PayloadAction<boolean>) => {
      if (state.sexModeUnlocked) state.sexMode = action.payload;
    },

    /** Fusionne le nouveau contenu (quêtes ajoutées par les mises à jour) dans les vieilles sauvegardes. */
    syncContent: (state) => {
      const existing = new Set(state.quests.map((q) => q.id));
      for (const q of STARTER_QUESTS) {
        if (!existing.has(q.id)) state.quests.push(q);
      }
      if (state.sexModeUnlocked) {
        for (const q of NSFW_QUESTS) {
          if (!existing.has(q.id)) state.quests.push(q);
        }
      }
    },

    resetGame: (state) => {
      Object.assign(state, {
        ...initialState,
        quests: STARTER_QUESTS,
        skillProgress: initSkillProgress(),
        lastActiveDay: today(),
      });
    },
  },
});

export const gameActions = gameSlice.actions;
export default gameSlice.reducer;
