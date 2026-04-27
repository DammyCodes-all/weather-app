import { Link } from 'expo-router';
import { View } from 'react-native';

import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Typography } from '@/components/Typography';
import { colors } from '@/theme';

export default function NotFoundScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Typography variant="display" size="2xl" color={colors.textPrimary}>
          lost.
        </Typography>
        <Typography variant="mono" size="sm" color={colors.textMuted}>
          route not found
        </Typography>
        <Link href="/" asChild>
          <Typography variant="label" size="sm" color={colors.accent}>
            return home
          </Typography>
        </Link>
      </View>
    </ScreenWrapper>
  );
}
