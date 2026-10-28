import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { DragonBall } from '@/components/manga/Effects';
import { Colors, Fonts, Ink, MIN_TOUCH, Radius, Spacing } from '@/constants/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  races: string[];
  race: string | null;
  onRaceChange: (race: string | null) => void;
}

export function SearchBar({ value, onChangeText, races, race, onRaceChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        <DragonBall stars={4} size={26} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Busca un guerrero… ej. Freezer"
          placeholderTextColor={Colors.muted}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="never"
          accessibilityLabel="Buscar guerrero por nombre"
          style={styles.input}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            accessibilityRole="button"
            accessibilityLabel="Borrar búsqueda"
            hitSlop={10}
            style={styles.clear}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {races.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="Todos" active={race === null} onPress={() => onRaceChange(null)} />
          {races.map((r) => (
            <Chip key={r} label={r} active={race === r} onPress={() => onRaceChange(race === r ? null : r)} />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filtrar: ${label}`}
      accessibilityState={{ selected: active }}
      style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two, marginTop: Spacing.two },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: MIN_TOUCH + 4,
    paddingHorizontal: Spacing.three,
    backgroundColor: Colors.surface,
    borderRadius: Radius.button,
    borderWidth: Ink.border - 1,
    borderColor: Colors.gold,
  },
  input: { flex: 1, color: Colors.white, fontSize: 16, paddingVertical: Spacing.two },
  clear: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.maroon },
  clearText: { color: Colors.gold, fontSize: 15, fontWeight: '900' },
  chips: { gap: Spacing.two, paddingRight: Spacing.four },
  chip: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.black },
  chipText: { fontFamily: Fonts.display, fontSize: 16, letterSpacing: 0.4, color: Colors.gold },
  chipTextActive: { color: Colors.black },
});
