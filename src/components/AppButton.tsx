import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Fonts, Ink, MIN_TOUCH, Radius, Spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  busy?: boolean;
}

export function AppButton({ label, onPress, variant = 'primary', disabled = false, busy = false }: Props) {
  const inactive = disabled || busy;
  const secondary = variant === 'secondary';
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy }}
      style={({ pressed }) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        pressed && styles.pressed,
        inactive && styles.disabled,
      ]}>
      {busy ? <ActivityIndicator color={secondary ? Colors.gold : Colors.black} /> : null}
      <Text style={[styles.label, secondary && styles.labelSecondary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH + 6,
    borderRadius: Radius.button,
    borderWidth: Ink.border,
    borderBottomWidth: Ink.border + 4,
    paddingHorizontal: Spacing.five,
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: Colors.gold, borderColor: Colors.black, borderBottomColor: Colors.red },
  secondary: { backgroundColor: Colors.surface, borderColor: Colors.gold },
  pressed: { borderBottomWidth: Ink.border, transform: [{ translateY: 3 }] },
  disabled: { opacity: 0.45 },
  label: { fontFamily: Fonts.display, fontSize: 22, letterSpacing: 0.8, color: Colors.black },
  labelSecondary: { color: Colors.gold },
});
