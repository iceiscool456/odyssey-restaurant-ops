import { Text, View } from 'react-native';
import { border, color, fontFamily, fontSize, space } from '../tokens';
import { Interactive } from './Interactive';

export function ListRow({
  title,
  meta,
  onPress,
}: {
  title: string;
  meta?: string;
  onPress?: () => void;
}) {
  return (
    <Interactive
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={(state) => ({
        paddingVertical: space[3],
        paddingHorizontal: space[3],
        borderBottomWidth: border.hairline,
        borderBottomColor: color.line,
        backgroundColor: state.hovered || state.pressed ? color.canvasSubtle : color.transparent,
        cursor: onPress ? 'pointer' : 'default',
      })}
    >
      <View style={{ gap: space.hair }}>
        <Text style={{ fontFamily: fontFamily.sans, fontSize: fontSize.body, color: color.ink }}>{title}</Text>
        {meta ? (
          <Text style={{ fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: color.inkMuted }}>{meta}</Text>
        ) : null}
      </View>
    </Interactive>
  );
}
