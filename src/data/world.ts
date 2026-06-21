import type { WorldNode } from '../types';

// Le royaume personnel grandit avec le niveau du personnage.
export const WORLD_NODES: WorldNode[] = [
  { id: 'camp', name: 'Camp de Départ', type: 'village', icon: '⛺', desc: 'Là où tout commence.', unlockLevel: 1, x: 18, y: 72 },
  { id: 'spring', name: 'Source Claire', type: 'monument', icon: '⛲', desc: 'Une source d’énergie renouvelée.', unlockLevel: 3, x: 34, y: 60 },
  { id: 'hamlet', name: 'Hameau des Habitudes', type: 'village', icon: '🏘️', desc: 'Un petit village né de ta régularité.', unlockLevel: 5, x: 28, y: 44 },
  { id: 'forge', name: 'Forge de Volonté', type: 'monument', icon: '🔨', desc: 'Où se trempe la discipline.', unlockLevel: 8, x: 48, y: 52 },
  { id: 'town', name: 'Cité de l’Effort', type: 'ville', icon: '🏰', desc: 'Une vraie ville bourdonnante de vie.', unlockLevel: 12, x: 52, y: 34 },
  { id: 'wolf', name: 'Loup Allié', type: 'créature', icon: '🐺', desc: 'Une créature qui te suit fidèlement.', unlockLevel: 15, x: 66, y: 48 },
  { id: 'tower', name: 'Tour du Savoir', type: 'monument', icon: '🗼', desc: 'Elle perce les nuages de l’ignorance.', unlockLevel: 18, x: 70, y: 28 },
  { id: 'capital', name: 'Capitale du Royaume', type: 'ville', icon: '🏛️', desc: 'Le cœur rayonnant de ton monde.', unlockLevel: 25, x: 78, y: 18 },
  { id: 'griffin', name: 'Griffon Royal', type: 'créature', icon: '🦅', desc: 'Une monture majestueuse.', unlockLevel: 32, x: 86, y: 36 },
  { id: 'castle', name: 'Château Céleste', type: 'monument', icon: '🏯', desc: 'Le sommet de ton ascension.', unlockLevel: 50, x: 90, y: 10 },
];
