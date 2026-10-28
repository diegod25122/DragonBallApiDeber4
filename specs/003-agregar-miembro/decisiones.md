# Decisiones — 003-agregar-miembro (docs/deber-4.md: F2, R1, R2)

1. **¿Dónde se guardan los datos propios?**
   Respuesta: en MockAPI, recurso "team", con characterId, name, image, note,
   rating y updatedAt. Se guardan nombre e imagen para mostrar mi equipo sin
   pedir cada guerrero a la API pública.
   Motivo: el deber pide MockAPI para lo que crea el usuario.

2. **¿Qué valora el usuario?**
   Respuesta: de 1 a 7 esferas del dragón (por defecto 4).
   Motivo: es propio del tema y no parece un componente genérico.

3. **¿Qué reglas tiene la nota?**
   Respuesta: obligatoria, de 1 a 140 caracteres sin contar espacios al
   inicio y al final. Mensaje: "Escribe una nota de 1 a 140 caracteres."
   Motivo: corta como un tuit; obliga a decir por qué.

4. **¿Se puede agregar dos veces el mismo guerrero?**
   Respuesta: no. Si ya está (confirmado o pendiente), la ficha muestra "Ya
   está en tu equipo." o "Ya lo agregaste: está pendiente de enviarse a
   MockAPI." y el botón "Ver mi equipo".
   Motivo: evita duplicados, también cuando se agregó sin red.

5. **¿Qué pasa al tocar agregar?**
   Respuesta: se va a Mi equipo de inmediato; el registro aparece confirmado
   o como pendiente según la red.
   Motivo: no hace esperar al usuario, tenga o no conexión.
