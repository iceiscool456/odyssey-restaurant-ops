import { formatCurrency } from '@odyssey/shared';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odyssey Restaurant Ops</Text>
      <Text style={styles.subtitle}>
        Monorepo scaffold is live — shared package import works: {formatCurrency(123456)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
