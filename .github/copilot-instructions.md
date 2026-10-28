# Equipo Z

App móvil que muestra el catálogo de guerreros de la Dragon Ball API (pública,
solo lectura) y deja armar "Mi equipo" con notas y valoración en esferas,
guardado en MockAPI. Funciona sin conexión: la caché se persiste y las
mutaciones hechas sin red se envían solas al volver. Proyecto didáctico
construido con Spec-Driven Development (SDD) — Deber 4.

## Stack y estructura
- Expo SDK 57, TypeScript estricto y Expo Router.
- TanStack Query v5 con PersistQueryClientProvider,
  @tanstack/query-async-storage-persister y AsyncStorage.
- expo-network para onlineManager. expo-image para imágenes con caché en disco.
- expo-font + @expo-google-fonts/bangers: letra de cómic del estilo manga.
- src/domain/: lógica pura (sin React ni red). src/api/: fetch a la Dragon
  Ball API y a MockAPI. src/query/: queryKeys, queryClient, persister, red y
  hooks. src/components/: piezas de interfaz. src/app/: pantallas. src/utils/:
  logger con hora. Pruebas en __tests__/ junto a cada módulo.

## Comandos
- Pruebas: npx jest
- Tipos: npx tsc --noEmit
- Ejecutar la app: npx expo start (solo cuando yo lo pida)
- APK: eas build -p android --profile preview (solo cuando yo lo pida)

## Dónde está cada cosa
- docs/constitution.md: principios del proyecto.
- docs/deber-4.md: requisitos del deber (la entrada de todo; no hay historias de usuario).
- specs/NNN-nombre/: decisiones.md, spec.md, plan.md y tasks.md.
- MEMORY.md: estado actual del trabajo.
- .github/skills/: método SDD, reglas de TanStack Query, paleta del logo de DBZ (dbz-palette) y
  convenciones RN.
- src/query/queryKeys.ts: ÚNICO lugar donde se escriben claves de consulta y
  de mutación.
- src/config.ts: URL de MockAPI.

## Cómo trabajar
1. Al empezar, lee MEMORY.md y docs/constitution.md.
2. Código y nombres en inglés; textos de interfaz, comentarios y documentos en español.
3. No tomes decisiones de producto o de diseño que la historia o decisiones.md
   no definan. Márcalas como [NECESITA ACLARACIÓN] y avísame.
4. Haz solo la fase o la tarea que te pido. No avances a la siguiente.
5. En la lógica, escribe primero las pruebas.
6. Pregunta antes de instalar dependencias, crear archivos fuera del plan o
   cambiar el formato de los datos guardados o de la caché.
7. No reemplaces archivos existentes si la tarea no lo pide. No guardes datos
   sensibles. No hagas commit.

## MEMORY.md
Solo tiene "Estado actual" y "Próximos pasos". Al terminar una fase o tarea
actualiza únicamente esas dos secciones. No copies decisiones ni contenido de
la spec. Mantenlo en unas 50 líneas.
