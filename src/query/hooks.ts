import { keepPreviousData, onlineManager, useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

import { fetchAllCharacters, fetchCharacter, fetchCharacterPage } from '@/api/dragonBallApi';
import { fetchTeam, fetchTeamMember } from '@/api/mockApi';
import type { CharacterDetail, CharacterPage } from '@/domain/characters';
import { mergePages, raceOptions, searchCharacters } from '@/domain/search';
import {
  mergeTeam,
  type NewTeamMember,
  type PendingCreate,
  type PendingUpdate,
  type TeamMember,
  type TeamMemberUpdate,
} from '@/domain/team';
import { formatClock, log } from '@/utils/logger';

import { mutationKeys, queryKeys } from './queryKeys';

export function useCharacterPage(page: number) {
  return useQuery({
    queryKey: queryKeys.characters.list(page),
    queryFn: ({ signal }) => fetchCharacterPage(page, signal),
    placeholderData: keepPreviousData,
  });
}

export function useCharacter(id: number) {
  const queryClient = useQueryClient();
  return useQuery<CharacterDetail>({
    queryKey: queryKeys.characters.detail(id),
    queryFn: ({ signal }) => fetchCharacter(id, signal),
    enabled: Number.isInteger(id) && id > 0,
    placeholderData: (): CharacterDetail | undefined => {
      const pages = queryClient.getQueriesData<CharacterPage>({ queryKey: queryKeys.characters.lists() });
      for (const [, page] of pages) {
        const summary = page?.items?.find((c) => c.id === id);
        if (summary) return { ...summary, description: '', originPlanet: null, transformations: [] };
      }
      return undefined;
    },
  });
}

export function useRoster() {
  return useQuery<CharacterPage>({
    queryKey: queryKeys.characters.roster(),
    queryFn: ({ signal }) => fetchAllCharacters(signal),
  });
}

export function useCharacterSearch(text: string, race: string | null) {
  const roster = useRoster();
  const queryClient = useQueryClient();

  const source = useMemo(() => {
    if (roster.data) return roster.data.items;
    const pages = queryClient.getQueriesData<CharacterPage>({ queryKey: queryKeys.characters.lists() });
    return mergePages(pages.map(([, page]) => page?.items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster.data, roster.dataUpdatedAt, queryClient]);

  const results = useMemo(() => searchCharacters(source, text, { race }), [source, text, race]);
  const races = useMemo(() => raceOptions(source), [source]);

  return {
    results,
    races,
    partial: roster.data === undefined,
    isLoadingRoster: roster.isPending && roster.fetchStatus === 'fetching',
    roster,
  };
}

export function useTeam() {
  return useQuery({
    queryKey: queryKeys.team.list(),
    queryFn: ({ signal }) => fetchTeam(signal),
  });
}

export function useTeamMember(id: string) {
  const queryClient = useQueryClient();
  return useQuery<TeamMember>({
    queryKey: queryKeys.team.detail(id),
    queryFn: ({ signal }) => fetchTeamMember(id, signal),
    enabled: id !== '' && !id.startsWith('pendiente-'),
    placeholderData: () =>
      queryClient.getQueryData<TeamMember[]>(queryKeys.team.list())?.find((member) => member.id === id),
  });
}

export function useCreateTeamMember() {
  return useMutation<TeamMember, Error, NewTeamMember>({ mutationKey: mutationKeys.team.create() });
}

export function useUpdateTeamMember() {
  return useMutation<TeamMember, Error, TeamMemberUpdate>({ mutationKey: mutationKeys.team.update() });
}

export function useTeamRows() {
  const team = useTeam();

  const creates = useMutationState<PendingCreate>({
    filters: { mutationKey: mutationKeys.team.create(), status: 'pending' },
    select: (mutation) => ({
      submittedAt: mutation.state.submittedAt,
      variables: mutation.state.variables as NewTeamMember,
    }),
  });

  const updates = useMutationState<PendingUpdate>({
    filters: { mutationKey: mutationKeys.team.update(), status: 'pending' },
    select: (mutation) => ({
      submittedAt: mutation.state.submittedAt,
      variables: mutation.state.variables as TeamMemberUpdate,
    }),
  });

  const rows = useMemo(() => mergeTeam(team.data ?? [], creates, updates), [team.data, creates, updates]);
  return { ...team, rows, pendingCount: creates.length + updates.length };
}

interface CacheLogInput {
  data: unknown;
  isFetching: boolean;
  dataUpdatedAt: number;
}

export function useCacheLog(label: string, { data, isFetching, dataUpdatedAt }: CacheLogInput): void {
  const mountedAt = useRef(Date.now());
  const logged = useRef(false);
  useEffect(() => {
    if (logged.current || data === undefined) return;
    if (dataUpdatedAt === 0 || dataUpdatedAt >= mountedAt.current) return;
    logged.current = true;
    log(
      'CACHE',
      `${label} mostrado desde caché (datos de ${formatClock(new Date(dataUpdatedAt))})` +
        (isFetching ? ' mientras el GET sigue en curso' : ' — aún fresco por staleTime, sin GET'),
    );
  }, [label, data, isFetching, dataUpdatedAt]);
}

export function useIsOnline(): boolean {
  return useSyncExternalStore(
    (onChange) => onlineManager.subscribe(onChange),
    () => onlineManager.isOnline(),
  );
}
