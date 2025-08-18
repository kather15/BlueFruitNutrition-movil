import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/Navigation';
import LoadingScreen from './src/screens/LoadingScreen';

// Mantener el splash screen visible mientras se carga la app
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Ocultar el splash screen nativo cuando la app esté lista
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Mostrar loading mientras la app no esté lista
  if (!appIsReady) {
    return null;
  }

  // Mostrar pantalla de carga personalizada
  if (isLoading) {
    return (
      <>
        <StatusBar style="light" backgroundColor="#0C133F" />
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      </>
    );
  }

  // Mostrar la aplicación principal
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}