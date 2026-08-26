import { useState } from 'react';
import { TextInput, View, type TextInputProps, type TextStyle } from 'react-native';
import { border, color, focusRing, fontFamily, fontSize, layout, radius, space } from '../tokens';
import { Typography } from './Typography';

type Props = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, editable = true, onFocus, onBlur, ...rest }: Props) {
  const invalid = Boolean(error);
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ gap: space[1], width: '100%' }}>
      <Typography variant="label">{label}</Typography>
      <TextInput
        {...rest}
        editable={editable}
        placeholderTextColor={color.inkFaint}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          {
            fontFamily: fontFamily.sans,
            fontSize: fontSize.body,
            color: color.ink,
            backgroundColor: editable ? color.surfaceRaised : color.canvasSubtle,
            borderWidth: border.hairline,
            borderColor: invalid ? color.danger : focused ? color.accent : color.line,
            borderRadius: radius.md,
            paddingHorizontal: space[3],
            paddingVertical: space[2],
            minHeight: layout.controlMd,
            ...focusRing(focused && editable),
          } as TextStyle,
          rest.style,
        ]}
      />
      {error ? (
        <Typography variant="caption" color={color.danger}>
          {error}
        </Typography>
      ) : hint ? (
        <Typography variant="caption">{hint}</Typography>
      ) : null}
    </View>
  );
}
