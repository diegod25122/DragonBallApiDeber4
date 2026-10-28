import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SpeedLines, Watermark } from '@/components/manga/Effects';
import { Colors, Fonts, MIN_TOUCH, Radius, Spacing, Type } from '@/constants/theme';

interface Action {
  label: string;
  onPress: () => void;
}

interface Props {
  title: string;
  subtitle?: string;
  kanji?: string;
  onBack?: () => void;
  actions?: Action[];
  children?: ReactNode;
}

export function ScreenHeader({ title, subtitle, kanji, onBack, actions = [], children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <View style={[styles.bar, { paddingTop: insets.top + Spacing.two }]}>
        <SpeedLines />
        {kanji ? <Watermark text={kanji} /> : null}

        <View style={styles.topRow}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle ?? ''}
          </Text>
          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                hitSlop={4}
                style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
                <Text style={styles.actionText}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.titleRow}>
          {onBack ? (
            <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={8} style={styles.back}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
          ) : null}
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit accessibilityRole="header">
            {title}
          </Text>
        </View>

        {children}
      </View>
      <View style={styles.stripeGold} />
      <View style={styles.stripeRed} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH - 8,
    gap: Spacing.two,
  },
  subtitle: { ...Type.label, color: Colors.gold, flexShrink: 1 },
  actions: { flexDirection: 'row', gap: Spacing.two },
  action: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.gold,
  },
  actionPressed: { backgroundColor: Colors.orange },
  actionText: { fontFamily: Fonts.display, fontSize: 17, color: Colors.black, letterSpacing: 0.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  back: { minWidth: 36, minHeight: MIN_TOUCH, justifyContent: 'center' },
  backText: { color: Colors.gold, fontSize: 44, fontWeight: '900', lineHeight: 46, ...Type.outline },
  title: { ...Type.hero, ...Type.outline, color: Colors.gold, flex: 1 },
  stripeGold: { height: 4, backgroundColor: Colors.gold },
  stripeRed: { height: 6, backgroundColor: Colors.red, borderBottomWidth: 2, borderBottomColor: Colors.black },
});
