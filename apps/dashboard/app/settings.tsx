import { ScrollView, View } from 'react-native';
import { Button, Card, Input, Toggle, Typography, color, space } from '@odyssey/shared';
import { AppShell } from '../components/AppShell';
import { QueryState } from '../components/QueryState';
import { weekdayLabel } from '../lib/opening-hours';
import { useSettingsScreen } from '../lib/use-settings-screen';

export default function SettingsPage() {
  const screen = useSettingsScreen();

  return (
    <AppShell title="Settings" actions={<Button label="Save" loading={screen.update.isPending} onPress={() => void screen.save()} />}>
      <ScrollView contentContainerStyle={{ gap: space[5], paddingBottom: space[8] }}>
        <QueryState isLoading={screen.query.isLoading} error={screen.query.error} isEmpty={!screen.settings}>
          <Card>
            <View style={{ gap: space[4] }}>
              <Input
                label="Prep time (minutes)"
                value={screen.prepTime}
                onChangeText={screen.setPrepTime}
                keyboardType="number-pad"
                hint="Printed on tickets after accept."
              />
              <Toggle label="Auto-accept new tickets" value={screen.autoAccept} onChange={screen.setAutoAccept} />
              <Toggle label="Service available" value={screen.serviceAvailable} onChange={screen.setServiceAvailable} />
              {!screen.serviceAvailable ? (
                <Typography variant="caption" color={color.danger}>
                  The pass will refuse new tickets while service is closed.
                </Typography>
              ) : null}
            </View>
          </Card>
          <Card>
            <View style={{ gap: space[4] }}>
              <Typography variant="heading">Opening hours</Typography>
              {screen.weekdays.map((day) => {
                const slot = screen.hours[day];
                return (
                  <View key={day} style={{ gap: space[2] }}>
                    <Toggle label={weekdayLabel(day)} value={Boolean(slot)} onChange={(open) => screen.setDayOpen(day, open)} />
                    {slot ? (
                      <View style={{ flexDirection: 'row', gap: space[3] }}>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="Open"
                            value={slot.open}
                            onChangeText={(open) => screen.setDayHours(day, { ...slot, open })}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="Close"
                            value={slot.close}
                            onChangeText={(close) => screen.setDayHours(day, { ...slot, close })}
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
