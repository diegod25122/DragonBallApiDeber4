import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MockApiConfigError } from '@/api/mockApi';
import { Halftone } from '@/components/manga/Effects';
import { Panel } from '@/components/manga/Panel';
import { NetworkBanner } from '@/components/NetworkBanner';
import { PendingBadge } from '@/components/PendingBadge';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SphereRating } from '@/components/SphereRating';
import { StateMessage } from '@/components/StateMessage';
import { Colors, Fonts, Ink, Spacing, Type } from '@/constants/theme';
import type { TeamRow } from '@/domain/team';
import { useCacheLog, useIsOnline, useTeamRows } from '@/query/hooks';
import { formatClock } from '@/utils/logger';
import { goBack } from '@/utils/navigation';

export default function TeamScreen() {
  const insets = useSafeAreaInsets();
  const online = useIsOnline();
  const team = useTeamRows();
  useCacheLog('Mi equipo', team);

  const status = team.isFetching
    ? 'Actualizando desde MockAPI…'
    : team.dataUpdatedAt > 0
      ? `Datos de las ${formatClock(new Date(team.dataUpdatedAt)).slice(0, 8)}`
      : '';

  const showEmpty = team.rows.length === 0;
  const missingConfig = team.error instanceof MockApiConfigError;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        subtitle="MockAPI"
        title="Mi equipo"
        kanji="仲間"
        onBack={() => goBack()}
        actions={[{ label: 'Logs', onPress: () => router.push('/registro') }]}
      />
      <NetworkBanner online={online} pendingCount={team.pendingCount} />

      {showEmpty && team.data === undefined && team.isError ? (
        missingConfig ? (
          <StateMessage
            stars={3}
            title="Falta configurar MockAPI"
            message="Abre src/config.ts y pega en MOCKAPI_BASE_URL la URL de tu proyecto de mockapi.io (termina en /api/v1). Luego reinicia la app."
          />
        ) : (
          <StateMessage
            title="No se pudo cargar tu equipo"
            message={online ? 'MockAPI no respondió. Revisa la URL en src/config.ts.' : 'Sin conexión y sin datos guardados.'}
            actionLabel="Reintentar"
            onAction={() => void team.refetch()}
          />
        )
      ) : showEmpty && team.data === undefined ? (
        <StateMessage loading stars={3} title="Reuniendo a tu equipo…" />
      ) : (
        <FlatList
          data={team.rows}
          keyExtractor={(row) => row.key}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.five }]}
          ListHeaderComponent={
            <View style={styles.infoRow}>
              <Text style={styles.count}>
                {team.rows.length} {team.rows.length === 1 ? 'guerrero' : 'guerreros'}
              </Text>
              <Text style={styles.status}>{status}</Text>
            </View>
          }
          ListEmptyComponent={
            <StateMessage
              stars={7}
              title="Tu equipo está vacío"
              message="Elige un guerrero del catálogo y agrégalo con una nota."
              actionLabel="Ir al catálogo"
              onAction={() => goBack()}
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: Spacing.five }} />}
          renderItem={({ item }) => <TeamRowCard row={item} />}
        />
      )}
    </View>
  );
}

function TeamRowCard({ row }: { row: TeamRow }) {
  const editable = row.pending !== 'create';
  return (
    <Pressable
      disabled={!editable}
      onPress={() => router.push(`/equipo/${row.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${row.name}, ${row.rating} esferas. ${row.note}${row.pending ? '. Pendiente' : ''}`}
      style={({ pressed }) => pressed && styles.pressed}>
      <Panel shadowColor={row.pending ? Colors.orange : Colors.red} dashed={row.pending !== null} innerStyle={styles.card}>
        <View style={styles.orb}>
          <Halftone rows={8} cols={8} />
          <Image source={row.image || undefined} style={styles.image} contentFit="contain" contentPosition="bottom" cachePolicy="memory-disk" />
        </View>
        <View style={[styles.body, row.pending ? styles.bodyPending : null]}>
          <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
            {row.name}
          </Text>
          <SphereRating value={row.rating} size={18} />
          <Text style={styles.note} numberOfLines={3}>
            “{row.note}”
          </Text>
          {editable ? <Text style={styles.edit}>Editar ›</Text> : null}
        </View>
      </Panel>
      {row.pending ? <PendingBadge kind={row.pending} floating /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.black },
  list: { padding: Spacing.four, flexGrow: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.five },
  count: { fontFamily: Fonts.display, fontSize: 22, color: Colors.gold, letterSpacing: 0.5 },
  status: { color: Colors.orange, fontSize: 13, fontWeight: '800', flexShrink: 1, textAlign: 'right' },
  pressed: { transform: [{ translateY: 2 }] },
  card: { flexDirection: 'row', gap: Spacing.four, padding: Spacing.three, backgroundColor: Colors.paper },
  orb: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.maroon,
    borderWidth: Ink.border,
    borderColor: Colors.black,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: { width: 70, height: 84 },
  body: { flex: 1, gap: Spacing.one },
  bodyPending: { paddingTop: Spacing.four },
  name: { ...Type.title, color: Colors.black },
  note: { ...Type.body, color: Colors.inkSoft },
  edit: { fontFamily: Fonts.display, fontSize: 18, color: Colors.maroon, alignSelf: 'flex-end' },
});
