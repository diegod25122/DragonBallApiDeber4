---
name: dragonball-brand
description: Úsala siempre que crees o modifiques colores, estilos, componentes o pantallas del Equipo Z.
---

# Paleta y estilo Dragon Ball del Equipo Z

Inspirada en el gi de Goku (naranja y azul) y en las esferas del dragón
(dorado con estrellas rojas). El dorado #FAC02D es el color de marca del sitio
de la Dragon Ball API. Uso didáctico: no es material oficial de la serie.

## Roles (fondo, texto y contraste)
- Encabezado: fondo #17325C (azul cinturón), título #FFFFFF (12.75:1),
  subtítulo #FAC02D (7.68:1). Franja inferior #F47C20.
- Botón principal: fondo #F47C20, texto #1A1A1A (6.42:1), borde inferior #17325C.
- Botón secundario: fondo #FFFFFF, borde y texto #17325C (12.75:1).
- Pendiente / sincronizando: fondo #FAC02D, texto #17325C (7.68:1).
- Sin conexión: fondo #17325C, texto #FAC02D (7.68:1).
- Error: borde y texto #D62828 (sobre blanco 5.01:1).
- Fondo de pantalla: #FFF7EC con texto #1A1A1A (16.38:1) o #5B4A3A (7.95:1).
- Texto de acción sobre el fondo: #C2410C (4.87:1).
- Tarjetas: #FFFFFF con borde #E9DCC9. #E9DCC9 nunca como texto.

## Prohibido (no cumplen 4.5:1)
- Blanco sobre #F47C20 (2.71:1).
- #E9DCC9 como texto (1.35:1 sobre blanco).

## Rasgos que evitan el "diseño genérico de IA"
- Títulos en cursiva gruesa (Type.hero / Type.title).
- Los personajes salen de una "esfera" dorada con borde naranja.
- La valoración es de 1 a 7 esferas con sus estrellas, no estrellas genéricas.
- Pendientes con borde punteado dorado y etiqueta "Pendiente · por crear/editar".
- Nada de gradientes morados, glassmorphism ni íconos genéricos.

## Reglas
- Los valores viven en src/constants/theme.ts. Ningún `#hex` ni `rgba(...)`
  suelto en src/app/ o src/components/.
- El estado (pendiente, sin conexión) se dice con texto, no solo con color.
- Usa solo colores de esta lista. Si falta uno, pregunta.

## Checklist de revisión
- [ ] `grep -rnE "rgba\(|'#[0-9A-Fa-f]{3,6}'" src/app src/components` no devuelve nada
- [ ] Ningún par de "Prohibido" aparece en pantalla
- [ ] Pendiente y sin conexión se entienden sin ver el color

## Al terminar
Indica qué puntos del checklist has comprobado y cómo.
