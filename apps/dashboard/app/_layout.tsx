import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider, color } from '@odyssey/shared';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <View style={{ flex: 1, backgroundColor: color.canvas }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.canvas } }} />
        </View>
      </ToastProvider>
    </QueryClientProvider>
  );
}
