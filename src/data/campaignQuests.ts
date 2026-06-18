import { QuestType } from '../types';

export interface CampaignQuestTemplate {
  title: string;
  description: string;
  reward: string;
  type: QuestType;
  objectives: string[];
}

export interface CampaignQuestPack {
  id: string;
  label: string;
  icon: string;
  description: string;
  matchSystems?: string[];   // si défini, proposé automatiquement pour ces systèmes
  matchName?: RegExp;        // si défini, proposé pour les campagnes dont le nom correspond
  quests: CampaignQuestTemplate[];
}

// ─────────────────────────────────────────────────────────────────────────────
// TUTORIEL — Forêt de Sylvane
// ─────────────────────────────────────────────────────────────────────────────
const SYLVANE_QUESTS: CampaignQuestTemplate[] = [
  {
    title: "Les Rats des Caves",
    description: "Mère Tilda, aubergiste de Bois-Clair, a les caves infestées de rats géants. Elle offre 50 po et le gîte pour une semaine en échange de l'extermination.",
    reward: "50 po · Chambre gratuite 7 nuits · 100 XP",
    type: 'secondaire',
    objectives: [
      "Parler à Mère Tilda pour accepter la mission",
      "Descendre dans les caves de la taverne",
      "Éliminer les 4 rats géants (CA 12, 7 PV, morsure 1D6)",
      "Trouver le nid et détruire les œufs pour éviter la récidive",
      "Rendre compte à Mère Tilda et récupérer la récompense",
    ],
  },
  {
    title: "L'Embuscade du Chemin de Pierre",
    description: "Des gobelins tendent des embuscades sur la route reliant Bois-Clair au village de Pierrefonde. Le chef de village demande de sécuriser le passage.",
    reward: "75 po · 150 XP · Faveur du chef de village",
    type: 'principale',
    objectives: [
      "Accepter la mission auprès du Chef Aldric de Bois-Clair",
      "Patrouiller le Chemin de Pierre et repérer les signes d'embuscade (Perception DD 12)",
      "Neutraliser le groupe de gobelins embusqués (5 gobelins)",
      "Interroger un gobelin survivant sur leur camp (Intimidation DD 13)",
      "Rapporter les informations au Chef Aldric",
    ],
  },
  {
    title: "Le Camp Gobelin de la Forêt de Sylvane",
    description: "Les gobelins sont plus nombreux qu'il n'y paraît — un camp entier s'est installé à l'orée de la Forêt de Sylvane. Il faut les repousser avant qu'ils n'attaquent le village.",
    reward: "200 po · 300 XP · Épée de Sylvane +1 (dans le coffre du chef)",
    type: 'principale',
    objectives: [
      "Localiser le camp gobelin en suivant les traces (Survie DD 13)",
      "Effectuer une reconnaissance discrète du camp (Discrétion DD 14)",
      "Éliminer les sentinelles sans donner l'alarme — ou déclencher l'assaut frontal",
      "Vaincre le Chef Gobelin Krax et ses deux gardes du corps",
      "Fouiller le camp et récupérer les biens volés aux villageois",
      "Retourner à Bois-Clair pour la récompense et les célébrations",
    ],
  },
  {
    title: "Le Temple Oublié de Sylvane",
    description: "Profondément dans la forêt se cache un ancien temple dédié à Sylvane, déesse de la nature. Un druide âgé affirme que les gobelins ont réveillé quelque chose dans ses ruines.",
    reward: "400 XP · Amulette de Sylvane (résistance aux poisons) · Bénédiction du druide",
    type: 'principale',
    objectives: [
      "Trouver le druide Elarion dans la forêt et écouter son avertissement",
      "Traverser la forêt dense jusqu'aux ruines (2 rencontres aléatoires possible)",
      "Résoudre l'énigme de la porte du temple (Intelligence DD 14 ou chercher des indices)",
      "Affronter l'Ombre Errante réveillée par les gobelins (résiste aux armes non-magiques)",
      "Purifier l'autel central en versant une fiole d'eau bénite",
      "Rendre compte à Elarion et recevoir sa bénédiction",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// L'AUBE DES HÉROS — Campagne D&D débutants
// ─────────────────────────────────────────────────────────────────────────────
const AUBE_HEROS_QUESTS: CampaignQuestTemplate[] = [
  {
    title: "La Disparition du Marchand",
    description: "Gorwin le marchand n'est pas rentré de sa tournée depuis 3 jours. Sa femme offre sa récompense personnelle. On raconte que des bandits opèrent sur la route de l'Est.",
    reward: "60 po · 120 XP · Gratitude de la famille Gorwin",
    type: 'secondaire',
    objectives: [
      "Interroger les habitants sur les dernières activités de Gorwin",
      "Suivre la route de l'Est et repérer des signes de lutte (Survie DD 11)",
      "Localiser le repaire des bandits dans la grange abandonnée",
      "Libérer Gorwin et neutraliser les 3 bandits",
      "Escorter Gorwin jusqu'à sa famille",
    ],
  },
  {
    title: "La Mine Hantée",
    description: "La mine d'argent du Baron Ashford est à l'arrêt depuis qu'un accident a tué cinq mineurs il y a une semaine. Les survivants parlent d'un 'spectre de pierre'. Le Baron paie bien pour une explication.",
    reward: "150 po · 250 XP · Matières premières (5kg d'argent brut)",
    type: 'principale',
    objectives: [
      "Rencontrer le Baron Ashford et accepter le contrat",
      "Interroger les mineurs survivants pour récolter les témoignages",
      "Explorer les galeries inférieures (lampes à huile requises)",
      "Découvrir l'éboulement artificiel — quelqu'un a saboté les étais",
      "Identifier et neutraliser le Gobelours tapi dans la galerie effondrée",
      "Rapporter la vérité au Baron : ce n'était pas un spectre, mais un sabotage",
    ],
  },
  {
    title: "Les Récoltes Volées",
    description: "Trois fermes autour de Bois-Clair ont été pillées. Les traces mènent vers la Forêt Sombre. Les fermiers ont formé une milice désespérée — ils vont se faire massacrer sans aide professionnelle.",
    reward: "80 po · 200 XP · Réputations dans la région (avantage aux jets sociaux locaux)",
    type: 'secondaire',
    objectives: [
      "Examiner les trois fermes pillées et relever les indices",
      "Identifier les coupables : traces de sabots et poils courts — des gnolls (Survie DD 14)",
      "Convaincre la milice de ne pas agir seuls (Persuasion DD 12)",
      "Tendre une embuscade nocturne au prochain pillage prévu",
      "Poursuivre les gnolls fuyants jusqu'à leur campement",
      "Détruire le campement et récupérer les provisions volées",
    ],
  },
  {
    title: "L'Artefact du Mage Fou",
    description: "Une vieille tour à la lisière du comté abrite un mage excentrique nommé Zelindra. Elle a perdu le contrôle d'un orbe de feu de son propre chef magique, et menace d'incendier la forêt entière.",
    reward: "300 po · 400 XP · Parchemin de sort niveau 2 (choix) · Faveur de Zelindra",
    type: 'principale',
    objectives: [
      "Apprendre l'existence du problème auprès du garde forestier Perrin",
      "Traverser la forêt brûlée et atteindre la tour sans se faire rôtir",
      "Escalader la tour ou convaincre Zelindra de baisser son pont-levis (Persuasion DD 15)",
      "Naviguer dans la tour à travers les pièges et les familiers en folie",
      "Atteindre le laboratoire au sommet et contenir l'orbe (Intelligence DD 16 ou aide de Zelindra)",
      "Négocier la récompense avec une Zelindra humiliée mais reconnaissante",
    ],
  },
  {
    title: "Le Culte du Masque d'Ombre",
    description: "Des disparitions inexpliquées touchent les voyageurs isolés. Des symboles étranges apparaissent sur les portes. Un enquêteur de la capitale affirme que c'est l'œuvre d'un culte qui cherche à ouvrir un portail vers le Plan de l'Ombre.",
    reward: "500 po · 600 XP · Épée bénie +1 (trophée du chef de culte)",
    type: 'principale',
    objectives: [
      "Contacter l'enquêteur Soren et accepter la mission secrète",
      "Infiltrer une réunion de culte déguisés en initiés (Tromperie DD 14)",
      "Localiser le temple souterrain sous la vieille église abandonnée",
      "Sabotager le rituel d'ouverture du portail avant la lune de sang",
      "Affronter le Grand Masque Veldris et ses quatre acolytes",
      "Détruire l'Œil du Vide — le catalyseur du portail",
      "Remettre les preuves à l'enquêteur pour le procès des complices",
    ],
  },
  {
    title: "L'Ombre Derrière les Gobelins",
    description: "Quelqu'un pousse les gobelins. Quelqu'un de bien plus dangereux. Le grand arc de la campagne se referme : un nécromancien cherche à lever une armée de morts en perturbant les populations pour récolter des cadavres.",
    reward: "1000 po · 1000 XP · Montée de niveau · Titre de héros régional",
    type: 'principale',
    objectives: [
      "Trouver la lettre scellée dans les affaires du Chef Gobelin Krax (indice de la mine)",
      "Déchiffrer le symbole de la lettre : il s'agit d'une tour de nécromancien (Histoire DD 13)",
      "Localiser la tour dans les Collines Grises grâce aux marchands nomades",
      "S'infiltrer ou forcer l'entrée de la tour fortifiée",
      "Traverser les trois étages remplis de gardes morts-vivants",
      "Affronter le nécromancien Malachar Voss et son champion squelettique",
      "Détruire le Grimoire de la Mort Éternelle pour empêcher la renaissance de Malachar",
      "Rentrer à Bois-Clair en héros",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUÊTES GÉNÉRIQUES FANTASY D&D (toutes campagnes)
// ─────────────────────────────────────────────────────────────────────────────
const GENERIC_FANTASY_QUESTS: CampaignQuestTemplate[] = [
  {
    title: "Escorte Périlleuse",
    description: "Un marchand transportant des médicaments rares pour un village isolé a besoin d'une escorte armée. La route traverse un col connu pour ses bandits et ses loups.",
    reward: "100 po · 200 XP · Potion de soins (×2)",
    type: 'secondaire',
    objectives: [
      "Rencontrer le marchand Baret et négocier la paie",
      "Escorter le convoi pendant 2 jours de voyage",
      "Repousser l'embuscade de bandits au Col du Loup Gris",
      "Soigner Baret blessé par une flèche ou le stabiliser",
      "Arriver au village de destination avec les médicaments intacts",
    ],
  },
  {
    title: "Le Trésor du Capitaine Mort",
    description: "Une carte au trésor d'un vieux corsaire est mise aux enchères à la taverne. La rumeur dit que le trésor est gardé par le fantôme du capitaine lui-même dans une crique isolée.",
    reward: "500 po en lingots · 350 XP · Tricorne maudit (avantage Intimidation, désavantage Charisme)",
    type: 'secondaire',
    objectives: [
      "Remporter la mise aux enchères ou voler/dupliquer la carte",
      "Trouver la crique secrète indiquée sur la carte (Navigation DD 13)",
      "Traverser le piège de la grotte inondée (Constitution DD 12 ou canot)",
      "Parlementer avec le Spectre du Capitaine Morgath ou le vaincre",
      "Localiser le coffre caché derrière le mur illusoire",
      "Sortir de la grotte avant la marée montante",
    ],
  },
  {
    title: "La Bête des Marécages",
    description: "Des paysans disparaissent dans les marécages de la Vase Noire. Les anciens parlent d'un 'Glurp', une créature de vase et de magie corrompue. La récompense est postée à la mairie.",
    reward: "200 po · 300 XP · Peau de Glurp (matériau magique rare)",
    type: 'principale',
    objectives: [
      "Lire l'avis de récompense et se rendre à la mairie pour les détails",
      "Explorer les marécages et repérer les traces de la bête (Survie DD 14)",
      "Éviter ou traverser les zones de sables mouvants (Acrobaties DD 12)",
      "Tendre un piège à la créature en utilisant un paysan volontaire comme appât",
      "Vaincre le Glurp (immunisé aux armes tranchantes, vulnérable au feu)",
      "Identifier la source de corruption magique : un fragment d'un artefact brisé",
    ],
  },
  {
    title: "Sauvetage au Donjon Royal",
    description: "Un allié ou un membre de la famille d'un PNJ important a été arrêté injustement par un juge corrompu. L'évasion doit se faire discrètement pour ne pas créer d'incident diplomatique.",
    reward: "300 po · 350 XP · Dettes d'un noble (faveurs futures)",
    type: 'principale',
    objectives: [
      "Obtenir les plans du donjon via un contact (Contacts DD 14 ou pot-de-vin 50 po)",
      "Se procurer des tenues de garde ou trouver un passage secret",
      "Entrer dans le donjon sans déclencher l'alarme (Discrétion DD 14)",
      "Localiser la cellule du prisonnier dans les sous-sols",
      "Distraire ou neutraliser les gardiens du couloir",
      "Exfiltrer le prisonnier par les égouts jusqu'à un point de rendez-vous sûr",
    ],
  },
  {
    title: "La Malédiction du Village",
    description: "Dans le village de Pierreval, tous les enfants sont frappés d'un sommeil profond depuis une semaine. Une sorcière habitant le pic voisin est accusée. La vérité est plus complexe.",
    reward: "250 po · 400 XP · Grimoire de médecine herbale (compétence Médecine +2 pendant la campagne)",
    type: 'principale',
    objectives: [
      "Interroger les parents et les enfants endormis pour trouver des points communs",
      "Se rendre au sommet pour confronter la sorcière Myrna",
      "Découvrir que Myrna est innocente : la malédiction vient d'un champignon rare",
      "Trouver la source des champignons : le puits du village",
      "Ramener un spécimen intact à Myrna pour qu'elle prépare l'antidote (8h)",
      "Administrer l'antidote à tous les enfants et vérifier leur réveil",
    ],
  },
  {
    title: "L'Héritage du Paladin",
    description: "Un vieux paladin mourant demande aux aventuriers de retrouver l'Épée de Justice, légendaire arme sainte qu'il a perdue dans un temple démoniaque il y a 40 ans. Il mourra heureux avec cette épée dans les mains.",
    reward: "Épée de Justice (arme +2, sainte, 2D6 dégâts radieux supplémentaires contre morts-vivants) · 500 XP",
    type: 'principale',
    objectives: [
      "Écouter l'histoire du vieux paladin Bertrand et jurer de récupérer l'épée",
      "Localiser le Temple de Baal oublié dans les Collines Maudites",
      "Traverser l'entrée gardée par les deux Gardiens de Pierre",
      "Résoudre l'épreuve des trois chambres (Force, Sagesse, Courage)",
      "Affronter le démon mineur Vex'al qui a volé l'épée comme trophée",
      "Ramener l'Épée de Justice au vieux Bertrand avant qu'il ne rende l'âme",
    ],
  },
  {
    title: "La Guilde des Ombres",
    description: "Des voleurs d'une nouvelle guilde inconnue saignent les commerçants du quartier. Personne ne sait qui les dirige. Le chef de la guilde des marchands offre une récompense pour identifier et neutraliser leur opération.",
    reward: "400 po · 450 XP · Accès au marché noir de la Guilde des Marchands",
    type: 'principale',
    objectives: [
      "Accepter la mission auprès du Président de la Guilde des Marchands",
      "Se faire passer pour un potentiel recruteur ou espionner les rendez-vous (Discrétion DD 15)",
      "Identifier la taverne de façade qui sert de quartier général",
      "Trouver les preuves de corruption d'un fonctionnaire local",
      "Localiser le vrai chef : non pas un criminel, mais un noble ruiné",
      "Choisir : livrer le noble à la justice, négocier sa retraite, ou s'allier à lui",
    ],
  },
  {
    title: "Le Tournoi du Champion",
    description: "Un tournoi de combat est organisé pour désigner le Champion du Roi. Le vainqueur reçoit honneurs et terres. Mais le tournoi est truqué — un marchand d'armes a soudoyé plusieurs candidats.",
    reward: "Titre de Champion · 500 po · 600 XP · Terre de 5 hectares",
    type: 'secondaire',
    objectives: [
      "S'inscrire au tournoi (entrée libre ou 10 po selon organisation)",
      "Gagner les 3 premiers duels éliminatoires",
      "Repérer les comportements suspects entre les combattants (Perspicacité DD 13)",
      "Rassembler les preuves du complot contre le juge royal",
      "Vaincre le champion actuel Rudo l'Inflexible en demi-finale",
      "Révéler le complot lors de la finale ou après la victoire",
    ],
  },
  {
    title: "Les Ruines d'Evermont",
    description: "L'ancienne cité d'Evermont, engloutie par un tremblement de terre il y a 200 ans, ressurgit partiellement des eaux. Des explorateurs ont disparu. Un riche historien finance l'expédition.",
    reward: "600 po · 700 XP · Fragment de la Couronne d'Evermont (objet magique rare)",
    type: 'principale',
    objectives: [
      "Accepter le contrat de l'historien Aldric Vane",
      "Naviguer jusqu'aux ruines émergées (1 journée de bateau)",
      "Cartographier les 3 quartiers accessibles sans se noyer",
      "Trouver les explorateurs disparus : certains sont morts, 2 sont prisonniers d'une sirène",
      "Négocier avec la sirène Mélisande ou la vaincre",
      "Rapporter le Fragment de Couronne et les survivants à l'historien",
    ],
  },
  {
    title: "Le Pacte du Démon",
    description: "Un seigneur local a signé un pacte avec un démon pour gagner une guerre. Cinq ans plus tard, le démon exige son dû : l'âme de l'héritier. Le seigneur paie n'importe quel prix pour annuler le pacte.",
    reward: "800 po · 900 XP · Amulette de Protection contre le Mal",
    type: 'principale',
    objectives: [
      "Rencontrer le Seigneur Harkon et découvrir le pacte",
      "Localiser un spécialiste des démons : la prêtresse Ayla au couvent de Lumière",
      "Trouver la Clé de Rupture : le vrai nom du démon dans les archives interditres",
      "Pénétrer dans le Plan Inférieur via un portail temporaire (risqué)",
      "Retrouver le contrat physique dans la tour du démon Zarex",
      "Prononcer le vrai nom de Zarex et brûler le contrat",
      "Retourner dans le Plan Matériel avant la fermeture du portail",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAGNE URBAINE — Intrigues de cité
// ─────────────────────────────────────────────────────────────────────────────
const URBAN_QUESTS: CampaignQuestTemplate[] = [
  {
    title: "Meurtre à l'Académie",
    description: "Un professeur de l'Académie de Magie est retrouvé mort dans son laboratoire. La mort a été maquillée en accident, mais un observateur averti voit les marques d'un sort rare. Le doyen engage des enquêteurs discrets.",
    reward: "300 po · 350 XP · Parchemin de Détection de Magie permanent",
    type: 'principale',
    objectives: [
      "Examiner la scène de crime et trouver les 3 indices cachés (Investigation DD 13)",
      "Interroger les 4 suspects principaux parmi le corps professoral",
      "Accéder aux archives secrètes de l'Académie (Discrétion ou Acrobaties DD 15)",
      "Découvrir le mobile : le professeur avait découvert une fraude académique",
      "Confronter le meurtrier avant qu'il ne fuie la cité",
      "Témoigner devant le Conseil de l'Académie",
    ],
  },
  {
    title: "La Menace de la Pègre",
    description: "La Confrérie du Serpent Noir contrôle les docks depuis 10 ans. Ils viennent d'enlever la fille du chef des gardes pour le faire chanter. Il demande une aide extérieure pour ne pas compromettre ses hommes.",
    reward: "250 po · 300 XP · Laissez-passer des gardes de la cité",
    type: 'principale',
    objectives: [
      "Localiser un repaire de la Confrérie en filant un membre connu",
      "Infiltrer l'entrepôt des docks où la fille est retenue",
      "Neutraliser les 6 gardes de la Confrérie sans donner l'alarme",
      "Libérer la captive sans qu'elle ne soit blessée",
      "Trouver le registre de corruption des gardes comme preuve bonus",
      "Remettre la fille en sécurité et décider quoi faire des preuves",
    ],
  },
  {
    title: "L'Élection Truquée",
    description: "Le vote pour désigner le nouveau Maître de Guilde est dans 3 jours. Un candidat a engagé des intimidateurs pour faire pression sur les votants. Un candidat concurrent embauche les aventuriers pour neutraliser cette menace.",
    reward: "200 po · 250 XP · Soutien politique d'une guilde influente",
    type: 'secondaire',
    objectives: [
      "Identifier les intimidateurs et leurs cibles",
      "Protéger 3 votants menacés lors de tentatives d'intimidation nocturnes",
      "Rassembler des preuves du complot (témoignages écrits signés)",
      "Remettre les preuves au Juge de Guilde avant le vote",
      "Assurer la sécurité le jour du vote",
    ],
  },
  {
    title: "La Maladie des Bas-Fonds",
    description: "Une fièvre mystérieuse tue les habitants des bas-fonds mais laisse les riches intacts. L'herboriste du quartier pauvre suspecte un empoisonnement délibéré de la source d'eau.",
    reward: "150 po · 300 XP · Reconnaissance éternelle du quartier",
    type: 'principale',
    objectives: [
      "Aider l'herboriste Nessa à soigner les malades les plus critiques",
      "Analyser l'eau de plusieurs sources (Médecine ou Nature DD 12)",
      "Remonter la chaîne de contamination jusqu'à la citerne centrale",
      "Découvrir que la contamination est intentionnelle : un spéculateur veut racheter les terres",
      "Rassembler les preuves et les remettre au procureur",
      "Faire condamner le commanditaire avant qu'il ne fuie",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAGNE HORREUR — Ravenloft / Ténèbres
// ─────────────────────────────────────────────────────────────────────────────
const HORROR_QUESTS: CampaignQuestTemplate[] = [
  {
    title: "La Maison des Murmures",
    description: "Une vieille bâtisse à l'écart du village est accusée d'être hantée depuis qu'une famille y a été retrouvée morte il y a 20 ans. Personne n'y entre — jusqu'à ce qu'un enfant disparaisse à l'intérieur.",
    reward: "200 po · 350 XP · Journal du dernier habitant (indice de campagne)",
    type: 'principale',
    objectives: [
      "Interroger les villageois sur l'histoire de la maison",
      "Entrer dans la maison et cartographier les 3 étages",
      "Survivre aux manifestations de l'esprit (6 jets de sauvegarde SAG DD 13)",
      "Trouver l'enfant disparu dans le grenier scellé",
      "Comprendre la tragédie originale : le père a tout fait pour protéger la famille, pas pour les tuer",
      "Libérer l'esprit en récupérant son médaillon brisé et en l'enterrant avec lui",
    ],
  },
  {
    title: "Le Loup-Garou du Comte",
    description: "Des villageois sont déchiquetés lors des pleines lunes depuis 3 mois. Le Comte local impose un couvre-feu mais refuse de parler. Les aventuriers arrivent avec une mission de la capitale.",
    reward: "400 po · 500 XP · Argent béni (×10 pièces de munition en argent)",
    type: 'principale',
    objectives: [
      "Examiner les corps et identifier les marques caractéristiques (Médecine DD 13)",
      "Surveil la nuit de pleine lune dans un poste d'observation",
      "Suivre la piste de la bête jusqu'au château",
      "Infiltrer le château et accéder aux appartements privés du Comte",
      "Confronter le Comte qui est lui-même un loup-garou cherchant un remède",
      "Décider : l'aider à trouver un remède ou l'éliminer pour protéger le village",
    ],
  },
  {
    title: "Le Rituel de la Pleine Lune Noire",
    description: "Un culte de Vecna prépare un rituel pour ressusciter un liche. Il se tiendra lors de la prochaine Lune Noire, dans 4 jours. Une informatrice contacte les aventuriers pour les faire intervenir.",
    reward: "600 po · 700 XP · Fragment de l'Œil de Vecna (objet de quête)",
    type: 'principale',
    objectives: [
      "Retrouver l'informatrice Irene dans la cave sous la boulangerie",
      "Localiser le lieu du rituel grâce aux symboles laissés sur les murs de la ville",
      "S'infiltrer dans la cérémonie la nuit précédant le rituel",
      "Identifier et marquer les 5 officiants principaux",
      "Interrompre le rituel lors de son point culminant en brisant les 5 sceaux",
      "Affronter le Grand Prêtre Malachar lors de sa fureur finale",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAGNE POLITIQUE — Guerres et Royaumes
// ─────────────────────────────────────────────────────────────────────────────
const POLITICAL_QUESTS: CampaignQuestTemplate[] = [
  {
    title: "L'Assassinat du Duc",
    description: "Le Duc de Valdorne a été empoisonné lors d'un banquet royal. Sa fille, héritière, suspecte son oncle ambitieux mais n'a aucune preuve. Elle engage des agents de confiance extérieurs.",
    reward: "500 po · 600 XP · Titre de Noble Associé (avantages sociaux en cours de campagne)",
    type: 'principale',
    objectives: [
      "Se faire inviter au château sous un prétexte valable",
      "Analyser le verre du Duc encore dans la salle du banquet (Médecine DD 14)",
      "Identifier la source du poison : Belladone de Nuit, disponible chez un seul apothicaire",
      "Localiser l'acheteur dans les registres de l'apothicaire",
      "Confronter l'Oncle Morvar avec les preuves en présence de témoins nobles",
      "Protéger l'héritière lors de la tentative d'assassinat de Morvar pour réduire au silence",
    ],
  },
  {
    title: "Le Traité de Paix",
    description: "Deux royaumes sont au bord de la guerre. Un traité de paix a été rédigé, mais le messager porteur a disparu. Récupérer le traité et le livrer avant que les armées ne franchissent la frontière.",
    reward: "800 po · 700 XP · Médaille de Pacificateur",
    type: 'principale',
    objectives: [
      "Partir de la capitale royale avec une escorte réduite pour plus de discrétion",
      "Retrouver le messager blessé dans une ferme isolée",
      "Récupérer le traité qui a été volé par des agents du troisième Royaume",
      "Affronter les agents rivaux sur la Route Royale",
      "Traverser la frontière contestée avant le délai fixé",
      "Remettre le traité au roi adverse et le convaincre de signer",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INDEX DES PACKS — détermine ce qui est proposé pour chaque campagne
// ─────────────────────────────────────────────────────────────────────────────
export const CAMPAIGN_QUEST_PACKS: CampaignQuestPack[] = [
  {
    id: 'sylvane',
    label: 'Forêt de Sylvane',
    icon: '🌲',
    description: 'Quêtes de la campagne tutoriel — Forêt de Sylvane',
    matchName: /sylvane|tutoriel/i,
    quests: SYLVANE_QUESTS,
  },
  {
    id: 'aube_heros',
    label: "L'Aube des Héros",
    icon: '⚔️',
    description: "Arc narratif complet de la campagne de démarrage",
    matchName: /aube|heros|bois.clair/i,
    quests: AUBE_HEROS_QUESTS,
  },
  {
    id: 'fantasy_generic',
    label: 'Aventures Fantasy',
    icon: '🏰',
    description: 'Quêtes génériques pour toute campagne D&D ou Pathfinder',
    matchSystems: ['D&D 5e', 'Pathfinder', 'Pathfinder 2e'],
    quests: GENERIC_FANTASY_QUESTS,
  },
  {
    id: 'urban',
    label: 'Intrigues Urbaines',
    icon: '🏙️',
    description: 'Mystères, guildes et politique pour les campagnes en cité',
    quests: URBAN_QUESTS,
  },
  {
    id: 'horror',
    label: 'Horreur & Ténèbres',
    icon: '🕯️',
    description: "Quêtes d'horreur gothique, vampires, malédictions",
    matchSystems: ['Warhammer', 'Call of Cthulhu'],
    quests: HORROR_QUESTS,
  },
  {
    id: 'political',
    label: 'Guerres & Royaumes',
    icon: '👑',
    description: 'Intrigues politiques, traités et guerres entre royaumes',
    quests: POLITICAL_QUESTS,
  },
];

export const getRecommendedPacks = (campaignName: string, system: string): CampaignQuestPack[] => {
  const recommended: CampaignQuestPack[] = [];
  for (const pack of CAMPAIGN_QUEST_PACKS) {
    if (pack.matchName && pack.matchName.test(campaignName)) {
      recommended.push(pack);
    } else if (pack.matchSystems && pack.matchSystems.some((s) => system.includes(s))) {
      recommended.push(pack);
    }
  }
  if (recommended.length === 0) {
    const fallback = CAMPAIGN_QUEST_PACKS.find((p) => p.id === 'fantasy_generic');
    if (fallback) recommended.push(fallback);
  }
  return recommended;
};
