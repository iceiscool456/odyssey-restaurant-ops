import type { ViewStyle } from 'react-native';

/** Web `boxShadow` — RN `shadow*` props are deprecated on Expo web. */
export const shadow = {
  none: { boxShadow: 'none' },
  sm: { boxShadow: '0 1px 3px rgba(27, 20, 16, 0.08)' },
  md: { boxShadow: '0 6px 16px rgba(27, 20, 16, 0.10)' },
  lg: { boxShadow: '0 16px 32px rgba(27, 20, 16, 0.16)' },
} satisfies Record<string, ViewStyle>;
