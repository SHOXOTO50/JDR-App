import { useState } from 'react';
import { useGame } from '../store/gameStore';
import { ITEMS } from '../data/items';
import type { ItemType } from '../types';

const FILTERS: { id: ItemType | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tout' },
  { id: 'badge', label: 'Badges' },
  { id: 'relique', label: 'Reliques' },
  { id: 'trophée', label: 'Trophées' },
  { id: 'cosmétique', label: 'Cosmétiques' },
  { id: 'compagnon', label: 'Compagnons' },
];

export default function Inventory() {
  const unlocked = useGame((s) => s.unlockedItems);
  const [filter, setFilter] = useState<ItemType | 'tous'>('tous');

  const list = filter === 'tous' ? ITEMS : ITEMS.filter((i) => i.type === filter);
  const ownedCount = unlocked.length;

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand"><span className="logo">🎒</span> Inventaire</div>
        <span className="chip chip-gold">{ownedCount}/{ITEMS.length}</span>
      </div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
        Récompenses 100% symboliques — aucun avantage payant. La fierté de l’avoir mérité.
      </p>

      <div className="tabs">
        {FILTERS.map((f) => (
          <button key={f.id} className={`tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="itemgrid">
        {list.map((item) => {
          const has = unlocked.includes(item.id);
          return (
            <div key={item.id} className={`itemcard ${has ? '' : 'locked'}`} title={item.desc}>
              <div className="ico">{has ? item.icon : '❔'}</div>
              <div className="name">{has ? item.name : '???'}</div>
              <div className="rar" style={{ color: `var(--rarity-${item.rarity})` }}>{item.rarity}</div>
            </div>
          );
        })}
      </div>

      <div className="section-title">Objets à débloquer</div>
      {ITEMS.filter((i) => !unlocked.includes(i.id)).slice(0, 6).map((i) => (
        <div key={i.id} className="card" style={{ padding: 12 }}>
          <div className="row">
            <span style={{ fontSize: 24, opacity: 0.5 }}>{i.icon}</span>
            <div className="grow">
              <div style={{ fontWeight: 800 }}>{i.name} <span className="rar" style={{ color: `var(--rarity-${i.rarity})` }}>· {i.rarity}</span></div>
              <div className="muted" style={{ fontSize: 13 }}>{i.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
