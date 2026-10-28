import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { CharacterCard } from '@/components/CharacterCard';
import { NetworkBanner } from '@/components/NetworkBanner';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchBar } from '@/components/SearchBar';
import { StateMessage } from '@/components/StateMessage';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { hasNextPage, type CharacterSummary } from '@/domain/characters';
import { useCacheLog, useCharacterPage, useCharacterSearch, useIsOnline, useTeamRows } from '@/query/hooks';
import { formatClock } from '@/utils/logger';

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [race, setRace] = useState<string | null>(null);

  const online = useIsOnline();
  const catalog = useCharacterPage(page);
  const search = useCharacterSearch(query, race);
  const team = useTeamRows();
  useCacheLog(`Catálogo página ${page}`, catalog);

  const searching = query.trim() !== '' || race !== null;
  const teamIds = useMemo(() => new Set(team.rows.map((row) => row.characterId)), [team.rows]);

  const status = catalog.isFetching
    ? 'Actualizando…'
    : catalog.dataUpdatedAt > 0
      ? `Datos de las ${formatClock(new Date(catalog.dataUpdatedAt)).slice(0, 5)}`
      : '';

  const renderCard = ({ item }: { item: CharacterSummary }) => (
    <View style={styles.cell}>
      <CharacterCard
        character={item}
        inTeam={teamIds.has(item.id)}
        onPress={() => {
          Keyboard.dismiss();
          router.push(`/personaje/${item.id}`);
        }}
      />
    </View>
  );

  const header = (
    <ScreenHeader
      subtitle="Dragon Ball API"
      title="Guerreros"
      kanji="戦士"
      actions={[{ label: `Mi equipo · ${team.rows.length}`, onPress: () => router.push('/equipo') }]}>
      <SearchBar value={query} onChangeText={setQuery} races={search.races} race={race} onRaceChange={setRace} />
    </ScreenHeader>
  );

  if (searching) {
    const label = query.trim() ? `“${query.trim()}”` : race;
    return (
      <View style={styles.screen}>
        {header}
        <NetworkBanner online={online} pendingCount={team.pendingCount} />
        <FlatList
          data={search.results}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columns}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.five }]}
          ListHeaderComponent={
            <View style={styles.infoRow}>
              <Text style={styles.count}>
                {search.results.length} {search.results.length === 1 ? 'guerrero' : 'guerreros'}
              </Text>
              <Text style={styles.status} numberOfLines={1}>
                {search.partial ? 'Buscando solo en lo guardado' : label}
              </Text>
            </View>
          }
          ListEmptyComponent={
            search.isLoadingRoster ? (
              <StateMessage loading stars={1} title="Reuniendo a todos los guerreros…" />
            ) : (
              <StateMessage
                stars={7}
                title="Ningún guerrero se llama así"
                message={
                  search.partial && !online
                    ? 'Sin conexión: solo se busca entre las páginas que ya viste.'
                    : 'Prueba con otro nombre, por ejemplo Goku, Vegeta o Freezer.'
                }
                actionLabel="Limpiar búsqueda"
                onAction={() => {
                  setQuery('');
                  setRace(null);
                }}
              />
            )
          }
          renderItem={renderCard}
        />
      </View>
    );
  }

  const data = catalog.data;
  return (
    <View style={styles.screen}>
      {header}
      <NetworkBanner online={online} pendingCount={team.pendingCount} />

      {data === undefined ? (
        catalog.isError ? (
          <StateMessage
            stars={4}
            title="No se pudo cargar el catálogo"
            message={online ? 'La Dragon Ball API no respondió.' : 'Sin conexión y sin datos guardados todavía.'}
            actionLabel="Reintentar"
            onAction={() => void catalog.refetch()}
          />
        ) : (
          <StateMessage loading stars={1} title="Buscando guerreros…" />
        )
      ) : (
        <FlatList
          data={data.items}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columns}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.five }]}
          ListHeaderComponent={
            <View style={styles.infoRow}>
              <Text style={styles.count}>
                Página {data.page} / {data.totalPages}
              </Text>
              <Text style={styles.status}>{status}</Text>
            </View>
          }
          renderItem={renderCard}
          ListFooterComponent={
            <View style={styles.pager}>
              <View style={styles.pagerButton}>
                <AppButton
                  label="‹ Anterior"
                  variant="secondary"
                  disabled={page <= 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                />
              </View>
              <View style={styles.pagerButton}>
                <AppButton
                  label="Siguiente ›"
                  disabled={!hasNextPage(data) || catalog.isPlaceholderData}
                  onPress={() => setPage((p) => p + 1)}
                />
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.black },
  list: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, flexGrow: 1 },
  columns: { gap: Spacing.three, marginBottom: Spacing.three },
  cell: { flex: 1, maxWidth: '50%' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  count: { fontFamily: Fonts.display, fontSize: 22, letterSpacing: 0.5, color: Colors.gold },
  status: { color: Colors.orange, fontSize: 13, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
  pager: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.four },
  pagerButton: { flex: 1 },
});