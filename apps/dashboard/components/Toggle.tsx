import { Button, Typography, space } from '@odyssey/shared';
import { View } from 'react-native';

export function Toggle({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[3] }}>
      <Typography variant="body" style={{ flex: 1 }}>
        {label}
      </Typography>
      <Button
        size="sm"
        variant={value ? 'primary' : 'secondary'}
        label={value ? 'On' : 'Off'}
        disabled={disabled}
        onPress={() => onChange(!value)}
      />
    </View>
  );
}
