# Plan 005 — Usar la app sin conexión

## Archivos y responsabilidades
| Archivo | Responsabilidad | RF |
|---|---|---|
| src/query/network.ts | onlineManager con expo-network; focusManager con AppState | RF-01 |
| src/query/persister.ts | createAsyncStoragePersister + maxAge 24 h + buster | RF-05 |
| src/domain/cacheTimes.ts | Tiempos y gcTimeCoversMaxAge | RNF-01 |
| src/app/_layout.tsx | PersistQueryClientProvider; onSuccess → resumePausedMutations() | RF-04, RF-05 |
| src/query/hooks.ts | useTeamRows (useMutationState + mergeTeam), useIsOnline, useCacheLog | RF-03, RF-06 |
| src/components/NetworkBanner.tsx, PendingBadge.tsx | Avisos y marcas | RF-01, RF-03 |
| src/utils/logger.ts, src/app/registro.tsx | Logs con hora | RF-06 |

## Algoritmo (pseudocódigo)
```
al abrir: restaurar caché (≤ 24 h) → onSuccess:
    log(consultas y mutaciones pausadas)
    resumePausedMutations()        // usa las mutationFn de setMutationDefaults
mutación sin red: onMutate (log) → retryer ve onlineManager = false → pausada
persister: guarda consultas con éxito + mutaciones pausadas (por defecto)
filas = mergeTeam(lista confirmada, creaciones pendientes, ediciones pendientes)
```

## Decisiones técnicas
- Indicador "pendiente" con useMutationState en vez de escribir en la caché
  (setQueryData). Alternativa descartada: actualización optimista; al reabrir
  la app onMutate no se vuelve a ejecutar y hay que deshacerla a mano si falla.
- expo-network en vez de @react-native-community/netinfo (decisión 1).
- No se llama a invalidateQueries() global tras reanudar: cada mutación ya
  invalida lo suyo y el catálogo respeta su staleTime de 1 h.

## Estrategia de pruebas (Jest)
team.test.ts ("Spec 005"): mezcla de pendientes. queryKeys.test.ts: gcTime >=
maxAge. logger.test.ts: hora con ms, orden y límite.
