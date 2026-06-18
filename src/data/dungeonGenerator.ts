function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

const ROOM_TYPES = ['Grande salle','Couloir','Crypte','Cellule','Salle du trône','Armurerie','Bibliothèque','Laboratoire','Salle de méditation','Salle des gardes','Cachette','Oubliettes','Salle rituelle','Réfectoire','Caverne naturelle','Salle des cartes','Chambre secrète','Salle aux pièges','Égout','Forge infernale'];
const LIGHTING = ['plongée dans l\'obscurité totale','faiblement éclairée par des torches mourantes','illuminée par des champignons bioluminescents','éclairée par des flammes spectrales bleues','baignée d\'une lumière rougeâtre mystérieuse'];
const FLOOR = ['jonché d\'ossements brisés','couvert de mousses et de champignons','inondé de quelques centimètres d\'eau noirâtre','recouvert de glyphes gravés','de pierre nue et froide','de terre battue','de dalles traîtresses qui s\'enfoncent sous le poids'];
const WALLS = ['suintent d\'humidité','sont couverts de fresques représentant des sacrifices','portent les griffures de prisonniers','sont renforcés d\'acier rouillé','disparaissent dans l\'obscurité','sont ornés de crânes empilés','vibrent d\'une énergie magique'];
const SMELL = ['une odeur de soufre irrespirable','le parfum sucré de la putréfaction','une odeur de renfermé et d\'humidité','une senteur métallique de sang séché','un parfum d\'encens brûlé','une odeur de feu et de cendres'];
const SOUNDS = ['un silence total, oppressant','des gouttes d\'eau qui résonnent au loin','des grattements dans les murs','des murmures indistincts','le bruit sourd de quelque chose qui se déplace','un chant funèbre qui vient de nulle part'];

const TRAPS = [
  { name: 'Dalle piégée', description: 'La dalle s\'enfonce et déclenche une rafale de fléchettes empoisonnées (DC 15 Dex, 2D6 perforant + DC 13 Con ou 2D6 poison).', difficulty: 'DC 15' },
  { name: 'Fosse dissimulée', description: 'Un panneau de bois recouvert de poussière dissimule une fosse de 6 m (DC 12 Perception, 2D6 contondant par chute).', difficulty: 'DC 12' },
  { name: 'Gaz soporifique', description: 'Briser un fil déclenche une nuée de gaz (DC 14 Perception, DC 13 Con ou inconscient 1D4 heures).', difficulty: 'DC 14' },
  { name: 'Sphère de feu', description: 'Une rune explosant à l\'approche (DC 16 Arcanes, 4D6 feu rayon 3 m, DC 15 Dex demi-dégâts).', difficulty: 'DC 16' },
  { name: 'Mur coulissant', description: 'Un mécanisme referme la salle (DC 15 Investigation pour trouver la gâchette, DC 14 Force pour résister).', difficulty: 'DC 15' },
  { name: 'Plafond qui s\'abaisse', description: 'Des mécanismes font descendre le plafond (DC 13 Perception, 1D10 contondant par tour, DC 20 Force pour bloquer).', difficulty: 'DC 13' },
  { name: 'Projectiles magiques automatiques', description: 'Des orbites magiques se déclenchent (DC 17 Arcanes, attaque +6, 1D4+2 force chacun).', difficulty: 'DC 17' },
  { name: 'Filet renforcé', description: 'Un filet dissimulé capture les intrus (DC 13 Perception, DC 14 Force ou Dex pour se libérer).', difficulty: 'DC 13' },
  { name: 'Faux pas dans le vide', description: 'Le sol illusoire cache un vide (DC 14 Investigation ou 2D6 contondant, puis coincé en bas).', difficulty: 'DC 14' },
  { name: 'Statue qui crache du feu', description: 'La statue s\'active quand on lui tourne le dos (DC 16 Perception passive, 3D6 feu, DC 14 Dex demi).', difficulty: 'DC 16' },
];

const TREASURES = [
  '1D6×10 pièces d\'or dans une bourse de cuir',
  '2D10×5 pièces d\'argent et 1D4×10 pièces de cuivre',
  'Un rubis non taillé (valeur 2D6×10 po)',
  'Une statuette en ivoire représentant un dragon (valeur 50 po)',
  'Un rouleau de parchemin de sort de niveau 1',
  'Une clé en fer rouillé qui ouvre une serrure mystérieuse',
  'Un collier en argent serti d\'une améthyste (valeur 150 po)',
  'Un coffret de composantes de sorts rares (valeur 200 po)',
  'Une épée rouillée avec une inscription runique (pourrait être magique)',
  'Un grimoire contenant 2D4 sorts de niveau 1-2',
  'Une potion de soins cachée dans un crâne creux',
  '3D6×100 pièces d\'or dans un coffre rouillé',
  'Une carte partielle montrant les profondeurs du donjon',
  'Des bijoux royaux volés (valeur 1D4×100 po)',
  'Un objet magique aléatoire (commun)',
  'Un objet magique aléatoire (peu commun)',
  'Un parchemin de sort de niveau 3',
  'Des gemmes variées (valeur 2D4×50 po)',
];

