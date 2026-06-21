import { useGame } from '../store/gameStore';
import { CLASSES, TITLES } from '../data/classes';
import { STAT_LABELS, STAT_ICONS, StatKey } from '../types';
import { xpToNext } from '../engine/xp';
import XPBar from '../components/XPBar';

export default function Character() {
  const s = useGame();
  const setTitle = useGame((st) => st.setTitle);
  const cls = CLASSES.find((c) => c.id === s.classId) ?? CLASSES[0];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand"><span className="logo">🧙</span> Personnage</div>
      </div>

      <div className="card center">
        <div className="avatar-ring" style={{ margin: '0 auto' }}>{cls.icon}</div>
        <h2 style={{ marginTop: 10 }}>{s.name}</h2>
        <div className="muted">{cls.name} · {cls.tagline}</div>
        <div className="row" style={{ justifyContent: 'center', gap: 8, marginTop: 10 }}>
          <span className="chip chip-gold">Niveau {s.level}</span>
          <span className="chip">⭐ {s.reputation} réputation</span>
          <span className="chip">🔥 {s.bestStreak} j record</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <XPBar value={s.xp} max={xpToNext(s.level)} />
          <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{s.xp} / {xpToNext(s.level)} XP</div>
        </div>
      </div>

      <div className="section-title">Statistiques</div>
      <div className="card">
        <div className="statgrid">
          {(Object.keys(STAT_LABELS) as StatKey[]).map((k) => (
            <div key={k} className="stat">
              <span className="ico">{STAT_ICONS[k]}</span>
              <div className="meta">
                <span className="label">{STAT_LABELS[k]}</span>
                <span className="value">{s.stats[k]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Titres</div>
      <div className="card">
        {TITLES.map((t) => {
          const unlocked = s.unlockedTitles.includes(t.id);
          const active = s.titleId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => unlocked && setTitle(t.id)}
              disabled={!unlocked}
              className="spread"
              style={{
                width: '100%', background: active ? 'rgba(245,197,66,0.1)' : 'transparent',
                border: 'none', borderBottom: '1px solid var(--border)', color: 'inherit',
                padding: '12px 4px', textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: unlocked ? 'var(--text)' : 'var(--muted)' }}>
                  {unlocked ? '' : '🔒 '}{t.name}
                </div>
                <div className="muted" style={{ fontSize: 12 }}>{t.requirement}</div>
              </div>
              {active && <span className="chip chip-gold">Équipé</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
