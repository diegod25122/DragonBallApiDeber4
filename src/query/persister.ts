import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { PersistQueryClientProviderProps } from '@tanstack/react-query-persist-client';

import { CACHE_BUSTER } from '@/config';
import { PERSIST_MAX_AGE } from '@/domain/cacheTimes';

export const CACHE_STORAGE_KEY = 'EQUIPO_Z_QUERY_CACHE';

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: CACHE_STORAGE_KEY,
  throttleTime: 1_000,
});

export const persistOptions: PersistQueryClientProviderProps['persistOptions'] = {
  persister: asyncStoragePersister,
  maxAge: PERSIST_MAX_AGE,
  buster: CACHE_BUSTER,
};
