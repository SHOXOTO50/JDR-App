import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useGame } from './src/store/gameStore';
import Onboarding from './src/screens/Onboarding';
import TabNavigator from './src/navigation/TabNavigator';
import Toasts from './src/components/Toasts';
import { C } from './src/theme';

export default function App() {
  const initialized = useGame((s) => s.initialized);
  const askCoach = useGame((s) => s.askCoach);

  useEffect(() => {
    if (initialized) askCoach();
  }, [initialized]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={C.bg} />
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {initialized ? (
          <NavigationContainer>
            <TabNavigator />
            <Toasts />
          </NavigationContainer>
        ) : (
          <Onboarding />
        )}
      </View>
    </SafeAreaProvider>
  );
}
