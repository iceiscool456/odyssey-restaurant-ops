import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  businessSettings,
  customers,
  menuCategories,
  menuItems,
  orderItems,
  orders,
  type OpeningHours,
} from '../src/db/schema';
import { resolveDatabaseUrl } from './env';

const ids = {
  starters: '11111111-1111-4111-8111-111111111111',
  mains: '11111111-1111-4111-8111-111111111112',
  desserts: '11111111-1111-4111-8111-111111111113',
  drinks: '11111111-1111-4111-8111-111111111114',
  calamari: '22222222-2222-4222-8222-222222222221',
  salad: '22222222-2222-4222-8222-222222222222',
  steak: '22222222-2222-4222-8222-222222222223',
  pasta: '22222222-2222-4222-8222-222222222224',
  tiramisu: '22222222-2222-4222-8222-222222222225',
  espresso: '22222222-2222-4222-8222-222222222226',
  soldOut: '22222222-2222-4222-8222-222222222227',
  ada: '33333333-3333-4333-8333-333333333331',
  ben: '33333333-3333-4333-8333-333333333332',
  order1: '44444444-4444-4444-8444-444444444441',
  order2: '44444444-4444-4444-8444-444444444442',
};

const weekday: OpeningHours[keyof OpeningHours] = { open: '11:00', close: '22:00' };
const openingHours: OpeningHours = {
  monday: weekday,
  tuesday: weekday,
  wednesday: weekday,
  thursday: weekday,
  friday: { open: '11:00', close: '23:00' },
  saturday: { open: '10:00', close: '23:00' },
  sunday: { open: '10:00', close: '21:00' },
};

async function seed() {
  const url = resolveDatabaseUrl();
  const client = postgres(url, { max: 1 });
  const db = drizzle(client);

  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(menuItems);
  await db.delete(menuCategories);
  await db.delete(customers);
  await db.delete(businessSettings);

  await db.insert(menuCategories).values([
    { id: ids.starters, name: 'Starters', sortOrder: 1 },
    { id: ids.mains, name: 'Mains', sortOrder: 2 },
    { id: ids.desserts, name: 'Desserts', sortOrder: 3 },
    { id: ids.drinks, name: 'Drinks', sortOrder: 4 },
  ]);

  await db.insert(menuItems).values([
    {
      id: ids.calamari,
      categoryId: ids.starters,
      name: 'Crispy Calamari',
      description: 'Lemon aioli, pickled chili',
      priceCents: 1400,
      isAvailable: true,
    },
    {
      id: ids.salad,
      categoryId: ids.starters,
      name: 'Market Salad',
      description: 'Seasonal greens, shaved fennel, citrus vinaigrette',
      priceCents: 1200,
      isAvailable: true,
    },
    {
      id: ids.steak,
      categoryId: ids.mains,
      name: 'Hanger Steak',
      description: 'Charred onion, bone marrow butter, fries',
      priceCents: 3200,
      isAvailable: true,
    },
    {
      id: ids.pasta,
      categoryId: ids.mains,
      name: 'Cacio e Pepe',
      description: 'Tonarelli, pecorino, black pepper',
      priceCents: 2200,
      isAvailable: true,
    },
    {
      id: ids.tiramisu,
      categoryId: ids.desserts,
      name: 'Tiramisu',
      description: 'Espresso-soaked ladyfingers, mascarpone',
      priceCents: 1100,
      isAvailable: true,
    },
    {
      id: ids.espresso,
      categoryId: ids.drinks,
      name: 'Espresso',
      priceCents: 400,
      isAvailable: true,
    },
    {
      id: ids.soldOut,
      categoryId: ids.mains,
      name: 'Whole Branzino',
      description: 'Tonight’s catch — currently sold out',
      priceCents: 3600,
      isAvailable: false,
    },
  ]);

  await db.insert(customers).values([
    { id: ids.ada, name: 'Ada Lovelace', email: 'ada@example.com', phone: '555-0101' },
    { id: ids.ben, name: 'Ben Franklin', email: 'ben@example.com', phone: '555-0102' },
  ]);

  await db.insert(orders).values([
    {
      id: ids.order1,
      customerId: ids.ada,
      status: 'completed',
      subtotalCents: 4600,
      taxCents: 391,
      totalCents: 4991,
      notes: 'Window table',
    },
    {
      id: ids.order2,
      customerId: ids.ben,
      status: 'pending',
      subtotalCents: 2600,
      taxCents: 221,
      totalCents: 2821,
    },
  ]);

  await db.insert(orderItems).values([
    {
      orderId: ids.order1,
      menuItemId: ids.calamari,
      nameSnapshot: 'Crispy Calamari',
      unitPriceCents: 1400,
      quantity: 1,
      lineTotalCents: 1400,
    },
    {
      orderId: ids.order1,
      menuItemId: ids.steak,
      nameSnapshot: 'Hanger Steak',
      unitPriceCents: 3200,
      quantity: 1,
      lineTotalCents: 3200,
    },
    {
      orderId: ids.order2,
      menuItemId: ids.pasta,
      nameSnapshot: 'Cacio e Pepe',
      unitPriceCents: 2200,
      quantity: 1,
      lineTotalCents: 2200,
    },
    {
      orderId: ids.order2,
      menuItemId: ids.espresso,
      nameSnapshot: 'Espresso',
      unitPriceCents: 400,
      quantity: 1,
      lineTotalCents: 400,
    },
  ]);

  await db.insert(businessSettings).values({
    id: 'default',
    prepTimeMinutes: 18,
    autoAccept: false,
    serviceAvailable: true,
    openingHours,
  });

  await client.end({ timeout: 5 });
  console.log('Seeded restaurant data.');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
