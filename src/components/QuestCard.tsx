import type { Quest } from '../types';
import { useGame } from '../store/gameStore';
import { STAT_ICONS } from '../types';
import { SKILL_BY_ID } from '../data/skills';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function QuestCard({ quest }: { quest: Quest }) {
  const progress = useGame((s) => s.questProgress[quest.id]);
  const complete = useGame((s) => s.completeQuest);
  const toggleStep = useGame((s) => s.toggleStep);

  const isDailyDoneToday = quest.repeatable && progress?.lastDone === today();
  const isCompleted = !quest.repeatable && progress?.status === 'completed';
  const done = isDailyDoneToday || isCompleted;

  const steps = quest.steps;
  const stepStates = progress?.steps ?? steps?.map(() => false);

  return (
    <div className={`quest ${done ? 'done' : ''}`}>
      {!steps && (
        <button
          className={`check ${done ? 'on' : ''}`}
          aria-label="Terminer la quête"
          onClick={() => !done && complete(quest.id)}
          disabled={done}
        >
          {done ? '✓' : ''}
        </button>
      )}
      <div className="body">
        <div className="spread">
          <div className="title">{quest.title}</div>
          <span className={`difftag diff-${quest.difficulty}`}>{quest.difficulty}</span>
        </div>
        <div className="desc">{quest.desc}</div>

        {steps && (
          <div className="steps">
            {steps.map((s, i) => {
              const on = stepStates?.[i];
              return (
                <button key={i} className={`step ${on ? 'on' : ''}`} onClick={() => toggleStep(quest.id, i)} style={{ background: 'none', border: 'none', textAlign: 'left', padding: 0, color: 'inherit' }}>
                  <span className={`box ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="rewards">
          <span className="reward-pill">+{quest.xp} XP</span>
          {Object.entries(quest.statRewards).map(([k, v]) => (
            <span key={k} className="reward-pill">
              {STAT_ICONS[k as keyof typeof STAT_ICONS]} +{v}
            </span>
          ))}
          {quest.skillId && (
            <span className="reward-pill skill">
              {SKILL_BY_ID[quest.skillId]?.icon} +{quest.skillXp}
            </span>
          )}
          {isDailyDoneToday && progress?.streak ? (
            <span className="reward-pill">🔥 série {progress.streak}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
