import { useState } from 'react';
import { Text, View } from 'react-native';
import { border, color, elevation, focusRing, fontFamily, fontSize, layout, radius, space } from '../tokens';
import { Interactive } from './Interactive';
import { Typography } from './Typography';

export type SelectOption = { value: string; label: string };

type Props = {
  label: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function Select({ label, value, options, placeholder = 'Select…', disabled, error, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={{ gap: space[1], width: '100%', zIndex: open ? 20 : 1 }}>
      <Typography variant="label">{label}</Typography>
      <Interactive
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        style={(state) => ({
          minHeight: layout.controlMd,
          borderWidth: border.hairline,
          borderColor: error ? color.danger : state.focused ? color.accent : color.line,
          borderRadius: radius.md,
          backgroundColor: disabled ? color.canvasSubtle : color.surfaceRaised,
          paddingHorizontal: space[3],
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...focusRing(state.focused && !disabled),
        })}
      >
        <Text style={{ fontFamily: fontFamily.sans, fontSize: fontSize.body, color: selected ? color.ink : color.inkFaint }}>
          {selected?.label ?? placeholder}
        </Text>
      </Interactive>
      {open && !disabled ? (
        <View
          style={{
            position: 'absolute',
            top: layout.selectMenuOffset,
            left: 0,
            right: 0,
            backgroundColor: color.surfaceRaised,
            borderWidth: border.hairline,
            borderColor: color.line,
            borderRadius: radius.md,
            ...elevation.md,
            overflow: 'hidden',
          }}
        >
          {options.map((option) => (
            <Interactive
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={(state) => ({
                paddingHorizontal: space[3],
                paddingVertical: space[2],
                backgroundColor: option.value === value || state.hovered ? color.accentMuted : color.surfaceRaised,
              })}
              accessibilityRole="button"
            >
              <Text style={{ fontFamily: fontFamily.sans, fontSize: fontSize.body, color: color.ink }}>{option.label}</Text>
            </Interactive>
          ))}
        </View>
      ) : null}
      {error ? (
        <Typography variant="caption" color={color.danger}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
}
