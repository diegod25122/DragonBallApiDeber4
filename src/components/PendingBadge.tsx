import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Ink } from '@/constants/theme';
import type { PendingKind } from '@/domain/team';

const LABELS: Record<PendingKind, string> = {
  create: 'Pendiente · por crear',
  update: 'Pendiente · por editar',
};

interface Props {
  kind: PendingKind;
  floating?: boolean;
}

export function PendingBadge({ kind, floating = false }: Props) {
  return (
    <View style={[styles.stamp, floating && styles.floating]} accessibilityRole="text" accessibilityLabel={LABELS[kind]}>
      <Text style={styles.text}>{LABELS[kind]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.paper,
    borderWidth: Ink.border,
    borderColor: Colors.red,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 1,
    transform: [{ rotate: '-4deg' }],
  },
  floating: { position: 'absolute', right: 10, top: -20, zIndex: 2, elevation: 2 },
  text: { fontFamily: Fonts.display, fontSize: 16, letterSpacing: 0.6, color: Colors.red },
});
