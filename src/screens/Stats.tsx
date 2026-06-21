import { useGame } from '../store/gameStore';
import { totalXpForLevel } from '../engine/xp';
import { STAT_LABELS, STAT_ICONS, StatKey } from '../types';

export default function Stats() {
  const s = useGame();
  const reset = useGame((st) => st.resetGame);

  const completed = Object.values(s.questProgress).filter((p) => p.status === 'completed' || p.lastDone).length;
  const totalXp = totalXpForLevel(s.level) + s.xp;
  const topStat = (Object.keys(s.stats) as StatKey[]).sort((a, b) => s.stats[b] - s.stats[a])[0];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand"><span className="logo">📊</span> Statistiques</div>
      </div>

      <div className="statgrid">
        <div className="card center"><div className="big-num">{s.level}</div><div className="muted">Niveau</div></div>
        <div className="card center"><div className="big-num">{totalXp}</div><div className="muted">XP total</div></div>
        <div className="card center"><div className="big-num">{completed}</div><div className="muted">Quêtes faites</div></div>
        <div className="card center"><div className="big-num">{s.bestStreak}</div><div className="muted">Série record</div></div>
        <div className="card center"><div className="big-num">{s.reputation}</div><div className="muted">Réputation</div></div>
        <div className="card center"><div className="big-num">{s.unlockedItems.length}</div><div className="muted">Objets</div></div>
      </div>

      <div className="section-title">Statistique dominante</div>
      <div className="card row">
        <span style={{ fontSize: 30 }}>{STAT_ICONS[topStat]}</span>
        <div className="grow">
          <div style={{ fontWeight: 800 }}>{STAT_LABELS[topStat]}</div>
          <div className="muted" style={{ fontSize: 13 }}>Ta force la plus développée : {s.stats[topStat]} points.</div>
        </div>
      </div>

      <div className="section-title">Journal d’activité</div>
      <div className="card">
        {s.log.length === 0 && <p className="muted center">Rien encore. Accomplis ta première quête !</p>}
        {s.log.slice(0, 15).map((e) => (
          <div key={e.id} className="spread" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13 }}>{e.text}</div>
            {e.xp ? <span className="reward-pill">+{e.xp}</span> : null}
          </div>
        ))}
      </div>

      <button className="btn btn-block mt-lg" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => {
        if (confirm('Recommencer une nouvelle aventure ? Toute la progression sera perdue.')) reset();
      }}>
        ♻️ Réinitialiser l’aventure
      </button>
    </div>
  );
}
