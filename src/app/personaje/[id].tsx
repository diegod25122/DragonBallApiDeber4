import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { FocusLines } from '@/components/manga/Effects';
import { Panel } from '@/components/manga/Panel';
import { MemberForm } from '@/components/MemberForm';
import { NetworkBanner } from '@/components/NetworkBanner';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StateMessage } from '@/components/StateMessage';
import { Colors, Fonts, Ink, Radius, Spacing, Type } from '@/constants/theme';
import { useCharacter, useCreateTeamMember, useIsOnline, useTeamRows } from '@/query/hooks';
import { goBack } from '@/utils/navigation';

export default function CharacterScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const characterId = Number(id);
  const online = useIsOnline();
  const character = useCharacter(characterId);
  const team = useTeamRows();
  const createMember = useCreateTeamMember();

  const detail = character.data;
  const inTeam = team.rows.find((row) => row.characterId === characterId);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        subtitle={`Guerrero Nº ${String(characterId).padStart(2, '0')}`}
        title={detail?.name ?? '…'}
        kanji="気"
        onBack={() => goBack()}
      />
      <NetworkBanner online={online} pendingCount={team.pendingCount} />

      {detail === undefined ? (
        character.isError ? (
          <StateMessage
            title="No se pudo cargar este guerrero"
            message={online ? 'La Dragon Ball API no respondió.' : 'Sin conexión y sin datos guardados.'}
            actionLabel="Reintentar"
            onAction={() => void character.refetch()}
          />
        ) : (
          <StateMessage loading stars={2} title="Midiendo su ki…" />
        )
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.six }]}>
            <View style={styles.hero}>
              <FocusLines />
              <View style={styles.ring} />
              <View style={styles.halo} />
              <Image
                source={detail.image || undefined}
                style={styles.heroImage}
                contentFit="contain"
                contentPosition="bottom"
                cachePolicy="memory-disk"
                accessibilityLabel={detail.name}
              />
            </View>

            <Text style={styles.bigName} numberOfLines={1} adjustsFontSizeToFit>
              {detail.name}
            </Text>

            <Panel backgroundColor={Colors.surface} shadowColor={Colors.gold} innerStyle={styles.scouter}>
              <Stat label="Raza" value={detail.race} />
              <Stat label="Género" value={detail.gender} />
              <Stat label="Ki" value={detail.ki} />
              <Stat label="Ki máximo" value={detail.maxKi} />
              <Stat label="Afiliación" value={detail.affiliation} wide />
              {detail.originPlanet ? (
                <Stat
                  label="Planeta de origen"
                  value={`${detail.originPlanet.name}${detail.originPlanet.isDestroyed ? ' (destruido)' : ''}`}
                  wide
                />
              ) : null}
            </Panel>

            {character.isPlaceholderData ? (
              <Text style={styles.muted}>
                {online ? 'Cargando descripción…' : 'Sin conexión: se muestra lo guardado del catálogo.'}
              </Text>
            ) : (
              <>
                <Panel shadowColor={Colors.orange} innerStyle={styles.bubble}>
                  <Text style={styles.description}>{detail.description}</Text>
                </Panel>

                {detail.transformations.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Transformaciones</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.transforms}>
                      {detail.transformations.map((t) => (
                        <Panel key={t.id} backgroundColor={Colors.maroon} shadowColor={Colors.gold} innerStyle={styles.transform}>
                          <Image source={t.image || undefined} style={styles.transformImage} contentFit="contain" cachePolicy="memory-disk" />
                          <Text style={styles.transformName} numberOfLines={2}>
                            {t.name}
                          </Text>
                          <Text style={styles.transformKi} numberOfLines={1}>
                            KI {t.ki}
                          </Text>
                        </Panel>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
              </>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mi equipo</Text>
              {inTeam ? (
                <View style={styles.already}>
                  <Text style={styles.alreadyText}>
                    {inTeam.pending === 'create'
                      ? 'Ya lo agregaste: está pendiente de enviarse a MockAPI.'
                      : 'Ya está en tu equipo.'}
                  </Text>
                  <AppButton label="Ver mi equipo" variant="secondary" onPress={() => router.push('/equipo')} />
                </View>
              ) : (
                <MemberForm
                  initial={{ note: '', rating: 4 }}
                  submitLabel={online ? 'Agregar a mi equipo' : 'Agregar (se enviará al volver la red)'}
                  onSubmit={({ note, rating }) => {
                    createMember.mutate({
                      characterId: detail.id,
                      name: detail.name,
                      image: detail.image,
                      note,
                      rating,
                      updatedAt: new Date().toISOString(),
                    });
                    router.replace('/equipo');
                  }}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

function Stat({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <View style={[styles.stat, wide && styles.statWide]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.black },
  flex: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },
  hero: {
    height: 290,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: -Spacing.four,
    marginTop: -Spacing.four,
    backgroundColor: Colors.maroon,
    borderBottomWidth: Ink.border,
    borderBottomColor: Colors.black,
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    bottom: 12,
    width: 232,
    height: 232,
    borderRadius: 116,
    backgroundColor: Colors.red,
    borderWidth: Ink.border,
    borderColor: Colors.black,
  },
  halo: {
    position: 'absolute',
    bottom: 25,
    width: 206,
    height: 206,
    borderRadius: 103,
    backgroundColor: Colors.orange,
    borderWidth: Ink.border,
    borderColor: Colors.black,
  },
  heroImage: { width: 260, height: 290 },
  bigName: { ...Type.hero, ...Type.outlineRed, fontSize: 52, color: Colors.gold, marginTop: -Spacing.two },
  scouter: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.three, rowGap: Spacing.three },
  stat: { width: '50%', gap: 2 },
  statWide: { width: '100%' },
  statLabel: { ...Type.label, color: Colors.gold, fontSize: 11 },
  statValue: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  bubble: { padding: Spacing.four },
  description: { ...Type.body, color: Colors.black },
  muted: { ...Type.body, color: Colors.muted, fontStyle: 'italic' },
  section: { gap: Spacing.three, marginTop: Spacing.two },
  sectionTitle: { ...Type.title, ...Type.outline, color: Colors.gold },
  transforms: { gap: Spacing.three, paddingBottom: Spacing.one },
  transform: { width: 128, padding: Spacing.two, alignItems: 'center', gap: 2, borderRadius: Radius.card },
  transformImage: { width: 108, height: 124 },
  transformName: { fontFamily: Fonts.display, fontSize: 16, color: Colors.white, textAlign: 'center' },
  transformKi: { color: Colors.gold, fontSize: 11, fontWeight: '800' },
  already: { gap: Spacing.three },
  alreadyText: { ...Type.body, color: Colors.white },
});
