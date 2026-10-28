# Decisiones — 006-buscar-guerrero (docs/deber-4.md: F1, R1 · mejora propia)

Mejora pedida por el desarrollador: buscar solo cambiando de página es tedioso.
Entrevista con la skill grill-me.

1. **¿Dónde se busca: en la API (`?name=`) o en el celular?**
   Respuesta: en el celular. Se descarga una vez la lista completa (unos 60
   guerreros) y se filtra localmente.
   Motivo: funciona sin conexión, responde al instante y no exige escribir el
   nombre exacto.

2. **¿Qué clave usa la lista completa?**
   Respuesta: `['characters', 'list', 'all']`, debajo de `['characters', 'list']`.
   Motivo: hereda staleTime 1 h y gcTime 48 h de la API pública y se persiste
   con el resto de la caché.

3. **¿Qué cuenta como coincidencia?**
   Respuesta: sin importar mayúsculas ni tildes; primero los nombres que
   empiezan igual, luego una palabra que empieza igual, luego los que lo
   contienen, luego un error de tipeo (1 letra; 2 si se escriben 7 o más) y al
   final raza o afiliación. Con 3 letras o menos no se adivinan errores.
   Motivo: "free" debe dar Freezer y "vejeta" debe dar Vegeta, sin resultados raros.

4. **¿Y los nombres de otros doblajes?**
   Respuesta: una tabla de alias: Frieza/Freeza → Freezer, Cell → Célula,
   Tien → Tenshinhan, Krilin → Krillin, Hercule → Mr. Satan, Buu/Boo → Majin Buu,
   Milk → Chi Chi, Android → Androide.
   Motivo: la API usa nombres del doblaje latino.

5. **¿Hay filtros además del texto?**
   Respuesta: sí, chips por raza (las más comunes primero) que se combinan con
   el texto. "Todos" quita el filtro.
   Motivo: explorar por raza es lo más común después del nombre.

6. **¿Qué pasa con la paginación?**
   Respuesta: sin texto ni filtro se ve el catálogo por páginas (spec 001); al
   escribir, se ven todos los resultados juntos, sin paginar.
   Motivo: R1 sigue usando la clave de lista por página.

7. **¿Y si no hay red y nunca se bajó la lista completa?**
   Respuesta: se busca en las páginas ya guardadas y se muestra "Buscando solo
   en lo guardado".
   Motivo: algo es mejor que nada, y el usuario sabe por qué faltan guerreros.

8. **Dependencias nuevas para el estilo (constitución, principio 1).**
   Respuesta: aprobadas expo-font y @expo-google-fonts/bangers.
   Motivo: la letra de cómic es parte de la identidad visual (D1) y va dentro
   de la app, sin red.
