# Plan 001 — Catálogo de guerreros

## Archivos y responsabilidades
| Archivo | Responsabilidad | RF |
|---|---|---|
| src/domain/characters.ts | parseCharacterPage, hasNextPage | RF-01, RF-02, RF-05 |
| src/api/http.ts | fetch con tiempo límite y logs | RF-04, RF-05 |
| src/api/dragonBallApi.ts | fetchCharacterPage(page) | RF-01 |
| src/query/queryKeys.ts | ['characters', 'list', { page }] | RF-01..03 |
| src/query/queryClient.ts | setQueryDefaults(['characters'], staleTime 1 h, gcTime 48 h) | RF-03, RNF-01 |
| src/query/hooks.ts | useCharacterPage con keepPreviousData; useCacheLog | RF-03, RF-07 |
| src/components/CharacterCard.tsx | Tarjeta con esfera dorada | RF-01, RF-06 |
| src/app/index.tsx | Lista, estados, paginación | RF-01..07 |

## Algoritmo (pseudocódigo)
```
parseCharacterPage(json, pagina):
    si json.items no es arreglo → ApiFormatError
    items ← json.items filtrados por id válido
    page ← meta.currentPage o pagina; totalPages ← meta.totalPages o page
```

## Decisiones técnicas
- keepPreviousData en vez de un estado de carga por página. Alternativa
  descartada: mostrar spinner en cada cambio.
- Tiempos por raíz con setQueryDefaults. Alternativa descartada: repetir
  staleTime en cada useQuery (se olvida en alguno).

## Estrategia de pruebas (Jest)
characters.test.ts ("Spec 001"): página con meta, última página, sin meta,
personajes inválidos, respuesta sin items. queryKeys.test.ts: jerarquía.
