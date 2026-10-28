import {
  countPending,
  isInTeam,
  mergeTeam,
  NOTE_ERROR,
  NOTE_MAX,
  parseTeamList,
  RATING_ERROR,
  validateMemberForm,
  type NewTeamMember,
  type TeamMember,
} from '../team';

const vegeta: TeamMember = {
  id: '1',
  characterId: 2,
  name: 'Vegeta',
  image: 'v.webp',
  note: 'Rival eterno',
  rating: 6,
  updatedAt: '2026-10-26T20:00:00.000Z',
};

const newGoku: NewTeamMember = {
  characterId: 1,
  name: 'Goku',
  image: 'g.webp',
  note: 'El más fuerte',
  rating: 7,
  updatedAt: '2026-10-26T21:00:00.000Z',
};

describe('Specs 003 y 004: formulario de nota y esferas', () => {
  it('RF-02: acepta nota con espacios y la recorta', () => {
    expect(validateMemberForm({ note: '  Mi favorito  ', rating: 5 })).toEqual({
      ok: true,
      value: { note: 'Mi favorito', rating: 5 },
    });
  });

  it.each([
    ['vacía', ''],
    ['solo espacios', '    '],
    ['demasiado larga', 'x'.repeat(NOTE_MAX + 1)],
  ])('RF-03: rechaza nota %s', (_name, note) => {
    const result = validateMemberForm({ note, rating: 3 });
    expect(result).toEqual({ ok: false, errors: { note: NOTE_ERROR } });
  });

  it('acepta exactamente el máximo de caracteres', () => {
    expect(validateMemberForm({ note: 'x'.repeat(NOTE_MAX), rating: 1 }).ok).toBe(true);
  });

  it.each([0, 8, 2.5, NaN])('RF-03: rechaza %p esferas', (rating) => {
    const result = validateMemberForm({ note: 'ok', rating });
    expect(result).toEqual({ ok: false, errors: { rating: RATING_ERROR } });
  });

  it('acepta 1 y 7 esferas', () => {
    expect(validateMemberForm({ note: 'ok', rating: 1 }).ok).toBe(true);
    expect(validateMemberForm({ note: 'ok', rating: 7 }).ok).toBe(true);
  });
});

describe('lectura de MockAPI', () => {
  it('convierte ids numéricos a texto y descarta registros dañados', () => {
    const list = parseTeamList([
      { ...vegeta, id: 1 },
      { id: '2', characterId: 'abc' },
      'basura',
      { id: '3', characterId: 4, rating: 99 },
    ]);
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe('1');
    expect(list[1]).toMatchObject({ id: '3', name: 'Guerrero #4', rating: 7, note: '' });
  });

  it('una respuesta que no es arreglo es una lista vacía', () => {
    expect(parseTeamList({ error: 'Not found' })).toEqual([]);
  });
});

describe('Spec 005: mostrar cambios pendientes', () => {
  it('RF-03: sin pendientes muestra lo confirmado', () => {
    const rows = mergeTeam([vegeta], [], []);
    expect(rows).toEqual([{ ...vegeta, key: 'srv-1', pending: null }]);
    expect(countPending(rows)).toBe(0);
  });

  it('RF-03: una creación pendiente aparece al final marcada', () => {
    const rows = mergeTeam([vegeta], [{ submittedAt: 100, variables: newGoku }], []);
    expect(rows).toHaveLength(2);
    expect(rows[1]).toMatchObject({ name: 'Goku', pending: 'create', id: 'pendiente-100' });
    expect(countPending(rows)).toBe(1);
  });

  it('RF-03: una edición pendiente cambia nota y esferas y queda marcada', () => {
    const rows = mergeTeam(
      [vegeta],
      [],
      [{ submittedAt: 100, variables: { id: '1', note: 'Ahora aliado', rating: 4, updatedAt: 'x' } }],
    );
    expect(rows[0]).toMatchObject({ id: '1', note: 'Ahora aliado', rating: 4, pending: 'update' });
  });

  it('si hay dos ediciones pendientes del mismo registro, gana la más reciente', () => {
    const rows = mergeTeam(
      [vegeta],
      [],
      [
        { submittedAt: 300, variables: { id: '1', note: 'tercera', rating: 3, updatedAt: 'c' } },
        { submittedAt: 100, variables: { id: '1', note: 'primera', rating: 1, updatedAt: 'a' } },
      ],
    );
    expect(rows[0].note).toBe('tercera');
  });

  it('las creaciones pendientes salen en el orden en que se hicieron', () => {
    const krillin = { ...newGoku, characterId: 3, name: 'Krillin' };
    const rows = mergeTeam(
      [],
      [
        { submittedAt: 200, variables: krillin },
        { submittedAt: 100, variables: newGoku },
      ],
      [],
    );
    expect(rows.map((r) => r.name)).toEqual(['Goku', 'Krillin']);
  });

  it('una creación que ya llegó al servidor no se duplica', () => {
    const confirmed: TeamMember = { ...newGoku, id: '9' };
    const rows = mergeTeam([confirmed], [{ submittedAt: 100, variables: newGoku }], []);
    expect(rows).toHaveLength(1);
    expect(rows[0].pending).toBeNull();
  });

  it('una edición de un registro que ya no existe se ignora', () => {
    const rows = mergeTeam([], [], [{ submittedAt: 1, variables: { id: '77', note: 'x', rating: 2, updatedAt: '' } }]);
    expect(rows).toEqual([]);
  });
});

describe('Spec 003: no repetir personajes', () => {
  it('RF-04: detecta si un personaje ya está en el equipo (confirmado o pendiente)', () => {
    const rows = mergeTeam([vegeta], [{ submittedAt: 1, variables: newGoku }], []);
    expect(isInTeam(2, rows)).toBe(true);
    expect(isInTeam(1, rows)).toBe(true);
    expect(isInTeam(3, rows)).toBe(false);
  });
});
