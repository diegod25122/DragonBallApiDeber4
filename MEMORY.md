# MEMORY.md — Equipo Z
Estado del trabajo entre sesiones. Máximo ~50 líneas.

## Estado actual
- Specs 001 a 006 aprobadas y planificadas (006 = búsqueda por nombre).
- Lógica en verde: 53 pruebas (characters, team, search, queryKeys, logger).
- Rediseño con la paleta del logo de DBZ (skill dbz-palette): tema oscuro,
  estilo manga, letra Bangers. La skill dragonball-brand fue reemplazada.
- MockAPI configurado (src/config.ts); la URL con "/" final ya se normaliza.
- Tareas de interfaz sin marcar: falta probarlas en el Honor (Expo Go SDK 57).

## Próximos pasos
- npm install y npx expo install --fix; npx jest y npx tsc --noEmit.
- Probar en Expo Go: catálogo, búsqueda ("free", "vejeta", modo avión),
  detalle, agregar y editar; marcar las tareas de interfaz.
- Generar el APK y recorrer el protocolo del video (spec 005).
