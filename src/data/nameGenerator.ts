const FIRST_MALE = ['Aldric','Brom','Caelan','Darian','Edrin','Faelen','Garet','Hadrian','Idris','Jorick','Kael','Lorcan','Malachar','Niran','Oswin','Percival','Quillan','Rowan','Soren','Theron','Ulric','Vayne','Wren','Xander','Yorick','Zane','Aldaron','Braith','Calix','Darvyn','Emrick','Ferian','Gideon','Halvar','Ivor','Jareth'];
const FIRST_FEMALE = ['Aelith','Brynn','Caelynn','Daria','Eirwen','Faela','Gwyn','Hana','Iris','Jael','Kira','Lyra','Mira','Nadia','Oryn','Petra','Quilara','Ryn','Seraphine','Thea','Ulara','Vael','Wynna','Xyla','Yael','Zara','Asha','Brea','Calla','Dwyn','Eira','Faye','Genna','Halia','Isara','Jade'];
const FIRST_NEUTRAL = ['Aeven','Blix','Ceri','Dael','Eron','Fael','Gael','Hael','Isen','Jael','Kael','Lael','Mael','Nael','Orin','Pren','Quin','Rael','Sael','Tael','Urel','Vael','Wael','Xael','Yael','Zael'];
const LAST_NAMES = ['Ashwood','Blackthorn','Coldwater','Dawnblade','Emberglow','Frostmantle','Goldleaf','Hammerfall','Ironsong','Jadehaven','Keenblade','Lightbringer','Moonwhisper','Nightshadow','Oakheart','Pyreborn','Quicksilver','Ravensong','Stormcrow','Thornwall','Underhill','Voidwalker','Wildhorn','Xandrel','Yellowleaf','Zephyr','Stonefist','Silverwind','Redhawk','Proudmane','Oakenfield','Nightfall','Murkwater','Longsword','Brightwater','Cindervale'];

const CITY_PREFIX = ['Aer','Al','Bel','Bor','Cal','Dar','El','Em','Fal','Gal','Gar','Helm','High','Ir','Khal','Mal','Mar','Mid','Nord','Old','Port','Red','Rock','Shade','Silver','Stone','Storm','Swift','Twin','Vale','Wind','Wood'];
const CITY_SUFFIX = ['bridge','crest','dale','deep','field','ford','gate','grove','hall','haven','helm','hill','keep','lake','light','moor','mount','peak','port','reach','ridge','rock','run','shire','shore','spire','stead','stone','vale','water','watch','well','wood','wick'];

const TAVERN_ADJ = ['Affamé','Barbu','Boiteux','Brave','Crasseux','Doré','Étrange','Fier','Fou','Gai','Géant','Grincheux','Ivre','Jovial','Malin','Mélancolique','Mystérieux','Noble','Noir','Pâle','Poilu','Rouge','Rusé','Sage','Sauvage','Sombre','Tordu','Vieux','Vif'];
const TAVERN_ANIMAL = ['Aigle','Bouc','Chat','Chien','Corbeau','Cochon','Crane','Dragon','Épervier','Faucon','Grenouille','Hibou','Lapin','Loup','Mouton','Nain','Ours','Parchemin','Poulpe','Renard','Sanglier','Serpent','Vipère','Wyverne','Yéti'];

const NPC_ROLES = ['le Forgeron','la Servante','le Marchand','l\'Aubergiste','le Garde','le Voleur','la Sorcière','le Prêtre','la Chasseuse','l\'Érudit','le Barde','la Fermière','le Chevalier','l\'Espion','la Médecin','le Contrebandier','l\'Explorateur'];
const CREATURE_ADJ = ['Ancien','Corrompu','Éternel','Féroce','Gigantesque','Impitoyable','Maudit','Mortel','Obscur','Puissant','Sanguinaire','Terrifiant','Vénéneux','Vicieux'];
const CREATURE_NAMES = ['Araignée','Basilic','Chimère','Démon','Élémental','Fantôme','Gobelin','Harpy','Infernal','Lézard','Mimique','Nécromant','Ogre','Phénix','Quetzal','Rôdeur','Squelette','Troll','Ombre','Vampire','Worg','Xorn','Yéti','Zombie'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }

export type NameCategory = 'male' | 'female' | 'neutral' | 'city' | 'tavern' | 'npc' | 'creature';

export function generateName(category: NameCategory): string {
  switch (category) {
    case 'male': return `${pick(FIRST_MALE)} ${pick(LAST_NAMES)}`;
    case 'female': return `${pick(FIRST_FEMALE)} ${pick(LAST_NAMES)}`;
    case 'neutral': return `${pick(FIRST_NEUTRAL)} ${pick(LAST_NAMES)}`;
    case 'city': return `${pick(CITY_PREFIX)}${pick(CITY_SUFFIX)}`;
    case 'tavern': return `L${Math.random() > 0.5 ? 'e' : 'a'} ${pick(TAVERN_ADJ)} ${pick(TAVERN_ANIMAL)}`;
    case 'npc': return `${pick([...FIRST_MALE, ...FIRST_FEMALE])} ${pick(LAST_NAMES)}, ${pick(NPC_ROLES)}`;
    case 'creature': return `${pick(CREATURE_ADJ)} ${pick(CREATURE_NAMES)}`;
  }
}

export function generateMultiple(category: NameCategory, count: number): string[] {
  return Array.from({ length: count }, () => generateName(category));
}

export const NAME_CATEGORIES: Array<{ key: NameCategory; label: string; icon: string }> = [
  { key: 'male', label: 'Prénom masculin', icon: '⚔️' },
  { key: 'female', label: 'Prénom féminin', icon: '🌙' },
  { key: 'neutral', label: 'Prénom neutre', icon: '✨' },
  { key: 'city', label: 'Ville / Village', icon: '🏰' },
  { key: 'tavern', label: 'Taverne', icon: '🍺' },
  { key: 'npc', label: 'PNJ complet', icon: '🧙' },
  { key: 'creature', label: 'Créature', icon: '👹' },
];
