import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import { RATING_MAX } from '@/domain/team';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export function SphereRating({ value, onChange, size = 30 }: Props) {
  const spheres = Array.from({ length: RATING_MAX }, (_, i) => i + 1);
  return (
    <View
      style={styles.row}
      accessible={!onChange}
      accessibilityLabel={!onChange ? `${value} de ${RATING_MAX} esferas` : undefined}>
      {spheres.map((n) => {
        const filled = n <= value;
        const sphere = (
          <View
            style={[
              styles.sphere,
              { width: size, height: size, borderRadius: size / 2 },
              filled ? styles.filled : styles.empty,
            ]}>
            {filled ? (
              <Text style={[styles.stars, { fontSize: size * (n > 4 ? 0.22 : 0.3) }]} numberOfLines={2}>
                {'★'.repeat(n)}
              </Text>
            ) : null}
          </View>
        );
        if (!onChange) return <View key={n}>{sphere}</View>;
        return (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`${n} ${n === 1 ? 'esfera' : 'esferas'}`}
            accessibilityState={{ selected: n === value }}
            style={styles.touch}>
            {sphere}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  touch: { minWidth: 40, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  sphere: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  filled: { backgroundColor: Colors.orange, borderColor: Colors.black },
  empty: { backgroundColor: Colors.white, borderColor: Colors.inkSoft, borderRadius: Radius.pill },
  stars: { color: Colors.red, textAlign: 'center' },
});
