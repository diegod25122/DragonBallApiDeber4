import { Bangers_400Regular, useFonts } from '@expo-google-fonts/bangers';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { isMockApiConfigured } from '@/config';
import { Colors } from '@/constants/theme';
import { setupNetworkManagers } from '@/query/network';
import { persistOptions } from '@/query/persister';
import { queryClient } from '@/query/queryClient';
import { log } from '@/utils/logger';

SplashScreen.preventAutoHideAsync().catch(() => {});
setupNetworkManagers();
log('APP', 'App abierta: restaurando caché de AsyncStorage…');
if (!isMockApiConfigured) log('APP', 'Falta la URL de MockAPI en src/config.ts');

async function handleCacheRestored(): Promise<void> {
  const queries = queryClient.getQueryCache().getAll().length;
  const paused = queryClient.getMutationCache().getAll().filter((m) => m.state.isPaused).length;
  log('CACHE', `Caché restaurada: ${queries} consultas y ${paused} mutaciones pausadas`);
  if (paused > 0) log('MUTACION', 'resumePausedMutations(): enviando cambios pendientes…');
  await queryClient.resumePausedMutations();
  if (paused > 0) log('MUTACION', 'resumePausedMutations() terminó');
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Bangers_400Regular });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
        onSuccess={handleCacheRestored}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.black } }} />
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
