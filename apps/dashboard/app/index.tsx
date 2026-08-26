import { useListMenuItems } from '@odyssey/api-client';
import { formatCurrency } from '@odyssey/shared';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Home() {
  const query = useListMenuItems();
  const items = query.data?.status === 200 ? query.data.data : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odyssey Restaurant Ops</Text>
      <Text style={styles.subtitle}>Menu items loaded through the generated contract</Text>

      {query.isLoading ? <ActivityIndicator /> : null}
      {query.error ? <Text style={styles.error}>Could not load menu. Is the API running?</Text> : null}

      {items.map((item) => (
        <Text key={item.id} style={styles.item}>
          {item.name} — {formatCurrency(item.priceCents)}
          {item.isAvailable ? '' : ' (unavailable)'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
  },
  error: {
    color: '#b42318',
  },
});
