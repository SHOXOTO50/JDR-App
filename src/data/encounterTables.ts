export type Terrain = 'foret' | 'donjon' | 'ville' | 'plaines' | 'montagne' | 'marais' | 'cotier';
export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'mortel';
export type LevelRange = '1-4' | '5-10' | '11-16' | '17-20';

export interface Encounter {
  name: string;
  cr: string;
  count: string;
  description: string;
  loot?: string;
}

const ENCOUNTERS: Record<Terrain, Record<LevelRange, Record<Difficulty, Encounter[]>>> = {
  foret: {
    '1-4': {
      facile: [
        { name: 'Loups', cr: '1/4', count: '2D4', description: 'Une meute de loups affamés rôde entre les arbres.', loot: 'Fourrure (2D4 po)' },
        { name: 'Gobelins', cr: '1/4', count: '2D6', description: 'Un groupe de gobelins tend une embuscade depuis les buissons.', loot: 'Pièces de cuivre, armes rouillées' },
        { name: 'Araignées géantes', cr: '1', count: '1D3', description: 'Des araignées géantes descendent de leurs toiles tendues entre les branches.', loot: 'Soie d\'araignée (5 po)' },
      ],
      moyen: [
        { name: 'Hobgobelins', cr: '1/2', count: '2D4', description: 'Une patrouille militaire de hobgobelins disciplinés.', loot: 'Équipement militaire (10D6 po)' },
        { name: 'Gnolls', cr: '1/2', count: '1D6+2', description: 'Des gnolls en maraude cherchant leur prochain repas.', loot: 'Os, amulette fétiche (5 po)' },
        { name: 'Bête de cauchemar', cr: '2', count: '1', description: 'Une bête noire et silencieuse suit vos traces depuis un moment.', loot: 'Griffe (30 po)' },
      ],
      difficile: [
        { name: 'Ogre', cr: '2', count: '1D2', description: 'Un ogre massif barre le chemin, un tronc d\'arbre en guise de massue.', loot: 'Sac d\'ogre (50 po en contenu divers)' },
        { name: 'Sorcière de la forêt', cr: '3', count: '1', description: 'Une vieille sorcière vous attire dans son cercle de champignons.', loot: 'Grimoire de sorts (100 po), herbes rares' },
      ],
      mortel: [
        { name: 'Troll', cr: '5', count: '1', description: 'Un troll énorme émerge des marécages de la forêt profonde.', loot: 'Cœur régénérant (200 po)' },
        { name: 'Manticore', cr: '3', count: '1D2', description: 'Une manticore plane et lance ses épines depuis les hauteurs.', loot: 'Épines (5 po pièce), fourrure (50 po)' },
      ],
    },
    '5-10': {
      facile: [
        { name: 'Gnolls + Hyènes', cr: '1/2', count: '2D6', description: 'Un clan de gnolls avec leurs hyènes de combat.', loot: 'Pièces, armes (2D10×5 po)' },
        { name: 'Worg', cr: '1/2', count: '2D4', description: 'Des worgs monstrueux, montures des gobelins.', loot: 'Fourrure épaisse (20 po)' },
      ],
      moyen: [
        { name: 'Ours-hibou', cr: '3', count: '1D3', description: 'La créature hybride redoutable de la forêt profonde.', loot: 'Plumes d\'hibou (30 po)' },
        { name: 'Chef gobelin + troupe', cr: '1', count: '1+2D8', description: 'Un chef gobelin habile en embuscade avec sa troupe.', loot: 'Couronne de chef (50 po), trésor de groupe' },
      ],
      difficile: [
        { name: 'Vétéran humain + gardes', cr: '3', count: '1+2D4', description: 'Des bandits organisés avec un meneur expérimenté.', loot: 'Coffre fort (2D6×10 po)' },
        { name: 'Loup-garou', cr: '3', count: '1D3', description: 'Des loup-garous cachant leur nature lors du retour de la lune.', loot: 'Argent (transformation annulée 50 po)' },
      ],
      mortel: [
        { name: 'Géant des collines', cr: '5', count: '1', description: 'Un géant des collines s\'est égaré dans la forêt, destructeur.', loot: 'Sac géant (2D10×10 po)' },
        { name: 'Vampire fée', cr: '7', count: '1', description: 'Une créature féérique corrompue qui se nourrit d\'émotions.', loot: 'Cœur cristallisé (500 po)' },
      ],
    },
    '11-16': {
      facile: [
        { name: 'Groupe de bandits organisés', cr: '2', count: '2D6+4', description: 'Une guilde criminelle bien équipée.', loot: 'Coffre (5D10×10 po)' },
      ],
      moyen: [
        { name: 'Chimère', cr: '6', count: '1', description: 'La chimère crache du feu depuis les cimes des arbres.', loot: 'Cornes (200 po), écailles (300 po)' },
      ],
      difficile: [
        { name: 'Dragon vert (jeune)', cr: '8', count: '1', description: 'Un jeune dragon vert règne sur cette forêt depuis un siècle.', loot: 'Trésor de dragon (2D10×100 po + objets magiques)' },
      ],
      mortel: [
        { name: 'Dragon vert (adulte)', cr: '15', count: '1', description: 'L\'ancien dragon vert, maître manipulateur, attend dans son repaire.', loot: 'Trésor légendaire (5D10×100 po + objets très rares)' },
      ],
    },
    '17-20': {
      facile: [
        { name: 'Géant des tempêtes', cr: '13', count: '1', description: 'Un géant des tempêtes traverse la forêt.', loot: 'Artefact runique (1000 po)' },
      ],
      moyen: [
        { name: 'Dragon vert (ancien)', cr: '22', count: '1', description: 'L\'un des plus vieux dragons verts du monde.', loot: 'Trésor ancestral (légendaire)' },
      ],
      difficile: [
        { name: 'Liche de la forêt', cr: '21', count: '1', description: 'Une liche ancienne garde les secrets de la forêt éternelle.', loot: 'Phylactère, grimoires anciens (10 000 po)' },
      ],
      mortel: [
        { name: 'Tarrasque', cr: '30', count: '1', description: 'La bête légendaire — seule la ruse peut vous sauver.', loot: 'Légendaire' },
      ],
    },
  },
  donjon: {
    '1-4': {
      facile: [
        { name: 'Squelettes', cr: '1/4', count: '2D6', description: 'Des squelettes animés par une magie nécromantique résiduelle.', loot: 'Restes d\'équipement rouillé' },
        { name: 'Zombies', cr: '1/4', count: '2D4', description: 'Des zombies lents mais tenaces bloquent le couloir.', loot: 'Vêtements pourris, quelques pièces' },
        { name: 'Rats géants', cr: '1/8', count: '4D6', description: 'Une colonie de rats géants infeste ce niveau.', loot: 'Fourrure (1D4 po)' },
      ],
      moyen: [
        { name: 'Kobolds + piège', cr: '1/8', count: '3D6', description: 'Les kobolds ont piégé toute la salle. Prudence !', loot: 'Mécanismes de pièges (20 po), or caché (2D10 po)' },
        { name: 'Gobelins + chef', cr: '1/4+1', count: '2D8+1', description: 'Un nid de gobelins avec leur chef aux tactiques sournoises.', loot: 'Trésor de nid (3D10×2 po)' },
      ],
      difficile: [
        { name: 'Gelatinous Cube', cr: '2', count: '1', description: 'Un cube gélatineux silencieux remplit presque tout le couloir.', loot: 'Objets dissous à l\'intérieur (2D6×5 po)' },
        { name: 'Spectre', cr: '1', count: '1D4', description: 'Des spectres hurlent et traversent les murs.', loot: 'Énergie ectoplasmatique (30 po)' },
      ],
      mortel: [
        { name: 'Mimique', cr: '2', count: '1D2', description: 'Ce coffre est... trop parfait. Méfiance.', loot: 'Estomac de mimique (50 po)' },
        { name: 'Wraith', cr: '5', count: '1', description: 'Un wraith afame les âmes de ses victimes.', loot: 'Essence spectrale (100 po)' },
      ],
    },
    '5-10': {
      facile: [
        { name: 'Ghoules', cr: '1', count: '2D6', description: 'Des ghoules affamées attirées par les vivants.', loot: 'Bijoux sur les corps (2D10×5 po)' },
      ],
      moyen: [
        { name: 'Gardes animés + nécromant', cr: '1/4+5', count: '4+1', description: 'Un nécromant avec sa garde de morts-vivants.', loot: 'Grimoire (200 po), parchemins' },
        { name: 'Basilic', cr: '3', count: '1D2', description: 'Ne croisez pas son regard... ou vous serez pétrifiés.', loot: 'Yeux (60 po), sang (30 po)' },
      ],
      difficile: [
        { name: 'Méduse', cr: '6', count: '1', description: 'La méduse a transformé ses victimes précédentes en statues décoratives.', loot: 'Yeux de méduse (200 po), trésor (5D6×10 po)' },
      ],
      mortel: [
        { name: 'Vampire + Spawn', cr: '13+5', count: '1+2D4', description: 'Le maître du donjon en personne. Fuyez ou combattez.', loot: 'Trésor légendaire, coffin (500 po)' },
      ],
    },
    '11-16': {
      facile: [
        { name: 'Démon Vrock', cr: '6', count: '1D4', description: 'Des vracks démoniaques sont convoqués dans ce niveau.', loot: 'Plumes démoniaque (100 po)' },
      ],
      moyen: [
        { name: 'Diable de Glace', cr: '14', count: '1', description: 'Un puissant diable de glace monte la garde.', loot: 'Cœur de glace (500 po)' },
      ],
      difficile: [
        { name: 'Liche + Phylactère', cr: '21', count: '1', description: 'La liche imortelle dans son repaire.', loot: 'Phylactère, grimoires anciens (10 000 po)' },
      ],
      mortel: [
        { name: 'Dragon dracolich', cr: '17', count: '1', description: 'Un dracolich ancien, dragon immortel transformé par la nécromancie.', loot: 'Trésor dracolich (légendaire)' },
      ],
    },
    '17-20': {
      facile: [
        { name: 'Balor', cr: '19', count: '1', description: 'Un seigneur démon de premier rang.', loot: 'Épée flamboyante (10 000 po)' },
      ],
      moyen: [
        { name: 'Pit Fiend', cr: '20', count: '1', description: 'Le commandant des armées infernales.', loot: 'Artefact infernal' },
      ],
      difficile: [
        { name: 'Avatar de dieu maléfique', cr: '24', count: '1', description: 'Une manifestation divine corrompue.', loot: 'Fragment divin (légendaire)' },
      ],
      mortel: [
        { name: 'Tarrasque', cr: '30', count: '1', description: 'La fin du monde made flesh.', loot: 'Légendaire' },
      ],
    },
  },
  ville: {
    '1-4': {
      facile: [
        { name: 'Pickpockets', cr: '1/8', count: '1D4+1', description: 'De jeunes voleurs à la tire bien organisés dans la foule.', loot: 'Bourse subtilisée (1D10 po)' },
        { name: 'Bandits de rue', cr: '1/8', count: '2D4', description: 'Des bandits qui rançonnent les voyageurs dans une ruelle.', loot: 'Butin de rue (2D6×2 po)' },
      ],
      moyen: [
        { name: 'Garde corrompu + acolytes', cr: '1/2+1/4', count: '1+2', description: 'Un garde de la ville corrompu, en train d\'extorquer un marchand.', loot: 'Pot-de-vin (50 po)' },
      ],
      difficile: [
        { name: 'Assassin de guilde', cr: '8', count: '1', description: 'Un assassin professionnel a une cible en tête... peut-être vous.', loot: 'Contrat (information précieuse), armes empoisonnées' },
      ],
      mortel: [
        { name: 'Gang organisé complet', cr: '1-3', count: '2D10', description: 'Toute la cellule criminelle locale est sur vos traces.', loot: 'Repaire de gang (500 po de trésor)' },
      ],
    },
    '5-10': {
      facile: [
        { name: 'Espions rivaux', cr: '1', count: '1D4', description: 'Des agents d\'une faction rivale.', loot: 'Codes et documents (100 po)' },
      ],
      moyen: [
        { name: 'Magicien fou + familiers', cr: '6+1/4', count: '1+2D4', description: 'Un mage errant a perdu la raison et attaque au hasard.', loot: 'Grimoire (300 po), composantes (100 po)' },
      ],
      difficile: [
        { name: 'Chef de guilde + gardes d\'élite', cr: '4+3', count: '1+1D4', description: 'Le chef de la guilde des voleurs en personne.', loot: 'Coffre de guilde (1 000 po)' },
      ],
      mortel: [
        { name: 'Culte de vampire urbain', cr: '5+13', count: '2D6+1', description: 'Un culte entier voué au service d\'un vampire local.', loot: 'Trésor du culte (2 000 po)' },
      ],
    },
    '11-16': {
      facile: [
        { name: 'Gardes de l\'inquisition', cr: '5', count: '2D6', description: 'Des inquisiteurs fanatiques cherchent des "déviants".', loot: '—' },
      ],
      moyen: [
        { name: 'Agent du fiend infiltré', cr: '9', count: '1D3', description: 'Des agents démoniaques sous apparence humaine.', loot: 'Artefact démoniaque (500 po)' },
      ],
      difficile: [
        { name: 'Assassin légendaire', cr: '12', count: '1', description: 'Le meilleur assassin du continent a reçu votre contrat.', loot: 'Poison rare (1 000 po)' },
      ],
      mortel: [
        { name: 'Seigneur vampire de la cité', cr: '13', count: '1', description: 'Le vrai maître de la ville révèle sa nature.', loot: 'Trésor de siècles (légendaire)' },
      ],
    },
    '17-20': {
      facile: [
        { name: 'Élite de la garde du roi', cr: '9', count: '2D6', description: 'Des gardes royaux aux capacités surhumaines.', loot: 'Armure royale (5 000 po)' },
      ],
      moyen: [
        { name: 'Archange déchu', cr: '18', count: '1', description: 'Un ange tombé règne sur la corruption de la ville.', loot: 'Plumes angéliques (1 000 po), épée sainte' },
      ],
      difficile: [
        { name: 'Dragon métallique + horde', cr: '20', count: '1+2D10', description: 'Un dragon légendaire attaque la cité.', loot: 'Trésor légendaire' },
      ],
      mortel: [
        { name: 'Dieu maléfique manifesté', cr: '26', count: '1', description: 'Un dieu maléfique se manifeste dans la cité.', loot: 'Faveur divine (légendaire)' },
      ],
    },
  },
  plaines: {
    '1-4': {
      facile: [
        { name: 'Bandits à cheval', cr: '1/8', count: '2D6', description: 'Des bandits à cheval encerclent la caravane.', loot: 'Bourse de voyage (3D6×2 po)' },
        { name: 'Chevaux sauvages', cr: '1/2', count: '2D4', description: 'Un troupeau de chevaux sauvages, agressifs si acculés.', loot: 'Cheval apprivoisé (75 po pièce)' },
      ],
      moyen: [
        { name: 'Orcs', cr: '1/2', count: '2D6', description: 'Un groupe d\'orcs en maraude sur les plaines.', loot: 'Butin de pillage (4D6×5 po)' },
      ],
      difficile: [
        { name: 'Géant des collines', cr: '5', count: '1', description: 'Un géant solitaire erre sur les plaines.', loot: 'Sac de géant (100 po)' },
      ],
      mortel: [
        { name: 'Manticore', cr: '3', count: '1D3', description: 'Une meute de manticores chasse en groupe.', loot: 'Épines (5 po pièce)' },
      ],
    },
    '5-10': {
      facile: [
        { name: 'Centaures', cr: '2', count: '1D6+2', description: 'Des centaures défendant leur territoire.', loot: 'Arcs centaures (50 po)' },
      ],
      moyen: [
        { name: 'Ankheg', cr: '2', count: '1D4+1', description: 'Des ankheg surgissent de sous terre.', loot: 'Carapace (50 po)' },
      ],
      difficile: [
        { name: 'Roc', cr: '11', count: '1', description: 'Un roc immense chasse des proies de la taille d\'un bœuf... ou d\'un aventurier.', loot: 'Plumes (100 po), œuf (500 po)' },
      ],
      mortel: [
        { name: 'Horde d\'orcs + chef warchief', cr: '1/2+4', count: '4D10+1', description: 'Une vraie horde de guerre avec son commandant.', loot: 'Trésor de guerre (1 000 po)' },
      ],
    },
    '11-16': {
      facile: [
        { name: 'Géants des tempêtes', cr: '13', count: '1D3', description: 'Des géants des tempêtes voyagent.', loot: 'Rune géante (500 po)' },
      ],
      moyen: [
        { name: 'Dragon rouge (adulte)', cr: '17', count: '1', description: 'Un dragon rouge recherche de nouvelles terres.', loot: 'Trésor immense (5 000+ po)' },
      ],
      difficile: [
        { name: 'Liche nécromante avec armée', cr: '21+var', count: '1+4D20', description: 'Une armée de morts-vivants commandée par une liche.', loot: 'Phylactère, grimoires (10 000 po)' },
      ],
      mortel: [
        { name: 'Titan emprisonné', cr: '22', count: '1', description: 'Un titan antique brisé de ses chaînes.', loot: 'Artefact titanesque (légendaire)' },
      ],
    },
    '17-20': {
      facile: [
        { name: 'Dragons métalliques', cr: '20+', count: '1D3', description: 'Des dragons légendaires en patrol.', loot: 'Trésor légendaire' },
      ],
      moyen: [
        { name: 'Armée de démons', cr: '10+', count: '10D10', description: 'Une invasion démoniaque à grande échelle.', loot: 'Artefacts démoniaques (légendaire)' },
      ],
      difficile: [
        { name: 'Avatar de dieu de la guerre', cr: '25', count: '1', description: 'La divinité de la guerre se manifeste.', loot: 'Faveur divine' },
      ],
      mortel: [
        { name: 'Tarrasque éveillé', cr: '30', count: '1', description: 'La fin du monde.', loot: 'Légendaire' },
      ],
    },
  },
  montagne: {
    '1-4': {
      facile: [
        { name: 'Aigles géants', cr: '1', count: '1D4+1', description: 'Des aigles géants défendent leur aire.', loot: 'Plumes (5 po pièce)' },
        { name: 'Kobolds mineurs', cr: '1/8', count: '3D6', description: 'Des kobolds mineurs défendent leurs galeries.', loot: 'Minerai (2D6×2 po)' },
      ],
      moyen: [
        { name: 'Orcs montagnards', cr: '1/2', count: '2D6', description: 'Des orcs adaptés aux hauteurs, redoutables grimpeurs.', loot: 'Équipement d\'escalade (30 po)' },
      ],
      difficile: [
        { name: 'Troll des cavernes', cr: '5', count: '1', description: 'Un troll des cavernes adapté à l\'obscurité.', loot: 'Cœur de troll (100 po)' },
      ],
      mortel: [
        { name: 'Géant des pierres', cr: '7', count: '1D2', description: 'Des géants des pierres lancent des rochers depuis les hauteurs.', loot: 'Statue géante (500 po)' },
      ],
    },
    '5-10': {
      facile: [
        { name: 'Griffons', cr: '2', count: '1D4+1', description: 'Des griffons protègent leur nid.', loot: 'Plumes (25 po), œuf (1 000 po)' },
      ],
      moyen: [
        { name: 'Géant des pierres + golem', cr: '7+5', count: '1+1', description: 'Un géant avec son gardien golem.', loot: 'Cristaux (200 po)' },
      ],
      difficile: [
        { name: 'Dragon blanc (jeune)', cr: '9', count: '1', description: 'Un dragon blanc règne sur les sommets enneigés.', loot: 'Trésor givré (2 000 po)' },
      ],
      mortel: [
        { name: 'Fomorian', cr: '8', count: '1D3', description: 'Des géants difformes et magiques.', loot: 'Pierres runiques (300 po)' },
      ],
    },
    '11-16': {
      facile: [
        { name: 'Dragon blanc (adulte)', cr: '13', count: '1', description: 'L\'ancien maître des glaces.', loot: 'Trésor gelé (5 000 po)' },
      ],
      moyen: [
        { name: 'Géant des tempêtes', cr: '13', count: '1D3', description: 'Les seigneurs des sommets.', loot: 'Armes runiques (1 000 po)' },
      ],
      difficile: [
        { name: 'Dragon rouge (adulte)', cr: '17', count: '1', description: 'Le tyran des volcans.', loot: 'Trésor volcanique (8 000 po)' },
      ],
      mortel: [
        { name: 'Dragon de titan', cr: '22', count: '1', description: 'Le plus grand des dragons vivant dans les montagnes.', loot: 'Légendaire' },
      ],
    },
    '17-20': {
      facile: [
        { name: 'Géant ancestral', cr: '16', count: '1D4', description: 'Des géants de l\'ère primordiale.', loot: 'Artefact géant (5 000 po)' },
      ],
      moyen: [
        { name: 'Dragon rouge (ancien)', cr: '24', count: '1', description: 'Le plus vieux dragon rouge du monde.', loot: 'Trésor légendaire' },
      ],
      difficile: [
        { name: 'Titan des montagnes', cr: '23', count: '1', description: 'Le titan originel de cette chaîne de montagnes.', loot: 'Pierre cosmique (légendaire)' },
      ],
      mortel: [
        { name: 'Avatar de l\'Avalanche', cr: '28', count: '1', description: 'L\'esprit de la montagne lui-même se réveille.', loot: 'Légendaire' },
      ],
    },
  },
  marais: {
    '1-4': {
      facile: [
        { name: 'Crocodiles géants', cr: '2', count: '1D3', description: 'Des crocodiles géants camouflés dans les eaux sombres.', loot: 'Peau (20 po)' },
        { name: 'Lézards géants venimeux', cr: '1/4', count: '2D4', description: 'Des lézards venimeux dissimulés dans les hautes herbes.', loot: 'Venin (10 po dose)' },
      ],
      moyen: [
        { name: 'Trolls des marais', cr: '5', count: '1D2', description: 'Des trolls verts particulièrement agressifs.', loot: 'Bile (50 po), cœur (100 po)' },
      ],
      difficile: [
        { name: 'Sorcière des marais + familiers', cr: '3+var', count: '1+2D4', description: 'Une sorcière et ses créatures au service de la lune noire.', loot: 'Grimoire (150 po), ingrédients rares' },
      ],
      mortel: [
        { name: 'Hydre', cr: '8', count: '1', description: 'L\'hydre régénère ses têtes plus vite que vous ne pouvez les trancher.', loot: 'Sang d\'hydre (200 po), dent (50 po)' },
      ],
    },
    '5-10': {
      facile: [
        { name: 'Lézardhommes', cr: '1/2', count: '2D8', description: 'Une tribu de lézardhommes défendant leur village.', loot: 'Idoles tribales (100 po)' },
      ],
      moyen: [
        { name: 'Hag (vieille sorcière)', cr: '3', count: '1D3', description: 'Un covens de hags qui tissent des malédictions.', loot: 'Œil de hag (200 po)' },
      ],
      difficile: [
        { name: 'Dragon noir (jeune)', cr: '7', count: '1', description: 'Un dragon noir règne sur les marécages puants.', loot: 'Trésor acide (1 500 po)' },
      ],
      mortel: [
        { name: 'Hydre des profondeurs', cr: '10', count: '1', description: 'Une hydre de taille démesurée, ancienne comme les marais.', loot: 'Sang précieux (500 po)' },
      ],
    },
    '11-16': {
      facile: [
        { name: 'Dragon noir (adulte)', cr: '14', count: '1', description: 'Le seigneur des marais.', loot: 'Trésor corrosif (5 000 po)' },
      ],
      moyen: [
        { name: 'Sorcière du marais primordial', cr: '12', count: '1', description: 'La plus ancienne des hags.', loot: 'Cauldron magique (1 000 po)' },
      ],
      difficile: [
        { name: 'Dragon noir (ancien)', cr: '21', count: '1', description: 'L\'être le plus vieux des marais.', loot: 'Légendaire' },
      ],
      mortel: [
        { name: 'Dieu des marais incarné', cr: '25', count: '1', description: 'La divinité des eaux noires.', loot: 'Légendaire' },
      ],
    },
    '17-20': {
      facile: [
        { name: 'Titan des eaux', cr: '18', count: '1D3', description: 'Des titans aquatiques anciens.', loot: 'Trident titanesque (légendaire)' },
      ],
      moyen: [
        { name: 'Avatar du Marais Éternel', cr: '25', count: '1', description: 'L\'incarnation du marais primordial.', loot: 'Légendaire' },
      ],
      difficile: [
        { name: 'Kraken des marais', cr: '23', count: '1', description: 'Un kraken s\'est frayé un chemin jusqu\'aux marécages.', loot: 'Légendaire' },
      ],
      mortel: [
        { name: 'Tarrasque des profondeurs', cr: '30', count: '1', description: 'Variant aquatique de la fin du monde.', loot: 'Légendaire' },
      ],
    },
  },
  cotier: {
    '1-4': {
      facile: [
        { name: 'Pirates', cr: '1/2', count: '2D6', description: 'Un équipage de pirates qui pillent la côte.', loot: 'Butin maritime (4D6×5 po)' },
        { name: 'Crabe géant', cr: '1/8', count: '2D6', description: 'Des crabes géants défendent la plage.', loot: 'Carapace (5 po)' },
      ],
      moyen: [
        { name: 'Sahuagins', cr: '1/2', count: '2D8', description: 'Des hommes-poissons font une raid sur le rivage.', loot: 'Tridents (15 po), perles (2D6×10 po)' },
      ],
      difficile: [
        { name: 'Requin géant', cr: '5', count: '1D3', description: 'Des requins géants attaquent les nageurs.', loot: 'Dents (10 po pièce)' },
      ],
      mortel: [
        { name: 'Hydre marine', cr: '8', count: '1', description: 'Une hydre qui surgit des flots.', loot: 'Sang (200 po)' },
      ],
    },
    '5-10': {
      facile: [
        { name: 'Dragon des mers (jeune)', cr: '5', count: '1', description: 'Un jeune dragon serpentiforme des océans.', loot: 'Écailles (200 po)' },
      ],
      moyen: [
        { name: 'Sirène + Marins envoûtés', cr: '5+var', count: '1+2D6', description: 'Une sirène avec ses thralls humains.', loot: 'Bijoux de sirène (300 po)' },
      ],
      difficile: [
        { name: 'Dragon des mers (adulte)', cr: '13', count: '1', description: 'Le maître des côtes.', loot: 'Trésor côtier (3 000 po)' },
      ],
      mortel: [
        { name: 'Kraken (jeune)', cr: '13', count: '1', description: 'Un kraken adolescent — déjà une menace massive.', loot: 'Cristaux d\'abîsse (1 000 po)' },
      ],
    },
    '11-16': {
      facile: [
        { name: 'Dragon des mers (ancien)', cr: '20', count: '1', description: 'Le seigneur des océans.', loot: 'Trésor légendaire' },
      ],
      moyen: [
        { name: 'Kraken adulte', cr: '23', count: '1', description: 'Le terreur des profondeurs.', loot: 'Légendaire' },
      ],
      difficile: [
        { name: 'Titans des mers', cr: '20', count: '1D3', description: 'Les géants primordiaux des profondeurs.', loot: 'Artefacts marins (légendaire)' },
      ],
      mortel: [
        { name: 'Léviathan cosmique', cr: '28', count: '1', description: 'Le serpent qui entoure le monde.', loot: 'Légendaire' },
      ],
    },
    '17-20': {
      facile: [
        { name: 'Avatar de Poséidon', cr: '24', count: '1', description: 'Le dieu des mers se manifeste.', loot: 'Trident divin' },
      ],
      moyen: [
        { name: 'Kraken ancestral', cr: '26', count: '1', description: 'Le kraken originel.', loot: 'Légendaire' },
      ],
      difficile: [
        { name: 'Dieu des profondeurs manifesté', cr: '27', count: '1', description: 'L\'ancien dieu des abysses.', loot: 'Légendaire' },
      ],
      mortel: [
        { name: 'Tarrasque aquatique', cr: '30', count: '1', description: 'La version marine de la fin du monde.', loot: 'Légendaire' },
      ],
    },
  },
};

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export function rollEncounter(terrain: Terrain, levelRange: LevelRange, difficulty: Difficulty): Encounter {
  const list = ENCOUNTERS[terrain]?.[levelRange]?.[difficulty];
  if (!list?.length) return { name: 'Aucune rencontre', cr: '—', count: '—', description: 'La zone est calme pour l\'instant.' };
  return pickRandom(list);
}

