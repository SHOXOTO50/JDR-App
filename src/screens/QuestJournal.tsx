import { useState } from 'react';
import { useGame } from '../store/gameStore';
import QuestCard from '../components/QuestCard';
import type { QuestType, Difficulty, StatKey } from '../types';

const TABS: { id: QuestType | 'toutes'; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'quotidienne', label: 'Quotidiennes' },
  { id: 'secondaire', label: 'Secondaires' },
  { id: 'principale', label: 'Principales' },
  { id: 'auto', label: 'Coach IA' },
];

export default function QuestJournal() {
  const quests = useGame((s) => s.quests);
  const generate = useGame((s) => s.generateAutoQuests);
  const addCustom = useGame((s) => s.addCustomQuest);
  const [tab, setTab] = useState<QuestType | 'toutes'>('toutes');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = tab === 'toutes' ? quests : quests.filter((q) => q.type === tab);
  const order: Record<QuestType, number> = { principale: 0, secondaire: 1, quotidienne: 2, auto: 3 };
  const sorted = [...filtered].sort((a, b) => order[a.type] - order[b.type]);

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand"><span className="logo">📜</span> Journal de quêtes</div>
        <button className="btn btn-gold" style={{ padding: '8px 12px' }} onClick={() => setShowAdd(true)}>+ Quête</button>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'auto' || tab === 'toutes') && (
        <button className="btn btn-accent btn-block" style={{ marginBottom: 14 }} onClick={generate}>
          🪄 Générer des quêtes adaptées (Coach IA)
        </button>
      )}

      {sorted.length === 0 && <p className="muted center">Aucune quête ici. Crées-en une ou demande au Coach !</p>}
      {sorted.map((q) => (
        <QuestCard key={q.id} quest={q} />
      ))}

      {showAdd && <AddQuestModal onClose={() => setShowAdd(false)} onAdd={addCustom} />}
    </div>
  );
}

function AddQuestModal({ onClose, onAdd }: { onClose: () => void; onAdd: ReturnType<typeof useGame.getState>['addCustomQuest'] }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<QuestType>('secondaire');
  const [difficulty, setDifficulty] = useState<Difficulty>('moyenne');
  const [stat, setStat] = useState<StatKey>('discipline');

  const xpByDiff: Record<Difficulty, number> = { facile: 15, moyenne: 35, difficile: 60, épique: 120 };

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      type,
      title: title.trim(),
      desc: desc.trim() || 'Quête personnelle.',
      difficulty,
      xp: xpByDiff[difficulty],
      statRewards: { [stat]: difficulty === 'épique' ? 3 : 1 },
      repeatable: type === 'quotidienne',
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="spread">
          <h2>Nouvelle quête</h2>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
          <input className="input" placeholder="Titre de la quête" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="input" placeholder="Description (optionnel)" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <label className="muted" style={{ fontSize: 12 }}>Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as QuestType)}>
            <option value="quotidienne">Quotidienne (répétable)</option>
            <option value="secondaire">Secondaire</option>
            <option value="principale">Principale</option>
          </select>
          <label className="muted" style={{ fontSize: 12 }}>Difficulté</label>
          <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="facile">Facile (+15 XP)</option>
            <option value="moyenne">Moyenne (+35 XP)</option>
            <option value="difficile">Difficile (+60 XP)</option>
            <option value="épique">Épique (+120 XP)</option>
          </select>
          <label className="muted" style={{ fontSize: 12 }}>Statistique développée</label>
          <select className="input" value={stat} onChange={(e) => setStat(e.target.value as StatKey)}>
            <option value="force">Force</option>
            <option value="endurance">Endurance</option>
            <option value="intelligence">Intelligence</option>
            <option value="creativite">Créativité</option>
            <option value="charisme">Charisme</option>
            <option value="discipline">Discipline</option>
            <option value="sagesse">Sagesse</option>
            <option value="confiance">Confiance en soi</option>
          </select>
          <button className="btn btn-gold btn-block mt" onClick={submit}>Ajouter la quête</button>
        </div>
      </div>
    </div>
  );
}
