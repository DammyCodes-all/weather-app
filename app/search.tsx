import { View } from 'react-native';

import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Typography } from '@/components/Typography';
import { colors } from '@/theme';

export default function SearchScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center px-6">
        <Typography variant="display" size="2xl" color={colors.textPrimary}>
          search.
        </Typography>
        <Typography
          variant="mono"
          size="sm"
          color={colors.textMuted}
          style={{ letterSpacing: 2, marginTop: 10 }}
        >
          PHASE 1 ROUTE PLACEHOLDER
        </Typography>
      </View>
    </ScreenWrapper>
  );
}
