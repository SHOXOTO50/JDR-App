import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { CharacterSheetScreen } from '../screens/CharacterSheetScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { DiceRollerScreen } from '../screens/DiceRollerScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { MoreScreen } from '../screens/MoreScreen';

export type TabParamList = {
  Personnage: undefined;
  Inventaire: undefined;
  Des: undefined;
  Journal: undefined;
  Plus: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={[styles.icon, focused && styles.iconFocused]}>{label}</Text>
);

const TabLabel = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
);

export const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1 },
      headerTintColor: colors.primary,
      headerTitleStyle: { color: colors.text, fontWeight: '700', fontSize: 18 },
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
    }}
  >
    <Tab.Screen
      name="Personnage"
      component={CharacterSheetScreen}
      options={{
        title: 'Personnage',
        tabBarIcon: ({ focused }) => <TabIcon label="⚔️" focused={focused} />,
        tabBarLabel: ({ focused }) => <TabLabel label="Perso" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Inventaire"
      component={InventoryScreen}
      options={{
        title: 'Inventaire',
        tabBarIcon: ({ focused }) => <TabIcon label="🎒" focused={focused} />,
        tabBarLabel: ({ focused }) => <TabLabel label="Inventaire" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Des"
      component={DiceRollerScreen}
      options={{
        title: 'Lanceur de Dés',
        tabBarIcon: ({ focused }) => <TabIcon label="🎲" focused={focused} />,
        tabBarLabel: ({ focused }) => <TabLabel label="Dés" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Journal"
      component={JournalScreen}
      options={{
        title: 'Journal',
        tabBarIcon: ({ focused }) => <TabIcon label="📖" focused={focused} />,
        tabBarLabel: ({ focused }) => <TabLabel label="Journal" focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Plus"
      component={MoreScreen}
      options={{
        title: 'Plus',
        tabBarIcon: ({ focused }) => <TabIcon label="☰" focused={focused} />,
        tabBarLabel: ({ focused }) => <TabLabel label="Plus" focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
});
