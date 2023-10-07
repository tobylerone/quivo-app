import { StatusBar } from 'expo-status-bar';
import Navigation from './navigation/index';
import useCachedResources from "./hooks/useCashedResources"
import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider } from './contexts/UserContext';
import LoginScreen from './screens/LoginScreen';
import UserContext from './contexts/UserContext';

function UserComponent() {

  const { currentUser } = useContext(UserContext);

  return currentUser ? <Navigation /> : <LoginScreen />;

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