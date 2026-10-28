export const queryKeys = {
  characters: {
    all: ['characters'] as const,
    lists: () => [...queryKeys.characters.all, 'list'] as const,
    list: (page: number) => [...queryKeys.characters.lists(), { page }] as const,
    roster: () => [...queryKeys.characters.lists(), 'all'] as const,
    details: () => [...queryKeys.characters.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.characters.details(), id] as const,
  },
  team: {
    all: ['team'] as const,
    list: () => [...queryKeys.team.all, 'list'] as const,
    details: () => [...queryKeys.team.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.team.details(), id] as const,
  },
} as const;

export const mutationKeys = {
  team: {
    create: () => ['team', 'create'] as const,
    update: () => ['team', 'update'] as const,
  },
} as const;
