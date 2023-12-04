import { StatusBar } from 'expo-status-bar';
import { AuthNavigation, Navigation } from './navigation/index';
import useCachedResources from "./hooks/useCachedResources"
import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider } from './contexts/UserContext';
import UserContext from './contexts/UserContext';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

let customFonts = {
  'Nunito': require('./assets/fonts/Nunito-Regular.ttf')
};

function UserComponent() {

  const { currentUser } = useContext(UserContext);

  return currentUser ? <Navigation /> : <AuthNavigation />;
}

export default function App() {
  const isLoaded = useCachedResources();
  //const fontsLoaded = useFonts(customFonts);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
        'Nunito Bold': require('./assets/fonts/Nunito-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!isLoaded || !fontsLoaded) {
    console.log('font not loaded');
    return null; // or a loading spinner
  }

  //Font.loadAsync({
  //  'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
  //});

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <UserComponent />
    </AuthProvider>
  );

}