export const TERRAINS: Array<{ key: Terrain; label: string; icon: string }> = [
  { key: 'foret', label: 'Forêt', icon: '🌲' },
  { key: 'donjon', label: 'Donjon', icon: '🏰' },
  { key: 'ville', label: 'Ville', icon: '🏘️' },
  { key: 'plaines', label: 'Plaines', icon: '🌾' },
  { key: 'montagne', label: 'Montagne', icon: '⛰️' },
  { key: 'marais', label: 'Marais', icon: '🌿' },
  { key: 'cotier', label: 'Côtier', icon: '🌊' },
];

export const DIFFICULTIES: Array<{ key: Difficulty; label: string; color: string }> = [
  { key: 'facile', label: 'Facile', color: '#22c55e' },
  { key: 'moyen', label: 'Moyen', color: '#f59e0b' },
  { key: 'difficile', label: 'Difficile', color: '#ef4444' },
  { key: 'mortel', label: 'Mortel', color: '#7c3aed' },
];

export const LEVEL_RANGES: Array<{ key: LevelRange; label: string }> = [
  { key: '1-4', label: 'Niveaux 1-4' },
  { key: '5-10', label: 'Niveaux 5-10' },
  { key: '11-16', label: 'Niveaux 11-16' },
  { key: '17-20', label: 'Niveaux 17-20' },
];
