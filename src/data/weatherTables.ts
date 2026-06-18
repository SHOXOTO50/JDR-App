function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export type Season = 'printemps' | 'ete' | 'automne' | 'hiver';
export type Region = 'tempere' | 'tropical' | 'arctique' | 'desertique' | 'montagneux' | 'cotier';

export interface WeatherResult {
  condition: string;
  temperature: string;
  wind: string;
  visibility: string;
  effect: string;
  ambiance: string;
  icon: string;
}

const CONDITIONS: Record<Season, Record<Region, string[]>> = {
  printemps: {
    tempere: ['Ciel dégagé et ensoleillé','Nuages épars, beau temps','Légère pluie brumeuse','Averse modérée','Ciel couvert, pas de pluie','Arc-en-ciel après une pluie'],
    tropical: ['Chaleur humide et lourde','Pluie torrentielle tropicale','Soleil écrasant','Orage soudain','Brume matinale qui se dissipe','Cyclone en formation au loin'],
    arctique: ['Blizzard modéré','Ciel gris mais calme','Tempête de neige','Rare éclaircie sur la toundra','Neige légère et continue','Vent glacial cinglant'],
    desertique: ['Soleil de plomb','Tempête de sable','Vent chaud et sec','Mirage à l\'horizon','Nuit fraîche après une journée brûlante','Rare nuage voilant le soleil'],
    montagneux: ['Ciel clair mais froid','Brouillard dans les vallées','Averses soudaines','Neige au-dessus de 2000m','Vent violent dans les cols','Éclaircie au sommet'],
    cotier: ['Brise marine légère','Brouillard marin dense','Mer agitée, ciel gris','Tempête côtière','Belle journée ensoleillée sur la mer','Vague de chaleur côtière'],
  },
  ete: {
    tempere: ['Canicule épuisante','Journée chaude et humide','Ciel parfaitement bleu','Orage d\'été violent','Beau temps idéal pour voyager','Chaleur modérée, vent léger'],
    tropical: ['Mousson, pluie incessante','Chaleur et humidité maximales','Cyclone tropical','Journée étrangement calme entre deux orages','Inondations en formation','Soleil féroce entre les nuages'],
    arctique: ['Été arctique : soleil de minuit','Dégel et boue partout','Moustiques en nuées denses','Courte tempête estivale','Brume sur la toundra','Température presque agréable'],
    desertique: ['Chaleur mortelle (50°C)','Tempête de sable colossale','Nuit fraîche et étoilée','Vents brûlants (Sirocco)','Oasis de fraîcheur trompeuse','Ciel rouge au coucher du soleil'],
    montagneux: ['Journée idéale en altitude','Orage de montagne violent','Grêle surprise','Neige tardive au sommet','Avalanche lointaine audible','Brise fraîche sur les pentes'],
    cotier: ['Journée de voile idéale','Tempête maritime déchaînée','Brume froide sur la mer','Chaleur lourde, mer étale','Courant froid remontant à la surface','Vent de terre fort'],
  },
  automne: {
    tempere: ['Brouillard matinal épais','Pluie froide et continue','Journée dorée d\'automne','Vent violent balayant les feuilles','Gelée matinale','Ciel d\'acier, pluie imminente'],
    tropical: ['Fin de saison des pluies','Temps lourd et orageux','Cyclone de fin de saison','Journée encore chaude','Nuits fraîches qui arrivent','Pluies intermittentes'],
    arctique: ['Premières tempêtes hivernales','Nuit polaire qui commence','Neige épaisse','Froid mordant','Dernière lumière avant l\'hiver','Glace qui se forme sur les lacs'],
    desertique: ['Température enfin supportable','Vent du désert violent','Nuits glaciales','Pluie rarissime et intense','Sable rouge dans le ciel','Mirage persistant'],
    montagneux: ['Premières neiges en altitude','Chemins de montagne bloqués','Brouillard dans les cols','Journée claire mais froide','Vent de nord-est puissant','Avalanche précoce'],
    cotier: ['Mer mauvaise, vagues hautes','Tempête côtière automnale','Brouillard persistant','Bonne journée de pêche','Vent marin violent','Marée exceptionnelle'],
  },
  hiver: {
    tempere: ['Blizzard violent','Givre sur tout','Ciel dégagé mais froid (−10°C)','Neige légère et silencieuse','Verglas traître','Vent du nord cinglant'],
    tropical: ['Saison sèche, temps idéal','Nuits fraîches','Vents alizés agréables','Journée chaude et claire','Légère brise tropicale','Soleil tropical d\'hiver'],
    arctique: ['Nuit polaire complète','Tempête de neige dévastatrice','Froid extrême (−40°C)','Aurore boréale spectaculaire','Crevasses de glace','Ours polaire visible au loin'],
    desertique: ['Nuits glaciales sous les étoiles','Vent de sable hivernal','Jour froid et clair','Gel du désert la nuit','Rare précipitation hivernale','Ciel d\'hiver pur et dégagé'],
    montagneux: ['Montagne impraticable (blizzard)','Col bouché par la neige','Journée calme malgré le froid','Avalanche dangereuse','Crevasses cachées sous la neige fraîche','Tempête de verglas'],
    cotier: ['Mer déchaînée, tempête hivernale','Navigation impossible','Brouillard givrant','Journée hivernale ensoleillée en mer','Gel sur les amarres','Vague scélérate en mer'],
  },
};

