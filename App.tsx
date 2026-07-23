/**
 * ParkGuard Parking Enforcement App
 *
 * @format
 */

import React from 'react';
import { LogBox, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { Colors } from './src/constants/Colors';

LogBox.ignoreAllLogs(); // Ignore all React Native Warnings in debug mode

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
            <RootNavigator />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
