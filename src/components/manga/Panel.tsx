import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Ink, Radius } from '@/constants/theme';

interface Props {
  children: ReactNode;
  shadowColor?: string;
  backgroundColor?: string;
  dashed?: boolean;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
}

export function Panel({
  children,
  shadowColor = Colors.red,
  backgroundColor = Colors.paper,
  dashed = false,
  style,
  innerStyle,
}: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.shadow, { backgroundColor: shadowColor }]} />
      <View style={[styles.panel, { backgroundColor }, dashed && styles.dashed, innerStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginRight: Ink.shadowOffset, marginBottom: Ink.shadowOffset },
  shadow: {
    position: 'absolute',
    top: Ink.shadowOffset,
    left: Ink.shadowOffset,
    right: -Ink.shadowOffset,
    bottom: -Ink.shadowOffset,
    borderRadius: Radius.card,
  },
  panel: {
    borderWidth: Ink.border,
    borderColor: Colors.black,
    borderRadius: Radius.card,
  },
  dashed: { borderStyle: 'dashed' },
});
