export const Colors = {
  red: '#D90718',
  maroon: '#73030D',
  gold: '#F2B705',
  orange: '#F28705',
  black: '#0D0D0D',

  paper: '#FFF6E0',
  surface: '#1C1414',
  muted: '#C9BBA8',
  inkSoft: '#5A3A2E',
  white: '#FFFFFF',

  speedLine: 'rgba(242, 183, 5, 0.10)',
  watermark: 'rgba(255, 255, 255, 0.08)',
  halftone: 'rgba(242, 135, 5, 0.28)',
  focusLine: 'rgba(242, 135, 5, 0.20)',
  hairline: 'rgba(255, 255, 255, 0.12)',
} as const;

export const Fonts = {
  display: 'Bangers_400Regular',
} as const;

export const Spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
} as const;

export const Radius = {
  card: 16,
  button: 14,
  pill: 999,
} as const;

export const Ink = {
  border: 3,
  shadowOffset: 5,
} as const;

export const MIN_TOUCH = 48;

export const Type = {
  hero: { fontFamily: Fonts.display, fontSize: 40, letterSpacing: 1 },
  title: { fontFamily: Fonts.display, fontSize: 26, letterSpacing: 0.5 },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  body: { fontSize: 15, lineHeight: 22 },
  outline: { textShadowColor: Colors.black, textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 },
  outlineRed: { textShadowColor: Colors.red, textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 },
} as const;
