import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Platform, Text, View } from 'react-native';
import { elevation, fontFamily, fontSize, layout, radius, space, zIndex } from '../tokens';
import { statusTone, type StatusTone } from '../tokens/status';
import { Interactive } from './Interactive';

type ToastItem = { id: string; message: string; tone: StatusTone };

type ToastContextValue = { push: (message: string, tone?: StatusTone) => void };

const ToastContext = createContext<ToastContextValue>({ push: () => undefined });

export function useToast() {
  return useContext(ToastContext);
}

function persists(tone: StatusTone) {
  return tone === 'error' || tone === 'warning';
}

function ToastAnchor({ children }: { children: ReactNode }) {
  const node = (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: space[5],
        bottom: space[5],
        gap: space[2],
        zIndex: zIndex.toast,
        ...(Platform.OS === 'web' ? ({ position: 'fixed' } as object) : null),
      }}
    >
      {children}
    </View>
  );

  if (Platform.OS === 'web' && typeof document !== 'undefined' && document.body) {
    return createPortal(node, document.body);
  }
  return node;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: StatusTone = 'info') => {
      const id = `${Date.now()}-${message}`;
      setToasts((current) => [...current, { id, message, tone }]);
      if (!persists(tone)) {
        setTimeout(() => dismiss(id), 3200);
      }
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <ToastAnchor>
          {toasts.map((toast) => {
            const tone = statusTone[toast.tone] ?? statusTone.info;
            return (
              <Interactive
                key={toast.id}
                onPress={() => dismiss(toast.id)}
                style={{
                  backgroundColor: tone.bg,
                  borderRadius: radius.md,
                  paddingVertical: space[2],
                  paddingHorizontal: space[3],
                  ...elevation.md,
                  minWidth: layout.toastMin,
                  zIndex: zIndex.toast,
                }}
              >
                <Text style={{ color: tone.fg, fontFamily: fontFamily.sans, fontSize: fontSize.body }}>{toast.message}</Text>
              </Interactive>
            );
          })}
        </ToastAnchor>
      </View>
    </ToastContext.Provider>
  );
}
