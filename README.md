# Equipo Z

App en React Native con Expo que consume la **Dragon Ball API** (pública, solo
lectura) y guarda **Mi equipo** (nota y valoración de 1 a 7 esferas) en
**MockAPI**. Usa TanStack Query v5 con caché persistida en AsyncStorage y
mutaciones que funcionan sin conexión. Se puede **buscar a cualquier guerrero
por nombre** ("freezer", "vejeta", "cell"…) y filtrar por raza, también sin red.
Diseño estilo manga con la paleta del logo de Dragon Ball Z.

Deber 4 — Desarrollo de Aplicaciones Móviles (ESFOT · EPN). Construida con
Spec-Driven Development (agentes y skills, como en el deber 3).

## 1. Configurar MockAPI

1. Entra a https://mockapi.io, crea un proyecto (plan gratuito).
2. Crea el recurso **`team`** con este esquema y **0 registros iniciales**:

   | Campo | Tipo |
   |---|---|
   | id | Object ID (automático) |
   | characterId | Number |
   | name | String |
   | image | String |
   | note | String |
   | rating | Number |
   | updatedAt | String |

3. Copia la URL del proyecto (termina en `/api/v1`) y pégala en
   `src/config.ts` → `MOCKAPI_BASE_URL`.

## 2. Ejecutar

