# Plan 003 — Agregar un guerrero a mi equipo

## Archivos y responsabilidades
| Archivo | Responsabilidad | RF |
|---|---|---|
| src/domain/team.ts | validateMemberForm, parseTeamMember, isInTeam | RF-03, RF-04 |
| src/api/mockApi.ts | createTeamMember (POST /team) | RF-02 |
| src/config.ts | URL del proyecto de MockAPI | RF-02 |
| src/query/queryKeys.ts | mutationKeys.team.create, queryKeys.team.list | RF-02, RF-05 |
| src/query/queryClient.ts | setMutationDefaults(create): mutationFn, logs, onSettled → invalidar ['team', 'list'] | RF-02, RF-05 |
| src/components/MemberForm.tsx, SphereRating.tsx | Formulario y esferas | RF-01, RF-03 |
| src/app/personaje/[id].tsx | Formulario o "Ya está en tu equipo" | RF-01, RF-04 |

## Invalidación
Crear → `['team', 'list']`: aparece un registro nuevo en la lista. No se toca
`['characters']` (la API pública no cambia) ni detalles de otros registros.

## Decisiones técnicas
- La mutationFn vive en setMutationDefaults y useMutation solo pasa la
  mutationKey. Alternativa descartada: mutationFn dentro del componente; una
  mutación restaurada tras cerrar la app no tendría función (spec 005).
- onSettled devuelve la promesa de invalidateQueries: la marca de pendiente
  dura hasta que llega la lista nueva.

## Estrategia de pruebas (Jest)
team.test.ts: formulario (bordes de nota y esferas), lectura de MockAPI,
isInTeam con confirmados y pendientes.
