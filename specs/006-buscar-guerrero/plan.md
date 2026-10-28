# Plan 006 — Buscar guerreros por nombre

## Archivos y responsabilidades
| Archivo | Responsabilidad | RF |
|---|---|---|
| src/domain/search.ts | normalize, NAME_ALIASES, editDistance, searchCharacters, raceOptions, mergePages | RF-01..08 |
| src/api/dragonBallApi.ts | fetchAllCharacters (`?limit=100`, recorre páginas por si acaso) | RNF-01 |
| src/query/queryKeys.ts | queryKeys.characters.roster() = ['characters', 'list', 'all'] | RNF-01 |
| src/query/hooks.ts | useRoster, useCharacterSearch (con respaldo en páginas guardadas) | RF-08 |
| src/components/SearchBar.tsx | Campo tipo rastreador y chips de raza | RF-02, RF-07 |
| src/app/index.tsx | Modo búsqueda / modo páginas | RF-06, RF-09 |

## Algoritmo (pseudocódigo)
```
q ← normalize(texto); consultas ← [q] + alias(q)
para cada guerrero (filtrado por raza):
    puntaje ← 0 empieza · 1 palabra empieza · 2 contiene · 3 casi igual · 4 raza/afiliación
ordenar por puntaje y luego por id
```

## Decisiones técnicas
- Búsqueda local sobre la lista en caché. Alternativa descartada: `?name=` de
  la API (red en cada letra, nombre exacto, no funciona sin conexión).
- La lista completa guarda la misma forma que una página (CharacterPage): el
  placeholder del detalle (spec 002) también la aprovecha.
- Distancia de edición propia (20 líneas). Alternativa descartada: librería
  de búsqueda difusa (dependencia nueva para 60 elementos).

## Estrategia de pruebas (Jest)
search.test.ts: normalizar, "freezer", mayúsculas/tildes, búsqueda parcial,
alias, errores de tipeo, umbral de 3 letras, raza/afiliación, sin resultados,
filtro de raza, unir páginas. queryKeys.test.ts: clave de la lista completa.
