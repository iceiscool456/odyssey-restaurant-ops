import { View, type DimensionValue } from 'react-native';
import { color, radius, space } from '../tokens';

export function Skeleton({ width = '100%', height = 16 }: { width?: DimensionValue; height?: number }) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius.sm,
        backgroundColor: color.canvasSubtle,
        marginBottom: space[2],
      }}
    />
  );
}

export function SkeletonBlock() {
  return (
    <View>
      <Skeleton width="40%" height={12} />
      <Skeleton width="100%" height={18} />
      <Skeleton width="70%" height={18} />
    </View>
  );
}
