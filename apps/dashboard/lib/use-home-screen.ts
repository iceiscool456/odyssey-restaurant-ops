import { OrderStatus, useGetHomeSummary, useGetSettings, useListCustomers, useListOrders } from '@odyssey/api-client';
import { isEnvelope } from './result';

export function useHomeScreen() {
  const summaryQuery = useGetHomeSummary();
  const settingsQuery = useGetSettings();
  const customersQuery = useListCustomers();
  const pendingQuery = useListOrders({ status: OrderStatus.pending });

  const summary = isEnvelope(summaryQuery.data, 200) ? summaryQuery.data.data : undefined;
  const settings = isEnvelope(settingsQuery.data, 200) ? settingsQuery.data.data : undefined;
  const pending = isEnvelope(pendingQuery.data, 200) ? pendingQuery.data.data : [];
  const customers = isEnvelope(customersQuery.data, 200) ? customersQuery.data.data : [];
  const customersById = new Map(customers.map((customer) => [customer.id, customer]));

  return { summaryQuery, pendingQuery, summary, settings, pending, customersById };
}
