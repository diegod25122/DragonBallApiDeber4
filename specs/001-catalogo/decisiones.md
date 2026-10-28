# Decisiones — 001-catalogo (docs/deber-4.md: F1, R1, R3, R4)

Entrevista con la skill grill-me. Cada decisión: pregunta, respuesta y motivo.

1. **¿Qué API pública se usa?**
   Respuesta: Dragon Ball API (https://dragonball-api.com/api), sin clave.
   Motivo: tiene lista paginada y detalle por id, que es la jerarquía que pide
   el deber; tema propio para no tener un diseño genérico.

2. **¿Cuántos guerreros por página?**
   Respuesta: 10, con botones "‹ Anterior" y "Siguiente ›".
   Motivo: son unos 60 personajes: 6 páginas se recorren rápido en el video.

3. **¿Qué datos van en cada tarjeta?**
   Respuesta: imagen, nombre, raza · afiliación y ki. Si ya está en mi equipo,
   "★ En tu equipo".
   Motivo: es lo que sirve para elegir; el resto va en el detalle.

4. **¿Cómo se sabe si los datos son de caché o recién pedidos?**
   Respuesta: arriba de la lista "Actualizando…" mientras hay un GET, o
   "Datos de las hh:mm" cuando no.
   Motivo: se ve en el video que la lista aparece antes del GET.

5. **¿Qué pasa al cambiar de página mientras carga la nueva?**
   Respuesta: se sigue viendo la página anterior hasta que llegue la nueva.
   Motivo: evita una pantalla en blanco en cada cambio.
