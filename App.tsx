import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import Toasts from './src/components/Toasts';
import { C } from './src/theme';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor={C.bg} />
          <View style={{ flex: 1, backgroundColor: C.bg }}>
            <NavigationContainer>
              <RootNavigator />
              <Toasts />
            </NavigationContainer>
          </View>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
