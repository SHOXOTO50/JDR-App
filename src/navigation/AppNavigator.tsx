import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { MainTabNavigator } from './MainTabNavigator';
import { CharacterSelectScreen } from '../screens/CharacterSelectScreen';
import { CreateCharacterScreen } from '../screens/CreateCharacterScreen';
import { CombatScreen } from '../screens/CombatScreen';
import { GMScreen } from '../screens/GMScreen';
import { CampaignScreen } from '../screens/CampaignScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { QuestsScreen } from '../screens/QuestsScreen';
import { colors } from '../theme';

export type RootStackParamList = {
  CharacterSelect: undefined;
  CreateCharacter: { characterId?: string } | undefined;
  Main: undefined;
  Combat: undefined;
  GM: undefined;
  Campaign: undefined;
  Settings: undefined;
  Quests: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const currentCharacterId = useAppSelector((s) => s.characters.currentCharacterId);

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          headerBackTitle: '',
          animation: 'slide_from_right',
        }}
      >
        {currentCharacterId ? (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateCharacter"
              component={CreateCharacterScreen}
              options={{ title: 'Modifier le personnage', presentation: 'modal' }}
            />
            <Stack.Screen
              name="Combat"
              component={CombatScreen}
              options={{ title: 'Gestion du Combat' }}
            />
            <Stack.Screen
              name="GM"
              component={GMScreen}
              options={{ title: 'Mode Maître du Jeu' }}
            />
            <Stack.Screen
              name="Campaign"
              component={CampaignScreen}
              options={{ title: 'Campagnes' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Paramètres', presentation: 'modal' }}
            />
            <Stack.Screen
              name="Quests"
              component={QuestsScreen}
              options={{ title: 'Quêtes' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="CharacterSelect"
              component={CharacterSelectScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateCharacter"
              component={CreateCharacterScreen}
              options={{ title: 'Créer un personnage', presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
