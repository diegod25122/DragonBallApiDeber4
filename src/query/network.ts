import { focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import { log } from '@/utils/logger';

function isOnline(state: Network.NetworkState): boolean {
  return state.isConnected === true && state.isInternetReachable !== false;
}

let configured = false;

export function setupNetworkManagers(): void {
  if (configured) return;
  configured = true;

  onlineManager.setEventListener((setOnline) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return () => {};
      const onOnline = () => setOnline(true);
      const onOffline = () => setOnline(false);
      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);
      setOnline(window.navigator.onLine);
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
      };
    }

    Network.getNetworkStateAsync()
      .then((state) => setOnline(isOnline(state)))
      .catch(() => {});
    const subscription = Network.addNetworkStateListener((state) => setOnline(isOnline(state)));
    return () => subscription.remove();
  });

  onlineManager.subscribe((online) => {
    log(
      'RED',
      online
        ? 'Con conexión: TanStack reanuda consultas y mutaciones pausadas'
        : 'Sin conexión: las mutaciones nuevas quedan en pausa',
    );
  });

  if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });
  }
}