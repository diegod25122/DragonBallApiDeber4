export const NOTE_MAX = 140;
export const RATING_MIN = 1;
export const RATING_MAX = 7;

export interface TeamMember {
  id: string;
  characterId: number;
  name: string;
  image: string;
  note: string;
  rating: number;
  updatedAt: string;
}

export type NewTeamMember = Omit<TeamMember, 'id'>;

export interface TeamMemberUpdate {
  id: string;
  note: string;
  rating: number;
  updatedAt: string;
}

export interface MemberForm {
  note: string;
  rating: number;
}

export type MemberFormErrors = Partial<Record<keyof MemberForm, string>>;

export type MemberFormResult = { ok: true; value: MemberForm } | { ok: false; errors: MemberFormErrors };

export const NOTE_ERROR = `Escribe una nota de 1 a ${NOTE_MAX} caracteres.`;
export const RATING_ERROR = `Elige de ${RATING_MIN} a ${RATING_MAX} esferas.`;

export function validateMemberForm(form: MemberForm): MemberFormResult {
  const errors: MemberFormErrors = {};
  const note = form.note.trim();
  if (note.length < 1 || note.length > NOTE_MAX) errors.note = NOTE_ERROR;
  if (!Number.isInteger(form.rating) || form.rating < RATING_MIN || form.rating > RATING_MAX) {
    errors.rating = RATING_ERROR;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { note, rating: form.rating } };
}

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseTeamMember(value: unknown): TeamMember | null {
  if (!isObject(value)) return null;
  const id = typeof value.id === 'string' || typeof value.id === 'number' ? String(value.id) : '';
  const characterId = Number(value.characterId);
  const rating = Number(value.rating);
  if (id === '' || !Number.isInteger(characterId) || characterId <= 0) return null;
  return {
    id,
    characterId,
    name: typeof value.name === 'string' && value.name.trim() !== '' ? value.name : `Guerrero #${characterId}`,
    image: typeof value.image === 'string' ? value.image : '',
    note: typeof value.note === 'string' ? value.note : '',
    rating: Number.isInteger(rating) ? Math.min(RATING_MAX, Math.max(RATING_MIN, rating)) : RATING_MIN,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '',
  };
}

export function parseTeamList(json: unknown): TeamMember[] {
  if (!Array.isArray(json)) return [];
  return json.map(parseTeamMember).filter((m): m is TeamMember => m !== null);
}

export type PendingKind = 'create' | 'update';

export interface TeamRow extends TeamMember {
  key: string;
  pending: PendingKind | null;
}

export interface PendingCreate {
  submittedAt: number;
  variables: NewTeamMember;
}

export interface PendingUpdate {
  submittedAt: number;
  variables: TeamMemberUpdate;
}

export function mergeTeam(server: TeamMember[], creates: PendingCreate[], updates: PendingUpdate[]): TeamRow[] {
  const latestUpdate = new Map<string, PendingUpdate>();
  for (const update of updates) {
    const current = latestUpdate.get(update.variables.id);
    if (!current || update.submittedAt >= current.submittedAt) {
      latestUpdate.set(update.variables.id, update);
    }
  }

  const rows: TeamRow[] = server.map((member) => {
    const update = latestUpdate.get(member.id);
    if (!update) return { ...member, key: `srv-${member.id}`, pending: null };
    return {
      ...member,
      note: update.variables.note,
      rating: update.variables.rating,
      updatedAt: update.variables.updatedAt,
      key: `srv-${member.id}`,
      pending: 'update',
    };
  });

  const serverCharacterIds = new Set(server.map((m) => m.characterId));
  const sortedCreates = [...creates].sort((a, b) => a.submittedAt - b.submittedAt);
  for (const create of sortedCreates) {
    if (serverCharacterIds.has(create.variables.characterId)) continue;
    rows.push({
      ...create.variables,
      id: `pendiente-${create.submittedAt}`,
      key: `pend-${create.submittedAt}-${create.variables.characterId}`,
      pending: 'create',
    });
  }
  return rows;
}

export function isInTeam(characterId: number, rows: Pick<TeamMember, 'characterId'>[]): boolean {
  return rows.some((row) => row.characterId === characterId);
}

export function countPending(rows: TeamRow[]): number {
  return rows.filter((row) => row.pending !== null).length;
}
