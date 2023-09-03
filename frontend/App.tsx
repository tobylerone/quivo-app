import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Navigation from './navigation/index';
import useCachedResources from "./hooks/useCashedResources"

export default function App() {
  const isLoaded= useCachedResources()

  if (isLoaded){
    return (
      <>
        <Navigation/>
        <StatusBar style="auto" />
      </>
    );
  } else {
    return null
  }


}