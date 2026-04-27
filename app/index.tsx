import { Pressable, View } from 'react-native';

import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Typography } from '@/components/Typography';
import { ConditionBackground } from '@/features/weather/components/ConditionBackground';
import { DataStrip } from '@/features/weather/components/DataStrip';
import { colors, spacing } from '@/theme';
import { getConditionMeta } from '@/utils/conditionMap';

export default function HomeScreen() {
  const conditionCode = 800;
  const isDay = true;
  const conditionLabel = getConditionMeta(conditionCode, isDay).label;

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <ConditionBackground conditionCode={conditionCode} isDay={isDay} />

        <View className="flex-1 px-6">
          <View className="flex-row items-start justify-between" style={{ marginTop: spacing.sm }}>
            <View className="gap-1">
              <Typography variant="display" size="xl" color={colors.textPrimary}>
                Reykjavik
              </Typography>
              <Typography
                variant="mono"
                size="xs"
                color={colors.textMuted}
                style={{ letterSpacing: 2 }}
              >
                WEATHER STATION ALPHA
              </Typography>
            </View>

            <Pressable hitSlop={10}>
              <Typography variant="label" size="lg" color={colors.textPrimary}>
                ⌕
              </Typography>
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center" style={{ marginTop: -40 }}>
            <Typography variant="display" size="6xl" color={colors.textPrimary}>
              24
            </Typography>
            <Typography
              variant="mono"
              size="sm"
              color={colors.textMuted}
              style={{ letterSpacing: 3, marginTop: 8 }}
            >
              {conditionLabel.toUpperCase()}
            </Typography>
          </View>

          <View style={{ paddingBottom: spacing.lg }}>
            <DataStrip humidity={72} windSpeed={5.2} feelsLike={297.15} unit="C" />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
