import { useGame } from '../store/gameStore';

export default function CoachCard() {
  const messages = useGame((s) => s.coachMessages);
  const ask = useGame((s) => s.askCoach);
  const latest = messages[0];

  return (
    <div className="coach">
      <div className="avatar">🧝‍♀️</div>
      <div className="grow">
        <div className="tone">Coach · {latest?.tone ?? 'motivation'}</div>
        <div className="msg">{latest?.text ?? 'Bienvenue, héros. Prêt à écrire ta légende ?'}</div>
        <button className="btn btn-ghost" style={{ marginTop: 10, padding: '6px 12px', fontSize: 13 }} onClick={ask}>
          💬 Parler au Coach
        </button>
      </div>
    </div>
  );
}
