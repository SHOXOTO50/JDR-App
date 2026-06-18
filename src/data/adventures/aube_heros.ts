import { PlayableAdventure, EnemyTemplate } from '../../types/adventure';

// ─── Enemy Templates ──────────────────────────────────────────────────────────
const RAT_GEANT: EnemyTemplate = {
  id: 'rat_geant', name: 'Rat Géant', icon: '🐀',
  ca: 12, maxHP: 7, atkBonus: 4, dmgFormula: '1d4+2',
  xpReward: 25, goldDrop: 0,
};
const RAT_GEANT_2: EnemyTemplate = {
  id: 'rat_geant_2', name: 'Rat Géant', icon: '🐀',
  ca: 12, maxHP: 7, atkBonus: 4, dmgFormula: '1d4+2',
  xpReward: 25, goldDrop: 0,
};
const GOBELIN: EnemyTemplate = {
  id: 'gobelin', name: 'Gobelin', icon: '👺',
  ca: 13, maxHP: 7, atkBonus: 4, dmgFormula: '1d6+2',
  xpReward: 50, goldDrop: 5,
};
const GOBELIN_B: EnemyTemplate = {
  id: 'gobelin_b', name: 'Gobelin', icon: '👺',
  ca: 13, maxHP: 7, atkBonus: 4, dmgFormula: '1d6+2',
  xpReward: 50, goldDrop: 5,
};
const GOBELIN_C: EnemyTemplate = {
  id: 'gobelin_c', name: 'Gobelin', icon: '👺',
  ca: 13, maxHP: 9, atkBonus: 4, dmgFormula: '1d6+2',
  xpReward: 50, goldDrop: 8,
};
const GOBELIN_ARCHER: EnemyTemplate = {
  id: 'gobelin_archer', name: 'Gobelin Archer', icon: '🏹',
  ca: 13, maxHP: 5, atkBonus: 4, dmgFormula: '1d6',
  xpReward: 50, goldDrop: 3,
};
const GARDE_KRAX: EnemyTemplate = {
  id: 'garde_krax', name: 'Garde de Krax', icon: '👺',
  ca: 14, maxHP: 12, atkBonus: 5, dmgFormula: '1d8+2',
  xpReward: 100, goldDrop: 15,
};
const KRAX: EnemyTemplate = {
  id: 'krax', name: 'Chef Krax', icon: '👹',
  ca: 15, maxHP: 30, atkBonus: 6, dmgFormula: '1d10+4',
  xpReward: 400, goldDrop: 80,
  isBoss: true,
};

