# Spec 001 — Catálogo de guerreros

Estado: aprobada
Fuente: docs/deber-4.md (F1, R1, R3, R4)

## Contexto y objetivo
Mostrar el catálogo de la API pública por páginas y abrirlo al instante desde
lo guardado.

## Usuarios
Fan de Dragon Ball.

## Requisitos del deber que cubre
- F1: consumir una API pública de solo lectura.
- R1: clave de lista con jerarquía.
- R3: staleTime y gcTime propios de la API pública.
- R4: mostrar los datos desde la caché antes de que termine el GET.

## Requisitos funcionales
- RF-01: CUANDO se carga una página, EL SISTEMA muestra 10 guerreros con imagen, nombre, raza, afiliación y ki. Origen: F1, decisiones 2 y 3.
- RF-02: CUANDO el usuario toca "Siguiente ›" o "‹ Anterior", EL SISTEMA muestra esa página; en la primera no se puede retroceder y en la última no se puede avanzar. Origen: R1 (lista).
- RF-03: CUANDO se abre la app con el catálogo guardado, EL SISTEMA lo muestra de inmediato, antes de que termine el GET. Origen: R4.
- RF-04: MIENTRAS hay un GET en curso, EL SISTEMA muestra "Actualizando…"; si no, "Datos de las hh:mm". Origen: decisión 4.
- RF-05: SI no hay datos guardados y la API falla o no hay conexión, ENTONCES EL SISTEMA muestra un mensaje y "Reintentar". Origen: F1.
- RF-06: EL SISTEMA marca "★ En tu equipo" en los guerreros que ya están en mi equipo. Origen: decisión 3.
- RF-07: MIENTRAS llega una página nueva, EL SISTEMA sigue mostrando la anterior. Origen: decisión 5.

## Requisitos no funcionales
- RNF-01: El catálogo no se vuelve a pedir a la API más de una vez por hora si no se fuerza.

## Casos límite
- Respuesta sin "items": error de formato, se trata como error de la API.
- Guerrero sin id: se descarta. Campo vacío: "Desconocido".

## Fuera de alcance
- Búsqueda y filtros por raza.

## Criterios de finalización
RF cubiertos por Jest o por la lista manual de rn-conventions.

## Dudas abiertas
(ninguna)
