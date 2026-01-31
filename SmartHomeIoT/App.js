/**
 * SmartHome IoT App
 * React Native app for controlling IoT devices via Raspberry Pi
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { DeviceProvider } from './src/context/DeviceContext';
import { RoomProvider } from './src/context/RoomContext';
import { ScheduleProvider } from './src/context/ScheduleContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { firebaseMessaging } from './src/services/firebase';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore some warnings in dev
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Toggle device failed',
  'Toggle attempt',
]);

// Inner app component that uses theme
function AppContent() {
  const { isDarkMode } = useTheme();

  // Setup foreground message handler at app root
  useEffect(() => {
    const unsubscribe = firebaseMessaging.onForegroundMessage((message) => {
      console.log('App received foreground message:', message);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthProvider>
        <NotificationProvider>
          <DeviceProvider>
            <RoomProvider>
              <ScheduleProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </ScheduleProvider>
            </RoomProvider>
          </DeviceProvider>
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
