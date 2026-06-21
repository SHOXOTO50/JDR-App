import type { Item } from '../types';

// Objets purement cosmétiques / symboliques — aucun avantage Pay-to-Win.
export const ITEMS: Item[] = [
  { id: 'badge-firststep', name: 'Premier Pas', type: 'badge', rarity: 'commun', icon: '👣', desc: 'Tu as commencé. C’est déjà énorme.', unlock: { kind: 'quests', value: 1 } },
  { id: 'badge-rookie', name: 'Recrue', type: 'badge', rarity: 'commun', icon: '🎖️', desc: 'Atteins le niveau 3.', unlock: { kind: 'level', value: 3 } },
  { id: 'badge-streak3', name: 'Étincelle', type: 'badge', rarity: 'rare', icon: '🔥', desc: 'Une série de 3 jours.', unlock: { kind: 'streak', value: 3 } },
  { id: 'badge-streak7', name: 'Flamme Constante', type: 'badge', rarity: 'rare', icon: '🔥', desc: 'Une série de 7 jours.', unlock: { kind: 'streak', value: 7 } },
  { id: 'badge-streak30', name: 'Brasier Inextinguible', type: 'badge', rarity: 'légendaire', icon: '🌋', desc: 'Une série de 30 jours.', unlock: { kind: 'streak', value: 30 } },

  { id: 'relic-tome', name: 'Tome des Anciens', type: 'relique', rarity: 'rare', icon: '📕', desc: 'Lecture niveau 10. Le savoir s’accumule.', unlock: { kind: 'skill', value: 10, skillId: 'lecture' } },
  { id: 'relic-lyre', name: 'Lyre Enchantée', type: 'relique', rarity: 'épique', icon: '🎵', desc: 'Musique niveau 15.', unlock: { kind: 'skill', value: 15, skillId: 'musique' } },
  { id: 'relic-core', name: 'Noyau de Code', type: 'relique', rarity: 'épique', icon: '🔮', desc: 'Programmation niveau 15.', unlock: { kind: 'skill', value: 15, skillId: 'code' } },

  { id: 'trophy-lvl10', name: 'Couronne du Héros', type: 'trophée', rarity: 'épique', icon: '👑', desc: 'Atteins le niveau 10.', unlock: { kind: 'level', value: 10 } },
  { id: 'trophy-lvl25', name: 'Trône de Volonté', type: 'trophée', rarity: 'légendaire', icon: '🏆', desc: 'Atteins le niveau 25.', unlock: { kind: 'level', value: 25 } },
  { id: 'trophy-lvl50', name: 'Étoile Éternelle', type: 'trophée', rarity: 'mythique', icon: '⭐', desc: 'Atteins le niveau 50.', unlock: { kind: 'level', value: 50 } },

  { id: 'cos-cloak', name: 'Cape Étoilée', type: 'cosmétique', rarity: 'rare', icon: '🧥', desc: 'Un style digne d’un aventurier chevronné.', unlock: { kind: 'level', value: 7 } },
  { id: 'cos-crown', name: 'Diadème de Lumière', type: 'cosmétique', rarity: 'légendaire', icon: '💎', desc: 'Réservé aux légendes.', unlock: { kind: 'level', value: 30 } },

  { id: 'comp-cat', name: 'Familier Félin', type: 'compagnon', rarity: 'rare', icon: '🐈', desc: 'Un compagnon qui ronronne quand tu progresses.', unlock: { kind: 'quests', value: 10 } },
  { id: 'comp-owl', name: 'Hibou Érudit', type: 'compagnon', rarity: 'épique', icon: '🦉', desc: 'Veille sur ta sagesse. Lecture niveau 20.', unlock: { kind: 'skill', value: 20, skillId: 'lecture' } },
  { id: 'comp-dragon', name: 'Dragonneau', type: 'compagnon', rarity: 'mythique', icon: '🐉', desc: 'Le compagnon ultime. Atteins le niveau 40.', unlock: { kind: 'level', value: 40 } },
];
