import { parseDollarsToCents } from '@odyssey/shared/currency';

export type FormResult<T = void> = { ok: true; value: T } | { ok: false; message: string };

export function validateCategoryName(name: string): FormResult<string> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, message: 'Name is required' };
  return { ok: true, value: trimmed };
}

export function validateMenuItem(input: { name: string; price: string; categoryId: string }): FormResult<{
  name: string;
  priceCents: number;
  categoryId: string;
}> {
  const name = input.name.trim();
  if (!name) return { ok: false, message: 'Name is required' };
  if (!input.categoryId) return { ok: false, message: 'Pick a category' };
  const priceCents = parseDollarsToCents(input.price);
  if (priceCents === null) return { ok: false, message: 'Price must be a dollars amount like 32 or 32.50' };
  return { ok: true, value: { name, priceCents, categoryId: input.categoryId } };
}

export function validateGuest(input: { name: string; email: string; phone: string }): FormResult<{
  name: string;
  email: string;
  phone: string | null;
}> {
  const name = input.name.trim();
  const email = input.email.trim();
  if (!name || !email) return { ok: false, message: 'Name and email are required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Email looks invalid' };
  return { ok: true, value: { name, email, phone: input.phone.trim() || null } };
}

export function validateTicket(input: {
  customerId: string;
  quantities: Record<string, number>;
}): FormResult<{ customerId: string; items: { menuItemId: string; quantity: number }[] }> {
  if (!input.customerId) return { ok: false, message: 'Pick a guest' };
  const items = Object.entries(input.quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
  if (items.length === 0) return { ok: false, message: 'Add at least one item' };
  return { ok: true, value: { customerId: input.customerId, items } };
}

export function validatePrepTime(value: string): FormResult<number> {
  const prepTimeMinutes = Number(value);
  if (!Number.isInteger(prepTimeMinutes) || prepTimeMinutes < 0) {
    return { ok: false, message: 'Prep time must be zero or more minutes' };
  }
  return { ok: true, value: prepTimeMinutes };
}
