# Plan 002 — Detalle de un guerrero

## Archivos y responsabilidades
| Archivo | Responsabilidad | RF |
|---|---|---|
| src/domain/characters.ts | parseCharacterDetail | RF-01 |
| src/api/dragonBallApi.ts | fetchCharacter(id) | RF-01 |
| src/query/hooks.ts | useCharacter con placeholderData desde ['characters', 'list'] | RF-02 |
| src/app/personaje/[id].tsx | Ficha, estados y carrusel de transformaciones | RF-01..03 |

## Decisiones técnicas
- placeholderData buscando en las páginas guardadas (getQueriesData por
  prefijo ['characters', 'list']). Alternativa descartada: initialData, que
  se guardaría como si fuera el detalle real y bloquearía el GET por 1 h.
- expo-image con cachePolicy "memory-disk". Alternativa descartada: Image de
  React Native, que no garantiza caché en disco.

## Estrategia de pruebas (Jest)
characters.test.ts ("Spec 002"): ficha completa, sin planeta ni transformaciones,
sin id.
