import { useState } from 'react';
import { useCreateCustomer, useGetCustomer, useListCustomers } from '@odyssey/api-client';
import { useToast } from '@odyssey/shared';
import { errorMessage, useInvalidateOps } from './api';
import { validateGuest } from './forms';
import { isEnvelope } from './result';

export function useCrmScreen() {
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
  const customers = isEnvelope(listQuery.data, 200) ? listQuery.data.data : [];
  const detail = isEnvelope(detailQuery.data, 200) ? detailQuery.data.data : undefined;

  async function saveGuest() {
    const parsed = validateGuest({ name, email, phone });
    if (!parsed.ok) {
      toast.push(parsed.message, 'warning');
      return;
    }
    try {
      const result = await createCustomer.mutateAsync({ data: parsed.value });
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

  return {
    listQuery,
    detailQuery,
    createCustomer,
    customers,
    detail,
    selectedId,
    setSelectedId,
    createOpen,
    setCreateOpen,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    saveGuest,
  };
}
