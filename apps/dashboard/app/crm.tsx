import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useCreateCustomer, useGetCustomer, useListCustomers } from '@odyssey/api-client';
import {
  Badge,
  Button,
  Card,
  Drawer,
  Input,
  ListRow,
  Typography,
  formatCurrency,
  space,
  useToast,
  type StatusTone,
} from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { errorMessage, useInvalidateOps } from '../lib/api';

export default function CrmPage() {
  const toast = useToast();
  const invalidate = useInvalidateOps();
  const listQuery = useListCustomers();
  const createCustomer = useCreateCustomer();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const detailQuery = useGetCustomer(selectedId ?? '', { query: { enabled: Boolean(selectedId) } });
  const customers = listQuery.data?.status === 200 ? listQuery.data.data : [];
  const detail = detailQuery.data?.status === 200 ? detailQuery.data.data : undefined;

  async function saveGuest() {
    if (!name.trim() || !email.trim()) {
      toast.push('Name and email are required', 'warning');
      return;
    }
    try {
      const result = await createCustomer.mutateAsync({
        data: { name: name.trim(), email: email.trim(), phone: phone.trim() || null },
      });
      if (result.status !== 201) {
        toast.push(errorMessage(result.data), 'error');
        return;
      }
      await invalidate.customers();
      toast.push('Guest added', 'success');
      setCreateOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setSelectedId(result.data.id);
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    }
  }

  return (
    <AppShell title="CRM" actions={<Button label="Add guest" onPress={() => setCreateOpen(true)} />}>
      <ScrollView contentContainerStyle={{ gap: space[3], paddingBottom: space[8] }}>
        <QueryState
          isLoading={listQuery.isLoading}
          error={listQuery.error}
          isEmpty={customers.length === 0}
          emptyTitle="No guests yet"
          emptyBody="Add a guest before you fire their first ticket."
        >
          {customers.map((customer) => (
            <Card key={customer.id} padded={false}>
              <ListRow
                title={customer.name}
                meta={`${customer.orderCount} orders · ${formatCurrency(customer.spendCents)} completed spend`}
                onPress={() => setSelectedId(customer.id)}
              />
            </Card>
          ))}
        </QueryState>
      </ScrollView>

      <Drawer open={Boolean(selectedId)} title="Guest" onClose={() => setSelectedId(null)}>
        <QueryState isLoading={detailQuery.isLoading} error={detailQuery.error} isEmpty={!detail}>
          {detail ? (
            <View style={{ gap: space[4] }}>
              <Typography variant="heading">{detail.name}</Typography>
              <Typography variant="caption">{detail.email}</Typography>
              {detail.phone ? <Typography variant="caption">{detail.phone}</Typography> : null}
              <Typography variant="body">
                {detail.orderCount} orders · {formatCurrency(detail.spendCents)} completed spend
              </Typography>
              <Typography variant="label">Recent tickets</Typography>
              {detail.recentOrders.length === 0 ? (
                <Typography variant="caption">No tickets yet.</Typography>
              ) : (
                detail.recentOrders.map((order) => (
                  <View key={order.id} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3] }}>
                    <Badge tone={order.status as StatusTone} />
                    <Typography variant="mono">{formatCurrency(order.totalCents)}</Typography>
                  </View>
                ))
              )}
            </View>
          ) : null}
        </QueryState>
      </Drawer>

      <Drawer open={createOpen} title="New guest" onClose={() => setCreateOpen(false)}>
        <View style={{ gap: space[4] }}>
          <Input label="Name" value={name} onChangeText={setName} placeholder="Ada Lovelace" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="ada@example.com" autoCapitalize="none" />
          <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Optional" />
          <Button label="Save guest" loading={createCustomer.isPending} onPress={() => void saveGuest()} />
        </View>
      </Drawer>
    </AppShell>
  );
}
