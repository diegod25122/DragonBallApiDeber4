import { useSyncExternalStore } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import { StateMessage } from '@/components/StateMessage';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { clearLogs, getLogs, subscribeLogs, type LogTag } from '@/utils/logger';
import { goBack } from '@/utils/navigation';

const TAG_COLORS: Record<LogTag, string> = {
  APP: Colors.white,
  RED: Colors.gold,
  CACHE: Colors.orange,
  GET: Colors.white,
  MUTACION: Colors.gold,
};

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const logs = useSyncExternalStore(subscribeLogs, getLogs);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        subtitle="Desde que se abrió la app"
        title="Registro"
        kanji="記録"
        onBack={() => goBack()}
        actions={[{ label: 'Limpiar', onPress: clearLogs }]}
      />
      <FlatList
        data={logs}
        keyExtractor={(entry) => String(entry.id)}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.five }]}
        ListEmptyComponent={<StateMessage title="Sin registros todavía" />}
        renderItem={({ item }) => (
          <View style={styles.line}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={[styles.tag, { color: TAG_COLORS[item.tag] }]}>{item.tag}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const mono = Platform.select({ ios: 'Menlo', default: 'monospace' });

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.black },
  list: { padding: Spacing.three, gap: Spacing.two },
  line: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.button,
    borderLeftWidth: 4,
    borderLeftColor: Colors.red,
    padding: Spacing.three,
    gap: 2,
  },
  time: { color: Colors.muted, fontFamily: mono, fontSize: 12 },
  tag: { fontFamily: mono, fontSize: 12, fontWeight: '700' },
  message: { color: Colors.white, fontFamily: mono, fontSize: 13 },
});
