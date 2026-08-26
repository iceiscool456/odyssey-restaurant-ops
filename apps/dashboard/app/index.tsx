import { Badge, Card, Typography, color, formatCurrency, space } from '@odyssey/shared';
import { useListMenuItems } from '@odyssey/api-client';
import { ActivityIndicator, View } from 'react-native';
import { AppShell } from '../components/AppShell';

export default function Home() {
  const query = useListMenuItems();
  const items = query.data?.status === 200 ? query.data.data : [];

  return (
    <AppShell title="Tonight’s board">
      <Typography variant="body" color={color.inkMuted}>
        Live menu loaded through the generated contract.
      </Typography>
      {query.isLoading ? <ActivityIndicator color={color.accent} /> : null}
      {query.error ? (
        <Typography color={color.danger}>Could not load menu. Is the API running?</Typography>
      ) : null}
      <View style={{ gap: space[3], maxWidth: 560 }}>
        {items.map((item) => (
          <Card key={item.id} padded>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[3] }}>
              <View style={{ flex: 1, gap: space[1] }}>
                <Typography variant="heading">{item.name}</Typography>
                <Typography variant="caption">{formatCurrency(item.priceCents)}</Typography>
              </View>
              <Badge tone={item.isAvailable ? 'ready' : 'cancelled'} label={item.isAvailable ? 'Available' : 'Unavailable'} />
            </View>
          </Card>
        ))}
      </View>
    </AppShell>
  );
}
