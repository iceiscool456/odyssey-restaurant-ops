import { Text, View } from 'react-native';
import { fontFamily, fontSize, fontWeight, letterSpacing, radius, space } from '../tokens';
import { statusTone, type StatusTone } from '../tokens/status';

export function Badge({ tone, label }: { tone: StatusTone; label?: string }) {
  const token = statusTone[tone];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: token.bg,
        borderRadius: radius.full,
        paddingHorizontal: space[2],
        paddingVertical: space.hair,
      }}
    >
      <Text
        style={{
          color: token.fg,
          fontFamily: fontFamily.sans,
          fontSize: fontSize.caption,
          fontWeight: fontWeight.semibold,
          letterSpacing: letterSpacing.badge,
        }}
      >
        {label ?? token.label}
      </Text>
    </View>
  );
}