const TEMPERATURES: Record<Region, Record<Season, string[]>> = {
  tempere: { printemps: ['10-15°C','15-20°C','8-12°C'], ete: ['25-35°C','28-32°C','20-25°C'], automne: ['5-15°C','2-10°C','10-18°C'], hiver: ['-5-5°C','-10-0°C','0-8°C'] },
  tropical: { printemps: ['28-35°C','30-38°C'], ete: ['30-40°C','32-42°C'], automne: ['26-34°C'], hiver: ['22-30°C','24-32°C'] },
  arctique: { printemps: ['-5-5°C','-10-0°C'], ete: ['5-15°C','0-10°C'], automne: ['-15- -5°C'], hiver: ['-40- -20°C','-30- -15°C'] },
  desertique: { printemps: ['20-40°C','25-45°C'], ete: ['35-55°C','40-60°C'], automne: ['15-35°C'], hiver: ['0-25°C','-5-20°C'] },
  montagneux: { printemps: ['0-10°C','5-15°C'], ete: ['10-20°C','15-25°C'], automne: ['-5-10°C'], hiver: ['-20- -5°C','-15-0°C'] },
  cotier: { printemps: ['12-18°C','15-22°C'], ete: ['22-30°C','25-35°C'], automne: ['10-18°C'], hiver: ['0-12°C','5-15°C'] },
};

const WINDS = ['Calme (vent nul)','Brise légère (5 km/h)','Vent modéré (20 km/h)','Vent fort (50 km/h)','Tempête (80 km/h)','Ouragan (120+ km/h)'];
const VISIBILITIES = ['Excellente (plus de 30 km)','Bonne (10-30 km)','Réduite (2-10 km)','Faible (moins de 2 km, brouillard)','Nulle (tempête de sable / blizzard)'];

const EFFECTS_BY_CONDITION = (cond: string): string => {
  if (cond.includes('blizzard') || cond.includes('Blizzard')) return 'Terrain difficile. −2 à tous les jets de Perception. Risque d\'hypothermie sans équipement adapté (DC 10 Con par heure).';
  if (cond.includes('orage') || cond.includes('Orage')) return 'Terrain difficile. Éclair possible (1% par heure à l\'extérieur). Désavantage aux jets de Perception basés sur l\'ouïe.';
  if (cond.includes('brouillard') || cond.includes('Brume')) return 'Zone légèrement obscurcie. Désavantage aux attaques à distance et aux jets de Perception visuelle. Risque de se perdre.';
  if (cond.includes('Chaleur') || cond.includes('canicule') || cond.includes('Soleil de plomb')) return 'Chaleur extrême. DC 10 Con par heure d\'activité intense sans eau. Risque d\'épuisement.';
  if (cond.includes('verglas') || cond.includes('Verglas') || cond.includes('Glace')) return 'Terrain glissant. Jet d\'Acrobaties DC 10 à chaque déplacement rapide ou risque de tomber à terre.';
  if (cond.includes('sable') || cond.includes('Sand')) return 'Zone obscurcie. Désavantage aux attaques à distance. Tous les équipements peuvent se gripper.';
  if (cond.includes('Ciel dégagé') || cond.includes('Beau temps') || cond.includes('Soleil') || cond.includes('clair')) return 'Conditions idéales. Aucun malus. Avantage aux jets de Survie pour se repérer.';
  return 'Conditions habituelles, aucun effet mécanique particulier.';
};

