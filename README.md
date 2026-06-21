# ⚔️ LifeQuest

> Transforme ta vie réelle en un véritable jeu de rôle. Chaque action te fait gagner de l'XP, monter de niveau, débloquer des compétences, accomplir des quêtes et faire grandir ton royaume personnel.

LifeQuest est une application **mobile-first** (PWA) jouable immédiatement, construite en **React + TypeScript + Vite**, avec une esthétique RPG fantasy / MMORPG. Toute la progression est **sauvegardée localement** sur l'appareil — aucune connexion requise pour jouer.

## ✨ Fonctionnalités implémentées

| Système | Détail |
|---|---|
| **Personnage** | Niveau global, XP, classes, titres, réputation, 8 statistiques (Force, Endurance, Intelligence, Créativité, Charisme, Discipline, Sagesse, Confiance en soi) |
| **Quêtes** | Principales (objectifs de vie multi-étapes), secondaires, quotidiennes répétables avec séries (streaks), et quêtes **générées automatiquement** par le Coach IA |
| **Compétences** | 12 compétences évoluant du niveau 1 à 100, chacune liée à un archétype (Musicien, Développeur, Athlète, Sage…) |
| **Inventaire** | Badges, reliques, trophées, cosmétiques et compagnons — débloqués par mérite, **jamais payants** |
| **Coach IA** | Moteur motivationnel local : félicite, relance, détecte les baisses de motivation, propose des défis, génère des quêtes adaptées |
| **Monde personnel** | Carte évolutive : villages, cités, monuments et créatures alliées qui se débloquent avec le niveau |
| **Tableau de bord** | Vue du jour, barre d'XP, quêtes quotidiennes, message du Coach |
| **Statistiques** | XP total, séries, journal d'activité, stat dominante |

## 🚀 Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## 🧱 Architecture

```
src/
├── types.ts            # Modèle de domaine (stats, quêtes, items, monde…)
├── data/               # Contenu de jeu (quêtes, compétences, objets, classes, monde)
├── engine/
│   ├── xp.ts           # Courbes d'XP personnage + compétences
│   ├── coach.ts        # Coach IA (moteur de règles, extensible vers un vrai LLM)
│   └── questGenerator.ts  # Génération de quêtes adaptées à la progression
├── store/gameStore.ts  # État global (Zustand + persistance localStorage)
├── components/         # XPBar, BottomNav, QuestCard, CoachCard, Toasts
└── screens/            # Dashboard, Character, QuestJournal, SkillTree, WorldMap, Inventory, Stats
```

## 🧠 Brancher un vrai Coach IA

Le Coach fonctionne 100 % en local (règles). Pour le rendre génératif, implémenter
`generateRemoteCoachMessage` dans `src/engine/coach.ts` en appelant un backend qui
interroge un modèle (ex. **Claude `claude-sonnet-4-6`**). Aucun secret ne doit vivre
côté client : l'appel passe par un endpoint serveur.

## 📄 Conception détaillée

Le document complet (concept, mécaniques, schéma de base de données, système d'XP,
modèle économique, technologies, maquettes UX/UI, **feuille de route 12 mois**) est
dans [`docs/CONCEPTION.md`](docs/CONCEPTION.md).

## ⚖️ Éthique & monétisation

- **Aucune mécanique Pay-to-Win.** Les objets sont symboliques.
- Monétisation prévue : cosmétiques, thèmes, personnalisation, abonnement premium optionnel.
- Mode social pensé pour la coopération, **sans compétition toxique** (classements facultatifs).
