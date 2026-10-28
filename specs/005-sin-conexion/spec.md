# Spec 005 — Usar la app sin conexión

Estado: aprobada
Fuente: docs/deber-4.md (R3, R4, R5, P1–P6)

## Contexto y objetivo
Persistencia de la caché y mutaciones sin conexión (requisitos 4 y 5 del deber).

## Usuarios
Fan de Dragon Ball.

## Requisitos del deber que cubre
- R3: gcTime >= maxAge del persister.
- R4: PersistQueryClientProvider con AsyncStorage.
- R5.1 a R5.4: onlineManager, setMutationDefaults, resumePausedMutations y pendientes en pantalla.
- P1–P6: protocolo del video con logs con hora.

## Definiciones
- Pendiente: creación o edición que MockAPI todavía no confirmó (sin red o en camino).

## Requisitos funcionales
- RF-01: MIENTRAS no hay conexión, EL SISTEMA muestra "Sin conexión" y sigue mostrando lo guardado. Origen: R5.1, decisión 1.
- RF-02: CUANDO el usuario crea o edita sin conexión, EL SISTEMA guarda el cambio como pendiente sin perderlo. Origen: R5.4, P2.
- RF-03: MIENTRAS haya cambios pendientes, EL SISTEMA los muestra en Mi equipo con su marca y cuenta cuántos faltan. Origen: R5.4, P2, decisión 2.
- RF-04: CUANDO se abre la app con cambios pendientes guardados y hay conexión, EL SISTEMA los envía solos a MockAPI. Origen: R5.3, P3–P5.
- RF-05: CUANDO se abre la app, EL SISTEMA muestra lo guardado (de hasta 24 h) antes de que termine el GET. Origen: R4, P5, decisión 3.
- RF-06: EL SISTEMA registra con hora (ms) la restauración de lo guardado, los cambios de red, cada GET/POST/PUT y cada confirmación, y los muestra en "Registro". Origen: P5, decisión 4.

## Requisitos no funcionales
- RNF-01: Ninguna consulta se borra de memoria antes de que venza lo guardado (gcTime >= maxAge).

## Casos límite
- Dos ediciones sin red del mismo registro: se envían en orden; se ve la última.
- Una creación pendiente que ya llegó a MockAPI antes de refrescar: no se duplica.

## Fuera de alcance
- Resolver conflictos si otro dispositivo editó el mismo registro.

## Criterios de finalización
RF-03, RF-06 y RNF-01 por Jest; RF-01, RF-02, RF-04 y RF-05 por la lista manual en el APK.

## Dudas abiertas
(ninguna)
