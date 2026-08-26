import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useGetSettings, useUpdateSettings, type OpeningHours } from '@odyssey/api-client';
import { Button, Card, Input, Typography, color, space, useToast } from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { Toggle } from '../components/Toggle';
import { errorMessage, useInvalidateOps } from '../lib/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const emptyHours: OpeningHours = {
  monday: { open: '11:00', close: '22:00' },
  tuesday: { open: '11:00', close: '22:00' },
  wednesday: { open: '11:00', close: '22:00' },
  thursday: { open: '11:00', close: '22:00' },
  friday: { open: '11:00', close: '22:00' },
  saturday: { open: '11:00', close: '22:00' },
  sunday: { open: '11:00', close: '22:00' },
};

function asOpeningHours(value: unknown): OpeningHours {
  if (!value || typeof value !== 'object') return emptyHours;
  const record = value as Record<string, { open?: string; close?: string } | null>;
  const next = { ...emptyHours };
  for (const day of DAYS) {
    const entry = record[day];
    next[day] = entry?.open && entry.close ? { open: entry.open, close: entry.close } : null;
  }
  return next;
}

export default function SettingsPage() {
  const toast = useToast();
  const invalidate = useInvalidateOps();
  const query = useGetSettings();
  const update = useUpdateSettings();
  const settings = query.data?.status === 200 ? query.data.data : undefined;

  const [prepTime, setPrepTime] = useState('');
  const [autoAccept, setAutoAccept] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [hours, setHours] = useState<OpeningHours>(emptyHours);

  useEffect(() => {
    if (!settings) return;
    setPrepTime(String(settings.prepTimeMinutes));
    setAutoAccept(settings.autoAccept);
    setServiceAvailable(settings.serviceAvailable);
    setHours(asOpeningHours(settings.openingHours));
  }, [settings]);

  async function save() {
    const prepTimeMinutes = Number(prepTime);
    if (!Number.isInteger(prepTimeMinutes) || prepTimeMinutes < 0) {
      toast.push('Prep time must be zero or more minutes', 'warning');
      return;
    }
    try {
      await update.mutateAsync({
        data: { prepTimeMinutes, autoAccept, serviceAvailable, openingHours: hours },
      });
      await invalidate.settings();
      toast.push('Settings saved', 'success');
    } catch (error) {
      toast.push(errorMessage(error), 'error');
    }
  }

  return (
    <AppShell title="Settings" actions={<Button label="Save" loading={update.isPending} onPress={() => void save()} />}>
      <ScrollView contentContainerStyle={{ gap: space[5], paddingBottom: space[8] }}>
        <QueryState isLoading={query.isLoading} error={query.error} isEmpty={!settings}>
          <Card>
            <View style={{ gap: space[4] }}>
              <Input
                label="Prep time (minutes)"
                value={prepTime}
                onChangeText={setPrepTime}
                keyboardType="number-pad"
                hint="Printed on tickets after accept."
              />
              <Toggle
                label="Auto-accept new tickets"
                value={autoAccept}
                onChange={setAutoAccept}
              />
              <Toggle
                label="Service available"
                value={serviceAvailable}
                onChange={setServiceAvailable}
              />
              {!serviceAvailable ? (
                <Typography variant="caption" color={color.danger}>
                  The pass will refuse new tickets while service is closed.
                </Typography>
              ) : null}
            </View>
          </Card>
          <Card>
            <View style={{ gap: space[4] }}>
              <Typography variant="heading">Opening hours</Typography>
              {DAYS.map((day) => {
                const slot = hours[day];
                return (
                  <View key={day} style={{ gap: space[2] }}>
                    <Toggle
                      label={day}
                      value={Boolean(slot)}
                      onChange={(open) =>
                        setHours((current) => ({
                          ...current,
                          [day]: open ? { open: '11:00', close: '22:00' } : null,
                        }))
                      }
                    />
                    {slot ? (
                      <View style={{ flexDirection: 'row', gap: space[3] }}>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="Open"
                            value={slot.open}
                            onChangeText={(open) => setHours((current) => ({ ...current, [day]: { ...slot, open } }))}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="Close"
                            value={slot.close}
                            onChangeText={(close) => setHours((current) => ({ ...current, [day]: { ...slot, close } }))}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </Card>
        </QueryState>
      </ScrollView>
    </AppShell>
  );
}
