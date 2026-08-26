import { useMemo, useState } from 'react';
import { type MenuItem, useCreateMenuCategory, useCreateMenuItem, useListMenuCategories, useListMenuItems, useUpdateMenuItem } from '@odyssey/api-client';
import { useToast } from '@odyssey/shared';
import { errorMessage, useInvalidateOps } from './api';
import { validateCategoryName, validateMenuItem } from './forms';
import { emptyItemDraft, itemToDraft, type ItemDraft } from './item-draft';
import { isEnvelope } from './result';

export function useMenuScreen() {
  const toast = useToast();
  const invalidate = useInvalidateOps();
  const categoriesQuery = useListMenuCategories();
  const itemsQuery = useListMenuItems();
  const createCategory = useCreateMenuCategory();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();

  const categories = isEnvelope(categoriesQuery.data, 200) ? categoriesQuery.data.data : [];
  const items = isEnvelope(itemsQuery.data, 200) ? itemsQuery.data.data : [];

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [draft, setDraft] = useState<ItemDraft | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const grouped = useMemo(
    () =>
      categories.map((category) => ({
        category,
        items: items.filter((item) => item.categoryId === category.id),
      })),
    [categories, items],
  );
  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.name }));

  async function saveCategory() {
    const parsed = validateCategoryName(categoryName);
    if (!parsed.ok) {
      toast.push(parsed.message, 'warning');
      return;
    }
    try {
      await createCategory.mutateAsync({
        data: { name: parsed.value, sortOrder: categories.length },
      });
      await invalidate.menu();
      toast.push('Category added', 'success');
      setCategoryName('');
      setCategoryOpen(false);
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    }
  }

  async function saveItem() {
    if (!draft) return;
    const parsed = validateMenuItem(draft);
    if (!parsed.ok) {
      toast.push(parsed.message, 'warning');
      return;
    }
    try {
      if (draft.id) {
        await updateItem.mutateAsync({
          id: draft.id,
          data: {
            name: parsed.value.name,
            categoryId: parsed.value.categoryId,
            priceCents: parsed.value.priceCents,
            description: draft.description.trim() || null,
          },
        });
        toast.push('Item updated', 'success');
      } else {
        await createItem.mutateAsync({
          data: {
            name: parsed.value.name,
            categoryId: parsed.value.categoryId,
            priceCents: parsed.value.priceCents,
            description: draft.description.trim() || null,
            isAvailable: true,
          },
        });
        toast.push('Item added to the board', 'success');
      }
      await invalidate.menu();
      setDraft(null);
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    }
  }

  async function toggleAvailability(item: MenuItem) {
    setTogglingId(item.id);
    try {
      await updateItem.mutateAsync({
        id: item.id,
        data: { isAvailable: !item.isAvailable },
      });
      await invalidate.menu();
      toast.push(item.isAvailable ? `${item.name} is 86’d` : `${item.name} is back`, item.isAvailable ? 'warning' : 'success');
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    } finally {
      setTogglingId(null);
    }
  }

  return {
    categoriesQuery,
    itemsQuery,
    createCategory,
    createItem,
    updateItem,
    categories,
    grouped,
    categoryOptions,
    categoryOpen,
    setCategoryOpen,
    categoryName,
    setCategoryName,
    draft,
    setDraft,
    togglingId,
    openNewItem: () => setDraft(emptyItemDraft(categories[0]?.id ?? '')),
    openEditItem: (item: MenuItem) => setDraft(itemToDraft(item)),
    closeItem: () => setDraft(null),
    saveCategory,
    saveItem,
    toggleAvailability,
  };
}
