import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', icon: '🏠', label: 'Accueil' },
  { to: '/character', icon: '🧙', label: 'Héros' },
  { to: '/quests', icon: '📜', label: 'Quêtes' },
  { to: '/skills', icon: '🌳', label: 'Talents' },
  { to: '/world', icon: '🗺️', label: 'Monde' },
  { to: '/inventory', icon: '🎒', label: 'Sac' },
];

export default function BottomNav() {
  return (
    <nav className="bottomnav">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => `navitem ${isActive ? 'active' : ''}`}>
          <span className="ico">{t.icon}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
