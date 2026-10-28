# Constitución — Equipo Z

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. Simplicidad primero: no se añaden dependencias nuevas sin aprobación.
2. La spec manda: nada se implementa si no está en la spec activa. Si falta
   una decisión, se para y se pregunta.
3. Lógica separada de interfaz: leer el JSON de las APIs, validar formularios
   y mezclar lo confirmado con lo pendiente son funciones puras en src/domain.
4. Pruebas como puerta: la lógica se prueba con Jest. Prohibido avanzar con
   pruebas en rojo. La interfaz y el modo sin conexión se verifican con la
   lista manual de la tarea.
5. Lo del usuario no se pierde: un cambio hecho sin red se guarda, se marca
   como pendiente y se envía solo al volver, aunque se cierre la app. Toda
   clave de caché sale de queryKeys.ts y toda mutación invalida lo que afecta.
6. La API pública es de solo lectura y no es nuestra: se le pide lo mínimo
   (staleTime largo) y nunca se le escribe. Lo propio va a MockAPI.