Con este repositorio (ya fija Expo **SDK 57**):
```bash
npm install
npx expo install --fix
```
Desde cero, la plantilla debe ser la de SDK 57 (`@latest` sin template crea la última SDK):
```bash
npx create-expo-app@latest equipo-z --template default@sdk-57
cd equipo-z
npx expo install @tanstack/react-query @tanstack/react-query-persist-client @tanstack/query-async-storage-persister @react-native-async-storage/async-storage expo-network expo-image expo-font @expo-google-fonts/bangers
npx expo install jest-expo jest @types/jest -- --save-dev
```
En el celular: Expo Go para **SDK 57** (Android: https://expo.dev/go?sdkVersion=57&platform=android&device=true).
Para probar:
```bash
npx jest                   # 38 pruebas de la lógica
npx tsc --noEmit
npx expo start
```

APK:
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

## 3. Claves de consulta (`src/query/queryKeys.ts`)

```
['characters']                         raíz de la API pública
['characters', 'list', { page }]       una página del catálogo
['characters', 'list', 'all']          lista completa (para buscar)
['characters', 'detail', id]           un guerrero
['team']                               raíz de los datos propios (MockAPI)
['team', 'list']                       mi equipo
['team', 'detail', id]                 un registro de mi equipo
```
Mutaciones: `['team', 'create']` y `['team', 'update']`.

TanStack invalida **por prefijo**: invalidar `['team', 'list']` refresca solo
esa consulta; invalidar `['team']` refrescaría todo lo propio; nada de lo
propio toca `['characters']`.

### Qué se invalida después de cada mutación y por qué

| Mutación | Se invalida | Por qué |
|---|---|---|
| **Crear** (POST `/team`) | `['team', 'list']` | Aparece un registro nuevo en la lista. Todavía no hay detalle de ese registro que refrescar, y los detalles de los otros no cambiaron. |
| **Editar** (PUT `/team/:id`) | `['team', 'list']` y `['team', 'detail', id]` | Cambian la nota y las esferas de ese registro, que se ven en la lista y en su detalle. Los demás detalles no cambiaron, por eso no se invalida `['team']` entero. |

Nunca se invalida `['characters']`: nuestras mutaciones van a MockAPI y no
cambian la API pública. La invalidación va en `onSettled` (éxito **o** error,
para volver a sincronizar si falló) y devuelve su promesa, así la mutación
sigue "pendiente" hasta que llega la lista nueva y la marca no parpadea.

## 4. staleTime y gcTime

| Fuente | staleTime | gcTime | Justificación |
|---|---|---|---|
| Dragon Ball API | **1 h** | **48 h** | Catálogo que casi nunca cambia y que no es nuestro: pedirlo menos cuida la API y los datos móviles. Durante 1 h, volver a una página no hace GET. |
| MockAPI | **30 s** | **24 h** | Son datos del usuario que cambian con cada mutación: deben refrescarse pronto al volver a la pantalla. |

Persister: `maxAge = 24 h`. Se aplican con `setQueryDefaults` por raíz de
clave (`src/query/queryClient.ts`), y una prueba verifica que gcTime >= maxAge
en ambas fuentes (`src/query/__tests__/queryKeys.test.ts`).

### ¿Por qué gcTime debe ser >= maxAge? ¿Qué pasaría si fuera menor?

`gcTime` es cuánto vive en memoria una consulta que ninguna pantalla está
usando; `maxAge` es cuánto tiempo se acepta la caché guardada en AsyncStorage.
El persister guarda **lo que hay en memoria**. Si gcTime fuera menor (por
ejemplo 5 min, el valor por defecto) a los 5 minutos de dejar de ver una
pantalla TanStack borraría esa consulta de la memoria, el persister volvería a
guardar la caché **ya sin ella** y, al reabrir la app, no habría nada que
mostrar: pantalla de carga en vez de datos inmediatos, y sin conexión, error.
Es decir, la promesa de "24 h de caché" no se cumpliría.

## 5. Persistencia

`src/app/_layout.tsx` envuelve la app en `PersistQueryClientProvider` con
`createAsyncStoragePersister({ storage: AsyncStorage })`
(`src/query/persister.ts`). Al abrir:

1. Se restaura la caché (si tiene menos de 24 h y el `buster` coincide).
2. Las pantallas muestran esos datos **de inmediato**.
3. Las consultas vencidas (staleTime) hacen su GET por detrás ("Actualizando…").

Se guardan las consultas con éxito y las **mutaciones pausadas**.

## 6. Mutaciones sin conexión

- **onlineManager con expo-network** (`src/query/network.ts`): TanStack sabe
  si hay red. Sin red, una mutación nueva queda **pausada**.
- **setMutationDefaults** (`src/query/queryClient.ts`): la `mutationFn` de
  crear y editar está registrada por `mutationKey`. Una mutación guardada en
  AsyncStorage no guarda funciones: al reabrir la app TanStack la encuentra
  por su clave en estos defaults.
- **resumePausedMutations()** en el `onSuccess` del provider: cuando terminó
  de restaurar, envía lo pendiente.
- **Pendientes en pantalla**: `useMutationState` lee las mutaciones en estado
  `pending` (también las restauradas) y `mergeTeam` las mezcla con la lista
  confirmada: "Pendiente · por crear" / "Pendiente · por editar" con borde
  punteado, y un aviso con cuántos cambios faltan.

## 7. Protocolo del video (APK instalado)

Logs: en la app, botón **Logs** (hora con milisegundos). También en la
computadora con el celular por USB:
```bash
adb logcat -s ReactNativeJS:V
```

1. **Con red**, abrir la app: catálogo y Mi equipo. En Logs: `GET … 200 OK`.
2. **Modo avión**, abrir un guerrero y agregarlo: aparece en Mi equipo con
   "Pendiente · por crear". Logs: `[RED] Sin conexión` y `Crear "…" registrada — SIN RED`.
3. **Cerrar la app** desde recientes.
4. **Quitar el modo avión** y abrir la app.
5. Logs, en orden y con hora: `App abierta`, `Caché restaurada: N consultas y
   1 mutaciones pausadas`, `Mi equipo mostrado desde caché … mientras el GET
   sigue en curso`, `POST MockAPI /team → enviando`, `… 201 OK`,
   `confirmada por MockAPI`, `GET MockAPI /team → 200 OK`.
6. Abrir el **panel de MockAPI** y mostrar el registro.

Opcional: Reactotron con sus plugins de TanStack Query y AsyncStorage para
mostrar la caché y la mutación pausada guardadas.

## 8. Búsqueda de guerreros (spec 006)

- Al abrir el catálogo se pide **una vez** la lista completa
  (`/characters?limit=100`, clave `['characters', 'list', 'all']`). Como
  cuelga de `['characters', 'list']`, hereda staleTime 1 h / gcTime 48 h y se
  persiste: **buscar no hace más peticiones y funciona sin conexión**.
- La búsqueda es lógica pura (`src/domain/search.ts`, con pruebas): ignora
  mayúsculas y tildes, busca por el inicio y por partes del nombre, entiende
  nombres de otros doblajes (Frieza → Freezer, Cell → Célula, Tien →
  Tenshinhan…) y tolera un error de tipeo ("frezer", "vejeta").
- Filtros rápidos por raza, sacados de la propia lista.
- Si la lista completa aún no se descargó y no hay red, busca en las páginas
  ya guardadas y lo avisa.

## 9. Estructura (SDD)

```
.github/
  copilot-instructions.md
  agents/            sdd-spec · sdd-plan · sdd-implement
  skills/            sdd · tanstack-query-rules · dbz-palette · rn-conventions
docs/constitution.md
docs/deber-4.md      requisitos del deber (entrada del flujo SDD)
specs/               001-catalogo · 002-detalle-guerrero · 003-agregar-miembro
                     004-editar-miembro · 005-sin-conexion · 006-buscar-guerrero
MEMORY.md
src/
  app/               index (catálogo) · personaje/[id] · equipo/index · equipo/[id] · registro
  domain/            lógica pura + pruebas (characters, team, search, cacheTimes)
  api/               http, dragonBallApi, mockApi
  query/             queryKeys, queryClient, persister, network, hooks
  components/        CharacterCard, SearchBar, SphereRating, MemberForm, NetworkBanner…
  components/manga/  Panel (viñeta) y Effects (líneas, trama, kanji, esferas)
  constants/theme.ts
  utils/logger.ts
```

## 10. Decisiones técnicas

| Necesidad | Elegido | Descartado y por qué |
|---|---|---|
| Datos remotos y caché | TanStack Query v5 | useEffect + useState: sin caché, reintentos ni pausa sin red |
| Persistir la caché | query-async-storage-persister + AsyncStorage | MMKV: más rápido pero requiere build nativo, no corre en Expo Go |
| Detectar red | expo-network | NetInfo: equivalente, pero expo-network es de Expo y no requiere configuración extra |
| Mostrar pendientes | Indicador con useMutationState | Actualización optimista en la caché: al reabrir la app onMutate no se repite y hay que deshacerla a mano si falla |
| Imágenes sin red | expo-image (caché en disco) | Image de RN: sin caché en disco garantizada |
| API pública | Dragon Ball API | PokeAPI / Rick and Morty: igual de válidas, pero las usa medio curso |
| Buscar por nombre | Lista completa en caché + búsqueda local | `?name=` de la API: hace falta red en cada letra y exige el nombre exacto |
| Paleta | 5 colores del logo de DBZ (skill dbz-palette), tema oscuro | Paleta genérica de UI: resta puntos (D1) |
| Estilo visual (D1) | Manga: Bangers, viñetas con borde de tinta y sombra dura, líneas de velocidad, trama, kanji | Componentes estándar: es el "diseño genérico" que resta puntos |
| Letra de cómic | @expo-google-fonts/bangers + expo-font (va dentro de la app) | Descargarla en tiempo real: no funcionaría sin red |
