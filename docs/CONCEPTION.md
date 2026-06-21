# 📐 LifeQuest — Document de conception complet

Version 0.1 · Application de gamification de vie réelle (RPG)

---

## 1. Concept général

**Pitch** — L'utilisateur *est* son propre personnage. Toutes les actions de la vie
réelle (se lever, lire, faire du sport, apprendre, créer, prendre soin de ses
relations) rapportent de l'expérience, font monter de niveau, débloquent des
compétences et font grandir un royaume personnel.

**Promesse** — Rendre la progression personnelle aussi satisfaisante qu'un RPG, tout
en améliorant réellement la vie de l'utilisateur. Immersif et motivant, **sans
exploitation de mécaniques addictives néfastes** : pas de pay-to-win, pas de FOMO
toxique, classements facultatifs.

**Boucle de jeu cœur (core loop)** :
`Agir dans la vraie vie → valider une quête → gagner XP / stats / compétences →
monter de niveau → débloquer titres, objets, lieux du monde → le Coach propose la
suite → recommencer.`

---

## 2. Système de personnage

| Élément | Description |
|---|---|
| **Niveau global** | Synthèse de toute la progression. Courbe `XP_requise(niv) = 100 × niv^1.5`. |
| **XP** | Gagnée à chaque quête. Cumulative, jamais perdue. |
| **Classes** | Aventurier, Érudit, Guerrier, Barde, Moine. Modifient les stats de départ. Personnalisables. |
| **Titres** | Débloqués par paliers de niveau (Âme Éveillée → Architecte du Destin). Équipables. |
| **Réputation** | Score d'engagement global, dérivé de l'XP et des montées de niveau. |
| **Succès** | Objets de type badge/trophée débloqués par conditions (niveau, série, compétence, nb de quêtes). |

**8 statistiques** : Force 💪, Endurance 🫀, Intelligence 🧠, Créativité 🎨,
Charisme ✨, Discipline ⚔️, Sagesse 📜, Confiance en soi 🦁. Chaque quête en
augmente une ou plusieurs.

---

## 3. Système de quêtes

| Type | Rôle | Exemple |
|---|---|---|
| **Principale** | Objectif de vie, multi-étapes | Apprendre une langue, trouver un emploi, vaincre une addiction, lancer une entreprise |
| **Secondaire** | Tâche ponctuelle | Ranger une pièce, appeler un proche, cuisiner sain |
| **Quotidienne** | Habitude répétable + série (streak) | Faire son lit, lire 20 min, sport, méditer |
| **Auto (Coach IA)** | Générée selon les habitudes | « Consacre 25 min à la guitare » |

**Récompenses** : XP, points de stats, XP de compétence. Les quêtes principales
versent une grosse récompense à la complétion de toutes leurs étapes. Les
quotidiennes entretiennent une **série** qui débloque des badges (3, 7, 30 jours).

**Difficultés** : facile / moyenne / difficile / épique → barème d'XP croissant.

---

## 4. Système de compétences

12 compétences, niveau **1 → 100**, courbe `XP(niv) = 60 × niv^1.35`. Chaque
compétence est rattachée à une **statistique primaire** et débloque un **archétype**
de maîtrise :

| Compétence | Archétype | Stat |
|---|---|---|
| Musique 🎸 | Musicien | Créativité |
| Dessin & Art 🖌️ | Artiste | Créativité |
| Programmation 💻 | Développeur | Intelligence |
| Sport 🏃 | Athlète | Force |
| Expression 🎤 | Orateur | Charisme |
| Lecture 📖 | Sage | Sagesse |
| Cuisine 🍳 | Alchimiste | Endurance |
| Méditation 🧘 | Moine | Discipline |
| Langues 🗣️ | Polyglotte | Intelligence |
| Finance 💰 | Marchand | Sagesse |
| Lien social 🤝 | Diplomate | Charisme |
| Écriture ✍️ | Conteur | Créativité |

---

## 5. Système d'objets (inventaire)

Cinq types, **100 % cosmétiques/symboliques** : **badges, reliques, trophées,
équipements cosmétiques, compagnons** (chat, hibou, dragonneau…). Rareté :
commun → rare → épique → légendaire → mythique. Déblocage par condition (niveau,
série, niveau de compétence, nombre de quêtes). **Aucun avantage payant.**

---

## 6. IA Coach

Aujourd'hui : **moteur de règles local** (`engine/coach.ts`) qui :

