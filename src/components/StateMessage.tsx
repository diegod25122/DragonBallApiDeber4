import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { DragonBall } from '@/components/manga/Effects';
import { Colors, Spacing, Type } from '@/constants/theme';

interface Props {
  title: string;
  message?: string;
  loading?: boolean;
  stars?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function StateMessage({ title, message, loading = false, stars = 4, actionLabel, onAction }: Props) {
  return (
    <View style={styles.box}>
      <DragonBall stars={stars} size={72} />
      {loading ? <ActivityIndicator size="large" color={Colors.gold} /> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? <AppButton label={actionLabel} variant="secondary" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: Spacing.three, padding: Spacing.six },
  title: { ...Type.title, ...Type.outlineRed, color: Colors.gold, textAlign: 'center' },
  message: { ...Type.body, color: Colors.muted, textAlign: 'center' },
});
