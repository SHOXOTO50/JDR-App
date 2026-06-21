import { useGame } from '../store/gameStore';
import { SKILLS } from '../data/skills';
import { STAT_LABELS } from '../types';
import { skillXpToNext } from '../engine/xp';
import XPBar from '../components/XPBar';

export default function SkillTree() {
  const skillProgress = useGame((s) => s.skillProgress);

  const sorted = [...SKILLS].sort(
    (a, b) => (skillProgress[b.id]?.level ?? 1) - (skillProgress[a.id]?.level ?? 1),
  );

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand"><span className="logo">🌳</span> Arbre de compétences</div>
      </div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
        Chaque activité fait grimper une compétence du niveau 1 au niveau 100, et débloque son archétype.
      </p>

      <div className="card">
        {sorted.map((sk) => {
          const p = skillProgress[sk.id] ?? { level: 1, xp: 0 };
          const max = sk.id && p.level >= 100 ? 1 : skillXpToNext(p.level);
          const mastered = p.level >= 100;
          return (
            <div key={sk.id} className="skillrow">
              <span className="ico">{sk.icon}</span>
              <div className="info">
                <div className="spread">
                  <div style={{ fontWeight: 800 }}>{sk.name}</div>
                  <div className="lvl">{mastered ? '★ MAÎTRE' : `Niv. ${p.level}`}</div>
                </div>
                <div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>
                  {sk.archetype} · {STAT_LABELS[sk.primaryStat]}
                </div>
                <XPBar className="skillbar" value={mastered ? 1 : p.xp} max={max} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
