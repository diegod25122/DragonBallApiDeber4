export interface CharacterSummary {
  id: number;
  name: string;
  race: string;
  gender: string;
  ki: string;
  maxKi: string;
  affiliation: string;
  image: string;
}

export interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

export interface Planet {
  id: number;
  name: string;
  isDestroyed: boolean;
  image: string;
}

export interface CharacterDetail extends CharacterSummary {
  description: string;
  originPlanet: Planet | null;
  transformations: Transformation[];
}

export interface CharacterPage {
  items: CharacterSummary[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export class ApiFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiFormatError';
  }
}

const UNKNOWN = 'Desconocido';

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, fallback = UNKNOWN): string {
  if (typeof value === 'number') return String(value);
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed === '' ? fallback : trimmed;
}

function positiveInt(value: unknown): number | null {
  const n = typeof value === 'string' ? Number(value) : value;
  return typeof n === 'number' && Number.isInteger(n) && n > 0 ? n : null;
}

function parseSummary(value: unknown): CharacterSummary | null {
  if (!isObject(value)) return null;
  const id = positiveInt(value.id);
  if (id === null) return null;
  return {
    id,
    name: text(value.name, `Guerrero #${id}`),
    race: text(value.race),
    gender: text(value.gender),
    ki: text(value.ki),
    maxKi: text(value.maxKi),
    affiliation: text(value.affiliation),
    image: text(value.image, ''),
  };
}

export function parseCharacterPage(json: unknown, requestedPage: number): CharacterPage {
  if (!isObject(json) || !Array.isArray(json.items)) {
    throw new ApiFormatError('La Dragon Ball API respondió sin la lista "items".');
  }
  const items = json.items.map(parseSummary).filter((c): c is CharacterSummary => c !== null);
  const meta = isObject(json.meta) ? json.meta : {};
  const page = positiveInt(meta.currentPage) ?? requestedPage;
  const totalPages = positiveInt(meta.totalPages) ?? page;
  const totalItems = positiveInt(meta.totalItems) ?? items.length;
  return { items, page, totalPages, totalItems };
}

function parsePlanet(value: unknown): Planet | null {
  if (!isObject(value)) return null;
  const id = positiveInt(value.id);
  if (id === null) return null;
  return {
    id,
    name: text(value.name),
    isDestroyed: value.isDestroyed === true,
    image: text(value.image, ''),
  };
}

function parseTransformation(value: unknown): Transformation | null {
  if (!isObject(value)) return null;
  const id = positiveInt(value.id);
  if (id === null) return null;
  return { id, name: text(value.name), image: text(value.image, ''), ki: text(value.ki) };
}

export function parseCharacterDetail(json: unknown): CharacterDetail {
  const summary = parseSummary(json);
  if (summary === null || !isObject(json)) {
    throw new ApiFormatError('La Dragon Ball API respondió un personaje sin id.');
  }
  const transformations = Array.isArray(json.transformations)
    ? json.transformations.map(parseTransformation).filter((t): t is Transformation => t !== null)
    : [];
  return {
    ...summary,
    description: text(json.description, 'Sin descripción.'),
    originPlanet: parsePlanet(json.originPlanet),
    transformations,
  };
}

export function hasNextPage(page: CharacterPage): boolean {
  return page.page < page.totalPages;
}
