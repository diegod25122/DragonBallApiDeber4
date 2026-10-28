# Decisiones — 004-editar-miembro (docs/deber-4.md: F2, R1, R2)

1. **¿Qué se puede editar?**
   Respuesta: la nota y las esferas. El guerrero no se cambia.
   Motivo: cambiar de guerrero es otro registro.

2. **¿Cómo se envía?**
   Respuesta: PUT /team/{id} con note, rating y updatedAt.
   Motivo: MockAPI acepta PUT parcial y devuelve el registro actualizado.

3. **¿Se puede editar un registro que se creó sin red y sigue pendiente?**
   Respuesta: no. Su tarjeta no se puede tocar hasta que MockAPI lo confirme.
   Motivo: todavía no tiene id en MockAPI; un PUT sin id fallaría.

4. **Si edito dos veces sin red, ¿qué se ve?**
   Respuesta: la última edición, con la marca "Pendiente · por editar". El
   formulario parte de la edición pendiente.
   Motivo: el usuario ve lo último que hizo.
