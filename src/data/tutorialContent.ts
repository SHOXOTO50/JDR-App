export interface TutorialPage {
  id: string;
  title: string;
  icon: string;
  content: string;
  tip?: string;
  example?: string;
}

export interface TutorialSection {
  id: string;
  title: string;
  icon: string;
  pages: TutorialPage[];
}

export const PLAYER_TUTORIAL: TutorialSection[] = [
  {
    id: 'intro',
    title: "C'est quoi D&D ?",
    icon: '🐉',
    pages: [
      {
        id: 'p1',
        title: "Bienvenue dans Donjons & Dragons",
        icon: '🎲',
        content: "Donjons & Dragons (D&D) est un jeu de rôle sur table. Un joueur devient le Maître du Jeu (MJ), et les autres incarnent des héros dans un monde fantastique.\n\nLe MJ décrit le monde, les personnages non-joueurs (PNJ), et les situations. Les joueurs décident ce que font leurs personnages. Les dés déterminent le résultat des actions risquées.",
        tip: "Il n'y a pas de plateau — tout se passe dans l'imagination, guidé par le MJ.",
        example: "Le MJ dit : 'Vous approchez d'une taverne. La porte est entrouverte.' Vous décidez : 'J'entre prudemment.' Le MJ décrit ce que vous voyez.",
      },
      {
        id: 'p2',
        title: "Le MJ et les joueurs",
        icon: '🧙',
        content: "Le Maître du Jeu (MJ) est l'arbitre et le narrateur. Il contrôle le monde, les monstres, les PNJ et les conséquences.\n\nLes joueurs incarnent chacun un personnage (PC - Player Character). Ensemble, ils forment une équipe d'aventuriers.",
        tip: "Le MJ n'est pas contre les joueurs — il crée une aventure épique pour tout le monde.",
        example: "'Je veux convaincre le garde de me laisser entrer.' Le MJ demande un jet de Persuasion. Tu lances un D20 et additionnes ton bonus de Charisme.",
      },
    ],
  },
  {
    id: 'dice',
    title: 'Les dés',
    icon: '🎲',
    pages: [
      {
        id: 'd1',
        title: "Les types de dés",
        icon: '🎲',
        content: "D&D utilise 7 types de dés, nommés par leur nombre de faces :\n\n• D4 : Pyramide à 4 faces\n• D6 : Dé classique à 6 faces\n• D8 : Dé à 8 faces (octaèdre)\n• D10 : Dé à 10 faces\n• D12 : Dé à 12 faces (dodécaèdre)\n• D20 : Dé à 20 faces — LE dé le plus important\n• D100 : Deux D10 combinés (1-100)",
        tip: "Dans DiceQuest, tous ces dés sont disponibles dans l'onglet Dés.",
      },
      {
        id: 'd2',
        title: "Le D20 — Le roi des dés",
        icon: '⚔️',
        content: "Le D20 est au cœur de D&D. Tu le lances quand tu tentes une action risquée.\n\n1️⃣ Tu lances le D20\n2️⃣ Tu ajoutes ton modificateur (stat ou compétence)\n3️⃣ Tu compares au Degré de Difficulté (DD) fixé par le MJ\n\n✅ Résultat ≥ DD = Succès\n❌ Résultat < DD = Échec\n\n🏆 20 naturel = Critique (succès épique)\n💀 1 naturel = Échec critique (catastrophe)",
        tip: "Un 20 naturel (sans modificateur) est toujours un succès — même si tu aurais échoué normalement.",
        example: "Tu veux escalader un mur glissant (DD 14). Tu lances D20 = 11, + Athlétisme +3 = 14. Pile égal au DD : succès !\n\nTu veux crocheter une serrure (DD 15). Tu lances D20 = 4, + Outils de voleur +4 = 8. Raté.",
      },
      {
        id: 'd3',
        title: "Avantage & Désavantage",
        icon: '⬆️⬇️',
        content: "Parfois, les circonstances t'aident ou te gênent :\n\n⬆️ Avantage : Lance 2D20, garde le plus haut\nEx : Tu attaques un ennemi aveugle.\n\n⬇️ Désavantage : Lance 2D20, garde le plus bas\nEx : Tu attaques en étant empoisonné.\n\nAvantage et désavantage s'annulent — s'il y a les deux, tu lances 1D20 normalement.",
        tip: "Cherche les situations qui te donnent l'Avantage ! La tactique et la créativité paient.",
        example: "Tu veux attaquer par surprise un garde endormi (Avantage). Tu lances deux D20 : 8 et 15. Tu gardes 15 + ton bonus d'attaque.",
      },
      {
        id: 'd4',
        title: "Formules de dés",
        icon: '📐',
        content: "Les dégâts et effets utilisent des formules de dés :\n\n• 1D6 = Un dé à 6 faces\n• 2D8 = Deux dés à 8 faces (somme)\n• 2D6+3 = Deux D6 + 3 (modificateur fixe)\n• 1D20-1 = Un D20 moins 1\n\nExemples d'armes :\n⚔️ Dague : 1D4 dégâts perforants\n⚔️ Épée longue : 1D8 tranchants (ou 1D10 à 2 mains)\n⚔️ Hache à 2 mains : 2D6 tranchants",
        tip: "Dans DiceQuest, l'onglet 'Formule' du lanceur de dés accepte n'importe quelle formule comme 2D6+3.",
      },
    ],
  },
  {
    id: 'character',
    title: 'Ton personnage',
    icon: '⚔️',
    pages: [
      {
        id: 'c1',
        title: "Les 6 Caractéristiques",
        icon: '📊',
        content: "Ton personnage a 6 caractéristiques, chacune entre 1 (minable) et 20 (exceptionnel). La moyenne humaine est 10.\n\n💪 Force (FOR) — Muscles, corps-à-corps, escalade\n🏃 Dextérité (DEX) — Agilité, discrétion, réflexes\n🛡️ Constitution (CON) — Endurance, santé, points de vie\n🧠 Intelligence (INT) — Mémoire, logique, sorts de magicien\n🌟 Sagesse (SAG) — Instinct, perception, sorts de prêtre\n✨ Charisme (CHA) — Éloquence, présence, sorts de barde",
        tip: "Les modificateurs vont de -5 (stat 1) à +5 (stat 20). Le modificateur = (stat − 10) ÷ 2, arrondi à l'inférieur.",
        example: "Stat 16 → Modificateur +3\nStat 8 → Modificateur -1\nStat 10 → Modificateur 0",
      },
      {
        id: 'c2',
        title: "Points de vie (PV)",
        icon: '❤️',
        content: "Les PV mesurent ta résistance. À 0 PV, tu tombes inconscient et risques de mourir.\n\nPV max = Dé de vie de ta classe + modificateur CON par niveau\n\nEx : Guerrier Niv.1 avec CON 14 (+2) : 1D10+2 = 7-12 PV\n\nQuand tu tombes à 0 PV :\n1️⃣ Tu t'effondres inconscient\n2️⃣ Tes alliés ont quelques rounds pour te soigner\n3️⃣ Sans aide, tu fais des jets de mort (3 réussites = stable, 3 échecs = mort)\n\nTempPV : PV temporaires s'absorbent en premier, ne se soignent pas.",
        tip: "Reste proche du soigneur de groupe ! Un prêtre ou druide sauve des vies.",
        example: "Tu es à 5 PV. Tu reçois 8 dégâts → tu tombes à 0 PV et t'effondres.\nTon allié lance Soins mineurs : 1D8+3 = 7 PV. Tu te relèves avec 7 PV.",
      },
      {
        id: 'c3',
        title: "Classe d'armure (CA)",
        icon: '🛡️',
        content: "La CA représente ta défense. L'ennemi doit dépasser ta CA pour te toucher.\n\nCA de base selon armure :\n• Sans armure : 10 + mod Dex\n• Armure de cuir : 11 + mod Dex\n• Cotte de mailles : 16 (pas de Dex)\n• Harnois : 18 (pas de Dex)\n\n+2 avec un bouclier\n\nL'ennemi lance D20 + modificateur d'attaque. Si ≥ ta CA, il te touche.",
        tip: "Un guerrier en harnois + bouclier a CA 20 — très difficile à toucher !",
        example: "Ta CA est 15. L'ennemi lance D20 = 12 + attaque +4 = 16. Il te touche !\nMais s'il avait fait D20 = 9 + 4 = 13, il manque.",
      },
      {
        id: 'c4',
        title: "Les classes",
        icon: '🏹',
        content: "La classe définit tes capacités et style de jeu :\n\n⚔️ Guerrier — Champion du combat, maîtrise des armes\n🗡️ Rôdeur — Archer, pisteur, combattant à deux armes\n🧙 Magicien — Sorts arcanes puissants mais fragile\n🙏 Prêtre — Sorts divins, soins, soutien\n🌿 Druide — Nature, transformation animale, sorts\n🎭 Barde — Polyvalent, sorts, soutien, inspirer\n🥷 Roublard — Discrétion, attaque sournoise, pièges\n⚡ Paladin — Guerrier divin, auras de protection, soins\n🐾 Moine — Arts martiaux, ki, vitesse surhumaine\n🔮 Ensorceleur — Sorts arcaniques, Fontaine de magie\n🌑 Occultiste — Pacte avec une entité, invocations\n🪓 Barbare — Rage, résistance, force brute",
        tip: "Chaque classe a des dés de vie différents (PV) et un rôle dans le groupe.",
      },
    ],
  },
  {
    id: 'combat',
    title: 'Le combat',
    icon: '⚔️',
    pages: [
      {
        id: 'co1',
        title: "Déroulement d'un combat",
        icon: '⚔️',
        content: "Un combat se déroule en rounds (≈ 6 secondes) :\n\n1️⃣ Initiative — Tout le monde lance D20 + mod Dex. Ordre du plus haut au plus bas.\n2️⃣ Ton tour arrive :\n   • 1 Action (attaquer, lancer un sort, Aider, Chercher...)\n   • 1 Action bonus (certaines classes/sorts)\n   • Déplacement (ta vitesse en mètres)\n   • 1 Réaction (hors de ton tour, ex : Attaque d'opportunité)\n3️⃣ Répéter jusqu'à victoire ou fuite.",
        tip: "Tu peux diviser ton déplacement avant et après ton action.",
        example: "Ton initiative : D20=14 + Dex+2 = 16.\nL'ennemi : D20=8 + 1 = 9.\nTu agis en premier !\n\nTon tour : tu te déplaces de 9m vers l'ennemi (Action) et tu attaques : D20+5 = 18 vs CA 13 → Touché ! 1D8+3 = 6 dégâts.",
      },
      {
        id: 'co2',
        title: "Attaquer",
        icon: '🗡️',
        content: "Pour attaquer :\n1️⃣ Choisis une cible à portée\n2️⃣ Lance D20 + bonus d'attaque\n3️⃣ Compare à la CA de la cible\n4️⃣ Si touché, lance les dés de dégâts\n\nBonus d'attaque = Maîtrise + Modificateur de stat\n(Armes corps-à-corps → FOR ou DEX ; À distance → DEX)\n\n20 naturel = Coup critique : double les dés de dégâts !\n1 naturel = Raté automatique (peu importe la CA).",
        tip: "Certains sorts remplacent l'attaque avec D20 par un jet de sauvegarde de la cible.",
        example: "Épée longue, guerrier niv.3 : +2 maîtrise, +3 FOR = +5 attaque, 1D8+3 dégâts.\nCritique (20) : 2D8+3 dégâts !",
      },
      {
        id: 'co3',
        title: "Les conditions",
        icon: '⚡',
        content: "Certains sorts et attaques infligent des conditions :\n\n😵 Étourdi — Aucune action, désavantage, tous les coups sont des critiques\n😴 Inconscient — Comme étourdi + couché\n🤢 Empoisonné — Désavantage aux jets d'attaque et de caractéristique\n😰 Effrayé — Désavantage si la source de peur est en vue\n🪢 Entravé — Vitesse 0, désavantage en attaque, avantage contre toi\n🪨 Pétrifié — Transformé en pierre, immunisé aux sorts mais vulnérable\n😵 Aveuglé — Désavantage en attaque, avantage contre toi\n🧲 Charmé — Ne peut pas attaquer la source, avantage social pour elle",
        tip: "Soigneur, dispel magic, et repos peuvent supprimer la plupart des conditions.",
      },
    ],
  },
  {
    id: 'spells',
    title: 'La magie',
    icon: '🔮',
    pages: [
      {
        id: 's1',
        title: "Comment fonctionnent les sorts",
        icon: '🔮',
        content: "Les lanceurs de sorts ont un nombre limité d'emplacements de sorts par niveau.\n\nUn sort de niveau 1 occupe un emplacement de niveau 1 (ou supérieur).\nUn sort de niveau 3 nécessite un emplacement de niveau 3 minimum.\n\nLes tours de magie (niveau 0) sont illimités.\n\nRepos long : récupère tous les emplacements de sorts.",
        tip: "Certaines classes (Barde, Drude, Prêtre) ont aussi des emplacements limités mais apprennent via des livres ou la prière.",
        example: "Magicien niv.3 : 4 emplacements niveau 1, 2 emplacements niveau 2.\nIl lance Projectile magique (niv.1) → il lui reste 3 emplacements de niveau 1.",
      },
      {
        id: 's2',
        title: "Jets de sauvegarde de sorts",
        icon: '🛡️',
        content: "Certains sorts forcent la cible à faire un jet de sauvegarde.\n\nDD du sort = 8 + bonus de maîtrise + modificateur de stat du lanceur\n\nLa cible lance D20 + modificateur de sauvegarde :\n• Réussite → Réduit ou annule l'effet\n• Échec → Subit l'effet complet\n\nExemples :\n🔥 Boule de feu : DD DEX, demi-dégâts si réussi\n😴 Sommeil : pas de jet, affecte les créatures les plus faibles d'abord\n🌊 Vague tonnante : DD CON, propulsé 3m si raté",
        tip: "DD de sorts = 8 + maîtrise + stat de sort. Un magicien de haut niveau peut avoir DD 17-19.",
      },
    ],
  },
];

