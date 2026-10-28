# Spec 006 — Buscar guerreros por nombre

Estado: aprobada
Fuente: docs/deber-4.md (F1, R1) · mejora pedida por el desarrollador

## Contexto y objetivo
Encontrar a un guerrero escribiendo su nombre, sin recorrer las páginas.

## Usuarios
Fan de Dragon Ball.

## Requisitos del deber que cubre
- F1: consumir la API pública de solo lectura.
- R1: la lista completa usa una clave de la jerarquía de lista.

## Requisitos funcionales
- RF-01: CUANDO el usuario escribe un nombre, EL SISTEMA muestra los guerreros que coinciden sin importar mayúsculas, tildes ni espacios. Origen: decisión 3.
- RF-02: MIENTRAS el usuario escribe, EL SISTEMA actualiza los resultados en cada letra, buscando por el inicio y por partes del nombre. Origen: decisiones 1 y 3.
- RF-03: SI el usuario escribe un nombre de otro doblaje, ENTONCES EL SISTEMA muestra al guerrero como lo nombra la API. Origen: decisión 4.
- RF-04: SI el usuario comete un error de tipeo en un texto de 4 letras o más, ENTONCES EL SISTEMA igual muestra al guerrero. Origen: decisión 3.
- RF-05: EL SISTEMA también encuentra por raza o afiliación, después de las coincidencias por nombre. Origen: decisión 3.
- RF-06: SI nada coincide, ENTONCES EL SISTEMA muestra "Ningún guerrero se llama así" y "Limpiar búsqueda". Origen: decisión 3.
- RF-07: CUANDO el usuario toca un chip de raza, EL SISTEMA filtra por esa raza y lo combina con el texto. Origen: decisión 5.
- RF-08: MIENTRAS no hay red y la lista completa no se descargó, EL SISTEMA busca en las páginas guardadas y lo indica. Origen: decisión 7.
- RF-09: MIENTRAS no hay texto ni filtro, EL SISTEMA muestra el catálogo por páginas. Origen: decisión 6.

## Requisitos no funcionales
- RNF-01: Buscar no hace peticiones a la red por cada letra.

## Casos límite
- Texto con solo espacios: se trata como vacío.
- 3 letras o menos: no se adivinan errores de tipeo.

## Fuera de alcance
- Ordenar por ki.

## Criterios de finalización
RF-01 a RF-08 por Jest; RF-09 y RNF-01 por la lista manual.

## Dudas abiertas
(ninguna)
