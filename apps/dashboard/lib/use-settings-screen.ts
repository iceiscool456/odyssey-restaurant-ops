import { useEffect, useState } from 'react';
import { type OpeningHours, useGetSettings, useUpdateSettings } from '@odyssey/api-client';
import { useToast } from '@odyssey/shared';
import { errorMessage, useInvalidateOps } from './api';
import { validatePrepTime } from './forms';
import { asOpeningHours, emptyOpeningHours, WEEKDAYS, type Weekday } from './opening-hours';
import { isEnvelope } from './result';

export function useSettingsScreen() {
  const toast = useToast();
  const invalidate = useInvalidateOps();
  const query = useGetSettings();
  const update = useUpdateSettings();
  const settings = isEnvelope(query.data, 200) ? query.data.data : undefined;

  const [prepTime, setPrepTime] = useState('');
  const [autoAccept, setAutoAccept] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [hours, setHours] = useState<OpeningHours>(emptyOpeningHours());

  useEffect(() => {
    if (!settings) return;
    setPrepTime(String(settings.prepTimeMinutes));
    setAutoAccept(settings.autoAccept);
    setServiceAvailable(settings.serviceAvailable);
    setHours(asOpeningHours(settings.openingHours));
  }, [settings]);

  function setDayOpen(day: Weekday, open: boolean) {
    setHours((current) => ({
      ...current,
      [day]: open ? { open: '11:00', close: '22:00' } : null,
    }));
  }

  function setDayHours(day: Weekday, slot: { open: string; close: string }) {
    setHours((current) => ({ ...current, [day]: slot }));
  }

  async function save() {
    const parsed = validatePrepTime(prepTime);
    if (!parsed.ok) {
      toast.push(parsed.message, 'warning');
      return;
    }
    try {
      await update.mutateAsync({
        data: { prepTimeMinutes: parsed.value, autoAccept, serviceAvailable, openingHours: hours },
      });
      await invalidate.settings();
      toast.push('Settings saved', 'success');
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    }
  }

  return {
    query,
    update,
    settings,
    prepTime,
    setPrepTime,
    autoAccept,
    setAutoAccept,
    serviceAvailable,
    setServiceAvailable,
    hours,
    weekdays: WEEKDAYS,
    setDayOpen,
    setDayHours,
    save,
  };
}
