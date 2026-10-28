# Plan 004 — Editar un guerrero de mi equipo

## Archivos y responsabilidades
| Archivo | Responsabilidad | RF |
|---|---|---|
| src/api/mockApi.ts | updateTeamMember (PUT /team/{id}), fetchTeamMember | RF-02 |
| src/query/queryKeys.ts | mutationKeys.team.update, queryKeys.team.detail(id) | RF-04 |
| src/query/queryClient.ts | setMutationDefaults(update): onSettled → invalidar ['team', 'list'] y ['team', 'detail', id] | RF-04 |
| src/query/hooks.ts | useTeamMember con placeholder desde la lista; useUpdateTeamMember | RF-01 |
| src/domain/team.ts | mergeTeam: la edición más reciente gana | RF-06 |
| src/app/equipo/index.tsx | Tarjeta no tocable si está pendiente de crear | RF-05 |
| src/app/equipo/[id].tsx | Formulario de edición | RF-01..03 |

## Invalidación
Editar → `['team', 'list']` (cambian nota y esferas en la lista) y
`['team', 'detail', id]` (cambia ese registro). No `['team']` entero: los
demás detalles no cambiaron.

## Decisiones técnicas
- PUT en vez de PATCH. Alternativa descartada: PATCH, que MockAPI no expone.

## Estrategia de pruebas (Jest)
team.test.ts: validación compartida con 003 y "gana la edición más reciente".
