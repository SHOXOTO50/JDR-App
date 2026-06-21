import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { C } from '../theme';
import Dashboard from '../screens/Dashboard';
import Character from '../screens/Character';
import QuestJournal from '../screens/QuestJournal';
import SkillTree from '../screens/SkillTree';
import WorldMap from '../screens/WorldMap';
import Inventory from '../screens/Inventory';
import Stats from '../screens/Stats';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Accueil', component: Dashboard, icon: '🏠' },
  { name: 'Héros', component: Character, icon: '🧙' },
  { name: 'Quêtes', component: QuestJournal, icon: '📜' },
  { name: 'Talents', component: SkillTree, icon: '🌳' },
  { name: 'Monde', component: WorldMap, icon: '🗺️' },
  { name: 'Sac', component: Inventory, icon: '🎒' },
  { name: 'Stats', component: Stats, icon: '📊' },
];

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(16, 12, 36, 0.97)',
          borderTopColor: C.border,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarIcon: ({ focused }) => {
          const tab = TABS.find((t) => t.name === route.name);
          return <Text style={{ fontSize: 20 }}>{tab?.icon}</Text>;
        },
      })}
    >
      {TABS.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}