// ─── Adventure ────────────────────────────────────────────────────────────────
export const AUBE_HEROS_ADVENTURE: PlayableAdventure = {
  id: 'aube_heros_v1',
  title: "L'Aube des Héros",
  description: "Une campagne d'initiation au cœur du village de Bois-Clair. Des rats, des gobelins, et peut-être quelque chose de bien plus sombre tapi dans les ombres...",
  coverIcon: '⚔️',
  difficulty: 'débutant',
  estimatedDuration: '2–3 heures',
  recommendedLevel: 1,
  chapters: [
    {
      id: 'ch1',
      number: 1,
      title: "L'Appel à l'Aventure",
      description: 'Arrivée à Bois-Clair. Un village tranquille... en apparence.',
      firstSceneId: 'ch1_arrive',
    },
    {
      id: 'ch2',
      number: 2,
      title: 'La Forêt Sombre',
      description: 'La route qui mène au camp gobelin est parsemée de dangers.',
      firstSceneId: 'ch2_depart',
    },
    {
      id: 'ch3',
      number: 3,
      title: 'Le Camp Gobelin',
      description: 'Le repaire de Krax attend. Une confrontation décisive approche.',
      firstSceneId: 'ch3_approche',
    },
  ],
  scenes: {
    // ─────────────── CHAPITRE 1 ───────────────────────────────────────────────
    ch1_arrive: {
      id: 'ch1_arrive', type: 'narrative', chapterId: 'ch1',
      title: 'Arrivée à Bois-Clair',
      narrative:
        "Le chemin de terre serpente entre les champs de blé dorés avant de déboucher sur le bourg de Bois-Clair. Une odeur de pain frais et de fumée de bois flotte dans l'air du soir.\n\nLes habitants rentrent des champs, les enfants jouent près du puits, et le tintement métallique d'une forge résonne depuis le bout de la rue principale. Au centre du village se dresse une taverne à l'enseigne représentant un sanglier aux défenses d'or.\n\nVous êtes fatigué. Une nuit de repos et peut-être une occasion de travailler — voilà ce que vous cherchez.",
      autoNextSceneId: 'ch1_taverne',
    },

    ch1_taverne: {
      id: 'ch1_taverne', type: 'dialogue', chapterId: 'ch1',
      title: 'La Taverne du Sanglier d\'Or',
      narrative: "L'intérieur de la taverne est chaleureux. Une robuste aubergiste aux cheveux grisonnants essuie des chopes derrière le bar. Elle vous dévisage avec un mélange de curiosité et d'espoir.",
      dialogue: [
        { speaker: 'Mère Tilda', text: "Bienvenue, étranger. Première fois à Bois-Clair ?" },
        { speaker: 'Vous', text: "Première fois, oui. Je cherche de l'aventure — et peut-être du travail honnête.", isPlayer: true },
        { speaker: 'Mère Tilda', text: "Du travail... vous tombez bien. J'ai... un problème.", emotion: 'sad' },
        { speaker: 'Mère Tilda', text: "Des rats géants ont envahi mes caves depuis une semaine. Énormes. Pas ordinaires. Mes fournisseurs refusent de descendre et je perds des provisions chaque nuit.", emotion: 'scared' },
        { speaker: 'Mère Tilda', text: "Je donne 50 pièces d'or et une semaine de gîte à qui les extermine. Vous semblez... capable.", emotion: 'neutral' },
      ],
      questOffer: {
        title: "Les Rats des Caves",
        description: "Mère Tilda, aubergiste du Sanglier d'Or, demande d'exterminer les rats géants dans ses caves.",
        reward: "50 po · Chambre gratuite 7 nuits · 100 XP",
        type: 'secondaire',
        objectives: [
          "Descendre dans les caves de la taverne",
          "Éliminer les rats géants",
          "Rendre compte à Mère Tilda",
        ],
      },
      choices: [
        { id: 'accept_rats', label: "⚔️ Accepter la mission", icon: '⚔️', nextSceneId: 'ch1_caves', setFlag: 'quest_rats_accepted' },
        { id: 'refuse_rats', label: "🚶 Refuser pour l'instant", icon: '🚶', nextSceneId: 'ch1_village_refuse' },
      ],
    },

    ch1_village_refuse: {
      id: 'ch1_village_refuse', type: 'choice', chapterId: 'ch1',
      title: 'Le Village Attend',
      narrative: "Vous décidez de d'abord explorer le village. Sur la place principale, une affiche accrochée à un pilier attire votre attention :\n\n\"RÉCOMPENSE — Le Chef Aldric cherche des aventuriers courageux pour résoudre le problème gobelin. Se présenter à la mairie.\"\n\nDerrière vous, la taverne. Devant vous, la mairie. Que faites-vous ?",
      choices: [
        { id: 'go_taverne', label: "↩️ Retourner à la taverne", nextSceneId: 'ch1_taverne' },
        { id: 'go_aldric_direct', label: "🏛️ Aller voir le Chef Aldric", nextSceneId: 'ch1_aldric' },
      ],
    },

    ch1_caves: {
      id: 'ch1_caves', type: 'narrative', chapterId: 'ch1',
      title: 'Dans les Caves',
      narrative: "Mère Tilda vous tend une torche et désigne la trappe derrière le bar.\n\n\"Bonne chance. Et... faites attention. Ils sont plus gros que d'habitude.\"\n\nLes marches en bois grincent sous vos pieds. L'obscurité est totale sauf pour le cercle de lumière de votre torche. Une odeur âcre de musc et d'excréments de rongeurs emplit l'air. Des tonneaux de bière et des sacs de farine s'entassent le long des murs.\n\nPuis vous entendez le bruit — un grattement rapide, et deux silhouettes bondissent de derrière les barils.",
      autoNextSceneId: 'ch1_combat_rats',
    },

    ch1_combat_rats: {
      id: 'ch1_combat_rats', type: 'combat', chapterId: 'ch1',
      title: 'Rats Géants !',
      narrative: "Deux rats de la taille d'un chien surgissent de l'ombre, leurs yeux rouges brillant à la lueur de la torche. Leurs longues dents jaunies s'entrechoquent dans un claquement sinistre.",
      combatIntro: "Deux Rats Géants vous chargent dans l'obscurité des caves !",
      enemies: [RAT_GEANT, RAT_GEANT_2],
      victorySceneId: 'ch1_victoire_caves',
      defeatSceneId: 'ch1_defaite_caves',
    },

    ch1_defaite_caves: {
      id: 'ch1_defaite_caves', type: 'narrative', chapterId: 'ch1',
      title: 'Submergé...',
      narrative: "Les rats vous submergent. Leurs dents s'enfoncent dans votre chair et tout devient noir.\n\nVous reprenez conscience dans une chambre de la taverne. Mère Tilda vous a trouvé inconscient et a bandé vos blessures. \"Vous avez eu de la chance. Ces rats ne plaisantent pas.\"\n\nVous êtes affaibli mais vivant. Il faudra être plus prudent.",
      autoNextSceneId: 'ch1_caves',
      reward: { xp: 0, gold: 0 },
    },

    ch1_victoire_caves: {
      id: 'ch1_victoire_caves', type: 'reward', chapterId: 'ch1',
      title: 'Caves Sécurisées !',
      narrative: "Les deux rats gisent immobiles sur les dalles en pierre. Un silence bienvenu règne enfin dans les caves.\n\nEn explorant les recoins, vous trouvez un vieux sac laissé par un précédent aventurier, contenant quelques pièces d'or et une potion d'aspect suspect.",
      reward: {
        xp: 100,
        gold: 50,
        items: [{ name: 'Potion de Soins Mineurs', description: 'Restaure 1d4+4 points de vie quand consommée.', category: 'consommable', rarity: 'commun' }],
        questComplete: ["Les Rats des Caves"],
      },
      autoNextSceneId: 'ch1_tilda_reward',
    },

    ch1_tilda_reward: {
      id: 'ch1_tilda_reward', type: 'dialogue', chapterId: 'ch1',
      title: 'La Gratitude de Tilda',
      narrative: "Vous remontez les escaliers, encore couvert de poussière et de sang de rongeur. Le visage de Mère Tilda s'illumine quand vous lui annoncez la bonne nouvelle.",
      dialogue: [
        { speaker: 'Mère Tilda', text: "Incroyable ! Vous l'avez vraiment fait !", emotion: 'happy' },
        { speaker: 'Mère Tilda', text: "Voici vos 50 pièces d'or, comme promis. Et votre chambre est prête — numéro 3, au premier étage.", emotion: 'happy' },
        { speaker: 'Vous', text: "Merci. Dites-moi... y a-t-il d'autres problèmes dans le village en ce moment ?", isPlayer: true },
        { speaker: 'Mère Tilda', text: "Ha... par où commencer. Le Chef Aldric est à bout. Des gobelins rançonnent les voyageurs sur le Chemin de Pierre depuis deux semaines. Trois marchands déjà dépouillés.", emotion: 'sad' },
        { speaker: 'Mère Tilda', text: "Il cherche des aventuriers courageux. Quelqu'un de votre trempe... Je pense qu'il paie bien.", emotion: 'neutral' },
      ],
      dialogueNextSceneId: 'ch1_aldric_bridge',
    },

    ch1_aldric_bridge: {
      id: 'ch1_aldric_bridge', type: 'choice', chapterId: 'ch1',
      title: 'Que faire ?',
      narrative: "La soirée est encore jeune. Vous avez quelques pièces d'or et votre première victoire derrière vous. Le Chef Aldric attend peut-être à la mairie.",
      choices: [
        { id: 'go_aldric', label: "🏛️ Rendre visite au Chef Aldric", nextSceneId: 'ch1_aldric' },
        { id: 'rest_first', label: "🛏️ Se reposer d'abord (soins complets)", nextSceneId: 'ch1_repos' },
      ],
    },

    ch1_repos: {
      id: 'ch1_repos', type: 'rest', chapterId: 'ch1',
      title: 'Repos Long',
      narrative: "Vous montez dans votre chambre. Le matelas de paille est dur mais propre. En quelques minutes, vous dormez profondément.\n\nAu matin, vos blessures ont disparu, votre énergie est restaurée. Dehors, le village s'anime.",
      reward: { xp: 10, gold: 0 },
      autoNextSceneId: 'ch1_aldric',
    },

    ch1_aldric: {
      id: 'ch1_aldric', type: 'dialogue', chapterId: 'ch1',
      title: 'Le Chef Aldric',
      narrative: "La mairie est un bâtiment en pierre solide au centre du village. Le Chef Aldric, un homme d'une cinquantaine d'années à la barbe poivre et sel, vous accueille dans son bureau encombré de cartes et de rapports.",
      dialogue: [
        { speaker: 'Chef Aldric', text: "Ah, un aventurier ! Mère Tilda m'a envoyé un message. Vous avez réglé son problème de rats, m'a-t-elle dit.", emotion: 'neutral' },
        { speaker: 'Chef Aldric', text: "Bois-Clair a un problème autrement plus grave, j'en ai peur.", emotion: 'sad' },
        { speaker: 'Chef Aldric', text: "Des gobelins terrorisent le Chemin de Pierre depuis deux semaines. Trois marchands ont été dévalisés. Personne n'ose plus emprunter cette route.", emotion: 'angry' },
        { speaker: 'Vous', text: "Où se trouve ce chemin ?", isPlayer: true },
        { speaker: 'Chef Aldric', text: "À l'ouest du village, longe la forêt sur 3 lieues. Les gobelins attaquent depuis les arbres. Si vous pouvez les repousser ET trouver leur camp... je paie 150 pièces d'or.", emotion: 'neutral' },
        { speaker: 'Chef Aldric', text: "Le marchand Gorvick a aussi signalé une chose étrange : des symboles noirs peints sur les arbres. Jamais vu ça dans cette région.", emotion: 'mysterious' },
      ],
      questOffer: {
        title: "Les Gobelins de la Passe",
        description: "Le Chef Aldric demande de sécuriser le Chemin de Pierre, d'identifier l'emplacement du camp gobelin, et d'enquêter sur les mystérieux symboles noirs.",
        reward: "150 po · 350 XP · Récompense bonus pour le camp",
        type: 'principale',
        objectives: [
          "Se rendre sur le Chemin de Pierre",
          "Éliminer le groupe de gobelins embusqués",
          "Localiser le camp gobelin",
          "Enquêter sur les symboles noirs",
          "Rendre compte au Chef Aldric",
        ],
      },
      choices: [
        { id: 'accept_goblins', label: "⚔️ Accepter la mission", nextSceneId: 'ch1_fin', setFlag: 'quest_goblins_accepted' },
        { id: 'decline_goblins', label: "🤔 Demander du temps pour réfléchir", nextSceneId: 'ch1_fin_decline' },
      ],
    },

    ch1_fin_decline: {
      id: 'ch1_fin_decline', type: 'choice', chapterId: 'ch1',
      title: 'Un Moment de Réflexion',
      narrative: "Le Chef Aldric hoche la tête, compréhensif. \"Je comprends. Mais ne tardez pas trop — chaque jour que passent ces gobelins, c'est un marchand de plus qui se fait détrousser.\"\n\nVous sortez dans l'air frais du matin. La décision vous appartient.",
      choices: [
        { id: 'go_back_accept', label: "↩️ Accepter finalement", nextSceneId: 'ch1_fin', setFlag: 'quest_goblins_accepted' },
        { id: 'explore_village', label: "🏘️ Explorer le village d'abord", nextSceneId: 'ch1_aldric_bridge' },
      ],
    },

    ch1_fin: {
      id: 'ch1_fin', type: 'chapter_end', chapterId: 'ch1',
      title: 'Chapitre 1 Terminé',
      narrative: "Vous quittez la mairie avec une mission claire et une idée de la route à suivre. Le soleil commence son ascension dans un ciel dégagé.\n\nBois-Clair s'anime autour de vous. Les habitants qui vous croisent vous sourient — la nouvelle de votre exploit dans les caves s'est déjà répandue.\n\n— La route de l'ouest vous attend —",
      reward: { xp: 50, gold: 0 },
      autoNextSceneId: 'ch2_depart',
    },

    // ─────────────── CHAPITRE 2 ───────────────────────────────────────────────
    ch2_depart: {
      id: 'ch2_depart', type: 'narrative', chapterId: 'ch2',
      title: 'Vers la Forêt',
      narrative: "Le Chemin de Pierre serpente à travers des champs avant de longer la lisière d'une sombre forêt de pins. Les arbres deviennent plus denses, les ombres plus profondes.\n\nVous remarquez rapidement les traces : des empreintes de petits pieds dans la boue, des branches brisées à mi-hauteur, un foulard appartenant à un marchand accroché dans les ronces.\n\nQuelqu'un — ou quelque chose — surveille ce chemin.",
      autoNextSceneId: 'ch2_choix_approche',
    },

    ch2_choix_approche: {
      id: 'ch2_choix_approche', type: 'exploration', chapterId: 'ch2',
      title: 'Une Présence dans les Arbres',
      narrative: "Vous êtes maintenant sur le tronçon le plus dangereux du chemin — une zone encaissée entre deux talus boisés. Le parfait endroit pour une embuscade.\n\nComment procédez-vous ?",
      choices: [
        {
          id: 'sneak', label: "🥷 Avancer prudemment (repérer les goblelins)",
          icon: '🥷', nextSceneId: 'ch2_combat_gobelins', setFlag: 'sneak_attempted',
        },
        {
          id: 'charge', label: "⚡ Charger en criant pour les intimider",
          icon: '⚡', nextSceneId: 'ch2_combat_gobelins',
        },
        {
          id: 'wait', label: "⏳ Se cacher et attendre qu'ils se montrent",
          icon: '⏳', nextSceneId: 'ch2_wait_ambush',
        },
      ],
    },

    ch2_wait_ambush: {
      id: 'ch2_wait_ambush', type: 'narrative', chapterId: 'ch2',
      title: 'L\'Attente Payante',
      narrative: "Vous vous glissez dans les buissons sur le côté du chemin et attendez, immobile.\n\nAu bout de quelques minutes, trois gobelins descendent d'un arbre et s'avancent prudemment sur le chemin, cherchant leur proie. Ils ne vous ont pas vu.\n\nVous tenez l'avantage de la surprise.",
      autoNextSceneId: 'ch2_combat_gobelins',
    },

    ch2_combat_gobelins: {
      id: 'ch2_combat_gobelins', type: 'combat', chapterId: 'ch2',
      title: 'Embuscade sur le Chemin de Pierre',
      narrative: "Trois gobelins surgissent des taillis, brandissant des lames rouillées et des arcs courts. Leurs grognements rauques fendent le silence de la forêt.",
      combatIntro: "Trois Gobelins vous attaquent sur le Chemin de Pierre !",
      enemies: [GOBELIN, GOBELIN_B, GOBELIN_C],
      victorySceneId: 'ch2_victoire_chemin',
      defeatSceneId: 'ch2_defaite_chemin',
    },

    ch2_defaite_chemin: {
      id: 'ch2_defaite_chemin', type: 'narrative', chapterId: 'ch2',
      title: 'Vaincu sur la Route...',
      narrative: "Les gobelins vous submergent à trois contre un. Ils vous fouillent rapidement et dérobent quelques pièces d'or avant de disparaître dans la forêt avec des ricanements.\n\nVous regagnez Bois-Clair en boitant. Mère Tilda soigne vos blessures sans poser de questions, mais vous lit la déception dans les yeux.\n\n\"La forêt est dangereuse. Mais vous êtes encore en vie. C'est ce qui compte.\"",
      reward: { xp: 30, gold: -10 },
      autoNextSceneId: 'ch2_depart',
    },

    ch2_victoire_chemin: {
      id: 'ch2_victoire_chemin', type: 'reward', chapterId: 'ch2',
      title: 'Chemin Sécurisé !',
      narrative: "Les trois gobelins gisent sur le chemin. En les fouillant, vous trouvez le butin qu'ils avaient dérobé aux marchands précédents — ainsi qu'une note griffonnée en écriture gobeline sur un bout de cuir.\n\nVous ne lisez pas le gobelin, mais le symbole dessiné en bas — un masque noir avec deux cercles pour les yeux — correspond exactement à ce que le Chef Aldric vous a décrit.",
      reward: {
        xp: 200,
        gold: 25,
        questComplete: [],
      },
      autoNextSceneId: 'ch2_prisonnier_choix',
    },

    ch2_prisonnier_choix: {
      id: 'ch2_prisonnier_choix', type: 'choice', chapterId: 'ch2',
      title: 'Un Survivant',
      narrative: "L'un des gobelins n'est pas tout à fait mort. Il vous regarde avec des yeux apeurés, saignant d'une blessure à l'épaule.\n\n\"Grix... pas vouloir mourir. Grix obéir juste à chef...\"",
      choices: [
        {
          id: 'interrogate', label: "💬 L'interroger sur le camp",
          nextSceneId: 'ch2_dialogue_grix',
        },
        {
          id: 'let_go', label: "🕊️ Le laisser partir sans l'interroger",
          nextSceneId: 'ch2_vers_camp', setFlag: 'released_grix',
        },
      ],
    },

    ch2_dialogue_grix: {
      id: 'ch2_dialogue_grix', type: 'dialogue', chapterId: 'ch2',
      title: 'La Langue de Grix',
      narrative: "Vous vous accroupissez face au gobelin blessé.",
      dialogue: [
        { speaker: 'Vous', text: "Où est votre camp ? Dis-moi et tu peux partir.", isPlayer: true },
        { speaker: 'Grix', text: "Grix... Grix pas vouloir trahir chef Krax. Chef Krax très en colère si...", emotion: 'scared' },
        { speaker: 'Vous', text: "Chef Krax n'a plus besoin de le savoir.", isPlayer: true },
        { speaker: 'Grix', text: "Grix montrer chemin ! Clairière des Deux Chênes, à l'est dans la forêt. Suivre le ruisseau, tourner au rocher rouge. Camp là.", emotion: 'scared' },
        { speaker: 'Grix', text: "Et... quelque chose d'autre. Chef Krax reçoit des ordres. Quelqu'un d'humain. Portait une robe noire avec... masque. Disait à Krax quoi faire, où attaquer.", emotion: 'mysterious' },
        { speaker: 'Vous', text: "Qui est cet humain ?", isPlayer: true },
        { speaker: 'Grix', text: "Grix pas savoir nom. Mais venait de la vieille tour... au nord des collines. Jamais allé là-bas. Trop peur.", emotion: 'scared' },
      ],
      dialogueNextSceneId: 'ch2_apres_grix',
    },

    ch2_apres_grix: {
      id: 'ch2_apres_grix', type: 'choice', chapterId: 'ch2',
      title: 'Que Faire de Grix ?',
      narrative: "Grix vous a fourni des informations précieuses : le chemin vers le camp et l'existence d'un mystérieux commanditaire humain. Il vous regarde, attendant votre verdict.",
      choices: [
        {
          id: 'free_grix', label: "🕊️ Le libérer comme promis",
          nextSceneId: 'ch2_vers_camp', setFlag: 'grix_info_obtained',
        },
        {
          id: 'keep_grix', label: "⛓️ Le garder pour le remettre aux gardes",
          nextSceneId: 'ch2_vers_camp', setFlag: 'grix_info_obtained',
        },
      ],
    },

    ch2_vers_camp: {
      id: 'ch2_vers_camp', type: 'narrative', chapterId: 'ch2',
      title: 'Vers la Clairière',
      narrative: "Vous suivez les indications obtenues — ou vous utilisez les traces laissées par les gobelins pour retracer leur chemin vers leur camp.\n\nLe ruisseau murmure sur votre gauche. Les arbres deviennent plus épais. Une odeur de fumée et de viande brûlée commence à se faire sentir.\n\nPuis vous l'apercevez : une clairière éclairée par des torches, avec une palissade de pieux grossiers. Des voix rauques et des rires gutturaux s'en échappent.",
      autoNextSceneId: 'ch2_espionnage',
    },

    ch2_espionnage: {
      id: 'ch2_espionnage', type: 'exploration', chapterId: 'ch2',
      title: 'Reconnaissance du Camp',
      narrative: "De votre position dans les buissons, vous observez le camp gobelin. Deux sentinelles montent la garde à l'entrée. Une tente plus grande au fond doit être celle de leur chef.\n\nVous comptez au moins 6 ou 7 gobelins actifs. Trop pour y aller seul frontalement... mais peut-être qu'avec de la discrétion...",
      choices: [
        {
          id: 'infiltrate', label: "🥷 S'infiltrer discrètement",
          nextSceneId: 'ch3_infiltration', setFlag: 'chose_infiltration',
        },
        {
          id: 'assault', label: "⚔️ Attaque frontale en éliminant les gardes",
          nextSceneId: 'ch3_combat_gardes',
        },
        {
          id: 'distraction', label: "🔥 Créer une distraction (lancer une torche à l'opposé)",
          nextSceneId: 'ch3_distraction', setFlag: 'created_distraction',
        },
      ],
    },

    // ─────────────── CHAPITRE 3 ───────────────────────────────────────────────
    ch3_distraction: {
      id: 'ch3_distraction', type: 'narrative', chapterId: 'ch3',
      title: 'La Diversion',
      narrative: "Vous ramassez une branche enflammée d'une torche abandonnée et la lancez dans un tas de buissons secs à l'opposé de l'entrée principale.\n\n\"FEU ! FEU !\" Les gobelins s'agitent, courent dans tous les sens. Les deux gardes de l'entrée abandonnent leur poste pour aller voir.\n\nL'entrée est libre.",
      autoNextSceneId: 'ch3_infiltration',
    },

    ch3_infiltration: {
      id: 'ch3_infiltration', type: 'narrative', chapterId: 'ch3',
      title: 'Au Cœur du Camp',
      narrative: "Vous vous glissez entre les tentes avec la fluidité d'une ombre. Les gobelins sont distraits ou endormis.\n\nLa grande tente du chef est juste devant vous. Sur une table grossière à l'entrée, un parchemin et un coffret en bois sont posés sans surveillance. Vous les saisissez rapidement.\n\nLe parchemin porte le même symbole que la note trouvée sur les gobelins : un masque noir.",
      autoNextSceneId: 'ch3_lettre',
    },

    ch3_approche: {
      id: 'ch3_approche', type: 'narrative', chapterId: 'ch3',
      title: 'Aux Portes du Camp',
      narrative: "Vous approchez du camp gobelin. La nuit commence à tomber, rendant l'atmosphère encore plus menaçante. Des torches crépitent sur la palissade.\n\nDeux sentinelles baraquées pour des gobelins montent la garde à l'entrée.",
      autoNextSceneId: 'ch3_combat_gardes',
    },

    ch3_combat_gardes: {
      id: 'ch3_combat_gardes', type: 'combat', chapterId: 'ch3',
      title: 'Les Gardes du Camp',
      narrative: "Les deux sentinelles gobelinoïdes vous repèrent et poussent un cri d'alarme. Un archer perché sur la palissade vous met en joue.",
      combatIntro: "2 Gobelins et un Archer vous barrent le chemin !",
      enemies: [GOBELIN, GOBELIN_B, GOBELIN_ARCHER],
      victorySceneId: 'ch3_apres_gardes',
      defeatSceneId: 'ch3_defaite_gardes',
    },

    ch3_defaite_gardes: {
      id: 'ch3_defaite_gardes', type: 'narrative', chapterId: 'ch3',
      title: 'Repoussé...',
      narrative: "Les gardes sont trop nombreux. Blessé, vous battez en retraite dans la forêt.\n\nAprès quelques heures de repos, vous retrouvez vos forces. Le camp gobelin ne s'est pas déplacé. Cette fois, vous serez plus prudent.",
      reward: { xp: 50, gold: 0 },
      autoNextSceneId: 'ch2_espionnage',
    },

    ch3_apres_gardes: {
      id: 'ch3_apres_gardes', type: 'narrative', chapterId: 'ch3',
      title: 'L\'Entrée Forcée',
      narrative: "Les gardes tombent. L'alarme n'a pas encore été donnée dans le reste du camp — ou du moins, pas encore.\n\nVous vous précipitez vers la grande tente du chef. Sur une table, vous apercevez un parchemin et un coffret.",
      autoNextSceneId: 'ch3_lettre',
    },

    ch3_lettre: {
      id: 'ch3_lettre', type: 'narrative', chapterId: 'ch3',
      title: 'Le Parchemin Noir',
      narrative: "Le parchemin est écrit en commun, d'une encre presque noire. Vous le lisez rapidement :\n\n\"Krax — Continuez à perturber les routes. Chaque mort nous rapproche de notre objectif. Le Maître sera bientôt prêt pour le rituel. Ne revenez à la tour que lorsque vous aurez rassemblé les âmes requises.\n— Le Masque\"\n\nVous retournez le parchemin. Au bas, un symbole familier : un masque avec deux yeux vides.\n\nQuelqu'un utilise ces gobelins pour quelque chose de bien plus sinistre que des braquages de marchands.",
      autoNextSceneId: 'ch3_krax_dialogue',
    },

    ch3_krax_dialogue: {
      id: 'ch3_krax_dialogue', type: 'dialogue', chapterId: 'ch3',
      title: 'Le Chef Krax',
      narrative: "Un grognement tonitruant vous fait sursauter. Une masse imposante pour un gobelin — presque aussi grand qu'un humain, bardé d'armure de fortune et brandissant une hachette à deux mains — se dresse devant vous.",
      dialogue: [
        { speaker: 'Chef Krax', text: "HUMAIN ! Tu oses entrer dans le camp de Krax ?!", emotion: 'angry' },
        { speaker: 'Chef Krax', text: "Krax va te briser. Krax va envoyer tes os au Masque comme offrande.", emotion: 'angry' },
        { speaker: 'Vous', text: "Qui est ce Masque ? Pour qui travailles-tu vraiment, Krax ?", isPlayer: true },
        { speaker: 'Chef Krax', text: "SILENCE ! Krax n'obéit à personne ! Krax est le plus fort !", emotion: 'angry' },
        { speaker: 'Vous', text: "Tu obéis à un humain en robe noire. Tu n'es qu'un outil pour lui.", isPlayer: true },
        { speaker: 'Chef Krax', text: "...Tuez-le !", emotion: 'angry' },
      ],
      dialogueNextSceneId: 'ch3_boss_fight',
    },

    ch3_boss_fight: {
      id: 'ch3_boss_fight', type: 'combat', chapterId: 'ch3',
      title: 'Le Duel Final — Chef Krax',
      narrative: "Le Chef Krax rugit de rage et se jette sur vous, sa hachette sifflant dans l'air. Son garde du corps personnel prend position à ses côtés.",
      combatIntro: "BOSS — Chef Krax et son Garde s'élancent vers vous !",
      enemies: [KRAX, GARDE_KRAX],
      victorySceneId: 'ch3_victoire_camp',
      defeatSceneId: 'ch3_defaite_boss',
    },

    ch3_defaite_boss: {
      id: 'ch3_defaite_boss', type: 'narrative', chapterId: 'ch3',
      title: 'Krax Triomphe...',
      narrative: "La hachette de Krax vous touche de plein fouet. La douleur est fulgurante.\n\nKrax vous regarde tomber avec un ricanement de satisfaction, mais curieusement, au lieu de vous achever, il vous fait jeter hors du camp par ses sbires.\n\n\"Krax pas tuer les faibles. Ça porte malchance. Va-t'en, humain, et dis aux autres de pas venir ici.\"\n\nVous vous relevez dans la forêt, blessé mais en vie. Vous devrez revenir plus préparé.",
      reward: { xp: 100, gold: 0 },
      autoNextSceneId: 'ch3_retour_prep',
    },

    ch3_retour_prep: {
      id: 'ch3_retour_prep', type: 'choice', chapterId: 'ch3',
      title: 'Se Préparer',
      narrative: "Vous regagnez Bois-Clair pour vous soigner et vous préparer. Mère Tilda vous remet sur pied. \"Krax est une légende dans la région. Personne n'a jamais réussi à le battre en combat direct.\"\n\nMais vous avez quelque chose que personne n'avait avant : des informations sur son commanditaire mystérieux.",
      choices: [
        {
          id: 'retry_assault', label: "⚔️ Retourner combattre Krax",
          nextSceneId: 'ch3_boss_fight',
        },
        {
          id: 'retry_infiltrate', label: "🥷 Tenter de l'approcher différemment",
          nextSceneId: 'ch2_espionnage',
        },
      ],
    },

    ch3_victoire_camp: {
      id: 'ch3_victoire_camp', type: 'reward', chapterId: 'ch3',
      title: 'La Chute de Krax !',
      narrative: "Chef Krax s'effondre avec un rugissement qui secoue la terre. Le silence qui suit est presque irréel.\n\nLes gobelins restants s'enfuient dans toutes les directions en poussant des cris de panique. Le camp vous appartient.\n\nDans la tente du chef, vous trouvez le coffret : il contient une épée courte finement ouvragée, des pièces d'or empilées, et encore des documents portant le symbole du Masque Noir.",
      reward: {
        xp: 600,
        gold: 150,
        items: [
          {
            name: 'Épée Courte de Bois-Clair',
            description: 'Une lame elfique gravée de runes de précision. Volée à un voyageur par les gobelins. Bonus +1 aux jets d\'attaque.',
            category: 'arme',
            rarity: 'peu_commun',
            damage: '1d6+1',
          },
        ],
        questComplete: ["Les Gobelins de la Passe"],
      },
      autoNextSceneId: 'ch3_epilogue',
    },

    ch3_epilogue: {
      id: 'ch3_epilogue', type: 'narrative', chapterId: 'ch3',
      title: 'Le Retour du Héros',
      narrative: "Le soleil se lève sur le chemin du retour. Vous portez les preuves dans votre sac — les parchemins du Masque Noir, l'épée récupérée, et la certitude qu'une menace plus grande attend dans la vieille tour au nord.\n\nBois-Clair vous accueille avec des cris de joie. Mère Tilda pleure de soulagement. Le Chef Aldric vous serre la main si fort que vos jointures blanchissent.\n\n\"Je savais que vous étiez quelqu'un d'exceptionnel dès la première minute.\"\n\nLa récompense est versée. Mais les documents du Masque Noir restent une question sans réponse. Une prochaine aventure attend...",
      autoNextSceneId: 'ch3_fin',
    },

    ch3_fin: {
      id: 'ch3_fin', type: 'adventure_end', chapterId: 'ch3',
      title: 'Fin de Campagne — L\'Aube des Héros',
      narrative: "🏆 Félicitations !\n\nVous avez terminé \"L'Aube des Héros\" !\n\nVous êtes arrivé inconnu à Bois-Clair et vous en repartez héros du village. Les gobelins sont vaincus, le Chemin de Pierre est sûr, et vous avez mis au jour un complot bien plus sombre.\n\nLe Masque Noir n'a pas fini de faire parler de lui...",
      reward: { xp: 200, gold: 0 },
      autoNextSceneId: 'ch3_fin',
    },
  },
};
