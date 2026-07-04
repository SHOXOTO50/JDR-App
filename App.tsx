import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { gameActions } from './src/store/slices/gameSlice';
import RootNavigator from './src/navigation/RootNavigator';
import Toasts from './src/components/Toasts';
import LevelUpOverlay from './src/components/anim/LevelUpOverlay';
import { C } from './src/theme';

function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Injecte le contenu ajouté par les mises à jour dans les vieilles sauvegardes.
    dispatch(gameActions.syncContent());
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavigationContainer>
        <RootNavigator />
        <Toasts />
        <LevelUpOverlay />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor={C.bg} />
          <Root />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
