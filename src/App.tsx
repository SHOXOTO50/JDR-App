import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGame } from './store/gameStore';
import BottomNav from './components/BottomNav';
import Toasts from './components/Toasts';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import Character from './screens/Character';
import QuestJournal from './screens/QuestJournal';
import SkillTree from './screens/SkillTree';
import WorldMap from './screens/WorldMap';
import Inventory from './screens/Inventory';
import Stats from './screens/Stats';

export default function App() {
  const initialized = useGame((s) => s.initialized);
  const askCoach = useGame((s) => s.askCoach);

  // Le Coach salue le héros à chaque ouverture (et détecte les absences).
  useEffect(() => {
    if (initialized) askCoach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  if (!initialized) return <Onboarding />;

  return (
    <>
      <Toasts />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/character" element={<Character />} />
        <Route path="/quests" element={<QuestJournal />} />
        <Route path="/skills" element={<SkillTree />} />
        <Route path="/world" element={<WorldMap />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  );
}
