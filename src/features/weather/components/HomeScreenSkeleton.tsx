import { View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { spacing } from '@/theme';

export function HomeScreenSkeleton() {
  return (
    <View className="flex-1 px-6">
      <View className="flex-row items-start justify-between" style={{ marginTop: spacing.sm }}>
        <View style={{ gap: spacing.sm }}>
          <Skeleton width={160} height={28} />
          <Skeleton width={130} height={14} />
        </View>
        <View className="flex-row items-center" style={{ gap: spacing.md }}>
          <Skeleton width={84} height={34} borderRadius={9999} />
          <Skeleton width={24} height={24} borderRadius={9999} />
        </View>
      </View>

      <View className="flex-1 items-center justify-center" style={{ gap: spacing.md, marginTop: -32 }}>
        <Skeleton width={180} height={180} borderRadius={90} />
        <Skeleton width={190} height={82} />
        <Skeleton width={140} height={16} />
      </View>

      <View style={{ paddingBottom: spacing.lg, gap: spacing.sm }}>
        <Skeleton width="100%" height={100} borderRadius={16} />
      </View>
    </View>
  );
}
