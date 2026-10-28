import type { CharacterSummary } from './characters';

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const NAME_ALIASES: Record<string, string> = {
  frieza: 'freezer',
  freeza: 'freezer',
  friza: 'freezer',
  cell: 'celula',
  'android 17': 'androide 17',
  'android 18': 'androide 18',
  android: 'androide',
  tien: 'tenshinhan',
  tenshin: 'tenshinhan',
  krilin: 'krillin',
  hercule: 'mr satan',
  satan: 'mr satan',
  buu: 'majin buu',
  boo: 'majin buu',
  'majin boo': 'majin buu',
  milk: 'chi chi',
  chichi: 'chi chi',
};

export function editDistance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return prev[b.length];
}

function score(character: CharacterSummary, query: string): number | null {
  const name = normalize(character.name);
  if (name.startsWith(query)) return 0;
  const words = name.split(' ');
  if (words.some((w) => w.startsWith(query))) return 1;
  if (name.includes(query)) return 2;
  if (query.length >= 4) {
    const tolerance = query.length >= 7 ? 2 : 1;
    const close = [name, ...words].some((w) => editDistance(w, query) <= tolerance);
    if (close) return 3;
  }
  if (normalize(character.race).includes(query) || normalize(character.affiliation).includes(query)) return 4;
  return null;
}

export interface SearchOptions {
  race?: string | null;
}

export function searchCharacters(
  characters: CharacterSummary[],
  rawQuery: string,
  { race = null }: SearchOptions = {},
): CharacterSummary[] {
  const query = normalize(rawQuery);
  const pool = race ? characters.filter((c) => c.race === race) : characters;
  if (query === '') return [...pool].sort((a, b) => a.id - b.id);

  const queries = [query];
  const alias = NAME_ALIASES[query];
  if (alias) queries.push(alias);

  const best = new Map<number, { character: CharacterSummary; score: number }>();
  for (const character of pool) {
    for (const q of queries) {
      const s = score(character, q);
      if (s === null) continue;
      const current = best.get(character.id);
      if (!current || s < current.score) best.set(character.id, { character, score: s });
    }
  }
  return [...best.values()]
    .sort((a, b) => a.score - b.score || a.character.id - b.character.id)
    .map((entry) => entry.character);
}

export function raceOptions(characters: CharacterSummary[]): string[] {
  const counts = new Map<string, number>();
  for (const c of characters) {
    if (c.race === 'Desconocido') continue;
    counts.set(c.race, (counts.get(c.race) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([race]) => race);
}

export function mergePages(pages: (CharacterSummary[] | undefined)[]): CharacterSummary[] {
  const byId = new Map<number, CharacterSummary>();
  for (const items of pages) for (const c of items ?? []) byId.set(c.id, c);
  return [...byId.values()].sort((a, b) => a.id - b.id);
}
