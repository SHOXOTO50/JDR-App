export const DB_QUEST_TEMPLATES = [
  {
    title: 'Rassembler les 7 Boules de Cristal',
    description: 'Parcourez le monde pour trouver les 7 Boules de Cristal légendaires et invoquer Shenron afin d\'exaucer un vœu décisif pour la campagne.',
    reward: '5 000 XP, Vœu Shenron (1 utilisation)',
    type: 'principale' as const,
    objectives: [
      'Localiser les Boules de Cristal avec le Radar',
      'Collecter les 7 Boules (4-étoiles, 3-étoiles, etc.)',
      'Prononcer l\'invocation en présence du groupe',
      'Formuler le vœu collectivement',
    ],
  },
  {
    title: 'Atteindre le Super Saiyan',
    description: 'Votre guerrier Saiyan sent une puissance insoupçonnée en lui. Suivez l\'entraînement légendaire pour déclencher la transformation Super Saiyan.',
    reward: '2 500 XP, Trait : Super Saiyan (×2 FOR pendant 3 rounds)',
    type: 'principale' as const,
    objectives: [
      'S\'entraîner dans la Chambre du Temps (8h in-game)',
      'Subir une perte déchirante ou une colère extrême',
      'Réussir un jet de Constitution DC 20 sous pression',
      'Déclencher la transformation en combat',
    ],
  },
  {
    title: 'Infiltrer le Tournoi du Pouvoir',
    description: 'Le Grand Prêtre a annoncé le Tournoi. Votre univers doit aligner 10 guerriers. Recrutez les combattants manquants avant l\'heure limite.',
    reward: '3 000 XP par guerrier recruté',
    type: 'principale' as const,
    objectives: [
      'Convaincre Piccolo (Diplomatie DC 14)',
      'Retrouver Android 17 sur son île',
      'Persuader Maître Roshi (test de sagesse)',
      'Réveiller le pouvoir endormi de Gohan',
    ],
  },
  {
    title: 'Obtenir les Sénigaines de Karin',
    description: 'La Tour de Karin abrite les précieuses Sénigaines. Escaladez la tour et prouvez votre valeur au vieux Maître des Arts Martiaux.',
    reward: '3× Sénigaines, 800 XP',
    type: 'secondaire' as const,
    objectives: [
      'Escalader la Tour de Karin (Athlétisme DC 16)',
      'Affronter Karin en combat d\'entraînement',
      'Démontrer un acte de courage ou de sacrifice',
      'Recevoir les Sénigaines des mains de Karin',
    ],
  },
  {
    title: 'Maîtriser la technique Kamehameha',
    description: 'Roshi vous a légué les bases du Kamehameha. Il vous faut maintenant des heures d\'entraînement pour maîtriser ce rayon dévastateur.',
    reward: '1 000 XP, Technique : Kamehameha (Niv.1)',
    type: 'secondaire' as const,
    objectives: [
      'Méditer 4 heures pour canaliser le Ki',
      'Réussir 5 tests de Canalisation de Ki (DC 12)',
      'Frapper une cible statique à 30 mètres',
      'Utiliser le Kamehameha en combat réel',
    ],
  },
  {
    title: 'Détruire l\'Armée du Dragon Rouge',
    description: 'L\'Armée du Dragon Rouge menace les villages du Continent de l\'Est. Neutralisez leurs bases et défaites leur commandant.',
    reward: '2 000 XP, Armure Dragon Rouge améliorée',
    type: 'principale' as const,
    objectives: [
      'Localiser les 3 bases de l\'Armée',
      'Infiltrer le quartier général (Discrétion DC 15)',
      'Neutraliser le Général Red',
      'Libérer les villageois capturés',
    ],
  },
];

export const DB_QUEST_HINTS = [
  'Cherchez les Boules de Cristal dans des temples en ruines ou des montagnes inaccessibles.',
  'La technique d\'un guerrier se perfectionne dans la douleur et l\'adversité.',
  'Un rival peut devenir un allié quand l\'ennemi est assez puissant.',
  'Le Ki se mesure non pas à la force brute, mais à la pureté d\'intention.',
  'Les Sénigaines ne soignent que les guerriers qui méritent de combattre.',
];
