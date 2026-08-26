import { ScrollView, View } from 'react-native';
import { Badge, Button, Card, Drawer, Input, ListRow, Typography, formatCurrency, space } from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { orderBadgeTone } from '../lib/order-badge';
import { useCrmScreen } from '../lib/use-crm-screen';

export default function CrmPage() {
  const screen = useCrmScreen();

  return (
    <AppShell title="CRM" actions={<Button label="Add guest" onPress={() => screen.setCreateOpen(true)} />}>
      <ScrollView contentContainerStyle={{ gap: space[3], paddingBottom: space[8] }}>
        <QueryState
          isLoading={screen.listQuery.isLoading}
          error={screen.listQuery.error}
          isEmpty={screen.customers.length === 0}
          emptyTitle="No guests yet"
          emptyBody="Add a guest before you fire their first ticket."
        >
          {screen.customers.map((customer) => (
            <Card key={customer.id} padded={false}>
              <ListRow
                title={customer.name}
                meta={`${customer.orderCount} orders · ${formatCurrency(customer.spendCents)} completed spend`}
                onPress={() => screen.setSelectedId(customer.id)}
              />
            </Card>
          ))}
        </QueryState>
      </ScrollView>

      <Drawer open={Boolean(screen.selectedId)} title="Guest" onClose={() => screen.setSelectedId(null)}>
        <QueryState isLoading={screen.detailQuery.isLoading} error={screen.detailQuery.error} isEmpty={!screen.detail}>
          {screen.detail ? (
            <View style={{ gap: space[4] }}>
              <Typography variant="heading">{screen.detail.name}</Typography>
              <Typography variant="caption">{screen.detail.email}</Typography>
              {screen.detail.phone ? <Typography variant="caption">{screen.detail.phone}</Typography> : null}
              <Typography variant="body">
                {screen.detail.orderCount} orders · {formatCurrency(screen.detail.spendCents)} completed spend
              </Typography>
              <Typography variant="label">Recent tickets</Typography>
              {screen.detail.recentOrders.length === 0 ? (
                <Typography variant="caption">No tickets yet.</Typography>
              ) : (
                screen.detail.recentOrders.map((order) => (
                  <View key={order.id} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3] }}>
                    <Badge tone={orderBadgeTone[order.status]} />
                    <Typography variant="mono">{formatCurrency(order.totalCents)}</Typography>
                  </View>
                ))
              )}
            </View>
          ) : null}
        </QueryState>
      </Drawer>

      <Drawer open={screen.createOpen} title="New guest" onClose={() => screen.setCreateOpen(false)}>
        <View style={{ gap: space[4] }}>
          <Input label="Name" value={screen.name} onChangeText={screen.setName} placeholder="Ada Lovelace" />
          <Input
            label="Email"
            value={screen.email}
            onChangeText={screen.setEmail}
            placeholder="ada@example.com"
            autoCapitalize="none"
          />
          <Input label="Phone" value={screen.phone} onChangeText={screen.setPhone} placeholder="Optional" />
          <Button label="Save guest" loading={screen.createCustomer.isPending} onPress={() => void screen.saveGuest()} />
        </View>
      </Drawer>
    </AppShell>
  );
}
