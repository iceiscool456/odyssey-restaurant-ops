import { type OpeningHours } from '@odyssey/api-client';

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const satisfies ReadonlyArray<keyof OpeningHours>;

export type Weekday = (typeof WEEKDAYS)[number];

export function weekdayLabel(day: Weekday) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function defaultSlot() {
  return { open: '11:00', close: '22:00' };
}

export function emptyOpeningHours(): OpeningHours {
  return {
    monday: defaultSlot(),
    tuesday: defaultSlot(),
    wednesday: defaultSlot(),
    thursday: defaultSlot(),
    friday: defaultSlot(),
    saturday: defaultSlot(),
    sunday: defaultSlot(),
  };
}

/** Coerces the settings jsonb blob into the generated OpeningHours shape. */
export function asOpeningHours(value: unknown): OpeningHours {
  if (!value || typeof value !== 'object') return emptyOpeningHours();
  const record = value as Record<string, { open?: string; close?: string } | null>;
  const next = emptyOpeningHours();
  for (const day of WEEKDAYS) {
    const entry = record[day];
    next[day] = entry?.open && entry.close ? { open: entry.open, close: entry.close } : null;
  }
  return next;
}
