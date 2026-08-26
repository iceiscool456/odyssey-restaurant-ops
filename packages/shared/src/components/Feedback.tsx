import { View } from 'react-native';
import { color, radius, space } from '../tokens';
import { statusTone, type StatusTone } from '../tokens/status';
import { Typography } from './Typography';

export function Feedback({
  tone,
  title,
  body,
}: {
  tone: Extract<StatusTone, 'success' | 'warning' | 'error' | 'info' | 'empty' | 'loading'>;
  title: string;
  body: string;
}) {
  const token = statusTone[tone];
  return (
    <View
      style={{
        backgroundColor: token.bg,
        borderRadius: radius.md,
        padding: space[4],
        gap: space[1],
        borderLeftWidth: 3,
        borderLeftColor: token.fg,
      }}
    >
      <Typography variant="heading" color={token.fg}>
        {title}
      </Typography>
      <Typography variant="body" color={color.ink}>
        {body}
      </Typography>
    </View>
  );
}
