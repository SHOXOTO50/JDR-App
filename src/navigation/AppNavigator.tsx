import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import { setAppMode } from '../store/slices/appModeSlice';
import { useAppTheme } from '../hooks/useAppTheme';
import { MainTabNavigator } from './MainTabNavigator';
import { CharacterSelectScreen } from '../screens/CharacterSelectScreen';
import { CampaignSelectScreen } from '../screens/CampaignSelectScreen';
import { ModeSelectScreen } from '../screens/ModeSelectScreen';
import { CreateCharacterScreen } from '../screens/CreateCharacterScreen';
import { CombatScreen } from '../screens/CombatScreen';
import { GMScreen } from '../screens/GMScreen';
import { CampaignScreen } from '../screens/CampaignScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { QuestsScreen } from '../screens/QuestsScreen';
import { MapScreen } from '../screens/MapScreen';
import { MultiplayerScreen } from '../screens/MultiplayerScreen';
import { LanScreen } from '../screens/LanScreen';
import { NameGeneratorScreen } from '../screens/NameGeneratorScreen';
import { EncounterTableScreen } from '../screens/EncounterTableScreen';
import { EquipmentLibraryScreen } from '../screens/EquipmentLibraryScreen';
import { TutorialScreen } from '../screens/TutorialScreen';
import { TutorialOfferScreen } from '../screens/TutorialOfferScreen';
import { PatchNotesScreen } from '../screens/PatchNotesScreen';
import { ThemesScreen } from '../screens/ThemesScreen';
import { XPCalculatorScreen } from '../screens/XPCalculatorScreen';
import { AdventureScreen } from '../screens/AdventureScreen';

export type RootStackParamList = {
  CharacterSelect: undefined;
  ModeSelect: undefined;
  TutorialOffer: undefined;
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
  NameGenerator: undefined;
  EncounterTable: undefined;
  EquipmentLibrary: undefined;
  Tutorial: undefined;
  PatchNotes: undefined;
  Themes: undefined;
  XPCalculator: undefined;
  Adventure: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GateBackButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity onPress={() => dispatch(setAppMode(null))} style={gateStyles.backButton}>
      <Text style={[gateStyles.backButtonText, { color: colors.primary }]}>⟵</Text>
    </TouchableOpacity>
  );
};

const gateStyles = StyleSheet.create({
  backButton: { paddingHorizontal: 4, paddingVertical: 4 },
  backButtonText: { fontSize: 22, fontWeight: '700' },
});

export const AppNavigator: React.FC = () => {
  const currentCharacterId = useAppSelector((s) => s.characters.currentCharacterId);
  const activeCampaignId = useAppSelector((s) => s.campaign.activeCampaignId);
  const mode = useAppSelector((s) => s.appMode.mode);
  const groupReady = useAppSelector((s) => s.appMode.groupReady);
  const tutorialSeen = useAppSelector((s) => s.appMode.tutorialSeen);
  const { colors } = useAppTheme();

  const navTheme = {
    dark: true,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.secondary,
    },
  };

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

    // Step 2: character chosen but no mode → mode selection (solo / LAN / pass-and-play)
    if (!mode) {
      return (
        <Stack.Screen
          name="ModeSelect"
          component={ModeSelectScreen}
          options={{ headerShown: false }}
        />
      );
    }

    // Step 3: multiplayer modes set up their group/connection before picking a campaign
    if ((mode === 'local' || mode === 'passplay') && !groupReady) {
      return mode === 'local' ? (
        <Stack.Screen
          name="Lan"
          component={LanScreen}
          options={{ title: 'Multijoueur Local (LAN)', headerLeft: () => <GateBackButton /> }}
        />
      ) : (
        <Stack.Screen
          name="Multiplayer"
          component={MultiplayerScreen}
          options={{ title: 'Pass-and-Play', headerLeft: () => <GateBackButton /> }}
        />
      );
    }

    // Step 4: solo first launch → tutorial offer
    if (mode === 'solo' && !tutorialSeen && !activeCampaignId) {
      return (
        <Stack.Screen
          name="TutorialOffer"
          component={TutorialOfferScreen}
          options={{ headerShown: false }}
        />
      );
    }

    // Step 5: no active campaign yet → campaign selection
    if (!activeCampaignId) {
      return (
        <Stack.Screen
          name="CampaignSelect"
          component={CampaignSelectScreen}
          options={{ headerShown: false }}
        />
      );
    }

    // Step 6: full app
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
        <Stack.Screen name="Multiplayer" component={MultiplayerScreen} options={{ title: 'Pass-and-Play' }} />
        <Stack.Screen name="Lan" component={LanScreen} options={{ title: 'Multijoueur Local (LAN)' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres', presentation: 'modal' }} />
        <Stack.Screen name="Quests" component={QuestsScreen} options={{ title: 'Quêtes' }} />
        <Stack.Screen name="NameGenerator" component={NameGeneratorScreen} options={{ title: 'Générateur de noms' }} />
        <Stack.Screen name="EncounterTable" component={EncounterTableScreen} options={{ title: 'Table de rencontres' }} />
        <Stack.Screen name="EquipmentLibrary" component={EquipmentLibraryScreen} options={{ title: 'Bibliothèque d\'équipements' }} />
        <Stack.Screen name="Tutorial" component={TutorialScreen} options={{ title: 'Tutoriels & Campagnes' }} />
        <Stack.Screen name="PatchNotes" component={PatchNotesScreen} options={{ title: 'Notes de mise à jour' }} />
        <Stack.Screen name="Themes" component={ThemesScreen} options={{ title: 'Thèmes visuels' }} />
        <Stack.Screen name="XPCalculator" component={XPCalculatorScreen} options={{ title: 'Calculateur d\'XP' }} />
        <Stack.Screen name="Adventure" component={AdventureScreen} options={{ headerShown: false }} />
      </>
    );
  };

  return (
    <NavigationContainer theme={navTheme}>
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
