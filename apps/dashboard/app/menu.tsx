import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  type MenuItem,
  useCreateMenuCategory,
  useCreateMenuItem,
  useListMenuCategories,
  useListMenuItems,
  useUpdateMenuItem,
} from '@odyssey/api-client';
import {
  Badge,
  Button,
  Card,
  Drawer,
  Input,
  Modal,
  Select,
  Typography,
  centsToDollarInput,
  color,
  formatCurrency,
  space,
  useToast,
} from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { errorMessage, useInvalidateOps } from '../lib/api';
import { validateCategoryName, validateMenuItem } from '../lib/forms';

type ItemDraft = {
  id?: string;
  name: string;
  categoryId: string;
  price: string;
  description: string;
};

const emptyDraft = (categoryId: string): ItemDraft => ({
  name: '',
  categoryId,
  price: '',
  description: '',
});

export default function MenuPage() {
  const toast = useToast();
  const invalidate = useInvalidateOps();
  const categoriesQuery = useListMenuCategories();
  const itemsQuery = useListMenuItems();
  const createCategory = useCreateMenuCategory();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();

  const categories = categoriesQuery.data?.status === 200 ? categoriesQuery.data.data : [];
  const items = itemsQuery.data?.status === 200 ? itemsQuery.data.data : [];

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

  function closeItem() {
    setDraft(null);
  }

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
      closeItem();
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

  const loading = categoriesQuery.isLoading || itemsQuery.isLoading;
  const error = categoriesQuery.error ?? itemsQuery.error;

  return (
    <AppShell
      title="Menu"
      actions={
        <View style={{ flexDirection: 'row', gap: space[2] }}>
          <Button variant="secondary" label="Add category" onPress={() => setCategoryOpen(true)} />
          <Button
            label="Add item"
            onPress={() => setDraft(emptyDraft(categories[0]?.id ?? ''))}
            disabled={categories.length === 0}
          />
        </View>
      }
    >
      <ScrollView contentContainerStyle={{ gap: space[5], paddingBottom: space[8] }}>
        <Typography variant="body" color={color.inkMuted}>
          Price and availability are the contract — 86 an item here and ticket create will refuse it.
        </Typography>
        <QueryState
          isLoading={loading}
          error={error}
          isEmpty={categories.length === 0}
          emptyTitle="No categories"
          emptyBody="Add a category before you hang items on the board."
        >
          {grouped.map(({ category, items: categoryItems }) => (
            <View key={category.id} style={{ gap: space[3] }}>
              <Typography variant="heading">{category.name}</Typography>
              {categoryItems.length === 0 ? (
                <Typography variant="caption">No items in this well yet.</Typography>
              ) : (
                categoryItems.map((item) => (
                  <Card key={item.id} padded>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space[3], alignItems: 'center' }}>
                      <View style={{ flex: 1, gap: space[1] }}>
                        <Typography variant="heading">{item.name}</Typography>
                        <Typography variant="caption">{formatCurrency(item.priceCents)}</Typography>
                        {item.description ? <Typography variant="body">{item.description}</Typography> : null}
                      </View>
                      <View style={{ gap: space[2], alignItems: 'flex-end' }}>
                        <Badge
                          tone={item.isAvailable ? 'ready' : 'cancelled'}
                          label={item.isAvailable ? 'Available' : '86’d'}
                        />
                        <Button
                          size="sm"
                          variant={item.isAvailable ? 'secondary' : 'primary'}
                          label={item.isAvailable ? '86' : 'Restore'}
                          loading={togglingId === item.id}
                          onPress={() => toggleAvailability(item)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          label="Edit"
                          onPress={() =>
                            setDraft({
                              id: item.id,
                              name: item.name,
                              categoryId: item.categoryId,
                              price: centsToDollarInput(item.priceCents),
                              description: item.description ?? '',
                            })
                          }
                        />
                      </View>
                    </View>
                  </Card>
                ))
              )}
            </View>
          ))}
        </QueryState>
      </ScrollView>

      <Modal open={categoryOpen} title="New category" onClose={() => setCategoryOpen(false)}>
        <Input label="Name" value={categoryName} onChangeText={setCategoryName} placeholder="Starters" />
        <Button label="Save category" loading={createCategory.isPending} onPress={() => void saveCategory()} />
      </Modal>

      <Drawer open={Boolean(draft)} title={draft?.id ? 'Edit item' : 'New item'} onClose={closeItem}>
        {draft ? (
          <View style={{ gap: space[4] }}>
            <Input label="Name" value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} />
            <Select
              label="Category"
              value={draft.categoryId}
              options={categoryOptions}
              onChange={(categoryId) => setDraft({ ...draft, categoryId })}
            />
            <Input
              label="Price"
              value={draft.price}
              onChangeText={(price) => setDraft({ ...draft, price })}
              placeholder="32.00"
              hint="Dollars. Stored as integer cents."
              keyboardType="decimal-pad"
            />
            <Input
              label="Description"
              value={draft.description}
              onChangeText={(description) => setDraft({ ...draft, description })}
              placeholder="Optional"
            />
            <Button
              label={draft.id ? 'Save item' : 'Add item'}
              loading={createItem.isPending || updateItem.isPending}
              onPress={() => void saveItem()}
            />
          </View>
        ) : null}
      </Drawer>
    </AppShell>
  );
}
