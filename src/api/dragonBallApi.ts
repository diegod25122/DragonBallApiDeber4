import { DRAGON_BALL_BASE_URL, PAGE_SIZE } from '@/config';
import { parseCharacterDetail, parseCharacterPage, type CharacterDetail, type CharacterPage } from '@/domain/characters';

import { requestJson } from './http';

export async function fetchCharacterPage(page: number, signal?: AbortSignal): Promise<CharacterPage> {
  const path = `/characters?page=${page}&limit=${PAGE_SIZE}`;
  const json = await requestJson(`${DRAGON_BALL_BASE_URL}${path}`, { signal, label: `Dragon Ball ${path}` });
  return parseCharacterPage(json, page);
}

const ROSTER_LIMIT = 100;
const MAX_ROSTER_PAGES = 5;

export async function fetchAllCharacters(signal?: AbortSignal): Promise<CharacterPage> {
  const items: CharacterPage['items'] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const path = `/characters?page=${page}&limit=${ROSTER_LIMIT}`;
    const json = await requestJson(`${DRAGON_BALL_BASE_URL}${path}`, { signal, label: `Dragon Ball ${path}` });
    const parsed = parseCharacterPage(json, page);
    items.push(...parsed.items);
    totalPages = parsed.totalPages;
    page += 1;
  } while (page <= totalPages && page <= MAX_ROSTER_PAGES);
  return { items, page: 1, totalPages: 1, totalItems: items.length };
}

export async function fetchCharacter(id: number, signal?: AbortSignal): Promise<CharacterDetail> {
  const path = `/characters/${id}`;
  const json = await requestJson(`${DRAGON_BALL_BASE_URL}${path}`, { signal, label: `Dragon Ball ${path}` });
  return parseCharacterDetail(json);
}
