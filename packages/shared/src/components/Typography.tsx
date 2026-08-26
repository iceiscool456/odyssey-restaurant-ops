import { Text, type TextProps } from 'react-native';
import { color, fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from '../tokens';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'bodyLg' | 'caption' | 'label' | 'mono';

const styles: Record<Variant, object> = {
  display: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.display,
    lineHeight: fontSize.display * lineHeight.tight,
    fontWeight: fontWeight.bold,
    color: color.ink,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.title,
    lineHeight: fontSize.title * lineHeight.snug,
    fontWeight: fontWeight.bold,
    color: color.ink,
  },
  heading: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.heading,
    lineHeight: fontSize.heading * lineHeight.snug,
    fontWeight: fontWeight.semibold,
    color: color.ink,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.body,
    lineHeight: fontSize.body * lineHeight.body,
    fontWeight: fontWeight.regular,
    color: color.ink,
  },
  bodyLg: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.bodyLg,
    lineHeight: fontSize.bodyLg * lineHeight.body,
    fontWeight: fontWeight.regular,
    color: color.ink,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.caption,
    lineHeight: fontSize.caption * lineHeight.body,
    fontWeight: fontWeight.regular,
    color: color.inkMuted,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.caption,
    lineHeight: fontSize.caption * lineHeight.body,
    fontWeight: fontWeight.semibold,
    color: color.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.label,
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.caption,
    color: color.ink,
  },
};

export function Typography({
  variant = 'body',
  color: colorOverride,
  children,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  return (
    <Text {...rest} style={[styles[variant], colorOverride ? { color: colorOverride } : null, rest.style]}>
      {children}
    </Text>
  );
}
