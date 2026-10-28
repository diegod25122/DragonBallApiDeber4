import type { CharacterSummary } from '../characters';
import { editDistance, mergePages, normalize, raceOptions, searchCharacters } from '../search';

function c(id: number, name: string, race = 'Saiyan', affiliation = 'Z Fighter'): CharacterSummary {
  return { id, name, race, gender: 'Male', ki: '0', maxKi: '0', affiliation, image: '' };
}

const roster: CharacterSummary[] = [
  c(1, 'Goku'),
  c(2, 'Vegeta'),
  c(3, 'Piccolo', 'Namekian'),
  c(4, 'Bulma', 'Human'),
  c(5, 'Freezer', 'Frieza Race', 'Army of Frieza'),
  c(6, 'Zarbon', 'Frieza Race', 'Army of Frieza'),
  c(7, 'Celula', 'Android', 'Villain'),
  c(8, 'Gohan'),
  c(9, 'Androide 18', 'Android'),
  c(10, 'Tenshinhan', 'Human'),
  c(11, 'Mr. Satan', 'Human', 'Other'),
  c(12, 'Goten'),
];

const names = (list: CharacterSummary[]) => list.map((x) => x.name);

describe('Spec 006: normalizar lo que escribe el usuario', () => {
  it('quita mayúsculas, tildes, signos y espacios de más', () => {
    expect(normalize('  FREEZER!! ')).toBe('freezer');
    expect(normalize('Célula')).toBe('celula');
    expect(normalize('Mr.   Satan')).toBe('mr satan');
  });

  it('distancia de edición', () => {
    expect(editDistance('freezer', 'freezer')).toBe(0);
    expect(editDistance('frezer', 'freezer')).toBe(1);
    expect(editDistance('vejeta', 'vegeta')).toBe(1);
    expect(editDistance('', 'abc')).toBe(3);
  });
});

describe('Spec 006: buscar por nombre', () => {
  it('RF-01: "freezer" devuelve a Freezer', () => {
    expect(names(searchCharacters(roster, 'freezer'))).toEqual(['Freezer']);
  });

  it('RF-01: no importan mayúsculas, tildes ni espacios', () => {
    expect(names(searchCharacters(roster, '  FREEZER '))).toEqual(['Freezer']);
    expect(names(searchCharacters(roster, 'célula'))).toEqual(['Celula']);
  });

  it('RF-02: busca mientras se escribe (por el inicio y por partes del nombre)', () => {
    expect(names(searchCharacters(roster, 'go'))).toEqual(['Goku', 'Gohan', 'Goten']);
    expect(names(searchCharacters(roster, '18'))).toEqual(['Androide 18']);
    expect(names(searchCharacters(roster, 'han'))).toEqual(['Gohan', 'Tenshinhan']);
  });

  it('RF-03: entiende nombres de otros doblajes', () => {
    expect(names(searchCharacters(roster, 'Frieza'))[0]).toBe('Freezer');
    expect(names(searchCharacters(roster, 'cell'))).toContain('Celula');
    expect(names(searchCharacters(roster, 'tien'))).toEqual(['Tenshinhan']);
    expect(names(searchCharacters(roster, 'hercule'))).toEqual(['Mr. Satan']);
  });

  it('RF-04: tolera un error de tipeo', () => {
    expect(names(searchCharacters(roster, 'frezer'))).toEqual(['Freezer']);
    expect(names(searchCharacters(roster, 'vejeta'))).toEqual(['Vegeta']);
    expect(names(searchCharacters(roster, 'picolo'))).toEqual(['Piccolo']);
  });

  it('con 3 letras o menos no adivina errores (evita resultados raros)', () => {
    expect(searchCharacters(roster, 'gku')).toEqual([]);
  });

  it('RF-05: también encuentra por raza o afiliación, después de los nombres', () => {
    expect(names(searchCharacters(roster, 'namek'))).toEqual(['Piccolo']);
    const army = names(searchCharacters(roster, 'army'));
    expect(army).toEqual(['Freezer', 'Zarbon']);
  });

  it('RF-06: sin coincidencias devuelve lista vacía', () => {
    expect(searchCharacters(roster, 'naruto')).toEqual([]);
  });

  it('el nombre que empieza igual va antes que el que solo lo contiene', () => {
    expect(names(searchCharacters(roster, 'gohan'))[0]).toBe('Gohan');
  });
});

describe('Spec 006: filtrar por raza', () => {
  it('RF-07: el filtro de raza se combina con el texto', () => {
    expect(names(searchCharacters(roster, '', { race: 'Human' }))).toEqual(['Bulma', 'Tenshinhan', 'Mr. Satan']);
    expect(names(searchCharacters(roster, 'b', { race: 'Human' }))).toEqual(['Bulma']);
  });

  it('RF-07: las razas salen de la lista, las más comunes primero', () => {
    expect(raceOptions(roster).slice(0, 2)).toEqual(['Saiyan', 'Human']);
    expect(raceOptions([c(1, 'X', 'Desconocido')])).toEqual([]);
  });

  it('sin texto ni filtro devuelve todos en orden', () => {
    expect(searchCharacters(roster, '').map((x) => x.id)).toEqual(roster.map((x) => x.id));
  });
});

describe('Spec 006: buscar sin conexión con lo guardado', () => {
  it('RF-08: une páginas guardadas sin repetir', () => {
    const merged = mergePages([[c(2, 'Vegeta'), c(1, 'Goku')], undefined, [c(1, 'Goku'), c(3, 'Piccolo')]]);
    expect(merged.map((x) => x.id)).toEqual([1, 2, 3]);
  });
});
