import { MotiView } from 'moti';
import { DimensionValue } from 'react-native';

import { colors } from '@/theme';

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
}

export function Skeleton({ width, height, borderRadius = 8 }: SkeletonProps) {
  return (
    <MotiView
      from={{ opacity: 0.15 }}
      animate={{ opacity: 0.4 }}
      transition={{ type: 'timing', duration: 1200, loop: true, repeatReverse: true }}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: colors.textGhost,
      }}
    />
  );
}