- motive (banque de messages tonals : motivation, défi, analyse, alerte, félicitation) ;
- **détecte les baisses de motivation** (jours d'inactivité) et relance avec
  bienveillance ;
- félicite les grosses journées ;
- propose des défis aux joueurs réguliers ;
- **génère des quêtes adaptées** (`engine/questGenerator.ts`) en renforçant les
  compétences en momentum et en réveillant les compétences délaissées.

Évolution : brancher un vrai LLM (**Claude `claude-sonnet-4-6`**) via un endpoint
serveur (`generateRemoteCoachMessage`) pour des messages et quêtes pleinement
génératifs et personnalisés. Les clés API restent **côté serveur**.

---

## 7. Interface & écrans

Esthétique : sombre fantasy, accents or et violet, panneaux « parchemin »
lumineux, navigation basse façon MMORPG mobile.

| Écran | Contenu |
|---|---|
| **Tableau de bord** | Bandeau héros + XP, message du Coach, quêtes du jour, raccourcis |
| **Personnage** | Avatar, stats, titres équipables, classe, réputation |
| **Journal de quêtes** | Onglets par type, génération IA, création de quête personnalisée |
| **Arbre de compétences** | Les 12 compétences, niveaux, barres de progression, archétypes |
| **Carte du monde** | Royaume évolutif positionné sur une carte, prochain déblocage |
| **Inventaire** | Grille filtrée par type, objets verrouillés/déverrouillés |
| **Statistiques** | KPIs, stat dominante, journal d'activité, réinitialisation |

### Maquettes UX/UI (wireframes ASCII)

```
TABLEAU DE BORD                 JOURNAL DE QUÊTES
┌───────────────────────┐       ┌───────────────────────┐
│ ⚔ LifeQuest   🔥12 ⭐80│       │ 📜 Quêtes      [+ Quête]│
│ ┌───┐ Lyra      Niv.7 │       │ [Toutes][Quotid.][Sec.]│
│ │🧭 │ Héros·Aventurier│       │ 🪄 Générer (Coach IA)  │
│ └───┘ ▓▓▓▓▓░░ 320/470 │       │ ┌───────────────────┐ │
│ ┌───────────────────┐ │       │ │○ Lire 20 min  +25 │ │
│ │🧝 Coach: Tu es en  │ │       │ │  💪+1  📖+30  🔥3  │ │
│ │   feu ! +3 quêtes  │ │       │ └───────────────────┘ │
│ └───────────────────┘ │       │ ┌───────────────────┐ │
│ QUÊTES DU JOUR 2/6    │       │ │ Apprendre langue  │ │
│ ○ Faire son lit  +15  │       │ │ ☑ Choisir méthode │ │
│ ✓ Méditer 10min  +20  │       │ │ ☐ 7 jours d'affilée│ │
│ ...                   │       │ └───────────────────┘ │
│ [🏠][🧙][📜][🌳][🗺][🎒]│       │ [🏠][🧙][📜][🌳][🗺][🎒]│
└───────────────────────┘       └───────────────────────┘
```

---

## 8. Monde personnel

Une carte où les **progrès deviennent un univers**. Nœuds (village, ville,
monument, créature alliée) débloqués par paliers de niveau : Camp de Départ (1) →
Hameau (5) → Cité (12) → Capitale (25) → Château Céleste (50)… Affichage de la
progression `lieux débloqués / total` et du prochain déblocage.

---

## 9. Mode social (roadmap)

- **Guildes** et groupes d'amis.
- **Défis coopératifs** (objectif d'XP collectif).
- **Classements facultatifs**, désactivables, par opt-in (anti-compétition toxique).
- **Événements communautaires** saisonniers.

Principe directeur : la comparaison est **opt-in** et orientée coopération, jamais
imposée.

---

## 10. Modèle économique

| Source | Détail | P2W ? |
|---|---|---|
| Cosmétiques | Skins d'avatar, compagnons rares | ❌ Non |
| Thèmes | Palettes d'interface (sombre, parchemin, néon…) | ❌ Non |
| Personnalisation | Bannières, cadres, titres custom | ❌ Non |
| **Premium optionnel** | Statistiques avancées, Coach IA génératif illimité, sauvegarde cloud multi-appareils, quêtes principales guidées | ❌ Non (confort, pas d'avantage de progression) |

**Règle d'or** : aucun achat n'accélère ni ne remplace l'effort réel.

---

## 11. Base de données

L'app actuelle persiste en **localStorage** (clé `lifequest-save-v1`). Pour une
version serveur multi-appareils, schéma relationnel cible :

```
users(id, email, created_at, premium_until)
characters(id, user_id→users, name, class_id, title_id, level, xp, reputation,
           best_streak, last_active_day, created_at)
character_stats(character_id→characters, stat_key, value)          -- 8 lignes/perso
skills(id, name, archetype, primary_stat, icon, desc)              -- catalogue
skill_progress(character_id, skill_id→skills, level, xp)
quests(id, type, title, desc, difficulty, xp, skill_id, skill_xp,
       repeatable, owner_id NULL=globale)                          -- catalogue + custom
quest_steps(id, quest_id→quests, label, position)
quest_progress(character_id, quest_id→quests, status, completed_at,
               last_done, streak)
quest_step_progress(character_id, quest_step_id→quest_steps, done)
items(id, name, type, rarity, icon, desc, unlock_kind, unlock_value, unlock_skill_id)
inventory(character_id, item_id→items, acquired_at)
world_nodes(id, name, type, icon, desc, unlock_level, x, y)        -- catalogue
coach_messages(id, character_id, tone, text, created_at)
activity_log(id, character_id, text, xp, created_at)

-- Social
guilds(id, name, created_at)
guild_members(guild_id→guilds, character_id, role)
challenges(id, guild_id, title, goal_xp, ends_at)
challenge_progress(challenge_id, character_id, contributed_xp)
```

Index recommandés : `quest_progress(character_id, last_done)`,
`skill_progress(character_id)`, `activity_log(character_id, created_at desc)`.

---

## 12. Système d'XP & de progression (formules)

```ts
// Personnage
xpToNext(level)      = floor(100 * level^1.5)      // niv 1→2 : 100, 9→10 : ~2700
totalXpForLevel(L)   = Σ xpToNext(l) pour l=1..L-1

// Compétences (cap 100)
skillXpToNext(level) = floor(60 * level^1.35)

// Récompense d'XP par difficulté de quête
facile 15 · moyenne 35 · difficile 60 · épique 120+
```

Une montée de niveau peut en déclencher plusieurs d'un coup (gros gain). La
réputation = `ceil(xp_quête/10)` + `5 × niveaux_gagnés`.

---

## 13. Technologies recommandées

| Couche | Choix actuel (MVP) | Cible production |
|---|---|---|
| Front | **React 18 + TypeScript + Vite** | + React Native / Expo pour le natif iOS/Android |
| État | **Zustand** + persist localStorage | + sync serveur (TanStack Query) |
| UI | CSS maison (thème fantasy) | Design system + animations (Framer Motion) |
| PWA | manifest + standalone | Service worker offline-first |
| Backend | — (100 % local) | Node/TypeScript ou Supabase (Postgres + Auth) |
| IA Coach | moteur de règles local | **Claude `claude-sonnet-4-6`** via endpoint serveur |
| Notifications | — | Push (FCM/APNs) pour rappels de quêtes & séries |
| Analytics | — | PostHog/Amplitude (rétention, complétion) |

---

## 14. Feuille de route 12 mois

| Phase | Mois | Livrables |
|---|---|---|
| **MVP local** ✅ | 1–2 | Personnage, quêtes (4 types), compétences, inventaire, monde, Coach local, PWA. *(Cette base.)* |
| **Comptes & cloud** | 3–4 | Auth, sauvegarde serveur multi-appareils, sync, schéma DB ci-dessus |
| **Coach génératif** | 4–5 | Intégration LLM (Claude), quêtes & messages personnalisés, analyse de progression |
| **Natif mobile** | 5–7 | Portage React Native/Expo, notifications push, rappels de séries |
| **Monde 2.0** | 7–8 | Carte enrichie, animations, compagnons vivants, thèmes payants (cosmétiques) |
| **Social** | 8–10 | Guildes, défis coopératifs, classements opt-in, événements |
| **Premium & monétisation** | 10–11 | Abonnement optionnel, boutique cosmétique, personnalisation |
| **Polish & lancement** | 11–12 | Onboarding affiné, accessibilité, optimisations, soft-launch puis lancement public |

**Objectif transverse** : maximiser l'**immersion** et la **rétention saine** —
chaque fonctionnalité doit aider l'utilisateur à progresser *réellement* dans sa
vie, jamais seulement à rester scotché à l'écran.
