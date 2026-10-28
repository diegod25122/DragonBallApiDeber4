import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Ink, Spacing } from '@/constants/theme';

interface Props {
  online: boolean;
  pendingCount: number;
}

export function NetworkBanner({ online, pendingCount }: Props) {
  if (online && pendingCount === 0) return null;

  const plural = pendingCount === 1 ? 'cambio pendiente' : 'cambios pendientes';
  const title = online ? 'Sincronizando' : 'Sin conexión';
  const text = !online
    ? pendingCount > 0
      ? `${pendingCount} ${plural}. Se enviarán solos al volver la red.`
      : 'Mostrando lo guardado. Lo que hagas se enviará al volver la red.'
    : `Enviando ${pendingCount} ${plural} a MockAPI…`;

  return (
    <View
      style={[styles.banner, online ? styles.syncing : styles.offline]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderBottomWidth: Ink.border,
    borderBottomColor: Colors.black,
  },
  offline: { backgroundColor: Colors.gold },
  syncing: { backgroundColor: Colors.orange },
  title: { fontFamily: Fonts.display, fontSize: 20, letterSpacing: 0.8, color: Colors.black },
  text: { fontSize: 14, fontWeight: '700', color: Colors.black },
});
