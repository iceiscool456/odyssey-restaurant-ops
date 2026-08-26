import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { elevation, fontFamily, fontSize, layout, radius, space } from '../tokens';
import { statusTone, type StatusTone } from '../tokens/status';
import { Interactive } from './Interactive';

type ToastItem = { id: string; message: string; tone: StatusTone };

type ToastContextValue = { push: (message: string, tone?: StatusTone) => void };

const ToastContext = createContext<ToastContextValue>({ push: () => undefined });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: StatusTone = 'info') => {
    const id = `${Date.now()}-${message}`;
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        <View
          style={{ position: 'absolute', right: space[5], bottom: space[5], gap: space[2], zIndex: 50, pointerEvents: 'box-none' }}
        >
        {toasts.map((toast) => {
          const tone = statusTone[toast.tone] ?? statusTone.info;
          return (
            <Interactive
              key={toast.id}
              onPress={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              style={{
                backgroundColor: tone.bg,
                borderRadius: radius.md,
                paddingVertical: space[2],
                paddingHorizontal: space[3],
                ...elevation.md,
                minWidth: layout.toastMin,
              }}
            >
              <Text style={{ color: tone.fg, fontFamily: fontFamily.sans, fontSize: fontSize.body }}>{toast.message}</Text>
            </Interactive>
          );
        })}
        </View>
      </View>
    </ToastContext.Provider>
  );
}
