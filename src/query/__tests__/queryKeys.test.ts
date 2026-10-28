import { CACHE_TIMES, gcTimeCoversMaxAge, HOUR, PERSIST_MAX_AGE } from '../../domain/cacheTimes';
import { mutationKeys, queryKeys } from '../queryKeys';

function isPrefix(prefix: readonly unknown[], key: readonly unknown[]): boolean {
  return prefix.every((part, i) => JSON.stringify(part) === JSON.stringify(key[i]));
}

describe('jerarquía de queryKeys', () => {
  it('lista y detalle cuelgan de su raíz', () => {
    expect(queryKeys.characters.list(2)).toEqual(['characters', 'list', { page: 2 }]);
    expect(queryKeys.characters.detail(7)).toEqual(['characters', 'detail', 7]);
    expect(queryKeys.characters.roster()).toEqual(['characters', 'list', 'all']);
    expect(queryKeys.team.list()).toEqual(['team', 'list']);
    expect(queryKeys.team.detail('3')).toEqual(['team', 'detail', '3']);
  });

  it('invalidar la lista del equipo no toca el catálogo ni los detalles', () => {
    const invalidated = queryKeys.team.list();
    expect(isPrefix(invalidated, queryKeys.team.list())).toBe(true);
    expect(isPrefix(invalidated, queryKeys.team.detail('3'))).toBe(false);
    expect(isPrefix(invalidated, queryKeys.characters.list(1))).toBe(false);
  });

  it('la raíz de personajes cubre todas sus páginas y detalles', () => {
    expect(isPrefix(queryKeys.characters.all, queryKeys.characters.list(5))).toBe(true);
    expect(isPrefix(queryKeys.characters.lists(), queryKeys.characters.list(5))).toBe(true);
    expect(isPrefix(queryKeys.characters.lists(), queryKeys.characters.detail(5))).toBe(false);
    expect(isPrefix(queryKeys.characters.lists(), queryKeys.characters.roster())).toBe(true);
  });

  it('las claves de mutación son distintas entre sí', () => {
    expect(mutationKeys.team.create()).not.toEqual(mutationKeys.team.update());
  });
});

describe('staleTime y gcTime', () => {
  it('la API pública y MockAPI tienen valores distintos', () => {
    expect(CACHE_TIMES.publicApi.staleTime).not.toBe(CACHE_TIMES.mockApi.staleTime);
    expect(CACHE_TIMES.publicApi.gcTime).not.toBe(CACHE_TIMES.mockApi.gcTime);
  });

  it('gcTime de ambas fuentes es >= maxAge del persister', () => {
    expect(gcTimeCoversMaxAge(CACHE_TIMES.publicApi)).toBe(true);
    expect(gcTimeCoversMaxAge(CACHE_TIMES.mockApi)).toBe(true);
    expect(gcTimeCoversMaxAge({ staleTime: 0, gcTime: PERSIST_MAX_AGE - 1 })).toBe(false);
  });

  it('staleTime nunca supera a gcTime', () => {
    expect(CACHE_TIMES.publicApi.staleTime).toBeLessThan(CACHE_TIMES.publicApi.gcTime);
    expect(CACHE_TIMES.mockApi.staleTime).toBeLessThan(CACHE_TIMES.mockApi.gcTime);
    expect(PERSIST_MAX_AGE).toBe(24 * HOUR);
  });
});
