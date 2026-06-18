import { Campaign } from '../types';

export const DRAGON_BALL_CAMPAIGN_ID = 'secret-db-tournament-power';

export const DRAGON_BALL_CAMPAIGN: Campaign = {
  id: DRAGON_BALL_CAMPAIGN_ID,
  name: 'Dragon Ball: Le Tournoi du Pouvoir',
  description: 'Une campagne secrète dans l\'univers Dragon Ball. Des guerriers de 8 univers s\'affrontent dans un tournoi ultime où l\'enjeu est la survie de leur univers. Choisissez votre combattant et transcendez vos limites !',
  system: 'Dragon Ball RPG (Personnalisé)',
  gmName: 'Grand Prêtre',
  gmNotes: '🐉 CAMPAGNE SECRÈTE DÉBLOQUÉE 🐉\n\nContexte: Le Grand Prêtre annonce le Tournoi du Pouvoir. 10 guerriers de chaque univers s\'affrontent sur le Terrain de Combat Vide. Les éliminés tombent hors de l\'arène. L\'univers perdant sera effacé par Zeno.\n\nRègles spéciales:\n• Remplacez "Armure" par "Gi de combat" dans l\'équipement\n• Fireball = Kamehameha | Lightning = Final Flash | Heal = Sénigraine / Énergie vitale\n• La "Classe" du personnage correspond à son école de combat\n• L\'XP représente la montée de Ki',
  players: [],
  characterIds: [],
  sessionCount: 3,
  sessions: [
    {
      id: 'db-s1',
      number: 1,
      title: 'L\'Annonce du Tournoi',
      date: new Date().toISOString(),
      summary: 'Le Grand Prêtre convoque les guerriers des 8 univers survivants. Goku apprend l\'existence du tournoi et commence à recruter son équipe. Les héros s\'entraînent intensément pour préparer leurs transformations ultimes.',
      participants: ['Goku', 'Vegeta', 'Gohan', 'Piccolo', 'Android 17', 'Android 18', 'Krillin', 'Tenshinhan', 'Boo Mystère', 'Maître Roshi'],
      xpAwarded: 500,
      highlights: ['Goku atteint Super Saiyan Blue', 'Vegeta maîtrise la Forme Évoluée', 'Gohan retrouve son plein pouvoir'],
    },
    {
      id: 'db-s2',
      number: 2,
      title: 'Le Terrain de Combat Vide',
      date: new Date().toISOString(),
      summary: 'Le Tournoi du Pouvoir commence ! 80 guerriers s\'affrontent simultanément. Les premières éliminations se produisent et des alliances inattendues se forment entre guerriers d\'univers différents.',
      participants: ['Goku', 'Vegeta', 'Gohan', 'Piccolo', 'Android 17'],
      xpAwarded: 1000,
      highlights: ['Combat épique Goku vs Caulifla & Kale', 'Jiren révèle une fraction de sa puissance', 'Android 17 sacrifie son existence'],
    },
    {
      id: 'db-s3',
      number: 3,
      title: 'Ultra Instinct — Limite Brisée',
      date: new Date().toISOString(),
      summary: 'Confrontation finale : Goku maîtrise l\'Ultra Instinct Accompli et affronte Jiren dans un combat légendaire. Android 17 est le dernier survivant et utilise son vœu pour restaurer les univers effacés.',
      participants: ['Goku', 'Vegeta', 'Jiren', 'Android 17'],
      xpAwarded: 5000,
      highlights: ['Goku maîtrise l\'Ultra Instinct Accompli', 'Vegeta — Forme Évoluée Finale', 'Android 17 exauce le vœu de restauration'],
    },
  ],
  npcIds: [],
  locationIds: [],
  active: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DRAGON_BALL_ITEMS = [
  { name: 'Gi de Goku (Kaioken)', description: 'La tenue orange de Goku, imbibée d\'énergie divine. Permet le Kaioken ×20 en combat.', category: 'armure' as const, rarity: 'legendaire' as const, value: 9999, weight: 1 },
  { name: 'Armure Saiyan de Vegeta', description: 'Armure gravitationnelle auto-régénérante du Prince des Saiyans. CA +8, résiste aux dégâts cosmiques.', category: 'armure' as const, rarity: 'legendaire' as const, value: 9999, weight: 3 },
  { name: 'Gi de Piccolo', description: 'La tenue pondérée du Namekien. 300 kg de poids dissimulé — retirer les poids double la vitesse.', category: 'armure' as const, rarity: 'rare' as const, value: 3000, weight: 300 },
  { name: 'Sénigraine', description: 'Restaure instantanément tous les PV et guérit toutes les blessures. Cultivées par le vieux Karin.', category: 'consommable' as const, rarity: 'rare' as const, value: 500, weight: 0 },
  { name: 'Bâton de combat extensible', description: 'Le bâton de Goku. S\'allonge à l\'infini et peut pointer vers la Lune. Dégâts: 2d8+FOR', category: 'arme' as const, rarity: 'tres_rare' as const, value: 8000, weight: 1 },
  { name: 'Épée Z (Trunks du Futur)', description: 'La légendaire épée de Trunks du Futur, forgée dans un métal indestructible. Dégâts: 3d6+8', category: 'arme' as const, rarity: 'legendaire' as const, value: 15000, weight: 4 },
  { name: 'Boules de Cristal (jeu de 7)', description: 'Les 7 Boules de Cristal légendaires. Invoquer Shenron pour exaucer 3 vœux par campagne.', category: 'magique' as const, rarity: 'artefact' as const, value: 99999, weight: 7 },
  { name: 'Radar à Boules de Cristal', description: 'L\'invention du Dr Brief. Localise les Boules de Cristal dans un rayon de 100km.', category: 'ressource' as const, rarity: 'peu_commun' as const, value: 1000, weight: 0 },
  { name: 'Capsule Capsule Corp', description: 'Une capsule qui se transforme en maison, véhicule ou équipement. 50 utilisations.', category: 'autre' as const, rarity: 'peu_commun' as const, value: 200, weight: 0 },
];

export const DRAGON_BALL_TECHNIQUES = [
  { name: 'Kamehameha', description: 'La technique signature de Goku. Concentre le Ki dans les paumes et libère une vague d\'énergie dévastatrice. Niveau 1+. Portée: 30m, Dégâts: 8d6 (Ki)', category: 'magique' as const, rarity: 'rare' as const },
  { name: 'Final Flash', description: 'La technique ultime de Vegeta. Charge tout le Ki en une fraction de seconde et libère un rayon qui pulvérise tout. Dégâts: 12d6 (Ki). Portée: 50m', category: 'magique' as const, rarity: 'legendaire' as const },
  { name: 'Makanko Sappo', description: 'La technique spirale de Piccolo. Peut percer n\'importe quelle armure. Dégâts: 6d8, perce la résistance.', category: 'magique' as const, rarity: 'rare' as const },
  { name: 'Masenko', description: 'Technique apprise de Piccolo par Gohan. Rapide et puissante. Dégâts: 5d8+SAG', category: 'magique' as const, rarity: 'peu_commun' as const },
  { name: 'Galick Gun', description: 'La réponse de Vegeta au Kamehameha. Aussi puissante mais plus rapide à charger. Dégâts: 8d6+FOR', category: 'magique' as const, rarity: 'rare' as const },
  { name: 'Énergie Dispersante (Android 18)', description: 'Android 18 libère de l\'énergie en toutes directions. Zone 10m autour. Dégâts: 4d6 à tous les ennemis.', category: 'magique' as const, rarity: 'peu_commun' as const },
];
