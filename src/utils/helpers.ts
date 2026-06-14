import { v4 as uuidv4 } from 'uuid';
import { ItemRarity, NPCDisposition } from '../types';
import { colors } from '../theme';

export const generateId = (): string => uuidv4();

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getModifier = (stat: number): number =>
  Math.floor((stat - 10) / 2);

export const getModifierString = (mod: number): string =>
  mod >= 0 ? `+${mod}` : `${mod}`;

export const getStatModifierString = (stat: number): string =>
  getModifierString(getModifier(stat));

export const capitalizeFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getRarityColor = (rarity: ItemRarity): string => {
  const map: Record<ItemRarity, string> = {
    commun: colors.common,
    peu_commun: colors.uncommon,
    rare: colors.rare,
    tres_rare: colors.veryRare,
    legendaire: colors.legendary,
    artefact: colors.artifact,
  };
  return map[rarity] ?? colors.common;
};

export const getRarityLabel = (rarity: ItemRarity): string => {
  const map: Record<ItemRarity, string> = {
    commun: 'Commun',
    peu_commun: 'Peu commun',
    rare: 'Rare',
    tres_rare: 'Très rare',
    legendaire: 'Légendaire',
    artefact: 'Artefact',
  };
  return map[rarity] ?? 'Commun';
};

export const getCategoryLabel = (category: string): string => {
  const map: Record<string, string> = {
    arme: 'Arme',
    armure: 'Armure',
    consommable: 'Consommable',
    magique: 'Magique',
    ressource: 'Ressource',
    quete: 'Quête',
    autre: 'Autre',
  };
  return map[category] ?? 'Autre';
};

export const getDispositionColor = (disposition: NPCDisposition): string => {
  const map: Record<NPCDisposition, string> = {
    amical: colors.success,
    neutre: colors.warning,
    hostile: colors.error,
  };
  return map[disposition] ?? colors.textMuted;
};

export const getDispositionLabel = (disposition: NPCDisposition): string => {
  const map: Record<NPCDisposition, string> = {
    amical: 'Amical',
    neutre: 'Neutre',
    hostile: 'Hostile',
  };
  return map[disposition] ?? 'Neutre';
};

export const getHPColor = (current: number, max: number): string => {
  if (max === 0) return colors.textMuted;
  const ratio = current / max;
  if (ratio > 0.5) return colors.success;
  if (ratio > 0.25) return colors.warning;
  return colors.error;
};

export const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max) + '...' : str;

export const getProficiencyBonus = (level: number): number => {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
};

export const formatWeight = (weight: number): string => {
  if (weight >= 1000) return `${(weight / 1000).toFixed(1)} kg`;
  return `${weight} g`;
};

export const formatGold = (copper: number, silver: number, gold: number, platinum: number): string => {
  const parts: string[] = [];
  if (platinum > 0) parts.push(`${platinum}po`);
  if (gold > 0) parts.push(`${gold}po`);
  if (silver > 0) parts.push(`${silver}pa`);
  if (copper > 0) parts.push(`${copper}pc`);
  return parts.join(' ') || '0po';
};

export const getQuestStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    active: 'Active',
    secondaire: 'Secondaire',
    terminee: 'Terminée',
    echouee: 'Échouée',
  };
  return map[status] ?? status;
};

export const getQuestStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: colors.primary,
    secondaire: colors.secondary,
    terminee: colors.success,
    echouee: colors.error,
  };
  return map[status] ?? colors.textMuted;
};

export const getNoteTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    libre: 'Note libre',
    session: 'Session',
    personnage: 'Personnage',
    campagne: 'Campagne',
  };
  return map[type] ?? type;
};

export const getLocationTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    ville: 'Ville',
    donjon: 'Donjon',
    village: 'Village',
    royaume: 'Royaume',
    foret: 'Forêt',
    autre: 'Autre',
  };
  return map[type] ?? type;
};

export const CONDITIONS = [
  { id: 'aveugle', name: 'Aveuglé', color: '#6B7280' },
  { id: 'charmee', name: 'Charmé', color: '#EC4899' },
  { id: 'assourdi', name: 'Assourdi', color: '#8B5CF6' },
  { id: 'effraie', name: 'Effrayé', color: '#7C3AED' },
  { id: 'agrippé', name: 'Agrippé', color: '#B45309' },
  { id: 'incapacite', name: 'Incapacité', color: '#DC2626' },
  { id: 'invisible', name: 'Invisible', color: '#E5E7EB' },
  { id: 'paralyse', name: 'Paralysé', color: '#F59E0B' },
  { id: 'petrifie', name: 'Pétrifié', color: '#9CA3AF' },
  { id: 'empoisonne', name: 'Empoisonné', color: '#16A34A' },
  { id: 'prone', name: 'À terre', color: '#B45309' },
  { id: 'entrave', name: 'Entravé', color: '#92400E' },
  { id: 'etourdi', name: 'Étourdi', color: '#6366F1' },
  { id: 'inconscient', name: 'Inconscient', color: '#1F2937' },
];

export const DEFAULT_DND_STATS = [
  { id: generateId(), name: 'Force', abbreviation: 'FOR', value: 10, isPrimary: true },
  { id: generateId(), name: 'Dextérité', abbreviation: 'DEX', value: 10, isPrimary: true },
  { id: generateId(), name: 'Constitution', abbreviation: 'CON', value: 10, isPrimary: true },
  { id: generateId(), name: 'Intelligence', abbreviation: 'INT', value: 10, isPrimary: true },
  { id: generateId(), name: 'Sagesse', abbreviation: 'SAG', value: 10, isPrimary: true },
  { id: generateId(), name: 'Charisme', abbreviation: 'CHA', value: 10, isPrimary: true },
];

export const DEFAULT_DND_SKILLS = [
  { id: generateId(), name: 'Acrobaties', ability: 'DEX', proficient: false, expertise: false },
  { id: generateId(), name: 'Arcanes', ability: 'INT', proficient: false, expertise: false },
  { id: generateId(), name: 'Athlétisme', ability: 'FOR', proficient: false, expertise: false },
  { id: generateId(), name: 'Discrétion', ability: 'DEX', proficient: false, expertise: false },
  { id: generateId(), name: 'Dressage', ability: 'SAG', proficient: false, expertise: false },
  { id: generateId(), name: 'Escamotage', ability: 'DEX', proficient: false, expertise: false },
  { id: generateId(), name: 'Histoire', ability: 'INT', proficient: false, expertise: false },
  { id: generateId(), name: 'Intimidation', ability: 'CHA', proficient: false, expertise: false },
  { id: generateId(), name: 'Investigation', ability: 'INT', proficient: false, expertise: false },
  { id: generateId(), name: 'Médecine', ability: 'SAG', proficient: false, expertise: false },
  { id: generateId(), name: 'Nature', ability: 'INT', proficient: false, expertise: false },
  { id: generateId(), name: 'Perception', ability: 'SAG', proficient: false, expertise: false },
  { id: generateId(), name: 'Perspicacité', ability: 'SAG', proficient: false, expertise: false },
  { id: generateId(), name: 'Persuasion', ability: 'CHA', proficient: false, expertise: false },
  { id: generateId(), name: 'Religion', ability: 'INT', proficient: false, expertise: false },
  { id: generateId(), name: 'Représentation', ability: 'CHA', proficient: false, expertise: false },
  { id: generateId(), name: 'Survie', ability: 'SAG', proficient: false, expertise: false },
  { id: generateId(), name: 'Tromperie', ability: 'CHA', proficient: false, expertise: false },
];
