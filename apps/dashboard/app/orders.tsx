import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  type OrderAction,
  OrderStatus,
  useApplyOrderAction,
  useCreateOrder,
  useGetOrder,
  useListCustomers,
  useListMenuItems,
  useListOrders,
} from '@odyssey/api-client';
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
  statusTone,
  useToast,
  type StatusTone,
} from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { errorMessage, useInvalidateOps } from '../lib/api';
import { validateTicket } from '../lib/forms';
import { ORDER_ACTION_UI, ticketActionButtons, ticketIsClosed } from '../lib/order-actions';

const STATUS_FILTERS = [
  { value: 'all', label: 'All tickets' },
  ...Object.values(OrderStatus).map((status) => ({ value: status, label: statusTone[status].label })),
];

export default function OrdersPage() {
  const toast = useToast();
  const invalidate = useInvalidateOps();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const ordersQuery = useListOrders(statusFilter === 'all' ? undefined : { status: statusFilter as (typeof OrderStatus)[keyof typeof OrderStatus] });
  const customersQuery = useListCustomers();
  const itemsQuery = useListMenuItems();
  const detailQuery = useGetOrder(selectedId ?? '', { query: { enabled: Boolean(selectedId) } });
  const createOrder = useCreateOrder();
  const applyAction = useApplyOrderAction();

  const orders = ordersQuery.data?.status === 200 ? ordersQuery.data.data : [];
  const customers = customersQuery.data?.status === 200 ? customersQuery.data.data : [];
  const items = itemsQuery.data?.status === 200 ? itemsQuery.data.data : [];
  const detail = detailQuery.data?.status === 200 ? detailQuery.data.data : undefined;

  const customersById = useMemo(() => new Map(customers.map((customer) => [customer.id, customer])), [customers]);

  function bump(itemId: string, delta: number) {
    setQuantities((current) => {
      const next = Math.max(0, (current[itemId] ?? 0) + delta);
      return { ...current, [itemId]: next };
    });
  }

  async function submitOrder() {
    const parsed = validateTicket({ customerId, quantities });
    if (!parsed.ok) {
      toast.push(parsed.message, 'warning');
      return;
    }
    try {
      const result = await createOrder.mutateAsync({
        data: { customerId: parsed.value.customerId, notes: notes.trim() || undefined, items: parsed.value.items },
      });
      if (result.status !== 201) {
        toast.push(errorMessage(result.data), 'error');
        return;
      }
      await invalidate.orders();
      toast.push(`Ticket in — ${formatCurrency(result.data.totalCents)}`, 'success');
      setCreateOpen(false);
      setNotes('');
      setQuantities({});
      setSelectedId(result.data.id);
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    }
  }

  async function runAction(action: OrderAction) {
    if (!selectedId) return;
    try {
      await applyAction.mutateAsync({ id: selectedId, data: { action } });
      await invalidate.orders();
      await detailQuery.refetch();
      toast.push(`${ORDER_ACTION_UI[action].label} sent`, action === 'cancel' ? 'warning' : 'success');
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    }
  }

  return (
    <AppShell title="Orders" actions={<Button label="New ticket" onPress={() => setCreateOpen(true)} />}>
      <View style={{ flex: 1, gap: space[4] }}>
        <Select label="Status" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
        <ScrollView contentContainerStyle={{ gap: space[3], paddingBottom: space[8] }}>
          <QueryState
            isLoading={ordersQuery.isLoading}
            error={ordersQuery.error}
            isEmpty={orders.length === 0}
            emptyTitle="No tickets in this well"
            emptyBody="Fire a ticket or clear the status filter."
          >
            {orders.map((order) => {
              const guest = customersById.get(order.customerId);
              return (
                <Card key={order.id} padded={false}>
                  <ListRow
                    title={guest?.name ?? 'Guest'}
                    meta={`${formatCurrency(order.totalCents)} · ${new Date(order.createdAt).toLocaleTimeString()}`}
                    onPress={() => setSelectedId(order.id)}
                  />
                  <View style={{ paddingHorizontal: space[3], paddingBottom: space[3] }}>
                    <Badge tone={order.status as StatusTone} />
                  </View>
                </Card>
              );
            })}
          </QueryState>
        </ScrollView>
      </View>

      <Drawer open={Boolean(selectedId)} title="Ticket" onClose={() => setSelectedId(null)}>
        <QueryState isLoading={detailQuery.isLoading} error={detailQuery.error} isEmpty={!detail}>
          {detail ? (
            <View style={{ gap: space[4] }}>
              <Badge tone={detail.status as StatusTone} />
              <Typography variant="heading">{detail.customer.name}</Typography>
              <Typography variant="caption">{detail.customer.email}</Typography>
              {detail.notes ? <Typography variant="body">{detail.notes}</Typography> : null}
              {detail.items.map((line) => (
                <View key={line.id} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3] }}>
                  <Typography variant="body">
                    {line.quantity}× {line.nameSnapshot}
                  </Typography>
                  <Typography variant="mono">{formatCurrency(line.lineTotalCents)}</Typography>
                </View>
              ))}
              <Typography variant="caption">
                Subtotal {formatCurrency(detail.subtotalCents)} · tax {formatCurrency(detail.taxCents)}
              </Typography>
              <Typography variant="heading">{formatCurrency(detail.totalCents)}</Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
                {ticketActionButtons(detail.availableActions).map((button) => (
                  <Button
                    key={button.action}
                    size="sm"
                    variant={button.variant}
                    label={button.label}
                    loading={applyAction.isPending}
                    onPress={() => void runAction(button.action)}
                  />
                ))}
              </View>
              {ticketIsClosed(detail.availableActions) ? (
                <Typography variant="caption">This ticket is closed — no further actions.</Typography>
              ) : null}
            </View>
          ) : null}
        </QueryState>
      </Drawer>

      <Drawer
        open={createOpen}
        title="Fire a ticket"
        onClose={() => {
          setCreateOpen(false);
          setQuantities({});
        }}
      >
        <View style={{ gap: space[4] }}>
          <Select
            label="Guest"
            value={customerId}
            onChange={setCustomerId}
            options={customers.map((customer) => ({ value: customer.id, label: customer.name }))}
            placeholder="Pick a guest"
          />
          <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Window table, extra lemon" />
          <Typography variant="label">Items</Typography>
          {items.map((item) => (
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
                  <Button size="sm" variant="secondary" label="−" onPress={() => bump(item.id, -1)} />
                  <Typography variant="mono">{quantities[item.id] ?? 0}</Typography>
                  <Button size="sm" variant="secondary" label="+" onPress={() => bump(item.id, 1)} />
                </View>
              </View>
              {!item.isAvailable ? (
                <Typography variant="caption" color={color.danger}>
                  The pass will reject this item if you fire it.
                </Typography>
              ) : null}
            </View>
          ))}
          <Button label="Send ticket" loading={createOrder.isPending} onPress={() => void submitOrder()} />
        </View>
      </Drawer>
    </AppShell>
  );
}
