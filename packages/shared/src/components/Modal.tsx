import type { ReactNode } from 'react';
import { Modal as RnModal, Pressable, View } from 'react-native';
import { color, layout, radius, shadow, space } from '../tokens';
import { Button } from './Button';
import { Typography } from './Typography';

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <RnModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: color.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: space[5],
        }}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: layout.modal,
            backgroundColor: color.surface,
            borderRadius: radius.lg,
            padding: space[5],
            ...shadow.lg,
          }}
        >
          <View style={{ gap: space[4] }}>
            <Typography variant="heading">{title}</Typography>
            {children}
            <View style={{ alignItems: 'flex-end' }}>
              <Button variant="ghost" label="Close" onPress={onClose} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </RnModal>
  );
}

export function Drawer({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <RnModal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable style={{ flex: 1, backgroundColor: color.overlay }} onPress={onClose} />
        <View
          style={{
            width: layout.drawer,
            maxWidth: '90%',
            backgroundColor: color.surface,
            padding: space[5],
            ...shadow.lg,
            gap: space[4],
          }}
        >
          <Typography variant="heading">{title}</Typography>
          {children}
          <Button variant="secondary" label="Close drawer" onPress={onClose} />
        </View>
      </View>
    </RnModal>
  );
}
