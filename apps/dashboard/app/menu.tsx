import { ScrollView, View } from 'react-native';
import { Badge, Button, Card, Drawer, Input, Modal, Select, Typography, color, formatCurrency, space } from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { useMenuScreen } from '../lib/use-menu-screen';

export default function MenuPage() {
  const screen = useMenuScreen();
  const loading = screen.categoriesQuery.isLoading || screen.itemsQuery.isLoading;
  const error = screen.categoriesQuery.error ?? screen.itemsQuery.error;

  return (
    <AppShell
      title="Menu"
      actions={
        <View style={{ flexDirection: 'row', gap: space[2] }}>
          <Button variant="secondary" label="Add category" onPress={() => screen.setCategoryOpen(true)} />
          <Button label="Add item" onPress={screen.openNewItem} disabled={screen.categories.length === 0} />
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
          isEmpty={screen.categories.length === 0}
          emptyTitle="No categories"
          emptyBody="Add a category before you hang items on the board."
        >
          {screen.grouped.map(({ category, items: categoryItems }) => (
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
                          loading={screen.togglingId === item.id}
                          onPress={() => void screen.toggleAvailability(item)}
                        />
                        <Button size="sm" variant="ghost" label="Edit" onPress={() => screen.openEditItem(item)} />
                      </View>
                    </View>
                  </Card>
                ))
              )}
            </View>
          ))}
        </QueryState>
      </ScrollView>

      <Modal open={screen.categoryOpen} title="New category" onClose={() => screen.setCategoryOpen(false)}>
        <Input label="Name" value={screen.categoryName} onChangeText={screen.setCategoryName} placeholder="Starters" />
        <Button label="Save category" loading={screen.createCategory.isPending} onPress={() => void screen.saveCategory()} />
      </Modal>

      <Drawer open={Boolean(screen.draft)} title={screen.draft?.id ? 'Edit item' : 'New item'} onClose={screen.closeItem}>
        {screen.draft ? (
          <View style={{ gap: space[4] }}>
            <Input
              label="Name"
              value={screen.draft.name}
              onChangeText={(name) => screen.setDraft({ ...screen.draft!, name })}
            />
            <Select
              label="Category"
              value={screen.draft.categoryId}
              options={screen.categoryOptions}
              onChange={(categoryId) => screen.setDraft({ ...screen.draft!, categoryId })}
            />
            <Input
              label="Price"
              value={screen.draft.price}
              onChangeText={(price) => screen.setDraft({ ...screen.draft!, price })}
              placeholder="32.00"
              hint="Dollars. Stored as integer cents."
              keyboardType="decimal-pad"
            />
            <Input
              label="Description"
              value={screen.draft.description}
              onChangeText={(description) => screen.setDraft({ ...screen.draft!, description })}
              placeholder="Optional"
            />
            <Button
              label={screen.draft.id ? 'Save item' : 'Add item'}
              loading={screen.createItem.isPending || screen.updateItem.isPending}
              onPress={() => void screen.saveItem()}
            />
          </View>
        ) : null}
      </Drawer>
    </AppShell>
  );
}
