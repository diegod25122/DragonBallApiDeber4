export const SECOND = 1_000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

export const PERSIST_MAX_AGE = 24 * HOUR;

export interface CacheTimes {
  staleTime: number;
  gcTime: number;
}

export const CACHE_TIMES = {
  publicApi: { staleTime: 1 * HOUR, gcTime: 48 * HOUR },
  mockApi: { staleTime: 30 * SECOND, gcTime: 24 * HOUR },
} as const satisfies Record<string, CacheTimes>;

export function gcTimeCoversMaxAge(times: CacheTimes, maxAge: number = PERSIST_MAX_AGE): boolean {
  return times.gcTime >= maxAge;
}
