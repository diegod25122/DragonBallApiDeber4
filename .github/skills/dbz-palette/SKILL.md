---
name: dbz-palette
description: Úsala siempre que crees o modifiques colores, estilos, componentes o pantallas del Equipo Z. Define la paleta tomada del logo de Dragon Ball Z, sus reglas de contraste y el estilo manga oscuro de la app.
---

# Paleta Dragon Ball Z del Equipo Z

Fuente: los 5 colores del logo de Dragon Ball Z (color.adobe.com), entregados
por el desarrollador. Uso didáctico: no es material oficial de la serie.

| Token | Hex | Nombre | Uso |
|---|---|---|---|
| `Colors.red` | #D90718 | Rojo Z | Sombras duras de paneles, sellos, franjas, errores sobre claro |
| `Colors.maroon` | #73030D | Granate | Encabezados, franja de las cartas, fondo del héroe |
| `Colors.gold` | #F2B705 | Oro | Títulos, botón principal, esferas, acentos |
| `Colors.orange` | #F28705 | Naranja | Esferas del dragón, acentos y enlaces sobre oscuro |
| `Colors.black` | #0D0D0D | Negro | Fondo de la app y tinta (bordes, texto sobre claro) |

Neutros de apoyo (no son del logo; existen solo para que el texto se lea):
`paper` #FFF6E0 (interior de cartas y formularios), `surface` #1C1414 (paneles
oscuros), `muted` #C9BBA8 (texto secundario sobre oscuro), `inkSoft` #5A3A2E
(texto secundario sobre paper), `white` #FFFFFF.

## Combinaciones permitidas (texto / fondo — contraste)
- Oro sobre negro 10.69 · sobre surface 9.96 · sobre granate 6.61
- Blanco sobre negro 19.44 · sobre granate 12.02 · sobre rojo 5.26
- Negro sobre oro 10.69 · sobre naranja 7.63 · sobre paper 18.06
- Naranja sobre negro 7.63 · sobre surface 7.11
- Granate sobre paper 11.16 · sobre oro 6.61
- Rojo sobre paper 4.89 (solo errores y sellos)
- Muted sobre surface 9.62 · sobre granate 6.38 · inkSoft sobre paper 9.38

## Prohibido (no llegan a 4.5:1)
- Rojo sobre negro (3.7) → en oscuro los errores van en naranja u oro.
- Negro sobre rojo (3.7).
- Blanco sobre naranja (2.55) y oro sobre rojo (2.89).
- Rojo sobre granate (2.29).

## Estilo (restricción D1: nada de diseño genérico)
- Tema oscuro, como el logo sobre negro: fondo `black`, encabezados `maroon`.
- Títulos en Bangers (`Fonts.display`) dorados con contorno negro duro
  (`Type.outline`), como las letras del logo. Con fuente propia no se usa
  fontWeight ni fontStyle.
- Viñetas `Panel`: borde de tinta 3 px + sombra dura desplazada 5 px (roja
  por defecto, dorada si el guerrero está en mi equipo). Nada de sombras
  difusas ni gradientes.
- Efectos de `src/components/manga/Effects.tsx`: líneas de velocidad doradas
  en el encabezado, trama naranja sobre granate, líneas de concentración
  detrás del guerrero, kanji de fondo (戦士, 仲間, 気, 記録) y esferas.
- Cartas: franja granate con trama y el guerrero saliéndose del marco (nada
  encima de él); cuerpo `paper` con el nombre, su número "#01" pequeño a la
  derecha y la lectura de ki en franja negra.
- Buscador tipo rastreador (scouter): campo `surface` con borde oro.
- Pendiente = sello rojo torcido sobre `paper` + borde punteado.
- Botón principal oro con texto negro; secundario `surface` con borde y texto oro.
- Encabezado del catálogo: solo "Mi equipo". "Logs" va únicamente en Mi equipo
  (evidencia del video, protocolo P5).

## Reglas
- Los valores viven solo en `src/constants/theme.ts`. Ningún `#hex` ni
  `rgba(...)` suelto en `src/app/` o `src/components/`.
- El estado (pendiente, sin conexión) se dice con texto, no solo con color.
- Usa solo colores de esta lista. Si falta uno, pregunta.

## Checklist de revisión
- [ ] `grep -rnE "rgba\(|'#[0-9A-Fa-f]{3,6}'" src/app src/components` no devuelve nada
- [ ] Ningún par de "Prohibido" aparece en pantalla
- [ ] Todo texto sobre oscuro es blanco, oro, naranja o muted
- [ ] Nada tapa al guerrero en las cartas
- [ ] Pendiente y sin conexión se entienden sin ver el color

## Al terminar
Indica qué puntos del checklist has comprobado y cómo.