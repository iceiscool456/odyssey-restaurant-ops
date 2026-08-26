import type { ViewStyle } from 'react-native';
import { shadow } from './shadow';

/** Stacking + lift. Web uses `boxShadow`; `zIndex` keeps overlays ordered. */
export const elevation = {
  none: { zIndex: 0, ...shadow.none },
  sm: { zIndex: 1, ...shadow.sm },
  md: { zIndex: 4, ...shadow.md },
  lg: { zIndex: 8, ...shadow.lg },
} satisfies Record<string, ViewStyle>;
