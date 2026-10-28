import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MemberForm } from '@/components/MemberForm';
import { NetworkBanner } from '@/components/NetworkBanner';
import { PendingBadge } from '@/components/PendingBadge';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StateMessage } from '@/components/StateMessage';
import { Colors, Spacing, Type } from '@/constants/theme';
import { useIsOnline, useTeamMember, useTeamRows, useUpdateTeamMember } from '@/query/hooks';
import { goBack } from '@/utils/navigation';

export default function EditMemberScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const online = useIsOnline();
  const detail = useTeamMember(id);
  const team = useTeamRows();
  const updateMember = useUpdateTeamMember();

  const row = team.rows.find((r) => r.id === id);
  const member = row ?? detail.data;

  return (
    <View style={styles.screen}>
      <ScreenHeader subtitle="Editar guerrero" title={member?.name ?? '…'} kanji="仲間" onBack={() => goBack('/equipo')} />
      <NetworkBanner online={online} pendingCount={team.pendingCount} />

      {member === undefined ? (
        detail.isError ? (
          <StateMessage
            title="No se encontró este registro"
            actionLabel="Volver"
            onAction={() => goBack('/equipo')}
          />
        ) : (
          <StateMessage loading title="Cargando registro…" />
        )
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.six }]}>
            {row?.pending === 'update' ? <PendingBadge kind="update" /> : null}
            <Text style={styles.hint}>
              {online
                ? 'El cambio se envía a MockAPI con un PUT.'
                : 'Sin conexión: el cambio se guarda como pendiente y se envía solo al volver la red.'}
            </Text>
            <MemberForm
              key={member.id}
              initial={{ note: member.note, rating: member.rating }}
              submitLabel="Guardar cambios"
              onSubmit={({ note, rating }) => {
                updateMember.mutate({ id: member.id, note, rating, updatedAt: new Date().toISOString() });
                goBack('/equipo');
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.black },
  flex: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },
  hint: { ...Type.body, color: Colors.muted },
});
