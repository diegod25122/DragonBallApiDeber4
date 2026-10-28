# Spec 003 — Agregar un guerrero a mi equipo

Estado: aprobada
Fuente: docs/deber-4.md (F2, R1, R2)

## Contexto y objetivo
Primera mutación del deber: crear un registro propio en MockAPI.

## Usuarios
Fan de Dragon Ball.

## Requisitos del deber que cubre
- F2: datos propios del usuario en MockAPI.
- R1: clave de datos propios.
- R2: mutación de creación con mutationKey e invalidación.

## Requisitos funcionales
- RF-01: MIENTRAS el guerrero no está en mi equipo, EL SISTEMA muestra al final de su ficha un formulario con nota y de 1 a 7 esferas (4 por defecto). Origen: R2 (creación), decisión 2.
- RF-02: CUANDO el usuario toca "Agregar a mi equipo" con datos válidos, EL SISTEMA crea el registro en MockAPI, abre Mi equipo y lo muestra. Origen: R2 (creación), decisiones 1 y 5.
- RF-03: SI la nota está vacía o pasa de 140 caracteres, o las esferas no están entre 1 y 7, ENTONCES EL SISTEMA no guarda y muestra el error debajo del campo. Origen: R2, decisión 3.
- RF-04: SI el guerrero ya está en mi equipo (confirmado o pendiente), ENTONCES EL SISTEMA no muestra el formulario y ofrece "Ver mi equipo". Origen: F2, decisión 4.
- RF-05: CUANDO MockAPI confirma o rechaza la creación, EL SISTEMA vuelve a pedir la lista de mi equipo. Origen: decisión 1.

## Requisitos no funcionales
- RNF-01: El registro creado se ve en el panel de MockAPI.

## Casos límite
- Nota de exactamente 140 caracteres: válida. Nota con solo espacios: inválida.

## Fuera de alcance
- Borrar registros.

## Criterios de finalización
RF-03 y RF-04 por Jest; el resto por la lista manual.

## Dudas abiertas
(ninguna)
