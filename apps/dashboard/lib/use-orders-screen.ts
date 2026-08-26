import { useMemo, useState } from 'react';
import {
  OrderStatus,
  type OrderAction,
  useApplyOrderAction,
  useCreateOrder,
  useGetOrder,
  useListCustomers,
  useListMenuItems,
  useListOrders,
} from '@odyssey/api-client';
import { formatCurrency, statusTone, useToast } from '@odyssey/shared';
import { errorMessage, useInvalidateOps } from './api';
import { validateTicket } from './forms';
import { ORDER_ACTION_UI } from './order-actions';
import { isEnvelope } from './result';

export const STATUS_FILTERS = [
  { value: 'all', label: 'All tickets' },
  ...Object.values(OrderStatus).map((status) => ({ value: status, label: statusTone[status].label })),
];

export function useOrdersScreen() {
  const toast = useToast();
  const invalidate = useInvalidateOps();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const listParams = statusFilter === 'all' ? undefined : { status: statusFilter as OrderStatus };
  const ordersQuery = useListOrders(listParams);
  const customersQuery = useListCustomers();
  const itemsQuery = useListMenuItems();
  const detailQuery = useGetOrder(selectedId ?? '', { query: { enabled: Boolean(selectedId) } });
  const createOrder = useCreateOrder();
  const applyAction = useApplyOrderAction();

  const orders = isEnvelope(ordersQuery.data, 200) ? ordersQuery.data.data : [];
  const customers = isEnvelope(customersQuery.data, 200) ? customersQuery.data.data : [];
  const items = isEnvelope(itemsQuery.data, 200) ? itemsQuery.data.data : [];
  const detail = isEnvelope(detailQuery.data, 200) ? detailQuery.data.data : undefined;
  const customersById = useMemo(() => new Map(customers.map((customer) => [customer.id, customer])), [customers]);

  function bump(itemId: string, delta: number) {
    setQuantities((current) => {
      const next = Math.max(0, (current[itemId] ?? 0) + delta);
      return { ...current, [itemId]: next };
    });
  }

  function closeCreate() {
    setCreateOpen(false);
    setQuantities({});
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
      closeCreate();
      setNotes('');
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

  return {
    statusFilter,
    setStatusFilter,
    selectedId,
    setSelectedId,
    createOpen,
    setCreateOpen,
    closeCreate,
    customerId,
    setCustomerId,
    notes,
    setNotes,
    quantities,
    bump,
    ordersQuery,
    detailQuery,
    createOrder,
    applyAction,
    orders,
    customers,
    items,
    detail,
    customersById,
    submitOrder,
    runAction,
  };
}