const MONSTERS_LOW = ['2D6 squelettes','1D4 zombies','2D8 rats géants','1D6 kobolds','1D4 gobelins','1 gobelours','2D4 chauves-souris géantes'];
const MONSTERS_MID = ['1D3 goules','1D2 spectres','1 Gelatinous Cube','1D4 ghoules','1 Ombre','1D3 hobgobelins','1 trollette'];
const MONSTERS_HIGH = ['1D2 wraiths','1 vampire spawn','1 basilic','1D4 démons mineurs','1 momie','1D2 lich-knights'];

const BOSS_NAMES = ['le Nécromant','l\'Ombre-Roi','le Seigneur Vampire','la Liche Ancienne','le Gardien Élémental','le Dragon Endormi','l\'Archidémon','la Hag Primordiale','le Colosse de Pierre','la Méduse Éternelle'];
const BOSS_REWARDS = ['un objet magique rare','le grimoire du maître des lieux','la clé d\'une salle secrète','une rançon massive (2D6×500 po)','la connaissance de l\'emplacement d\'un artefact légendaire','une dette de faveur auprès d\'une divinité mineure'];

const NB_ROOMS_MIN = 4;
const NB_ROOMS_MAX = 8;

export interface DungeonRoom {
  id: number;
  name: string;
  description: string;
  hasTrap: boolean;
  trap?: typeof TRAPS[0];
  hasTreasure: boolean;
  treasure?: string;
  hasMonster: boolean;
  monster?: string;
  isBossRoom: boolean;
  bossName?: string;
  bossReward?: string;
}

export interface GeneratedDungeon {
  title: string;
  entrance: string;
  rooms: DungeonRoom[];
  secret: string;
}

export function generateDungeon(): GeneratedDungeon {
  const nbRooms = rand(NB_ROOMS_MIN, NB_ROOMS_MAX);
  const dungeonTheme = pick(['abandonné','maudit','infesté','gardé','sacré','démoniaque']);
  const dungeonOrigin = pick(['ancienne forteresse naine','temple elfique profané','cachette de guilde de voleurs','tombeau royal','laboratoire de mage fou','refuge de culte démoniaque']);

  const rooms: DungeonRoom[] = [];

  for (let i = 0; i < nbRooms; i++) {
    const isBoss = i === nbRooms - 1;
    const roomType = pick(ROOM_TYPES);
    const hasTrap = !isBoss && Math.random() < 0.35;
    const hasTreasure = Math.random() < 0.45;
    const hasMonster = !isBoss && Math.random() < 0.6;

    const level = i < nbRooms / 3 ? 'low' : i < (2 * nbRooms) / 3 ? 'mid' : 'high';
    const monsterList = level === 'low' ? MONSTERS_LOW : level === 'mid' ? MONSTERS_MID : MONSTERS_HIGH;

    rooms.push({
      id: i + 1,
      name: isBoss ? `Salle du Boss — Pièce ${i + 1}` : `${roomType} — Pièce ${i + 1}`,
      description: `${isBoss ? 'Un vaste espace' : 'La salle est'} ${pick(LIGHTING)}, le sol ${pick(FLOOR)}. Les murs ${pick(WALLS)}. Une odeur de ${pick(SMELL)} flotte dans l\'air. On entend ${pick(SOUNDS)}.`,
      hasTrap,
      trap: hasTrap ? pick(TRAPS) : undefined,
      hasTreasure,
      treasure: hasTreasure ? pick(TREASURES) : undefined,
      hasMonster,
      monster: hasMonster ? pick(monsterList) : undefined,
      isBossRoom: isBoss,
      bossName: isBoss ? pick(BOSS_NAMES) : undefined,
      bossReward: isBoss ? pick(BOSS_REWARDS) : undefined,
    });
  }

  return {
    title: `Donjon ${dungeonTheme} (ancienne ${dungeonOrigin})`,
    entrance: `L'entrée du donjon est ${pick(['une lourde porte de pierre scellée par des runes','une brèche dans un mur éboulé','une trappe cachée sous un tapis','une bouche d\'égout éboulée','un portail béant aux herbes folles'])}.`,
    rooms,
    secret: `Chambre secrète : derrière ${pick(['la bibliothèque','l\'autel','la statue','le trône','la forge'])}, un levier (DC 18 Investigation) ouvre un passage vers ${pick(['un trésor caché (3D6×100 po)','une salle de téléportation','un dépôt d\'armes magiques','les oubliettes','la chambre personnelle du maître des lieux'])}.`,
  };
}
