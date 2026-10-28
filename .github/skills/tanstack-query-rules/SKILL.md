---
name: tanstack-query-rules
description: Úsala siempre que escribas, modifiques o revises consultas, mutaciones, claves de caché, tiempos (staleTime, gcTime, maxAge), persistencia o comportamiento sin conexión del Equipo Z.
---

# Reglas de TanStack Query del Equipo Z

## Claves
- Todas las claves salen de src/query/queryKeys.ts. Prohibido escribir un
  arreglo de clave a mano en un hook o pantalla.
- Jerarquía: raíz → lista/detalle → parámetros.
  ['characters', 'list', { page }], ['characters', 'detail', id],
  ['team', 'list'], ['team', 'detail', id].
- Toda mutación tiene mutationKey (mutationKeys.team.create / update).

## Invalidación
| Mutación | Invalida | Por qué |
|---|---|---|
| Crear miembro (POST) | ['team', 'list'] | Aparece un registro nuevo en la lista. No existe todavía un detalle que refrescar. |
| Editar miembro (PUT) | ['team', 'list'] y ['team', 'detail', id] | Cambian nota y esferas en la lista y en el detalle de ese registro. |
- Nunca se invalida ['characters']: la API pública no cambia por nuestras mutaciones.
- La invalidación va en onSettled (éxito o error) y se devuelve su promesa.

## Tiempos
| Fuente | staleTime | gcTime |
|---|---|---|
| Dragon Ball API | 1 h | 48 h |
| MockAPI | 30 s | 24 h |
- maxAge del persister: 24 h. gcTime de TODA consulta debe ser >= maxAge.
- Los tiempos se aplican con setQueryDefaults por raíz de clave, no en cada hook.

## Sin conexión
- onlineManager se alimenta de expo-network (src/query/network.ts).
- Las mutationFn se registran con setMutationDefaults en queryClient.ts,
  nunca solo dentro de useMutation: una mutación restaurada de AsyncStorage
  no trae su función.
- PersistQueryClientProvider.onSuccess llama a resumePausedMutations().
- Lo pendiente se muestra con useMutationState (status 'pending') mezclado
  con la lista confirmada (mergeTeam). No se edita un registro pendiente de crear.

## Logs
- Cada GET, POST y PUT, cada cambio de red, la restauración de la caché y
  cada mutación registrada/confirmada se loguea con log() (hora con ms).

## Checklist de revisión
- [ ] ¿Ninguna clave escrita a mano fuera de queryKeys.ts?
- [ ] ¿Cada mutación tiene mutationKey y su función en setMutationDefaults?
- [ ] ¿Cada mutación invalida exactamente lo de la tabla?
- [ ] ¿gcTime >= maxAge en ambas fuentes? (prueba en queryKeys.test.ts)
- [ ] ¿Se probó: sin red → crear → cerrar app → con red → abrir → se envía sola?

## Al terminar
Indica qué puntos del checklist has comprobado y cómo.
