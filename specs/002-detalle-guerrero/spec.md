# Spec 002 — Detalle de un guerrero

Estado: aprobada
Fuente: docs/deber-4.md (F1, R1)

## Contexto y objetivo
Mostrar la ficha completa de un guerrero (clave de detalle por id).

## Usuarios
Fan de Dragon Ball.

## Requisitos del deber que cubre
- F1: consumir una API pública de solo lectura.
- R1: clave de detalle por id.

## Requisitos funcionales
- RF-01: CUANDO el usuario abre un guerrero, EL SISTEMA muestra raza, género, ki, ki máximo, afiliación, descripción, planeta de origen y transformaciones. Origen: R1 (detalle por id), decisión 1.
- RF-02: MIENTRAS la ficha no ha llegado (cargando o sin conexión), EL SISTEMA muestra los datos del catálogo guardado y un aviso en lugar de la descripción. Origen: R4, decisión 2.
- RF-03: SI no hay datos del catálogo ni de la ficha y la API falla, ENTONCES EL SISTEMA muestra un mensaje y "Reintentar". Origen: R4.

## Requisitos no funcionales
- RNF-01: Las imágenes vistas se ven sin conexión.

## Casos límite
- Sin planeta o sin transformaciones: esas secciones no se muestran.
- Transformación sin id: se descarta.

## Fuera de alcance
- Detalle de planetas.

## Criterios de finalización
RF-01 por Jest; RF-02, RF-03 y RNF-01 por la lista manual.

## Dudas abiertas
(ninguna)
