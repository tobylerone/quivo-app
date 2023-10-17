import { StatusBar } from 'expo-status-bar';
import { AuthNavigation, Navigation } from './navigation/index';
import useCachedResources from "./hooks/useCashedResources"
import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider } from './contexts/UserContext';
import UserContext from './contexts/UserContext';

function UserComponent() {

  const { currentUser } = useContext(UserContext);

  return currentUser ? <Navigation /> : <AuthNavigation />;

}

export default function App() {
  const isLoaded= useCachedResources()

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <UserComponent />
    </AuthProvider>
  );

}