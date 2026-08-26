import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  Drawer,
  Feedback,
  Input,
  ListRow,
  Modal,
  NavItem,
  Select,
  Skeleton,
  SkeletonBlock,
  Table,
  Typography,
  border,
  color,
  fontSize,
  formatCurrency,
  layout,
  radius,
  shadow,
  space,
  statusTone,
  useToast,
} from '@odyssey/shared';
import { AppShell } from '../components/AppShell';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: space[3] }}>
      <Typography variant="heading">{title}</Typography>
      {children}
    </View>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <View style={{ width: 140, gap: space[1] }}>
      <View
        style={{
          height: 56,
          borderRadius: radius.md,
          backgroundColor: value,
          borderWidth: border.hairline,
          borderColor: color.line,
        }}
      />
      <Typography variant="caption">{name}</Typography>
      <Typography variant="mono">{value}</Typography>
    </View>
  );
}

export default function UiLibrary() {
  const toast = useToast();
  const [selectValue, setSelectValue] = useState('pending');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppShell title="Design system">
      <ScrollView contentContainerStyle={{ gap: space[7], paddingBottom: space[8] }}>
        <Typography variant="body" color={color.inkMuted}>
          Tokens and primitives for the service floor. Screens consume @odyssey/shared — they do not invent colors,
          type, or space.
        </Typography>

        <Section title="Color tokens">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
            {Object.entries(color).map(([name, value]) => (
              <Swatch key={name} name={name} value={value} />
            ))}
          </View>
        </Section>

        <Section title="Typography">
          <Typography variant="display">Display — service floor</Typography>
          <Typography variant="title">Title — tonight’s board</Typography>
          <Typography variant="heading">Heading — ticket well</Typography>
          <Typography variant="bodyLg">Body large — readable at arm’s length on a pass screen.</Typography>
          <Typography variant="body">Body — operational copy and form text.</Typography>
          <Typography variant="caption">Caption — timestamps, secondary meta.</Typography>
          <Typography variant="label">Section label</Typography>
          <Typography variant="mono">mono 1420 cents · {fontSize.body}px body</Typography>
        </Section>

        <Section title="Spacing and layout">
          <View style={{ gap: space[2] }}>
            {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((step) => (
              <View key={step} style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
                <Typography variant="mono" style={{ width: 64 }}>
                  {space[step]}
                </Typography>
                <View
                  style={{
                    height: space[3],
                    width: space[step],
                    backgroundColor: color.accent,
                    borderRadius: radius.sm,
                  }}
                />
              </View>
            ))}
          </View>
          <Typography variant="caption">
            Sidebar {layout.sidebar} · content max {layout.contentMax} · gutter {layout.gutter}
          </Typography>
        </Section>

        <Section title="Radius, border, elevation">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[4] }}>
            {(['sm', 'md', 'lg'] as const).map((level) => (
              <View
                key={level}
                style={{
                  width: 120,
                  height: 80,
                  backgroundColor: color.surface,
                  borderRadius: radius[level],
                  borderWidth: border.hairline,
                  borderColor: color.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...shadow[level],
                }}
              >
                <Typography variant="caption">{level}</Typography>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Semantic states">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            {(Object.keys(statusTone) as Array<keyof typeof statusTone>).map((tone) => (
              <Badge key={tone} tone={tone} />
            ))}
          </View>
        </Section>

        <Section title="Buttons">
          <Typography variant="caption">Hover, press, and keyboard focus are live on web.</Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            <Button label="Primary" onPress={() => undefined} />
            <Button label="Secondary" variant="secondary" onPress={() => undefined} />
            <Button label="Ghost" variant="ghost" onPress={() => undefined} />
            <Button label="Danger" variant="danger" onPress={() => undefined} />
            <Button label="Disabled" disabled />
            <Button label="Loading" loading />
            <Button label="Small" size="sm" onPress={() => undefined} />
            <Button label="Large" size="lg" onPress={() => undefined} />
          </View>
        </Section>

        <Section title="Inputs and select">
          <View style={{ maxWidth: 420, gap: space[4] }}>
            <Input label="Guest name" placeholder="Ada Lovelace" />
            <Input label="With hint" hint="Printed on the ticket." placeholder="Window table" />
            <Input label="Invalid" error="Prep time must be zero or more." defaultValue="-4" />
            <Input label="Disabled" editable={false} value="Read only" />
            <Select
              label="Ticket status"
              value={selectValue}
              onChange={setSelectValue}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'ready', label: 'Ready' },
              ]}
            />
            <Select
              label="Disabled select"
              value="accepted"
              disabled
              onChange={() => undefined}
              options={[{ value: 'accepted', label: 'Accepted' }]}
            />
            <Select
              label="Invalid select"
              error="Pick a status before firing the ticket."
              onChange={() => undefined}
              options={[{ value: 'pending', label: 'Pending' }]}
            />
          </View>
        </Section>

        <Section title="Navigation">
          <View style={{ maxWidth: 220, backgroundColor: color.surface, borderRadius: radius.md, padding: space[2] }}>
            <NavItem label="Active item" active />
            <NavItem label="Idle item" onPress={() => undefined} />
          </View>
        </Section>

        <Section title="Surfaces">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[4] }}>
            <Card>
              <Typography variant="heading">Default card</Typography>
              <Typography variant="caption">Ticket surface on paper canvas.</Typography>
            </Card>
            <Card tone="muted">
              <Typography variant="heading">Muted</Typography>
              <Typography variant="caption">Secondary grouping.</Typography>
            </Card>
            <Card tone="raised">
              <Typography variant="heading">Raised</Typography>
              <Typography variant="caption">Emphasis / popovers.</Typography>
            </Card>
          </View>
        </Section>

        <Section title="Table and list">
          <Card padded>
            <Table
              columns={[
                { key: 'name', header: 'Item', render: (row) => row.name },
                { key: 'price', header: 'Price', render: (row) => formatCurrency(row.priceCents) },
                { key: 'state', header: 'State', render: (row) => (row.available ? 'Available' : '86’d') },
              ]}
              rows={[
                { id: '1', name: 'Hanger Steak', priceCents: 3200, available: true },
                { id: '2', name: 'Whole Branzino', priceCents: 3600, available: false },
              ]}
            />
          </Card>
          <Card padded>
            <Table columns={[{ key: 'name', header: 'Item', render: (row) => row.name }]} rows={[] as { id: string; name: string }[]} />
          </Card>
          <Card padded={false}>
            <ListRow title="Ada Lovelace" meta="2 orders · $49.91 completed spend" onPress={() => toast.push('Opened Ada', 'info')} />
            <ListRow title="Ben Franklin" meta="1 pending ticket" />
          </Card>
        </Section>

        <Section title="Feedback patterns">
          <Feedback tone="loading" title="Loading tickets" body="The pass is catching up with the printer." />
          <Feedback tone="empty" title="No tickets in this well" body="New orders will land here as the floor sends them." />
          <Feedback tone="success" title="Accepted" body="The ticket is on the board." />
          <Feedback tone="warning" title="Sold out" body="Whole Branzino is 86’d for the rest of service." />
          <Feedback tone="error" title="Could not send" body="The order was rejected because an item is unavailable." />
          <View style={{ maxWidth: 280, gap: space[3] }}>
            <Typography variant="caption">Skeleton</Typography>
            <Skeleton width="50%" height={12} />
            <SkeletonBlock />
          </View>
        </Section>

        <Section title="Overlays and toast">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            <Button label="Open modal" onPress={() => setModalOpen(true)} />
            <Button label="Open drawer" variant="secondary" onPress={() => setDrawerOpen(true)} />
            <Button label="Toast success" variant="ghost" onPress={() => toast.push('Ticket accepted', 'success')} />
            <Button label="Toast error" variant="ghost" onPress={() => toast.push('Unavailable item', 'error')} />
          </View>
        </Section>
      </ScrollView>

      <Modal open={modalOpen} title="Fire this ticket?" onClose={() => setModalOpen(false)}>
        <Typography variant="body">Accepting sends it to the kitchen with the current prep time.</Typography>
      </Modal>
      <Drawer open={drawerOpen} title="Ticket detail" onClose={() => setDrawerOpen(false)}>
        <Typography variant="body">Drawer pattern for create/edit flows on Orders and Menu.</Typography>
      </Drawer>
    </AppShell>
  );
}
