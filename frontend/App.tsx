import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { AuthNavigation, FirstLoginNavigation, Navigation } from './navigation/index';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthProvider } from './contexts/UserContext';
import UserContext from './contexts/UserContext';
import { useFonts } from 'expo-font';

function UserComponent() {

  const { currentUser } = useContext(UserContext);

  if (currentUser) {
      // Take no known languages as a proxy for first login
      if (currentUser.known_languages.length === 0) {
          return <FirstLoginNavigation />
      }
      return <Navigation />
  } else {
    return <AuthNavigation />
  }
}

export default function App() {
  // Keep the splash screen visible while we fetch resources
  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded, fontError] = useFonts({
    'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito Bold': require('./assets/fonts/Nunito-Bold.ttf')
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    console.log('Error loading fonts');
    return null;
  }

  return (
    <AuthProvider>
      <View onLayout={onLayoutRootView}></View>
      <StatusBar style="auto" />
      <UserComponent />
    </AuthProvider>
  );

}