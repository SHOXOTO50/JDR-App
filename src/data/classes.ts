import type { CharacterClass, Title } from '../types';

export const CLASSES: CharacterClass[] = [
  {
    id: 'aventurier',
    name: 'Aventurier',
    icon: '🧭',
    tagline: 'Polyvalent, prêt à tout explorer.',
    bonus: { endurance: 2, confiance: 2 },
  },
  {
    id: 'erudit',
    name: 'Érudit',
    icon: '📚',
    tagline: 'La connaissance est ta plus grande arme.',
    bonus: { intelligence: 3, sagesse: 2 },
  },
  {
    id: 'guerrier',
    name: 'Guerrier',
    icon: '🛡️',
    tagline: 'Le corps comme un rempart, la volonté comme une lame.',
    bonus: { force: 3, discipline: 2 },
  },
  {
    id: 'barde',
    name: 'Barde',
    icon: '🎭',
    tagline: 'Créer, charmer, inspirer.',
    bonus: { creativite: 3, charisme: 2 },
  },
  {
    id: 'moine',
    name: 'Moine',
    icon: '🧘',
    tagline: 'La maîtrise de soi avant la maîtrise du monde.',
    bonus: { discipline: 3, sagesse: 2 },
  },
];

export const TITLES: Title[] = [
  { id: 't0', name: 'Âme Éveillée', requirement: 'Commencer l’aventure', unlockLevel: 1 },
  { id: 't1', name: 'Apprenti de la Vie', requirement: 'Atteindre le niveau 3', unlockLevel: 3 },
  { id: 't2', name: 'Disciple Déterminé', requirement: 'Atteindre le niveau 5', unlockLevel: 5 },
  { id: 't3', name: 'Héros en Devenir', requirement: 'Atteindre le niveau 10', unlockLevel: 10 },
  { id: 't4', name: 'Maître des Habitudes', requirement: 'Atteindre le niveau 20', unlockLevel: 20 },
  { id: 't5', name: 'Légende Vivante', requirement: 'Atteindre le niveau 35', unlockLevel: 35 },
  { id: 't6', name: 'Architecte du Destin', requirement: 'Atteindre le niveau 50', unlockLevel: 50 },
];