export const GM_TUTORIAL: TutorialSection[] = [
  {
    id: 'gm_intro',
    title: 'Devenir MJ',
    icon: '🏰',
    pages: [
      {
        id: 'gm1',
        title: "Le rôle du Maître du Jeu",
        icon: '🧙',
        content: "Le MJ est le narrateur, l'arbitre et l'acteur de tout le monde sauf les personnages des joueurs.\n\nTes responsabilités :\n📖 Préparer (ou improviser) des aventures intéressantes\n🎭 Jouer les PNJ avec personnalité\n⚖️ Arbitrer les règles équitablement\n😄 Assurer que tout le monde s'amuse\n\nL'objectif n'est pas de 'gagner contre' les joueurs — c'est de créer une histoire mémorable ensemble.",
        tip: "Tu n'as pas besoin de tout préparer. Les MJ les plus mémorables improvisent beaucoup.",
      },
      {
        id: 'gm2',
        title: "Préparer une session",
        icon: '📋',
        content: "Pour une session de 3-4 heures :\n\n1️⃣ Un objectif principal (tuer le chef gobelin, trouver l'artefact)\n2️⃣ 2-3 rencontres (combat, exploration, social)\n3️⃣ 1-2 PNJ avec un nom et une motivation\n4️⃣ Un lieu avec 2-3 traits distinctifs\n5️⃣ Une complication ou twist inattendu\n\nPas besoin de tout détailler — les joueurs vont toujours surprendre !\n\nDans DiceQuest, le Mode MJ te donne :\n• Fiche des PNJ et monstres\n• Générateur de donjons\n• Table de rencontres\n• Météo aléatoire",
        tip: "La règle d'or du MJ : 'Oui, mais...' et 'Non, mais...'. Ça fait avancer l'histoire.",
        example: "'Je veux voler l'épée du garde.' Le MJ : 'Oui, mais le garde le remarque et appelle du renfort.' OU 'Non, trop risqué, mais il y a peut-être un autre moyen...'",
      },
      {
        id: 'gm3',
        title: "Gérer les combats",
        icon: '⚔️',
        content: "En tant que MJ :\n\n1️⃣ Décris la scène et les ennemis\n2️⃣ Lance l'initiative de tous les monstres (ou un roll unique pour le groupe)\n3️⃣ Joue les monstres intelligemment mais pas cruellement\n4️⃣ Décris les coups narrativement\n5️⃣ Donne de l'XP et du butin\n\nLes monstres ont des tactiques :\n🧠 Intelligents : attaquent le soigneur en premier, utilisent le terrain\n🐺 Instinctifs : attaquent la cible la plus proche\n😈 Lâches : fuient si plus de 50% de leurs alliés sont morts\n\nDans DiceQuest, le Tracker de Combat gère l'initiative et les PV.",
        tip: "Si un combat est trop facile, ajoute une surprise. Si trop dur, un ennemi peut fuir ou capituler.",
      },
      {
        id: 'gm4',
        title: "Fixer les DDs",
        icon: '🎯',
        content: "Le Degré de Difficulté (DD) détermine la difficulté d'une action :\n\n• DD 5 = Très facile (ramasser quelque chose)\n• DD 10 = Facile (crocheter une serrure simple)\n• DD 15 = Moyen (escalader un mur glissant)\n• DD 20 = Difficile (tromper un expert)\n• DD 25 = Très difficile (quasi impossible)\n• DD 30 = Légendaire (seuls les héros accomplis)\n\nQuand fixer un DD ?\n→ Quand l'échec est intéressant ET l'action est risquée.\nPas besoin de DD pour mettre ses chaussures.",
        tip: "Annonce le DD AVANT le jet quand c'est logique. Les joueurs peuvent décider de ne pas tenter.",
      },
    ],
  },
];

