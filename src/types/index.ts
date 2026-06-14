export interface Currency {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}

export interface CharacterStat {
  id: string;
  name: string;
  abbreviation: string;
  value: number;
  isPrimary: boolean;
}

export interface SavingThrow {
  id: string;
  name: string;
  ability: string;
  proficient: boolean;
}

export interface CharacterSkill {
  id: string;
  name: string;
  ability: string;
  proficient: boolean;
  expertise: boolean;
  value?: number;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  components: string;
  description: string;
  prepared: boolean;
  ritual?: boolean;
  concentration?: boolean;
}

export type ItemRarity = 'commun' | 'peu_commun' | 'rare' | 'tres_rare' | 'legendaire' | 'artefact';
export type ItemCategory = 'arme' | 'armure' | 'consommable' | 'magique' | 'ressource' | 'quete' | 'autre';
export type QuestStatus = 'active' | 'secondaire' | 'terminee' | 'echouee';
export type QuestType = 'principale' | 'secondaire';
export type NoteType = 'libre' | 'session' | 'personnage' | 'campagne';
export type NPCDisposition = 'amical' | 'neutre' | 'hostile';

export interface InventoryItem {
  id: string;
  characterId: string;
  name: string;
  description: string;
  quantity: number;
  value: number;
  weight: number;
  rarity: ItemRarity;
  category: ItemCategory;
  equipped: boolean;
  notes: string;
  damage?: string;
  properties?: string[];
}

export interface Character {
  id: string;
  name: string;
  portrait?: string;
  race: string;
  characterClass: string;
  subclass?: string;
  level: number;
  age?: string;
  height?: string;
  weight?: string;
  background: string;
  personality: string;
  alignment?: string;
  system: string;
  stats: CharacterStat[];
  skills: CharacterSkill[];
  spells: Spell[];
  savingThrows: SavingThrow[];
  currentHP: number;
  maxHP: number;
  tempHP: number;
  armorClass: number;
  speed: number;
  initiative: number;
  proficiencyBonus: number;
  currency: Currency;
  inspiration: boolean;
  exhaustion: number;
  deathSaves: { successes: number; failures: number };
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  characterId: string;
  title: string;
  content: string;
  type: NoteType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  characterId: string;
  title: string;
  description: string;
  reward: string;
  status: QuestStatus;
  type: QuestType;
  objectives: QuestObjective[];
  createdAt: string;
  updatedAt: string;
}

export interface Condition {
  id: string;
  name: string;
  color: string;
}

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  currentHP: number;
  maxHP: number;
  armorClass: number;
  conditions: string[];
  isEnemy: boolean;
  notes: string;
  isActive: boolean;
}

export interface CombatLogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'action' | 'damage' | 'heal' | 'condition' | 'system';
}

export interface CombatState {
  id: string;
  characterId: string;
  name: string;
  combatants: Combatant[];
  round: number;
  currentTurnIndex: number;
  active: boolean;
  log: CombatLogEntry[];
  createdAt: string;
}

export interface NPC {
  id: string;
  name: string;
  race: string;
  role: string;
  description: string;
  disposition: NPCDisposition;
  stats?: Record<string, number>;
  notes: string;
  campaignId?: string;
  portrait?: string;
  location?: string;
  createdAt: string;
}

export interface MonsterAttack {
  name: string;
  bonus: string;
  damage: string;
  description?: string;
}

export interface Monster {
  id: string;
  name: string;
  type: string;
  cr: string;
  hp: number;
  ac: number;
  speed: string;
  stats: Record<string, number>;
  attacks: MonsterAttack[];
  description: string;
  abilities?: string[];
  campaignId?: string;
  createdAt: string;
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  reputation: number;
  leader?: string;
  notes: string;
  symbol?: string;
  goals?: string;
  createdAt: string;
}

export type LocationType = 'ville' | 'donjon' | 'village' | 'royaume' | 'foret' | 'autre';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  description: string;
  notes: string;
  campaignId?: string;
  inhabitants?: string;
  danger?: string;
  createdAt: string;
}

export interface CampaignSession {
  id: string;
  number: number;
  title: string;
  date: string;
  summary: string;
  participants: string[];
  xpAwarded?: number;
  highlights?: string[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  system: string;
  gmName?: string;
  players: string[];
  characterIds: string[];
  sessionCount: number;
  sessions: CampaignSession[];
  npcIds: string[];
  locationIds: string[];
  active: boolean;
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiceRoll {
  id: string;
  formula: string;
  dice: { sides: number; result: number }[];
  modifier: number;
  total: number;
  advantage?: boolean;
  disadvantage?: boolean;
  characterId?: string;
  timestamp: string;
}

export interface AppSettings {
  darkMode: boolean;
  language: string;
  diceAnimations: boolean;
  autosave: boolean;
  showTips: boolean;
}
