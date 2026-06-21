import type { Skill } from '../types';

export const SKILLS: Skill[] = [
  { id: 'musique', name: 'Musique', archetype: 'Musicien', icon: '🎸', desc: 'Pratiquer un instrument, composer, chanter.', primaryStat: 'creativite' },
  { id: 'dessin', name: 'Dessin & Art', archetype: 'Artiste', icon: '🖌️', desc: 'Dessiner, peindre, créer du visuel.', primaryStat: 'creativite' },
  { id: 'code', name: 'Programmation', archetype: 'Développeur', icon: '💻', desc: 'Coder, construire des logiciels.', primaryStat: 'intelligence' },
  { id: 'sport', name: 'Sport', archetype: 'Athlète', icon: '🏃', desc: 'Courir, soulever, bouger, transpirer.', primaryStat: 'force' },
  { id: 'theatre', name: 'Expression', archetype: 'Orateur', icon: '🎤', desc: 'Théâtre, prise de parole, débat.', primaryStat: 'charisme' },
  { id: 'lecture', name: 'Lecture', archetype: 'Sage', icon: '📖', desc: 'Lire, apprendre, absorber le savoir.', primaryStat: 'sagesse' },
  { id: 'cuisine', name: 'Cuisine', archetype: 'Alchimiste', icon: '🍳', desc: 'Cuisiner sain, expérimenter des recettes.', primaryStat: 'endurance' },
  { id: 'meditation', name: 'Méditation', archetype: 'Moine', icon: '🧘', desc: 'Respirer, méditer, cultiver le calme.', primaryStat: 'discipline' },
  { id: 'langue', name: 'Langues', archetype: 'Polyglotte', icon: '🗣️', desc: 'Apprendre une nouvelle langue.', primaryStat: 'intelligence' },
  { id: 'finance', name: 'Finance', archetype: 'Marchand', icon: '💰', desc: 'Épargner, investir, gérer son budget.', primaryStat: 'sagesse' },
  { id: 'social', name: 'Lien social', archetype: 'Diplomate', icon: '🤝', desc: 'Entretenir ses relations, aider les autres.', primaryStat: 'charisme' },
  { id: 'ecriture', name: 'Écriture', archetype: 'Conteur', icon: '✍️', desc: 'Écrire, tenir un journal, raconter.', primaryStat: 'creativite' },
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
