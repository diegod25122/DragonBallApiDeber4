# Decisiones — 005-sin-conexion (docs/deber-4.md: R3, R4, R5, P1–P6)

1. **¿Cómo se detecta la red?**
   Respuesta: expo-network alimenta el onlineManager de TanStack. Hay red si
   está conectado y internet no es explícitamente inalcanzable.
   Motivo: es paquete de Expo (funciona en Expo Go y en el APK sin
   configuración nativa extra).

2. **¿Cómo se muestran los pendientes?**
   Respuesta: con indicador, no con actualización optimista en la caché: la
   tarjeta lleva "Pendiente · por crear" o "Pendiente · por editar" y borde
   punteado dorado. Arriba, un aviso con cuántos cambios faltan.
   Motivo: se lee desde el estado de las mutaciones (useMutationState), que
   también se restaura al reabrir la app.

3. **¿Cuánto dura lo guardado?**
   Respuesta: 24 horas (maxAge del persister).
   Motivo: un día cubre quedarse sin datos un rato; más tiempo mostraría
   datos muy viejos.

4. **¿Cómo se demuestra en el video?**
   Respuesta: una pantalla "Registro" con los logs con hora (ms) y los mismos
   logs en consola (adb logcat).
   Motivo: el protocolo pide logs con hora visibles.
