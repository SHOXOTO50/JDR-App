import { useState } from 'react';
import { useGame } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import { STAT_LABELS } from '../types';

export default function Onboarding() {
  const create = useGame((s) => s.createCharacter);
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('aventurier');

  return (
    <div className="app">
      <div className="onboard">
        <div className="center">
          <div style={{ fontSize: 56 }}>⚔️</div>
          <h1 className="hero-title">LifeQuest</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Transforme ta vie réelle en une véritable aventure. Chaque action te fait progresser.
          </p>
        </div>

        <div className="card">
          <div className="section-title" style={{ margin: '0 0 8px' }}>Ton nom de héros</div>
          <input
            className="input"
            placeholder="Ex : Lyra, Kael, ton prénom…"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <div className="section-title">Choisis ta classe de départ</div>
          <div className="classpick">
            {CLASSES.map((c) => (
              <button
                key={c.id}
                className={`classcard ${classId === c.id ? 'sel' : ''}`}
                onClick={() => setClassId(c.id)}
                style={{ textAlign: 'left' }}
              >
                <span className="ico">{c.icon}</span>
                <div className="grow">
                  <div style={{ fontWeight: 800 }}>{c.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>{c.tagline}</div>
                  <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 4 }}>
                    {Object.entries(c.bonus)
                      .map(([k, v]) => `+${v} ${STAT_LABELS[k as keyof typeof STAT_LABELS]}`)
                      .join(' · ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-gold btn-block mt" style={{ padding: 16, fontSize: 17 }} onClick={() => create(name, classId)}>
          Commencer l’aventure →
        </button>
        <p className="muted center" style={{ fontSize: 12 }}>
          Ta progression est sauvegardée sur cet appareil. Tu pourras tout modifier plus tard.
        </p>
      </div>
    </div>
  );
}
