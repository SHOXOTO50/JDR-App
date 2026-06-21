import type { CoachMessage } from '../types';

// Coach IA local : moteur de règles motivationnel.
// Conçu pour être remplaçable par un vrai modèle (ex. Claude) côté serveur :
// il suffit d'implémenter `generateRemoteCoachMessage` et de la brancher.

interface CoachContext {
  name: string;
  level: number;
  todayCompleted: number;
  bestStreak: number;
  daysSinceActive: number; // 0 = aujourd'hui
  totalQuests: number;
}

function msg(tone: CoachMessage['tone'], text: string): CoachMessage {
  return { id: 'c-' + Math.random().toString(36).slice(2, 9), tone, text, at: Date.now() };
}

const MOTIVATION = [
  'Chaque petite quête accomplie reprogramme ton cerveau vers la victoire. Continue.',
  'Le héros n’est pas celui qui ne tombe jamais, mais celui qui se relève une fois de plus.',
  'Tu n’as pas besoin d’être grand pour commencer, mais tu dois commencer pour devenir grand.',
  'Un jour de plus, un niveau de plus. Le futur toi te observe avec fierté.',
];

const CHALLENGES = [
  'Défi du jour : accomplis 3 quêtes avant midi. Prêt ?',
  'Défi : ajoute une quête qui te fait un peu peur. La croissance vit là.',
  'Défi : transforme ta plus mauvaise habitude en quête principale dès maintenant.',
];

/**
 * Renvoie le message le plus pertinent selon l'état du joueur.
 * Détecte la baisse de motivation, félicite, relance, propose des défis.
 */
export function coachAdvise(ctx: CoachContext): CoachMessage {
  // Alerte : baisse de motivation détectée.
  if (ctx.daysSinceActive >= 2) {
    return msg(
      'alerte',
      `${ctx.name}, ton royaume s’est ennuyé de toi ${ctx.daysSinceActive} jours. ` +
        'Aucune culpabilité — juste une quête facile pour rallumer la flamme. Je crois en toi.',
    );
  }

  // Félicitation : grosse journée.
  if (ctx.todayCompleted >= 3) {
    return msg('félicitation', `Incroyable, ${ctx.todayCompleted} quêtes aujourd’hui ! Tu es en feu 🔥. Savoure cette victoire.`);
  }

  // Relance douce : rien fait aujourd'hui mais actif récemment.
  if (ctx.todayCompleted === 0 && ctx.daysSinceActive <= 1) {
    return msg('motivation', `Une seule petite quête aujourd’hui suffirait à entretenir ta série de ${ctx.bestStreak} jours. On y va ?`);
  }

  // Défi pour les joueurs réguliers.
  if (ctx.level >= 5 && Math.random() < 0.5) {
    return msg('défi', CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
  }

  return msg('motivation', MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]);
}

/**
 * Point d'extension pour un vrai LLM (Claude). Laisser non implémenté
 * tant qu'aucun backend n'est branché — l'app fonctionne 100% en local.
 *
 * Exemple d'intégration côté serveur :
 *   POST /api/coach { context } -> { message }  (modèle: claude-sonnet-4-6)
 */
export async function generateRemoteCoachMessage(_ctx: CoachContext): Promise<CoachMessage | null> {
  return null;
}
