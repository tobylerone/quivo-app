import { StatusBar } from 'expo-status-bar';
import { AuthNavigation, Navigation } from './navigation/index';
import useCachedResources from "./hooks/useCashedResources"
import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider } from './contexts/UserContext';
import UserContext from './contexts/UserContext';

/*
Problem with sessions:

axios client is getting created once at the start when the app is created
If that user then logs out and logs in as a different user, the csrf token isn't updated
but it should be a new session, so the user's post requests get denied
*/

function UserComponent() {

  const { currentUser } = useContext(UserContext);

  return currentUser ? <Navigation /> : <AuthNavigation />;

}

export default function App() {
  const isLoaded= useCachedResources();

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