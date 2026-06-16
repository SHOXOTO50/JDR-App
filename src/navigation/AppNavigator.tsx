import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';
import { MainTabNavigator } from './MainTabNavigator';
import { CharacterSelectScreen } from '../screens/CharacterSelectScreen';
import { CampaignSelectScreen } from '../screens/CampaignSelectScreen';
import { CreateCharacterScreen } from '../screens/CreateCharacterScreen';
import { CombatScreen } from '../screens/CombatScreen';
import { GMScreen } from '../screens/GMScreen';
import { CampaignScreen } from '../screens/CampaignScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { QuestsScreen } from '../screens/QuestsScreen';
import { MapScreen } from '../screens/MapScreen';
import { MultiplayerScreen } from '../screens/MultiplayerScreen';
import { LanScreen } from '../screens/LanScreen';
import { colors } from '../theme';

export type RootStackParamList = {
  CharacterSelect: undefined;
  CampaignSelect: undefined;
  CreateCharacter: { characterId?: string } | undefined;
  Main: undefined;
  Combat: undefined;
  GM: undefined;
  Campaign: undefined;
  Settings: undefined;
  Quests: undefined;
  Map: undefined;
  Multiplayer: undefined;
  Lan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const currentCharacterId = useAppSelector((s) => s.characters.currentCharacterId);
  const activeCampaignId = useAppSelector((s) => s.campaign.activeCampaignId);

  const renderScreens = () => {
    // Step 1: no character → character selection
    if (!currentCharacterId) {
      return (
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
      );
    }

    // Step 2: character chosen but no active campaign → campaign gate
    if (!activeCampaignId) {
      return (
        <Stack.Screen
          name="CampaignSelect"
          component={CampaignSelectScreen}
          options={{ headerShown: false }}
        />
      );
    }

    // Step 3: full app
    return (
      <>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="CreateCharacter"
          component={CreateCharacterScreen}
          options={{ title: 'Modifier le personnage', presentation: 'modal' }}
        />
        <Stack.Screen name="Combat" component={CombatScreen} options={{ title: 'Gestion du Combat' }} />
        <Stack.Screen name="GM" component={GMScreen} options={{ title: 'Mode Maître du Jeu' }} />
        <Stack.Screen name="Campaign" component={CampaignScreen} options={{ title: 'Campagnes' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Carte Interactive' }} />
        <Stack.Screen name="Multiplayer" component={MultiplayerScreen} options={{ title: 'Multijoueur Local' }} />
        <Stack.Screen name="Lan" component={LanScreen} options={{ title: 'Partie en Réseau (LAN)' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres', presentation: 'modal' }} />
        <Stack.Screen name="Quests" component={QuestsScreen} options={{ title: 'Quêtes' }} />
      </>
    );
  };

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
        {renderScreens()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
