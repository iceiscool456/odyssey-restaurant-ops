import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Badge, Card, ListRow, Typography, color, formatCurrency, layout, space } from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { useHomeScreen } from '../lib/use-home-screen';

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, minWidth: layout.kpiMin }}>
      <Typography variant="label">{label}</Typography>
      <Typography variant="title">{value}</Typography>
    </Card>
  );
}

export default function Home() {
  const router = useRouter();
  const { summaryQuery, pendingQuery, summary, settings, pending, customersById } = useHomeScreen();

  return (
    <AppShell title="Tonight’s board">
      <ScrollView contentContainerStyle={{ gap: space[5], paddingBottom: space[8] }}>
        <QueryState isLoading={summaryQuery.isLoading} error={summaryQuery.error} isEmpty={!summary}>
          {summary ? (
            <>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[4] }}>
                <Kpi label="Tickets" value={String(summary.totalOrders)} />
                <Kpi label="Revenue" value={formatCurrency(summary.revenueCents)} />
                <Kpi label="Pending" value={String(summary.pendingOrders)} />
              </View>
              {settings ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2], alignItems: 'center' }}>
                  <Badge
                    tone={settings.serviceAvailable ? 'ready' : 'cancelled'}
                    label={settings.serviceAvailable ? 'Service open' : 'Service closed'}
                  />
                  <Badge
                    tone={settings.autoAccept ? 'accepted' : 'info'}
                    label={settings.autoAccept ? 'Auto-accept on' : 'Manual accept'}
                  />
                  <Typography variant="caption">{settings.prepTimeMinutes} min prep</Typography>
                </View>
              ) : null}
              <Card>
                <View style={{ gap: space[3] }}>
                  <Typography variant="heading">Popular items</Typography>
                  {summary.popularItems.length === 0 ? (
                    <Typography variant="caption">No completed tickets yet.</Typography>
                  ) : (
                    summary.popularItems.map((item) => (
                      <View key={item.menuItemId} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Typography variant="body">{item.name}</Typography>
                        <Typography variant="mono">{item.quantity} sold</Typography>
                      </View>
                    ))
                  )}
                </View>
              </Card>
              <Card padded={false}>
                <View style={{ padding: space[5], paddingBottom: space[3] }}>
                  <Typography variant="heading">Pending well</Typography>
                </View>
                {pendingQuery.isLoading ? (
                  <View style={{ paddingHorizontal: space[5], paddingBottom: space[5] }}>
                    <Typography variant="caption" color={color.inkMuted}>
                      Loading…
                    </Typography>
                  </View>
                ) : null}
                {!pendingQuery.isLoading && pending.length === 0 ? (
                  <View style={{ paddingHorizontal: space[5], paddingBottom: space[5] }}>
                    <Typography variant="caption">No tickets waiting on accept.</Typography>
                  </View>
                ) : (
                  pending.map((order) => {
                    const guest = customersById.get(order.customerId);
                    return (
                      <ListRow
                        key={order.id}
                        title={guest?.name ?? 'Guest'}
                        meta={`${formatCurrency(order.totalCents)} · ${new Date(order.createdAt).toLocaleTimeString()}`}
                        onPress={() => router.push('/orders')}
                      />
                    );
                  })
                )}
              </Card>
            </>
          ) : null}
        </QueryState>
      </ScrollView>
    </AppShell>
  );
}
