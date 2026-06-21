// Courbes de progression du personnage et des compétences.

/** XP nécessaire pour passer du niveau `level` au suivant. */
export function xpToNext(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/** XP total cumulé requis pour atteindre `level` depuis le niveau 1. */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpToNext(l);
  return total;
}

/** Applique un gain d'XP et renvoie le nouvel état + le nombre de niveaux gagnés. */
export function applyXp(level: number, xp: number, gain: number): { level: number; xp: number; levelsGained: number } {
  let newLevel = level;
  let newXp = xp + gain;
  let levelsGained = 0;
  while (newXp >= xpToNext(newLevel)) {
    newXp -= xpToNext(newLevel);
    newLevel += 1;
    levelsGained += 1;
  }
  return { level: newLevel, xp: newXp, levelsGained };
}

// ── Compétences (niveau 1 → 100) ─────────────────────────────────────────────

const SKILL_CAP = 100;

export function skillXpToNext(level: number): number {
  return Math.floor(60 * Math.pow(level, 1.35));
}

export function applySkillXp(level: number, xp: number, gain: number): { level: number; xp: number; levelsGained: number } {
  let newLevel = level;
  let newXp = xp + gain;
  let levelsGained = 0;
  while (newLevel < SKILL_CAP && newXp >= skillXpToNext(newLevel)) {
    newXp -= skillXpToNext(newLevel);
    newLevel += 1;
    levelsGained += 1;
  }
  if (newLevel >= SKILL_CAP) {
    newLevel = SKILL_CAP;
    newXp = 0;
  }
  return { level: newLevel, xp: newXp, levelsGained };
}