export const BASE_CAMPAIGN_DATA = {
  name: "L'Aube des Héros",
  description: "Campagne de démarrage — Parfaite pour une première aventure.",
  gmNotes: "Campagne introductive pour nouveaux joueurs. Commencez par une mission simple dans un village (rats géants dans les caves de la taverne), puis une exploration du bois voisin infesté de gobelins. Bâtissez vers une révélation : les gobelins sont poussés hors de leur forêt par une force plus sombre.",
  sessions: [
    {
      id: 's1',
      name: "Session 1 : L'appel à l'aventure",
      notes: "Les héros arrivent à Bois-clair. L'aubergiste Mère Tilda leur propose 50 po pour nettoyer les caves infestées de rats géants. Bonne intro aux mécaniques de combat.",
      date: new Date().toISOString(),
      summary: '',
    },
  ],
};

export const TUTORIAL_CAMPAIGN_DATA = {
  name: "Tutoriel D&D — Forêt de Sylvane",
  description: "Campagne tutoriel guidée — Apprenez les règles en jouant !",
  gmNotes: "Campagne conçue pour apprendre les règles en jouant. Chaque rencontre introduit un nouveau concept : le combat de base, les jets de compétences, l'exploration, et la magie. Le MJ devrait expliquer les mécaniques au fur et à mesure.",
  sessions: [
    {
      id: 'ts1',
      name: "Tuto 1 : Premiers pas — Le Chemin de Pierre",
      notes: "Introduction au déplacement, aux jets de compétences (Perception DC 12 pour remarquer une embuscade) et au dialogue avec les PNJ. Pas de combat obligatoire.",
      date: new Date().toISOString(),
      summary: '',
    },
    {
      id: 'ts2',
      name: "Tuto 2 : Premier combat — Attaque de Gobelins",
      notes: "Introduction à l'initiative, aux attaques (D20 + modificateur vs CA), aux dégâts et aux PV. 3 gobelins (CA 13, 7 PV, attaque +4 1D6+2). Laissez les joueurs expérimenter.",
      date: new Date().toISOString(),
      summary: '',
    },
    {
      id: 'ts3',
      name: "Tuto 3 : La Magie — Temple de Sylvane",
      notes: "Introduction aux sorts et jets de sauvegarde. Un prêtre (ami) démontre les soins. Un gobelin chamane lance Grêle d'épines (DC Dex 12). Apprenez les conditions avec 'Empoisonné' via une flèche.",
      date: new Date().toISOString(),
      summary: '',
    },
  ],
};
