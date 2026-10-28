import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DragonBall, Halftone } from '@/components/manga/Effects';
import { Panel } from '@/components/manga/Panel';
import { Colors, Fonts, Ink, Radius, Spacing, Type } from '@/constants/theme';
import type { CharacterSummary } from '@/domain/characters';

interface Props {
  character: CharacterSummary;
  inTeam: boolean;
  onPress: () => void;
}

const BAND_HEIGHT = 108;
const IMAGE_HEIGHT = 146;

export function CharacterCard({ character, inTeam, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, ${character.race}. Ki ${character.ki}${inTeam ? '. En tu equipo' : ''}`}
      style={({ pressed }) => [styles.touch, pressed && styles.pressed]}>
      <Panel shadowColor={inTeam ? Colors.gold : Colors.red}>
        <View style={styles.band}>
          <View style={styles.bandClip}>
            <Halftone rows={11} cols={16} />
          </View>
          <Image
            source={character.image || undefined}
            style={styles.image}
            contentFit="contain"
            contentPosition="bottom"
            cachePolicy="memory-disk"
            transition={150}
          />
          {inTeam ? (
            <View style={styles.ball}>
              <DragonBall stars={1} size={26} />
            </View>
          ) : null}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
              {character.name}
            </Text>
            <Text style={styles.number}>#{String(character.id).padStart(2, '0')}</Text>
          </View>
          <Text style={styles.chip} numberOfLines={1}>
            {character.race} · {character.affiliation}
          </Text>
          <View style={styles.scouter}>
            <Text style={styles.kiLabel}>KI</Text>
            <Text style={styles.kiValue} numberOfLines={1} adjustsFontSizeToFit>
              {character.ki}
            </Text>
          </View>
        </View>
      </Panel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: { flex: 1, paddingTop: IMAGE_HEIGHT - BAND_HEIGHT },
  pressed: { transform: [{ translateY: 2 }] },
  band: {
    height: BAND_HEIGHT,
    backgroundColor: Colors.maroon,
    borderTopLeftRadius: Radius.card - Ink.border,
    borderTopRightRadius: Radius.card - Ink.border,
    borderBottomWidth: Ink.border,
    borderBottomColor: Colors.black,
    alignItems: 'center',
  },
  bandClip: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    borderTopLeftRadius: Radius.card - Ink.border,
    borderTopRightRadius: Radius.card - Ink.border,
  },
  image: { position: 'absolute', bottom: 0, width: '94%', height: IMAGE_HEIGHT },
  ball: { position: 'absolute', right: Spacing.two, top: Spacing.two },
  info: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.three, gap: Spacing.one },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.one },
  name: { ...Type.title, fontSize: 24, color: Colors.black, flexShrink: 1 },
  number: { fontFamily: Fonts.display, fontSize: 14, letterSpacing: 0.5, color: Colors.inkSoft, marginLeft: 'auto' },
  chip: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    color: Colors.inkSoft,
    fontSize: 11,
    fontWeight: '800',
    borderWidth: 1.5,
    borderColor: Colors.inkSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  scouter: {
    marginTop: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.black,
    borderRadius: 6,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  kiLabel: { fontFamily: Fonts.display, fontSize: 14, color: Colors.gold },
  kiValue: { color: Colors.white, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'], flexShrink: 1 },
});