import type { Quest, SkillProgress } from '../types';
import { SKILLS } from '../data/skills';

// "IA" légère et locale : génère des quêtes adaptées aux compétences
// les plus / les moins pratiquées, sans dépendre d'un service externe.
// (Brancher un vrai LLM ici se fait via engine/coach.ts -> generateRemoteQuests.)

const DIFF_XP: Record<Quest['difficulty'], number> = {
  facile: 20,
  moyenne: 40,
  difficile: 70,
  épique: 120,
};

function uid(): string {
  return 'auto-' + Math.random().toString(36).slice(2, 9);
}

const TEMPLATES: Record<string, { title: (n: string) => string; desc: string; difficulty: Quest['difficulty'] }[]> = {
  default: [
    { title: (n) => `Consacre 25 min à ${n}`, desc: 'Une session focalisée, sans distraction.', difficulty: 'moyenne' },
    { title: (n) => `Petit pas vers ${n}`, desc: '10 minutes suffisent pour entretenir la flamme.', difficulty: 'facile' },
    { title: (n) => `Défi : repousse tes limites en ${n}`, desc: 'Vise un peu plus loin qu’hier.', difficulty: 'difficile' },
  ],
};

/**
 * Analyse la progression et propose jusqu'à `count` quêtes :
 * - renforce les compétences déjà entamées (momentum),
 * - réveille les compétences délaissées (équilibre).
 */
export function generateQuests(skillProgress: Record<string, SkillProgress>, count = 3): Quest[] {
  const scored = SKILLS.map((s) => {
    const p = skillProgress[s.id];
    const lvl = p?.level ?? 1;
    return { skill: s, level: lvl };
  });

  const momentum = [...scored].sort((a, b) => b.level - a.level).slice(0, 2);
  const neglected = [...scored].sort((a, b) => a.level - b.level).slice(0, 2);
  const pool = [...momentum, ...neglected];

  const quests: Quest[] = [];
  const seen = new Set<string>();
  for (const { skill, level } of pool) {
    if (quests.length >= count) break;
    if (seen.has(skill.id)) continue;
    seen.add(skill.id);

    const templates = TEMPLATES.default;
    const tpl = templates[Math.min(level > 10 ? 2 : level > 3 ? 0 : 1, templates.length - 1)];
    quests.push({
      id: uid(),
      type: 'auto',
      title: tpl.title(skill.name),
      desc: `${tpl.desc} (suggéré par ton Coach)`,
      difficulty: tpl.difficulty,
      xp: DIFF_XP[tpl.difficulty],
      statRewards: { [skill.primaryStat]: 1 },
      skillId: skill.id,
      skillXp: DIFF_XP[tpl.difficulty] + 10,
    });
  }
  return quests;
}
