# Spec 004 — Editar un guerrero de mi equipo

Estado: aprobada
Fuente: docs/deber-4.md (F2, R1, R2)

## Contexto y objetivo
Segunda mutación del deber: editar un registro propio en MockAPI.

## Usuarios
Fan de Dragon Ball.

## Requisitos del deber que cubre
- F2: datos propios del usuario en MockAPI.
- R1: clave de detalle de datos propios.
- R2: mutación de edición con mutationKey e invalidación.

## Requisitos funcionales
- RF-01: CUANDO el usuario toca un registro confirmado de Mi equipo, EL SISTEMA abre un formulario con su nota y sus esferas. Origen: R2 (edición), decisión 1.
- RF-02: CUANDO el usuario guarda datos válidos, EL SISTEMA envía el cambio a MockAPI y vuelve a Mi equipo mostrando el cambio. Origen: R2 (edición), decisión 2.
- RF-03: SI la nota no es válida o las esferas no están entre 1 y 7, ENTONCES EL SISTEMA no guarda y marca el error. Origen: R2.
- RF-04: CUANDO MockAPI confirma o rechaza la edición, EL SISTEMA vuelve a pedir la lista y el detalle de ese registro. Origen: decisión 2.
- RF-05: MIENTRAS un registro está pendiente de crear, EL SISTEMA no permite editarlo. Origen: decisión 3.
- RF-06: SI hay varias ediciones pendientes del mismo registro, ENTONCES EL SISTEMA muestra la más reciente y el formulario parte de ella. Origen: decisión 4.

## Requisitos no funcionales
- RNF-01: El cambio se ve en el panel de MockAPI.

## Casos límite
- Edición de un registro que ya no existe en MockAPI: se ignora al mezclar.

## Fuera de alcance
- Borrar registros.

## Criterios de finalización
RF-03 y RF-06 por Jest; el resto por la lista manual.

## Dudas abiertas
(ninguna)
