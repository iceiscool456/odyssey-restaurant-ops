import { type MenuItem } from '@odyssey/api-client';
import { centsToDollarInput } from '@odyssey/shared';

export type ItemDraft = {
  id?: string;
  name: string;
  categoryId: string;
  price: string;
  description: string;
};

export function emptyItemDraft(categoryId: string): ItemDraft {
  return { name: '', categoryId, price: '', description: '' };
}

export function itemToDraft(item: MenuItem): ItemDraft {
  return {
    id: item.id,
    name: item.name,
    categoryId: item.categoryId,
    price: centsToDollarInput(item.priceCents),
    description: item.description ?? '',
  };
}
