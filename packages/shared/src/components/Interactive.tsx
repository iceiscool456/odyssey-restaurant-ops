import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

export type InteractionState = {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
};

export type WebStyle = Omit<ViewStyle, 'cursor'> & {
  cursor?: ViewStyle['cursor'] | 'pointer' | 'default' | 'not-allowed' | 'auto';
};

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<WebStyle> | ((state: InteractionState) => StyleProp<WebStyle>);
};

export function Interactive({ style, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      style={(state) => {
        const webState = state as { pressed: boolean; hovered?: boolean; focused?: boolean };
        const next: InteractionState = {
          pressed: webState.pressed,
          hovered: Boolean(webState.hovered),
          focused: Boolean(webState.focused),
        };
        return (typeof style === 'function' ? style(next) : style) as StyleProp<ViewStyle>;
      }}
    />
  );
}
