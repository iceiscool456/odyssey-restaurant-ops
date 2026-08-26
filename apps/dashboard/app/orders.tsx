import { ScrollView, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  Drawer,
  Input,
  ListRow,
  Select,
  Typography,
  color,
  formatCurrency,
  space,
} from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { orderBadgeTone } from '../lib/order-badge';
import { ticketActionButtons, ticketIsClosed } from '../lib/order-actions';
import { STATUS_FILTERS, useOrdersScreen } from '../lib/use-orders-screen';

export default function OrdersPage() {
  const screen = useOrdersScreen();

  return (
    <AppShell title="Orders" actions={<Button label="New ticket" onPress={() => screen.setCreateOpen(true)} />}>
      <View style={{ flex: 1, gap: space[4] }}>
        <Select label="Status" value={screen.statusFilter} options={STATUS_FILTERS} onChange={screen.setStatusFilter} />
        <ScrollView contentContainerStyle={{ gap: space[3], paddingBottom: space[8] }}>
          <QueryState
            isLoading={screen.ordersQuery.isLoading}
            error={screen.ordersQuery.error}
            isEmpty={screen.orders.length === 0}
            emptyTitle="No tickets in this well"
            emptyBody="Fire a ticket or clear the status filter."
          >
            {screen.orders.map((order) => {
              const guest = screen.customersById.get(order.customerId);
              return (
                <Card key={order.id} padded={false}>
                  <ListRow
                    title={guest?.name ?? 'Guest'}
                    meta={`${formatCurrency(order.totalCents)} · ${new Date(order.createdAt).toLocaleTimeString()}`}
                    onPress={() => screen.setSelectedId(order.id)}
                  />
                  <View style={{ paddingHorizontal: space[3], paddingBottom: space[3] }}>
                    <Badge tone={orderBadgeTone[order.status]} />
                  </View>
                </Card>
              );
            })}
          </QueryState>
        </ScrollView>
      </View>

      <Drawer open={Boolean(screen.selectedId)} title="Ticket" onClose={() => screen.setSelectedId(null)}>
        <QueryState isLoading={screen.detailQuery.isLoading} error={screen.detailQuery.error} isEmpty={!screen.detail}>
          {screen.detail ? (
            <View style={{ gap: space[4] }}>
              <Badge tone={orderBadgeTone[screen.detail.status]} />
              <Typography variant="heading">{screen.detail.customer.name}</Typography>
              <Typography variant="caption">{screen.detail.customer.email}</Typography>
              {screen.detail.notes ? <Typography variant="body">{screen.detail.notes}</Typography> : null}
              {screen.detail.items.map((line) => (
                <View key={line.id} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3] }}>
                  <Typography variant="body">
                    {line.quantity}× {line.nameSnapshot}
                  </Typography>
                  <Typography variant="mono">{formatCurrency(line.lineTotalCents)}</Typography>
                </View>
              ))}
              <Typography variant="caption">
                Subtotal {formatCurrency(screen.detail.subtotalCents)} · tax {formatCurrency(screen.detail.taxCents)}
              </Typography>
              <Typography variant="heading">{formatCurrency(screen.detail.totalCents)}</Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
                {ticketActionButtons(screen.detail.availableActions).map((button) => (
                  <Button
                    key={button.action}
                    size="sm"
                    variant={button.variant}
                    label={button.label}
                    loading={screen.applyAction.isPending}
                    onPress={() => void screen.runAction(button.action)}
                  />
                ))}
              </View>
              {ticketIsClosed(screen.detail.availableActions) ? (
                <Typography variant="caption">This ticket is closed — no further actions.</Typography>
              ) : null}
            </View>
          ) : null}
        </QueryState>
      </Drawer>

      <Drawer open={screen.createOpen} title="Fire a ticket" onClose={screen.closeCreate}>
        <View style={{ gap: space[4] }}>
          <Select
            label="Guest"
            value={screen.customerId}
            onChange={screen.setCustomerId}
            options={screen.customers.map((customer) => ({ value: customer.id, label: customer.name }))}
            placeholder="Pick a guest"
          />
          <Input label="Notes" value={screen.notes} onChangeText={screen.setNotes} placeholder="Window table, extra lemon" />
          <Typography variant="label">Items</Typography>
          {screen.items.map((item) => (
            <View key={item.id} style={{ gap: space[1] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[2] }}>
                <View style={{ flex: 1 }}>
                  <Typography variant="body">{item.name}</Typography>
                  <Typography variant="caption">
                    {formatCurrency(item.priceCents)}
                    {item.isAvailable ? '' : ' · 86’d'}
                  </Typography>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}>
                  <Button size="sm" variant="secondary" label="−" onPress={() => screen.bump(item.id, -1)} />
                  <Typography variant="mono">{screen.quantities[item.id] ?? 0}</Typography>
                  <Button size="sm" variant="secondary" label="+" onPress={() => screen.bump(item.id, 1)} />
                </View>
              </View>
              {!item.isAvailable ? (
                <Typography variant="caption" color={color.danger}>
                  The pass will reject this item if you fire it.
                </Typography>
              ) : null}
            </View>
          ))}
          <Button label="Send ticket" loading={screen.createOrder.isPending} onPress={() => void screen.submitOrder()} />
        </View>
      </Drawer>
    </AppShell>
  );
}
