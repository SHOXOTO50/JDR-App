import { useGame } from '../store/gameStore';
import { WORLD_NODES } from '../data/world';

export default function WorldMap() {
  const level = useGame((s) => s.level);
  const unlockedCount = WORLD_NODES.filter((n) => level >= n.unlockLevel).length;
  const next = WORLD_NODES.find((n) => level < n.unlockLevel);

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand"><span className="logo">🗺️</span> Mon royaume</div>
        <span className="chip chip-gold">{unlockedCount}/{WORLD_NODES.length} lieux</span>
      </div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
        Plus tu progresses, plus ton monde s’étend : villages, cités, monuments et créatures alliées.
      </p>

      <div className="worldmap">
        {WORLD_NODES.map((n) => {
          const unlocked = level >= n.unlockLevel;
          return (
            <div key={n.id} className={`worldnode ${unlocked ? '' : 'locked'}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <span className="dot">{unlocked ? n.icon : '🔒'}</span>
              <span className="lbl">{unlocked ? n.name : `Niv. ${n.unlockLevel}`}</span>
            </div>
          );
        })}
      </div>

      {next && (
        <div className="card mt">
          <div className="muted" style={{ fontSize: 12 }}>Prochain déblocage</div>
          <div className="spread" style={{ marginTop: 4 }}>
            <div style={{ fontWeight: 800 }}>{next.icon} {next.name}</div>
            <span className="chip">Niveau {next.unlockLevel}</span>
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>{next.desc}</div>
        </div>
      )}

      <div className="section-title">Lieux découverts</div>
      {WORLD_NODES.filter((n) => level >= n.unlockLevel).map((n) => (
        <div key={n.id} className="card" style={{ padding: 12 }}>
          <div className="row">
            <span style={{ fontSize: 26 }}>{n.icon}</span>
            <div className="grow">
              <div style={{ fontWeight: 800 }}>{n.name} <span className="muted" style={{ fontSize: 11 }}>· {n.type}</span></div>
              <div className="muted" style={{ fontSize: 13 }}>{n.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
