// ── Domain model for LifeQuest ───────────────────────────────────────────────

export type StatKey =
  | 'force'
  | 'endurance'
  | 'intelligence'
  | 'creativite'
  | 'charisme'
  | 'discipline'
  | 'sagesse'
  | 'confiance';

export const STAT_LABELS: Record<StatKey, string> = {
  force: 'Force',
  endurance: 'Endurance',
  intelligence: 'Intelligence',
  creativite: 'Créativité',
  charisme: 'Charisme',
  discipline: 'Discipline',
  sagesse: 'Sagesse',
  confiance: 'Confiance en soi',
};

export const STAT_ICONS: Record<StatKey, string> = {
  force: '💪',
  endurance: '🫀',
  intelligence: '🧠',
  creativite: '🎨',
  charisme: '✨',
  discipline: '⚔️',
  sagesse: '📜',
  confiance: '🦁',
};

export type Stats = Record<StatKey, number>;

export type Rarity = 'commun' | 'rare' | 'épique' | 'légendaire' | 'mythique';

export type ItemType = 'badge' | 'relique' | 'trophée' | 'cosmétique' | 'compagnon';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  icon: string;
  desc: string;
  /** Auto-unlocks when this condition is met (handled by the engine). */
  unlock?: { kind: 'level' | 'skill' | 'quests' | 'streak'; value: number; skillId?: string };
}

export type QuestType = 'principale' | 'secondaire' | 'quotidienne' | 'auto';

export type Difficulty = 'facile' | 'moyenne' | 'difficile' | 'épique';

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  desc: string;
  difficulty: Difficulty;
  xp: number;
  statRewards: Partial<Stats>;
  skillId?: string;
  skillXp?: number;
  /** Quotidiennes / récurrentes peuvent être recommencées chaque jour. */
  repeatable?: boolean;
  /** Quêtes principales en plusieurs étapes. */
  steps?: { label: string; done: boolean }[];
  /** Visible uniquement quand le mode secret 🔞 est actif. */
  nsfw?: boolean;
}

export interface QuestProgress {
  status: 'active' | 'completed';
  completedAt?: number;
  /** Dernière complétion (pour les quotidiennes). */
  lastDone?: string; // YYYY-MM-DD
  streak?: number;
  steps?: boolean[];
}

export interface Skill {
  id: string;
  name: string;
  /** Métier/archétype débloqué par la maîtrise. */
  archetype: string;
  icon: string;
  desc: string;
  primaryStat: StatKey;
}

export interface SkillProgress {
  level: number; // 1..100
  xp: number;
}

export type WorldNodeType = 'village' | 'ville' | 'monument' | 'créature';

export interface WorldNode {
  id: string;
  name: string;
  type: WorldNodeType;
  icon: string;
  desc: string;
  unlockLevel: number;
  x: number; // 0..100 (% on the map)
  y: number;
}

export interface CharacterClass {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  /** Stats de départ légèrement orientées. */
  bonus: Partial<Stats>;
}

export interface Title {
  id: string;
  name: string;
  requirement: string;
  unlockLevel: number;
}

export interface CoachMessage {
  id: string;
  tone: 'motivation' | 'défi' | 'analyse' | 'alerte' | 'félicitation';
  text: string;
  at: number;
}

export interface GameLogEntry {
  id: string;
  at: number;
  text: string;
  xp?: number;
}
