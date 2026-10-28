import { ApiFormatError, hasNextPage, parseCharacterDetail, parseCharacterPage } from '../characters';

const goku = {
  id: 1,
  name: 'Goku',
  ki: '60.000.000',
  maxKi: '90 Septillion',
  race: 'Saiyan',
  gender: 'Male',
  description: 'El protagonista de la serie.',
  image: 'https://dragonball-api.com/characters/goku_normal.webp',
  affiliation: 'Z Fighter',
  deletedAt: null,
};

describe('Spec 001: catálogo paginado', () => {
  it('RF-01: lee items y meta de una página', () => {
    const page = parseCharacterPage(
      { items: [goku], meta: { totalItems: 58, itemCount: 1, itemsPerPage: 10, totalPages: 6, currentPage: 1 } },
      1,
    );
    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toMatchObject({ id: 1, name: 'Goku', race: 'Saiyan', ki: '60.000.000' });
    expect(page).toMatchObject({ page: 1, totalPages: 6, totalItems: 58 });
    expect(hasNextPage(page)).toBe(true);
  });

  it('RF-02: la última página no tiene siguiente', () => {
    const page = parseCharacterPage({ items: [goku], meta: { totalPages: 6, currentPage: 6 } }, 6);
    expect(hasNextPage(page)).toBe(false);
  });

  it('sin meta usa la página pedida y no ofrece siguiente', () => {
    const page = parseCharacterPage({ items: [goku, { ...goku, id: 2 }] }, 3);
    expect(page).toMatchObject({ page: 3, totalPages: 3, totalItems: 2 });
  });

  it('descarta personajes sin id y rellena campos vacíos', () => {
    const page = parseCharacterPage({ items: [{ name: 'Sin id' }, { id: 9, name: '  ', race: '' }] }, 1);
    expect(page.items).toEqual([
      expect.objectContaining({ id: 9, name: 'Guerrero #9', race: 'Desconocido', image: '' }),
    ]);
  });

  it('RF-05: una respuesta sin items es un error de formato', () => {
    expect(() => parseCharacterPage({ data: [] }, 1)).toThrow(ApiFormatError);
    expect(() => parseCharacterPage(null, 1)).toThrow(ApiFormatError);
  });
});

describe('Spec 002: detalle de un personaje', () => {
  it('RF-01: lee descripción, planeta y transformaciones', () => {
    const detail = parseCharacterDetail({
      ...goku,
      originPlanet: { id: 3, name: 'Vegeta', isDestroyed: true, image: 'p.webp', description: '...' },
      transformations: [
        { id: 1, name: 'Goku SSJ', image: 't.webp', ki: '3 Billion' },
        { name: 'sin id' },
      ],
    });
    expect(detail.description).toBe('El protagonista de la serie.');
    expect(detail.originPlanet).toEqual({ id: 3, name: 'Vegeta', isDestroyed: true, image: 'p.webp' });
    expect(detail.transformations).toEqual([{ id: 1, name: 'Goku SSJ', image: 't.webp', ki: '3 Billion' }]);
  });

  it('sin planeta ni transformaciones devuelve null y lista vacía', () => {
    const detail = parseCharacterDetail({ ...goku, description: '' });
    expect(detail.originPlanet).toBeNull();
    expect(detail.transformations).toEqual([]);
    expect(detail.description).toBe('Sin descripción.');
  });

  it('un personaje sin id es un error de formato', () => {
    expect(() => parseCharacterDetail({ name: 'x' })).toThrow(ApiFormatError);
  });
});
