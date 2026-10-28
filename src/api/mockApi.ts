import { isMockApiConfigured, MOCKAPI_BASE_URL, MOCKAPI_RESOURCE } from '@/config';
import {
  parseTeamList,
  parseTeamMember,
  type NewTeamMember,
  type TeamMember,
  type TeamMemberUpdate,
} from '@/domain/team';

import { HttpError, requestJson } from './http';

const BASE = `${MOCKAPI_BASE_URL.replace(/\/+$/, '')}/${MOCKAPI_RESOURCE}`;

export class MockApiConfigError extends Error {
  constructor() {
    super('Falta configurar MockAPI: pega la URL de tu proyecto en src/config.ts.');
    this.name = 'MockApiConfigError';
  }
}

function ensureConfigured(): void {
  if (!isMockApiConfigured) throw new MockApiConfigError();
}

function ensureMember(json: unknown): TeamMember {
  const member = parseTeamMember(json);
  if (member === null) throw new HttpError(500, 'MockAPI respondió un registro inválido.');
  return member;
}

export async function fetchTeam(signal?: AbortSignal): Promise<TeamMember[]> {
  ensureConfigured();
  const json = await requestJson(BASE, { signal, label: `MockAPI /${MOCKAPI_RESOURCE}` });
  return parseTeamList(json);
}

export async function fetchTeamMember(id: string, signal?: AbortSignal): Promise<TeamMember> {
  ensureConfigured();
  const json = await requestJson(`${BASE}/${id}`, { signal, label: `MockAPI /${MOCKAPI_RESOURCE}/${id}` });
  return ensureMember(json);
}

export async function createTeamMember(input: NewTeamMember): Promise<TeamMember> {
  ensureConfigured();
  const json = await requestJson(BASE, {
    method: 'POST',
    body: input,
    label: `MockAPI /${MOCKAPI_RESOURCE} ("${input.name}")`,
  });
  return ensureMember(json);
}

export async function updateTeamMember({ id, ...changes }: TeamMemberUpdate): Promise<TeamMember> {
  ensureConfigured();
  const json = await requestJson(`${BASE}/${id}`, {
    method: 'PUT',
    body: changes,
    label: `MockAPI /${MOCKAPI_RESOURCE}/${id}`,
  });
  return ensureMember(json);
}
