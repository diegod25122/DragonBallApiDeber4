---
name: rn-conventions
description: Úsala siempre que crees o modifiques pantallas, formularios o componentes de interfaz del Equipo Z.
---

# Convenciones de interfaz en React Native

- Estilos con StyleSheet. Sin librerías de interfaz adicionales.
- Colores y estilo según la skill dbz-palette.
- Imágenes con expo-image y cachePolicy="memory-disk" (se ven sin red).
- Listas con FlatList y clave estable (id del personaje o key de TeamRow,
  nunca el índice).
- Cada pantalla con datos remotos cubre: cargando sin datos, error sin datos
  (con "Reintentar"), datos (con indicador "Actualizando…" si hay GET en curso).
- El botón de guardar no se desactiva: al tocarlo se valida, se marca el error
  debajo de cada campo. La validación vive en src/domain.
- Los formularios no quedan tapados por el teclado: KeyboardAvoidingView
  ('padding' en iOS, 'height' en Android) y ScrollView con
  keyboardShouldPersistTaps="handled".
- Respeta las áreas seguras con react-native-safe-area-context.
- Objetivos táctiles de al menos 44-48 puntos y etiquetas de accesibilidad.
- Todos los textos visibles en español.

## Lista manual de verificación (APK)
- [ ] Con red: el catálogo carga, se pasa de página y el detalle muestra
      planeta y transformaciones.
- [ ] Agregar un guerrero con nota y esferas: aparece en Mi equipo y en el
      panel de MockAPI.
- [ ] Editar la nota: cambia en Mi equipo y en MockAPI.
- [ ] Modo avión: aparece el aviso "Sin conexión"; el catálogo y Mi equipo
      se ven desde la caché (con imágenes).
- [ ] Modo avión: agregar un guerrero → aparece con "Pendiente · por crear".
- [ ] Cerrar la app desde recientes, quitar el modo avión y abrir: la lista
      aparece de inmediato y en Logs se ve "Caché restaurada", el POST y
      "confirmada por MockAPI", con sus horas.
- [ ] El registro aparece en el panel de MockAPI.
- [ ] Buscar "free" muestra a Freezer al instante; "vejeta" muestra a Vegeta.
- [ ] En modo avión la búsqueda sigue funcionando.
- [ ] El teclado no tapa la nota ni el botón.
