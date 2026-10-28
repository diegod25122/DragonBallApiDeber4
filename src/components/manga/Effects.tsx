import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function SpeedLines({ count = 18, gap = 24 }: { count?: number; gap?: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.speedLine, { left: i * gap - 60 }]} />
      ))}
    </View>
  );
}

export function Halftone({ rows = 12, cols = 18, size = 3, gap = 10 }: { rows?: number; cols?: number; size?: number; gap?: number }) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.clip]} pointerEvents="none" importantForAccessibility="no-hide-descendants">
      {Array.from({ length: rows }, (_, r) => (
        <View key={r} style={[styles.dotRow, { marginTop: r === 0 ? gap / 2 : gap - size, marginLeft: r % 2 ? gap / 2 : 0 }]}>
          {Array.from({ length: cols }, (_, c) => (
            <View key={c} style={{ width: size, height: size, borderRadius: size / 2, marginRight: gap - size, backgroundColor: Colors.halftone }} />
          ))}
        </View>
      ))}
    </View>
  );
}

export function FocusLines({ count = 30, length = 560, thickness = 7 }: { count?: number; length?: number; thickness?: number }) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none" importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: thickness,
            height: length,
            backgroundColor: Colors.focusLine,
            transform: [{ rotate: `${(180 / count) * i}deg` }],
          }}
        />
      ))}
    </View>
  );
}

export function Watermark({ text }: { text: string }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" importantForAccessibility="no-hide-descendants">
      <Text style={styles.watermark} accessible={false}>
        {text}
      </Text>
    </View>
  );
}

export function DragonBall({ stars = 4, size = 56 }: { stars?: number; size?: number }) {
  return (
    <View
      style={[styles.ball, { width: size, height: size, borderRadius: size / 2, borderWidth: Math.max(2, size / 18) }]}
      importantForAccessibility="no-hide-descendants">
      <View style={[styles.shine, { width: size * 0.2, height: size * 0.2, borderRadius: size, top: size * 0.14, left: size * 0.2 }]} />
      <Text style={{ color: Colors.red, fontSize: size * 0.24, textAlign: 'center' }} numberOfLines={2}>
        {'★'.repeat(stars)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  speedLine: {
    position: 'absolute',
    top: -80,
    width: 3,
    height: 320,
    backgroundColor: Colors.speedLine,
    transform: [{ rotate: '28deg' }],
  },
  clip: { overflow: 'hidden' },
  dotRow: { flexDirection: 'row' },
  center: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  watermark: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    fontSize: 84,
    fontWeight: '900',
    color: Colors.watermark,
  },
  ball: {
    backgroundColor: Colors.orange,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  shine: { position: 'absolute', backgroundColor: Colors.white, opacity: 0.75 },
});
