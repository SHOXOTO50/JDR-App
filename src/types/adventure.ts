export type SceneType =
  | 'narrative'
  | 'dialogue'
  | 'combat'
  | 'exploration'
  | 'choice'
  | 'reward'
  | 'rest'
  | 'shop'
  | 'chapter_end'
  | 'adventure_end';

export interface EnemyTemplate {
  id: string;
  name: string;
  icon: string;
  ca: number;
  maxHP: number;
  atkBonus: number;
  dmgFormula: string;
  xpReward: number;
  goldDrop?: number;
  isBoss?: boolean;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'angry' | 'scared' | 'sad' | 'mysterious';
  isPlayer?: boolean;
}

export interface QuestOffer {
  title: string;
  description: string;
  reward: string;
  type: 'principale' | 'secondaire';
  objectives: string[];
}

export interface SceneReward {
  xp?: number;
  gold?: number;
  items?: { name: string; description: string; category: string; rarity: string; damage?: string }[];
  questComplete?: string[];
}

export interface SceneChoice {
  id: string;
  label: string;
  icon?: string;
  requireFlag?: string;
  nextSceneId: string;
  setFlag?: string;
  reward?: SceneReward;
}

export interface AdventureScene {
  id: string;
  type: SceneType;
  chapterId: string;
  title: string;
  narrative: string;
  atmosphere?: string;
  // dialogue scenes
  dialogue?: DialogueLine[];
  dialogueNextSceneId?: string;
  // choice / exploration
  choices?: SceneChoice[];
  // auto-advance (narrative, reward, chapter_end)
  autoNextSceneId?: string;
  // combat
  enemies?: EnemyTemplate[];
  combatIntro?: string;
  victorySceneId?: string;
  defeatSceneId?: string;
  // quest offering
  questOffer?: QuestOffer;
  // reward at end of scene
  reward?: SceneReward;
}

export interface AdventureChapter {
  id: string;
  number: number;
  title: string;
  description: string;
  firstSceneId: string;
}

export interface PlayableAdventure {
  id: string;
  title: string;
  description: string;
  coverIcon: string;
  difficulty: 'débutant' | 'intermédiaire' | 'expert';
  estimatedDuration: string;
  recommendedLevel: number;
  chapters: AdventureChapter[];
  scenes: Record<string, AdventureScene>;
}

// ─── Combat local state (component-level, not Redux) ─────────────────────────
export interface LiveEnemy {
  instanceId: string;
  templateId: string;
  name: string;
  icon: string;
  maxHP: number;
  currentHP: number;
  ca: number;
  atkBonus: number;
  dmgFormula: string;
  xpReward: number;
  goldDrop: number;
  isBoss: boolean;
}

export interface LocalCombatState {
  enemies: LiveEnemy[];
  playerHP: number;
  round: number;
  phase: 'player_turn' | 'enemy_turn' | 'victory' | 'defeat';
  log: string[];
  victorySceneId: string;
  defeatSceneId: string;
  pendingXP: number;
  pendingGold: number;
}
