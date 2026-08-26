import type { ViewStyle } from 'react-native';
import { color } from './color';

export function focusRing(focused: boolean): ViewStyle {
  return {
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: focused ? 2 : 0,
    outlineColor: color.focus,
    outlineOffset: 2,
  } as ViewStyle;
}
