import { ActivityIndicator, Text, type ViewStyle } from 'react-native';
import { border, color, focusRing, fontFamily, fontSize, fontWeight, layout, radius, space } from '../tokens';
import { Interactive, type InteractionState } from './Interactive';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
};

const sizeStyle: Record<Size, ViewStyle> = {
  sm: { paddingVertical: space[1], paddingHorizontal: space[3], minHeight: layout.controlSm },
  md: { paddingVertical: space[2], paddingHorizontal: space[4], minHeight: layout.controlMd },
  lg: { paddingVertical: space[3], paddingHorizontal: space[5], minHeight: layout.controlLg },
};

function palette(variant: Variant, state: InteractionState, disabled: boolean) {
  if (disabled) {
    return { bg: color.canvasSubtle, fg: color.inkFaint, border: color.line };
  }
  const active = state.pressed || state.hovered;
  switch (variant) {
    case 'primary':
      return {
        bg: state.pressed ? color.accentPressed : active ? color.accentHover : color.accent,
        fg: color.surfaceRaised,
        border: color.transparent,
      };
    case 'danger':
      return {
        bg: state.pressed ? color.dangerPressed : active ? color.dangerHover : color.danger,
        fg: color.surfaceRaised,
        border: color.transparent,
      };
    case 'secondary':
      return {
        bg: active ? color.canvasSubtle : color.surface,
        fg: color.ink,
        border: color.line,
      };
    case 'ghost':
      return {
        bg: active ? color.accentMuted : color.transparent,
        fg: color.accent,
        border: color.transparent,
      };
  }
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
}: Props) {
  const inactive = disabled || loading;
  return (
    <Interactive
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={(state) => {
        const tone = palette(variant, state, inactive);
        return {
          ...sizeStyle[size],
          backgroundColor: tone.bg,
          borderColor: tone.border,
          borderWidth: variant === 'secondary' ? border.hairline : 0,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: space[2],
          opacity: inactive && variant === 'ghost' ? 0.5 : 1,
          ...focusRing(state.focused),
          cursor: inactive ? 'not-allowed' : 'pointer',
        } as ViewStyle;
      }}
    >
      {(state) => {
        const tone = palette(variant, state as InteractionState, inactive);
        return (
          <>
            {loading ? <ActivityIndicator color={tone.fg} size="small" /> : null}
            <Text
              style={{
                color: tone.fg,
                fontFamily: fontFamily.sans,
                fontSize: size === 'sm' ? fontSize.caption : fontSize.body,
                fontWeight: fontWeight.semibold,
              }}
            >
              {label}
            </Text>
          </>
        );
      }}
    </Interactive>
  );
}