const AMBIANCDES: Record<Season, string[]> = {
  printemps: ['Les oiseaux chantent et les fleurs éclosent le long du chemin.','Un parfum de terre fraîche et de jeunes pousses flotte dans l\'air.','Des papillons dansent dans la lumière dorée du matin.','L\'herbe nouvelle est d\'un vert intense.'],
  ete: ['La chaleur fait vibrer l\'air à l\'horizon.','Des cigales stridulent dans les herbes sèches.','La lumière est aveuglante à midi.','Une brise chaude apporte l\'odeur de la résine des pins.'],
  automne: ['Les feuilles mortes tourbillonnent dans le vent.','Un voile de brume couvre les bois au lever du jour.','L\'odeur de la pluie sur la terre froide est omniprésente.','Des corbeaux crient au-dessus des champs dépouillés.'],
  hiver: ['Le silence de la neige fraîche étouffe tous les sons.','Le souffle se condense dans l\'air glacé.','Le craquement de la glace sous les pas est le seul bruit.','Un manteau blanc recouvre tout le paysage à perte de vue.'],
};

const ICONS: string[] = ['☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','🌬️','🌫️','🌪️','🏜️'];

function getIcon(cond: string): string {
  if (cond.includes('neige') || cond.includes('Neige') || cond.includes('blizzard') || cond.includes('Blizzard') || cond.includes('hivernale')) return '❄️';
  if (cond.includes('orage') || cond.includes('Orage') || cond.includes('Cyclone') || cond.includes('Tempête')) return '⛈️';
  if (cond.includes('pluie') || cond.includes('Pluie') || cond.includes('Averse')) return '🌧️';
  if (cond.includes('brouillard') || cond.includes('Brouillard') || cond.includes('Brume') || cond.includes('brume')) return '🌫️';
  if (cond.includes('sable') || cond.includes('désertique') || cond.includes('Sirocco')) return '🏜️';
  if (cond.includes('Vent') || cond.includes('vent')) return '🌬️';
  if (cond.includes('clair') || cond.includes('Ciel dégagé') || cond.includes('ensoleillé') || cond.includes('Ensoleillé') || cond.includes('Soleil')) return '☀️';
  return '⛅';
}

export function rollWeather(season: Season, region: Region): WeatherResult {
  const condList = CONDITIONS[season][region] || CONDITIONS[season]['tempere'];
  const condition = pick(condList);
  const tempList = TEMPERATURES[region]?.[season] || ['10-20°C'];
  return {
    condition,
    temperature: pick(tempList),
    wind: pick(WINDS),
    visibility: pick(VISIBILITIES),
    effect: EFFECTS_BY_CONDITION(condition),
    ambiance: pick(AMBIANCDES[season]),
    icon: getIcon(condition),
  };
}

export const SEASONS: Array<{ key: Season; label: string; icon: string }> = [
  { key: 'printemps', label: 'Printemps', icon: '🌸' },
  { key: 'ete', label: 'Été', icon: '☀️' },
  { key: 'automne', label: 'Automne', icon: '🍂' },
  { key: 'hiver', label: 'Hiver', icon: '❄️' },
];

export const REGIONS: Array<{ key: Region; label: string; icon: string }> = [
  { key: 'tempere', label: 'Tempéré', icon: '🌲' },
  { key: 'tropical', label: 'Tropical', icon: '🌴' },
  { key: 'arctique', label: 'Arctique', icon: '🧊' },
  { key: 'desertique', label: 'Désertique', icon: '🏜️' },
  { key: 'montagneux', label: 'Montagneux', icon: '⛰️' },
  { key: 'cotier', label: 'Côtier', icon: '🌊' },
];
