export type ItemCategory = 'arme_simple' | 'arme_martiale' | 'armure_legere' | 'armure_moyenne' | 'armure_lourde' | 'bouclier' | 'consommable' | 'aventure' | 'magique_commun' | 'magique_peu_commun' | 'magique_rare' | 'magique_tres_rare' | 'magique_legendaire';
export type Rarity = 'standard' | 'commun' | 'peu commun' | 'rare' | 'très rare' | 'légendaire';

export interface LibraryItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  cost: string;
  weight: string;
  description: string;
  damage?: string;
  properties?: string[];
  ac?: string;
}

export const EQUIPMENT_LIBRARY: LibraryItem[] = [
  // ARMES SIMPLES CORPS-À-CORPS
  { id: 'club', name: 'Gourdin', category: 'arme_simple', rarity: 'standard', cost: '1 pa', weight: '1 kg', description: 'Un bâton court et épais.', damage: '1D4 contondant', properties: ['Légère'] },
  { id: 'dagger', name: 'Dague', category: 'arme_simple', rarity: 'standard', cost: '2 po', weight: '0,5 kg', description: 'Une courte lame à double tranchant.', damage: '1D4 perforant', properties: ['Finesse', 'Légère', 'Lancer (6/18)'] },
  { id: 'handaxe', name: 'Hachette', category: 'arme_simple', rarity: 'standard', cost: '5 po', weight: '1 kg', description: 'Une petite hache maniable.', damage: '1D6 tranchant', properties: ['Légère', 'Lancer (6/20)'] },
  { id: 'javelin', name: 'Javeline', category: 'arme_simple', rarity: 'standard', cost: '5 pa', weight: '1 kg', description: 'Un javelot léger pour le lancer.', damage: '1D6 perforant', properties: ['Lancer (9/36)'] },
  { id: 'quarterstaff', name: 'Bâton', category: 'arme_simple', rarity: 'standard', cost: '2 pa', weight: '2 kg', description: 'Un bâton de bois à deux bouts.', damage: '1D6 contondant', properties: ['Polyvalente (1D8)'] },
  { id: 'spear', name: 'Lance', category: 'arme_simple', rarity: 'standard', cost: '1 po', weight: '1,5 kg', description: 'Une arme d\'hast simple.', damage: '1D6 perforant', properties: ['Lancer (6/18)', 'Polyvalente (1D8)'] },
  { id: 'mace', name: 'Masse d\'armes', category: 'arme_simple', rarity: 'standard', cost: '5 po', weight: '2 kg', description: 'Une masse à tête en métal.', damage: '1D6 contondant', properties: [] },
  { id: 'greatclub', name: 'Grand gourdin', category: 'arme_simple', rarity: 'standard', cost: '2 pa', weight: '5 kg', description: 'Un gros gourdin à deux mains.', damage: '1D8 contondant', properties: ['À deux mains'] },

  // ARMES SIMPLES À DISTANCE
  { id: 'shortbow', name: 'Arc court', category: 'arme_simple', rarity: 'standard', cost: '25 po', weight: '1 kg', description: 'Un arc court idéal pour la mobilité.', damage: '1D6 perforant', properties: ['Munitions (18/72)', 'À deux mains'] },
  { id: 'crossbow_light', name: 'Arbalète légère', category: 'arme_simple', rarity: 'standard', cost: '25 po', weight: '2,5 kg', description: 'Une arbalète compacte.', damage: '1D8 perforant', properties: ['Munitions (24/96)', 'Chargement', 'À deux mains'] },
  { id: 'sling', name: 'Fronde', category: 'arme_simple', rarity: 'standard', cost: '1 pa', weight: '—', description: 'Une simple fronde de cuir.', damage: '1D4 contondant', properties: ['Munitions (9/36)'] },

  // ARMES MARTIALES CORPS-À-CORPS
  { id: 'shortsword', name: 'Épée courte', category: 'arme_martiale', rarity: 'standard', cost: '10 po', weight: '1 kg', description: 'Une épée légère à double tranchant.', damage: '1D6 perforant', properties: ['Finesse', 'Légère'] },
  { id: 'longsword', name: 'Épée longue', category: 'arme_martiale', rarity: 'standard', cost: '15 po', weight: '1,5 kg', description: 'La lame classique du guerrier.', damage: '1D8 tranchant', properties: ['Polyvalente (1D10)'] },
  { id: 'greatsword', name: 'Épée à deux mains', category: 'arme_martiale', rarity: 'standard', cost: '50 po', weight: '3 kg', description: 'Une imposante épée à deux mains.', damage: '2D6 tranchant', properties: ['À deux mains', 'Lourde'] },
  { id: 'battleaxe', name: 'Hache de bataille', category: 'arme_martiale', rarity: 'standard', cost: '10 po', weight: '2 kg', description: 'Une hache à lame large.', damage: '1D8 tranchant', properties: ['Polyvalente (1D10)'] },
  { id: 'greataxe', name: 'Hache à deux mains', category: 'arme_martiale', rarity: 'standard', cost: '30 po', weight: '3,5 kg', description: 'Une hache massive.', damage: '1D12 tranchant', properties: ['À deux mains', 'Lourde'] },
  { id: 'rapier', name: 'Rapière', category: 'arme_martiale', rarity: 'standard', cost: '25 po', weight: '1 kg', description: 'Une lame fine et précise.', damage: '1D8 perforant', properties: ['Finesse'] },
  { id: 'warhammer', name: 'Marteau de guerre', category: 'arme_martiale', rarity: 'standard', cost: '15 po', weight: '2 kg', description: 'Un marteau de combat solide.', damage: '1D8 contondant', properties: ['Polyvalente (1D10)'] },
  { id: 'maul', name: 'Marteau de siège', category: 'arme_martiale', rarity: 'standard', cost: '10 po', weight: '5 kg', description: 'Un énorme marteau à deux mains.', damage: '2D6 contondant', properties: ['À deux mains', 'Lourde'] },
  { id: 'flail', name: 'Fléau d\'armes', category: 'arme_martiale', rarity: 'standard', cost: '10 po', weight: '1 kg', description: 'Une boule hérissée au bout d\'une chaîne.', damage: '1D8 contondant', properties: [] },
  { id: 'glaive', name: 'Coutelas', category: 'arme_martiale', rarity: 'standard', cost: '20 po', weight: '3 kg', description: 'Une large lame au bout d\'un long manche.', damage: '1D10 tranchant', properties: ['Allonge', 'À deux mains', 'Lourde'] },
  { id: 'halberd', name: 'Hallebarde', category: 'arme_martiale', rarity: 'standard', cost: '20 po', weight: '3 kg', description: 'Une arme combinant hache et lance.', damage: '1D10 tranchant', properties: ['Allonge', 'À deux mains', 'Lourde'] },
  { id: 'lance', name: 'Lance de cavalerie', category: 'arme_martiale', rarity: 'standard', cost: '10 po', weight: '3 kg', description: 'Une longue lance pour cavalier.', damage: '1D12 perforant', properties: ['Allonge', 'Spéciale'] },

  // ARMES MARTIALES À DISTANCE
  { id: 'longbow', name: 'Arc long', category: 'arme_martiale', rarity: 'standard', cost: '50 po', weight: '1 kg', description: 'Un grand arc puissant.', damage: '1D8 perforant', properties: ['Munitions (45/180)', 'Lourde', 'À deux mains'] },
  { id: 'crossbow_heavy', name: 'Arbalète lourde', category: 'arme_martiale', rarity: 'standard', cost: '50 po', weight: '9 kg', description: 'Une arbalète puissante mais lente.', damage: '1D10 perforant', properties: ['Munitions (30/120)', 'Lourde', 'Chargement', 'À deux mains'] },
  { id: 'crossbow_hand', name: 'Arbalète de poing', category: 'arme_martiale', rarity: 'standard', cost: '75 po', weight: '1.5 kg', description: 'Une arbalète miniature à une main.', damage: '1D6 perforant', properties: ['Munitions (9/36)', 'Légère', 'Chargement'] },

  // ARMURES LÉGÈRES
  { id: 'padded', name: 'Armure matelassée', category: 'armure_legere', rarity: 'standard', cost: '5 po', weight: '4 kg', description: 'Du tissu doublé offrant une protection minimale.', ac: '11 + Dex' },
  { id: 'leather', name: 'Armure de cuir', category: 'armure_legere', rarity: 'standard', cost: '10 po', weight: '5 kg', description: 'Du cuir bouilli pour la protection.', ac: '11 + Dex' },
  { id: 'studded_leather', name: 'Armure de cuir clouté', category: 'armure_legere', rarity: 'standard', cost: '45 po', weight: '6,5 kg', description: 'Du cuir renforcé de rivets métalliques.', ac: '12 + Dex' },

  // ARMURES MOYENNES
  { id: 'hide', name: 'Armure de peau', category: 'armure_moyenne', rarity: 'standard', cost: '10 po', weight: '6 kg', description: 'Des peaux grossièrement travaillées.', ac: '12 + Dex (max +2)' },
  { id: 'chain_shirt', name: 'Chemise de mailles', category: 'armure_moyenne', rarity: 'standard', cost: '50 po', weight: '10 kg', description: 'Une cotte de mailles légère.', ac: '13 + Dex (max +2)' },
  { id: 'scale', name: 'Armure d\'écailles', category: 'armure_moyenne', rarity: 'standard', cost: '50 po', weight: '22,5 kg', description: 'Des écailles métalliques sur cuir.', ac: '14 + Dex (max +2)' },
  { id: 'breastplate', name: 'Plastron', category: 'armure_moyenne', rarity: 'standard', cost: '400 po', weight: '10 kg', description: 'Un plastron métallique bien ajusté.', ac: '14 + Dex (max +2)' },
  { id: 'half_plate', name: 'Demi-plate', category: 'armure_moyenne', rarity: 'standard', cost: '750 po', weight: '20 kg', description: 'Plaques métalliques couvrant le corps partiellement.', ac: '15 + Dex (max +2)' },

  // ARMURES LOURDES
  { id: 'ring_mail', name: 'Cotte de plaques', category: 'armure_lourde', rarity: 'standard', cost: '30 po', weight: '18 kg', description: 'Du cuir avec des anneaux de métal cousus.', ac: '14' },
  { id: 'chain_mail', name: 'Cotte de mailles', category: 'armure_lourde', rarity: 'standard', cost: '75 po', weight: '27,5 kg', description: 'Un armure de maillons entrecroisés.', ac: '16' },
  { id: 'splint', name: 'Armure de lamelles', category: 'armure_lourde', rarity: 'standard', cost: '200 po', weight: '30 kg', description: 'Bandes métalliques fixées sur du cuir.', ac: '17' },
  { id: 'plate', name: 'Harnois', category: 'armure_lourde', rarity: 'standard', cost: '1500 po', weight: '32,5 kg', description: 'L\'armure intégrale ultime du chevalier.', ac: '18' },

  // BOUCLIER
  { id: 'shield', name: 'Bouclier', category: 'bouclier', rarity: 'standard', cost: '10 po', weight: '3 kg', description: 'Un bouclier en bois ou métal.', ac: '+2' },

  // CONSOMMABLES
  { id: 'potion_healing', name: 'Potion de soins', category: 'consommable', rarity: 'commun', cost: '50 po', weight: '0,5 kg', description: 'Restaure 2D4+2 points de vie.' },
  { id: 'potion_healing_greater', name: 'Potion de grands soins', category: 'consommable', rarity: 'peu commun', cost: '150 po', weight: '0,5 kg', description: 'Restaure 4D4+4 points de vie.' },
  { id: 'potion_healing_superior', name: 'Potion de soins supérieurs', category: 'consommable', rarity: 'rare', cost: '500 po', weight: '0,5 kg', description: 'Restaure 8D4+8 points de vie.' },
  { id: 'potion_healing_supreme', name: 'Potion de soins suprêmes', category: 'consommable', rarity: 'très rare', cost: '5000 po', weight: '0,5 kg', description: 'Restaure 10D4+20 points de vie.' },
  { id: 'antitoxin', name: 'Antitoxine', category: 'consommable', rarity: 'standard', cost: '50 po', weight: '0,25 kg', description: 'Avantage aux jets de sauvegarde contre le poison pendant 1 heure.' },
  { id: 'acid_vial', name: 'Fiole d\'acide', category: 'consommable', rarity: 'standard', cost: '25 po', weight: '0,5 kg', description: 'Inflige 2D6 dégâts d\'acide à l\'impact (CA 13).' },
  { id: 'alchemist_fire', name: 'Feu d\'alchimiste', category: 'consommable', rarity: 'standard', cost: '50 po', weight: '0,5 kg', description: 'Inflige 1D4 dégâts de feu par tour jusqu\'à extinction (CA 13).' },
  { id: 'holy_water', name: 'Eau bénite', category: 'consommable', rarity: 'standard', cost: '25 po', weight: '0,5 kg', description: 'Inflige 2D6 radiants aux fiélons et morts-vivants.' },
  { id: 'potion_strength', name: 'Potion de force de géant', category: 'consommable', rarity: 'peu commun', cost: '200 po', weight: '0,5 kg', description: 'Force de 21 pendant 1 heure (force de géant des collines).' },
  { id: 'potion_invisibility', name: 'Potion d\'invisibilité', category: 'consommable', rarity: 'rare', cost: '1000 po', weight: '0,5 kg', description: 'Invisible pendant 1 heure ou jusqu\'à attaque/sort.' },
  { id: 'potion_flying', name: 'Potion de vol', category: 'consommable', rarity: 'rare', cost: '500 po', weight: '0,5 kg', description: 'Vitesse de vol 18 m pendant 1 heure.' },
  { id: 'potion_resistance', name: 'Potion de résistance', category: 'consommable', rarity: 'peu commun', cost: '300 po', weight: '0,5 kg', description: 'Résistance à un type de dégâts pendant 1 heure.' },
  { id: 'scroll_revivify', name: 'Parchemin de Rappel à la vie', category: 'consommable', rarity: 'rare', cost: '300 po', weight: '—', description: 'Ramène une créature morte depuis moins d\'1 minute (1 PV).' },
  { id: 'scroll_fireball', name: 'Parchemin de Boule de feu', category: 'consommable', rarity: 'rare', cost: '300 po', weight: '—', description: 'Lance le sort Boule de feu (8D6 feu, rayon 6 m).' },
  { id: 'scroll_teleport', name: 'Parchemin de Téléportation', category: 'consommable', rarity: 'très rare', cost: '5000 po', weight: '—', description: 'Téléporte vers un endroit connu sur le même plan.' },

  // ÉQUIPEMENT D'AVENTURIER
  { id: 'rope_hemp', name: 'Corde de chanvre (15m)', category: 'aventure', rarity: 'standard', cost: '1 po', weight: '5 kg', description: 'Une corde solide pour l\'escalade.' },
  { id: 'rope_silk', name: 'Corde de soie (15m)', category: 'aventure', rarity: 'standard', cost: '10 po', weight: '2,5 kg', description: 'Légère et solide, préférée des voleurs.' },
  { id: 'torch', name: 'Torche', category: 'aventure', rarity: 'standard', cost: '1 pc', weight: '0,5 kg', description: 'Lumière 9 m sur 1 heure, 6 m de lumière tamisée.' },
  { id: 'lantern_hooded', name: 'Lanterne à capote', category: 'aventure', rarity: 'standard', cost: '5 po', weight: '1 kg', description: 'Lumière orientable 9 m, 1 heure d\'huile.' },
  { id: 'thieves_tools', name: 'Outils de voleur', category: 'aventure', rarity: 'standard', cost: '25 po', weight: '0,5 kg', description: 'Crochets, lime et pinces pour les serrures et pièges.' },
  { id: 'healer_kit', name: 'Trousse de soins', category: 'aventure', rarity: 'standard', cost: '5 po', weight: '1,5 kg', description: 'Stabilise un personnage à 0 PV (10 utilisations).' },
  { id: 'grappling_hook', name: 'Grappin', category: 'aventure', rarity: 'standard', cost: '2 po', weight: '2 kg', description: 'Un crochet à lancer pour l\'escalade.' },
  { id: 'spellbook', name: 'Grimoire vierge', category: 'aventure', rarity: 'standard', cost: '50 po', weight: '1.5 kg', description: 'Grimoire vide de 100 pages pour un magicien.' },
  { id: 'holy_symbol', name: 'Symbole sacré', category: 'aventure', rarity: 'standard', cost: '5 po', weight: '0,5 kg', description: 'Focalisateur pour sorts divins.' },
  { id: 'arcane_focus', name: 'Focalisateur arcanique (baguette)', category: 'aventure', rarity: 'standard', cost: '10 po', weight: '0,5 kg', description: 'Focalisateur pour sorts arcaniques.' },
  { id: 'backpack', name: 'Sac à dos', category: 'aventure', rarity: 'standard', cost: '2 po', weight: '2,5 kg', description: 'Un sac à dos standard (30 kg).' },
  { id: 'bedroll', name: 'Rouleau de couchage', category: 'aventure', rarity: 'standard', cost: '1 po', weight: '3,5 kg', description: 'Pour dormir confortablement en dehors d\'une auberge.' },
  { id: 'rations', name: 'Ration (1 jour)', category: 'aventure', rarity: 'standard', cost: '5 pa', weight: '1 kg', description: 'Nourriture et eau pour une journée d\'aventure.' },
  { id: 'waterskin', name: 'Outre', category: 'aventure', rarity: 'standard', cost: '2 pa', weight: '2,5 kg', description: 'Contient 2 kg d\'eau.' },
  { id: 'caltrops', name: 'Chausse-trapes (sac de 20)', category: 'aventure', rarity: 'standard', cost: '1 po', weight: '1 kg', description: 'Ralentit les créatures de 4,5 m qui marchent dessus (1D4 perforant).' },

  // OBJETS MAGIQUES COMMUNS
  { id: 'bag_holding', name: 'Sac de transport', category: 'magique_peu_commun', rarity: 'peu commun', cost: '—', weight: '0,25 kg', description: 'Contient jusqu\'à 250 kg dans un espace de 120 litres (pèse toujours 0,25 kg).' },
  { id: 'boots_elvenkind', name: 'Bottes elfiques', category: 'magique_peu_commun', rarity: 'peu commun', cost: '—', weight: '0,5 kg', description: 'Avantage aux jets de Discrétion liés au déplacement.' },
  { id: 'cloak_protection', name: 'Cape de protection', category: 'magique_peu_commun', rarity: 'peu commun', cost: '—', weight: '0,25 kg', description: '+1 à la CA et aux jets de sauvegarde.' },
  { id: 'gauntlets_ogre', name: 'Gantelets de la puissance ogre', category: 'magique_peu_commun', rarity: 'peu commun', cost: '—', weight: '1 kg', description: 'Force de 19 tant que portés.' },
  { id: 'ring_protection', name: 'Anneau de protection', category: 'magique_rare', rarity: 'rare', cost: '—', weight: '—', description: '+1 à la CA et aux jets de sauvegarde.' },
  { id: 'flame_tongue', name: 'Langue de feu', category: 'magique_rare', rarity: 'rare', cost: '—', weight: '1,5 kg', description: 'Épée longue qui peut s\'enflammer (2D6 feu supplémentaires).' },
  { id: 'belt_giant_strength', name: 'Ceinture de force de géant des pierres', category: 'magique_rare', rarity: 'rare', cost: '—', weight: '0,5 kg', description: 'Force de 23 tant que portée.' },
  { id: 'ring_spell_storing', name: 'Anneau de stockage de sorts', category: 'magique_rare', rarity: 'rare', cost: '—', weight: '—', description: 'Stocke jusqu\'à 5 niveaux de sorts à lancer plus tard.' },
  { id: 'staff_power', name: 'Bâton de pouvoir', category: 'magique_tres_rare', rarity: 'très rare', cost: '—', weight: '2 kg', description: 'Bâton +2 avec de nombreux sorts (20 charges). Entraîne une explosion si brisé.' },
  { id: 'sword_sharpness', name: 'Épée tranchante', category: 'magique_tres_rare', rarity: 'très rare', cost: '—', weight: '1,5 kg', description: 'Épée longue +3. Sur 20 : tranche un membre.' },
  { id: 'vorpal_sword', name: 'Épée vorpale', category: 'magique_legendaire', rarity: 'légendaire', cost: '—', weight: '1,5 kg', description: 'Épée +3. Ignore résistances et immunités. 20 naturel = décapitation.' },
  { id: 'sphere_annihilation', name: 'Sphère d\'annihilation', category: 'magique_legendaire', rarity: 'légendaire', cost: '—', weight: '—', description: 'Détruit tout ce qu\'elle touche. Extrêmement dangereuse.' },
  { id: 'holy_avenger', name: 'Défenseur sacré', category: 'magique_legendaire', rarity: 'légendaire', cost: '—', weight: '1,5 kg', description: 'Épée +3 pour paladins. 2D10 radiants sur fiélons et morts-vivants. Aura de protection.' },
  { id: 'ring_three_wishes', name: 'Anneau des trois vœux', category: 'magique_legendaire', rarity: 'légendaire', cost: '—', weight: '—', description: 'Contient 1D3 charges du sort Vœu. Une fois vidé, n\'est plus magique.' },
];

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  arme_simple: 'Armes simples',
  arme_martiale: 'Armes martiales',
  armure_legere: 'Armures légères',
  armure_moyenne: 'Armures moyennes',
  armure_lourde: 'Armures lourdes',
  bouclier: 'Boucliers',
  consommable: 'Consommables',
  aventure: 'Équipement d\'aventurier',
  magique_commun: 'Objets magiques (communs)',
  magique_peu_commun: 'Objets magiques (peu communs)',
  magique_rare: 'Objets magiques (rares)',
  magique_tres_rare: 'Objets magiques (très rares)',
  magique_legendaire: 'Objets magiques (légendaires)',
};

export const RARITY_COLORS: Record<Rarity, string> = {
  standard: '#9ca3af',
  commun: '#22c55e',
  'peu commun': '#3b82f6',
  rare: '#a855f7',
  'très rare': '#f59e0b',
  légendaire: '#ef4444',
};

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  arme_simple: '🗡️',
  arme_martiale: '⚔️',
  armure_legere: '🧥',
  armure_moyenne: '🛡️',
  armure_lourde: '🪖',
  bouclier: '🛡️',
  consommable: '🧪',
  aventure: '🎒',
  magique_commun: '✨',
  magique_peu_commun: '💙',
  magique_rare: '💜',
  magique_tres_rare: '🟡',
  magique_legendaire: '🔴',
};

export const ITEM_CATEGORIES_ORDER: ItemCategory[] = [
  'arme_simple', 'arme_martiale', 'armure_legere', 'armure_moyenne', 'armure_lourde', 'bouclier',
  'consommable', 'aventure', 'magique_commun', 'magique_peu_commun', 'magique_rare', 'magique_tres_rare', 'magique_legendaire',
];
