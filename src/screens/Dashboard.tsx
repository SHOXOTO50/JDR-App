import { Link } from 'react-router-dom';
import { useGame } from '../store/gameStore';
import { xpToNext } from '../engine/xp';
import { CLASSES, TITLES } from '../data/classes';
import XPBar from '../components/XPBar';
import CoachCard from '../components/CoachCard';
import QuestCard from '../components/QuestCard';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const s = useGame();
  const cls = CLASSES.find((c) => c.id === s.classId) ?? CLASSES[0];
  const title = TITLES.find((t) => t.id === s.titleId);

  const dailies = s.quests.filter((q) => q.type === 'quotidienne');
  const doneToday = dailies.filter((q) => s.questProgress[q.id]?.lastDone === today()).length;

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand"><span className="logo">⚔️</span> LifeQuest</div>
        <Link to="/stats" className="chip chip-gold">🔥 {s.bestStreak} j · ⭐ {s.reputation}</Link>
      </div>

      {/* Bandeau héros */}
      <div className="card">
        <div className="row">
          <div className="avatar-ring">{cls.icon}</div>
          <div className="grow">
            <div className="spread">
              <h2>{s.name}</h2>
              <span className="chip chip-gold">Niv. {s.level}</span>
            </div>
            <div className="muted" style={{ fontSize: 13 }}>{title?.name} · {cls.name}</div>
            <div style={{ marginTop: 10 }}>
              <XPBar value={s.xp} max={xpToNext(s.level)} />
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                {s.xp} / {xpToNext(s.level)} XP vers le niveau {s.level + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />
      <CoachCard />

      <div className="section-title">
        Quêtes du jour — {doneToday}/{dailies.length}
      </div>
      {dailies.map((q) => (
        <QuestCard key={q.id} quest={q} />
      ))}

      <div className="spread" style={{ marginTop: 18 }}>
        <Link to="/quests" className="btn btn-accent grow center">📜 Toutes les quêtes</Link>
        <div style={{ width: 10 }} />
        <Link to="/world" className="btn grow center">🗺️ Mon royaume</Link>
      </div>
    </div>
  );
}
