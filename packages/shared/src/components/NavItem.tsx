import { Text } from 'react-native';
import { color, focusRing, fontFamily, fontSize, fontWeight, radius, space } from '../tokens';
import { Interactive } from './Interactive';

export function NavItem({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Interactive
      accessibilityRole="button"
      onPress={onPress}
      style={(state) => ({
        paddingVertical: space[2],
        paddingHorizontal: space[3],
        borderRadius: radius.md,
        backgroundColor: active || state.hovered || state.pressed ? color.accentMuted : color.transparent,
        cursor: 'pointer',
        ...focusRing(state.focused),
      })}
    >
      <Text
        style={{
          fontFamily: fontFamily.sans,
          fontSize: fontSize.body,
          fontWeight: active ? fontWeight.semibold : fontWeight.medium,
          color: active ? color.accent : color.ink,
        }}
      >
        {label}
      </Text>
    </Interactive>
  );
}
