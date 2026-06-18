export interface PatchNote {
  version: string;
  date: string;
  highlights: string;
  changes: string[];
}

export const PATCH_NOTES: PatchNote[] = [
  {
    version: '2.0.1',
    date: 'Juin 2026',
    highlights: '🎨 Corrections et améliorations v2.0.1',
    changes: [
      '🎨 Système de thèmes global — les thèmes changent instantanément toutes les fenêtres',
      '🐉 Mode Dragon Ball — campagne, quêtes et équipement DB dans leurs écrans respectifs',
      '🧭 Flux premier lancement repensé — création de personnage → mode → tutoriel → campagne',
      '🎓 Offre de tutoriel au premier lancement en mode Solo',
      '🏰 Création de campagne améliorée — sélecteur de type : Fantasy, Dragon Ball, Personnalisé',
      '🔐 Easter eggs rendus vraiment secrets — suppression de tous les compteurs visibles',
      '🛡️ SafeAreaView et protection des bordures sur tous les écrans',
      '✅ Corrections de bugs : TimerCombat, GMScreen, InventoryScreen',
    ],
  },
  {
    version: '2.0.0',
    date: 'Juin 2026',
    highlights: '🚀 Version majeure — DiceQuest 2.0',
    changes: [
      '🆕 Bibliothèque d\'équipements : armes, armures, sorts, consommables et objets magiques par rareté',
      '🆕 Tutoriel joueur interactif : règles D&D, dés, stats, combat, sorts',
      '🆕 Tutoriel Maître du Jeu avec campagne de base intégrée',
      '🆕 Générateur de noms (PNJ, villes, tavernes, créatures)',
      '🆕 Table de rencontres aléatoires par terrain et niveau',
      '🆕 Minuteur de tour dans le combat (configurable)',
      '🆕 Tracker de ressources : emplacements de sorts, points de ki, inspiration bardique, rage, points de sorcellerie',
      '🆕 Conditions visuelles sur la fiche de personnage',
      '🆕 Générateur de donjons aléatoires (salles, pièges, trésors, boss)',
      '🆕 Météo et ambiance aléatoires pour le MJ',
      '🆕 Calculateur d\'XP et de niveau',
      '🆕 Thèmes visuels : Sombre, Parchemin, Moderne — et un thème secret à débloquer...',
      '🆕 Notes de mise à jour dans l\'application',
      '🔧 DiceQuest v2.0.0',
    ],
  },
  {
    version: '1.2.3',
    date: 'Juin 2026',
    highlights: '🗺️ Cartes modèles, correctifs LAN, renommage DiceQuest',
    changes: [
      '🔧 Correction : les boutons "Arrêter la partie", "Quitter la partie" et "Retour" dans l\'écran LAN naviguent maintenant correctement',
      '🆕 4 cartes modèles intégrées : Donjon de pierre, Caverne souterraine, Place du village, Ville fluviale',
      '🆕 Hébergement via hotspot Wi-Fi avec saisie d\'IP manuelle en repli',
      '🆕 Icône, icône adaptative et splash screen personnalisés DiceQuest',
      '🔄 Renommage "JDR App" → "DiceQuest" dans toute l\'application',
      '📝 Section "À propos" mise à jour avec "Créé par SHOXOTO"',
    ],
  },
  {
    version: '1.2.2',
    date: 'Juin 2026',
    highlights: '🏰 Mode MJ amélioré, factions et lieux',
    changes: [
      '🆕 Gestion des factions avec suivi de réputation',
      '🆕 Gestion des lieux (donjons, villes, tavernes, etc.)',
      '🔧 Amélioration des performances de l\'écran MJ',
      '🔧 Correction de l\'affichage des conditions dans le combat',
    ],
  },
  {
    version: '1.2.1',
    date: 'Mai 2026',
    highlights: '🎲 Dés avancés, formules personnalisées',
    changes: [
      '🆕 Formules de dés personnalisées : 2D6+3, 1D20-1, etc.',
      '🆕 Lancers avec avantage et désavantage',
      '🆕 Historique des lancers amélioré',
      '🔧 Animation de rebond sur les boutons de dés',
    ],
  },
  {
    version: '1.2.0',
    date: 'Mai 2026',
    highlights: '📡 Multijoueur LAN, Pass-and-Play',
    changes: [
      '🆕 Mode multijoueur LAN : héberger ou rejoindre via code sur le même Wi-Fi',
      '🆕 Mode Pass-and-Play : plusieurs joueurs sur un seul appareil',
      '🆕 Synchronisation des personnages en temps réel (LAN)',
      '🆕 Tableau de bord du groupe LAN',
    ],
  },
  {
    version: '1.1.0',
    date: 'Avril 2026',
    highlights: '🗺️ Carte interactive, campagnes',
    changes: [
      '🆕 Carte interactive : import de photos, marqueurs personnalisés',
      '🆕 Gestion des campagnes avec suivi de sessions',
      '🆕 Notes MJ par campagne',
      '🔧 Sauvegarde automatique améliorée',
    ],
  },
  {
    version: '1.0.0',
    date: 'Mars 2026',
    highlights: '⚔️ Lancement initial',
    changes: [
      '🆕 Fiche de personnage complète (stats D&D 5e, compétences, sorts)',
      '🆕 Gestion de l\'inventaire avec équipements et raretés',
      '🆕 Lanceur de dés avec historique',
      '🆕 Journal / notes par personnage',
      '🆕 Tracker de combat avec initiative, conditions, journal',
      '🆕 Quêtes avec objectifs et statuts',
      '🆕 Mode Maître du Jeu : PNJ, monstres, factions',
      '🆕 Sauvegarde locale automatique',
    ],
  },
];
