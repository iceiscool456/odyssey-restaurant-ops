import type { ReactNode } from 'react';
import { NavItem, Typography, border, color, layout, space } from '@odyssey/shared';
import { type Href, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';

const items = [
  { path: '/', label: 'Home' },
  { path: '/ui-library', label: 'UI library' },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: color.canvas, minHeight: '100%' }}>
      <View
        style={{
          width: layout.sidebar,
          padding: space[5],
          borderRightWidth: border.hairline,
          borderRightColor: color.line,
          backgroundColor: color.surface,
          gap: space[4],
        }}
      >
        <Typography variant="label">Odyssey</Typography>
        <Typography variant="heading">Service floor</Typography>
        <View style={{ gap: space[1], marginTop: space[3] }}>
          {items.map((item) => (
            <NavItem
              key={item.path}
              label={item.label}
              active={pathname === item.path}
              onPress={() => router.push(item.path as Href)}
            />
          ))}
        </View>
      </View>
      <View style={{ flex: 1, padding: space[6], gap: space[5] }}>
        <Typography variant="title">{title}</Typography>
        {children}
      </View>
    </View>
  );
}
