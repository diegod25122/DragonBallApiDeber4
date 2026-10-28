import { onlineManager, QueryClient } from '@tanstack/react-query';

import { createTeamMember, MockApiConfigError, updateTeamMember } from '@/api/mockApi';
import { CACHE_TIMES } from '@/domain/cacheTimes';
import type { NewTeamMember, TeamMember, TeamMemberUpdate } from '@/domain/team';
import { log } from '@/utils/logger';

import { mutationKeys, queryKeys } from './queryKeys';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: (failures, error) => !(error instanceof MockApiConfigError) && failures < 1 },
    mutations: { retry: (failures, error) => !(error instanceof MockApiConfigError) && failures < 3 },
  },
});

queryClient.setQueryDefaults(queryKeys.characters.all, CACHE_TIMES.publicApi);
queryClient.setQueryDefaults(queryKeys.team.all, CACHE_TIMES.mockApi);

function offlineSuffix(): string {
  return onlineManager.isOnline() ? '' : ' — SIN RED: queda en pausa y pendiente';
}

queryClient.setMutationDefaults(mutationKeys.team.create(), {
  mutationFn: (input: NewTeamMember) => createTeamMember(input),
  onMutate: (input: NewTeamMember) => {
    log('MUTACION', `Crear "${input.name}" registrada${offlineSuffix()}`);
  },
  onSuccess: (member: TeamMember) => {
    log('MUTACION', `Crear "${member.name}" confirmada por MockAPI (id ${member.id})`);
  },
  onError: (error: Error) => {
    log('MUTACION', `Crear falló: ${error.message}`);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.team.list() }),
});

queryClient.setMutationDefaults(mutationKeys.team.update(), {
  mutationFn: (input: TeamMemberUpdate) => updateTeamMember(input),
  onMutate: (input: TeamMemberUpdate) => {
    log('MUTACION', `Editar registro ${input.id} registrada${offlineSuffix()}`);
  },
  onSuccess: (member: TeamMember) => {
    log('MUTACION', `Editar "${member.name}" confirmada por MockAPI`);
  },
  onError: (error: Error) => {
    log('MUTACION', `Editar falló: ${error.message}`);
  },
  onSettled: (_data: TeamMember | undefined, _error: Error | null, input: TeamMemberUpdate) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.team.list() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.team.detail(input.id) }),
    ]),
});
