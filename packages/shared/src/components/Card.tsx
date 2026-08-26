import { View, type ViewProps } from 'react-native';
import { border, color, radius, shadow, space } from '../tokens';

type Tone = 'default' | 'muted' | 'raised';

export function Card({
  tone = 'default',
  padded = true,
  children,
  style,
  ...rest
}: ViewProps & { tone?: Tone; padded?: boolean }) {
  const backgroundColor = tone === 'muted' ? color.canvasSubtle : tone === 'raised' ? color.surfaceRaised : color.surface;
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor,
          borderWidth: border.hairline,
          borderColor: color.line,
          borderRadius: radius.lg,
          padding: padded ? space[5] : 0,
          ...(tone === 'raised' ? shadow.md : shadow.sm),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
