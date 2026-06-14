import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { store, persistor } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme';

const LoadingFallback = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingFallback />} persistor={persistor}>
            <StatusBar style="light" backgroundColor={colors.background} />
            <AppNavigator />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
