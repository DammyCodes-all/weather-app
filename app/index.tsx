import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ScreenWrapper } from '@/components/ScreenWrapper';
import { Typography } from '@/components/Typography';
import { ConditionBackground } from '@/features/weather/components/ConditionBackground';
import { DataStrip } from '@/features/weather/components/DataStrip';
import { TempDisplay } from '@/features/weather/components/TempDisplay';
import { WeatherIcon } from '@/features/weather/components/WeatherIcon';
import { useWeatherContext } from '@/store/WeatherContext';
import { colors, spacing } from '@/theme';
import { formatFullDate } from '@/utils/formatters';
import { getConditionMeta } from '@/utils/conditionMap';

export default function HomeScreen() {
  const conditionCode = 800;
  const isDay = true;
  const tempKelvin = 297.15;
  const cityName = 'Reykjavik';
  const nowUnix = Math.floor(Date.now() / 1000);
  const { width } = useWindowDimensions();
  const isWide = width > 430;

  const { unit, setUnit } = useWeatherContext();
  const conditionLabel = getConditionMeta(conditionCode, isDay).label;
  const unitIndicatorX = useSharedValue(unit === 'C' ? 0 : 40);

  useEffect(() => {
    unitIndicatorX.value = withSpring(unit === 'C' ? 0 : 40, {
      damping: 18,
      stiffness: 200,
    });
  }, [unit, unitIndicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: unitIndicatorX.value }],
  }));

  const handleUnitChange = async (next: 'C' | 'F') => {
    if (next === unit) {
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUnit(next);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <ConditionBackground conditionCode={conditionCode} isDay={isDay} />

        <View className="flex-1 px-6">
          <View className="flex-row items-start justify-between" style={{ marginTop: spacing.sm }}>
            <View className="gap-1">
              <Typography variant="display" size="xl" color={colors.textPrimary}>
                {cityName}
              </Typography>
              <Typography
                variant="mono"
                size="xs"
                color={colors.textMuted}
                style={{ letterSpacing: 2 }}
              >
                {formatFullDate(nowUnix).toUpperCase()}
              </Typography>
            </View>

            <View style={styles.topActions}>
              <View style={styles.unitToggle}>
                <Animated.View style={[styles.unitActiveIndicator, indicatorStyle]} />
                <Pressable style={styles.unitOption} onPress={() => handleUnitChange('C')}>
                  <Typography
                    variant="label"
                    size="xs"
                    color={unit === 'C' ? colors.textPrimary : colors.textMuted}
                  >
                    °C
                  </Typography>
                </Pressable>
                <Pressable style={styles.unitOption} onPress={() => handleUnitChange('F')}>
                  <Typography
                    variant="label"
                    size="xs"
                    color={unit === 'F' ? colors.textPrimary : colors.textMuted}
                  >
                    °F
                  </Typography>
                </Pressable>
              </View>

              <Pressable hitSlop={10}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={24}
                  color={colors.textPrimary}
                />
              </Pressable>
            </View>
          </View>

          <View
            className="flex-1 items-center justify-center"
            style={[styles.heroWrap, isWide ? styles.heroWide : styles.heroStack]}
          >
            <WeatherIcon conditionCode={conditionCode} isDay={isDay} size={180} />
            <TempDisplay tempKelvin={tempKelvin} unit={unit} conditionLabel={conditionLabel} />
          </View>

          <View style={{ paddingBottom: spacing.lg }}>
            <DataStrip humidity={72} windSpeed={5.2} feelsLike={296.65} unit={unit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  unitToggle: {
    width: 82,
    height: 34,
    borderRadius: 9999,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    position: 'relative',
  },
  unitActiveIndicator: {
    position: 'absolute',
    width: 36,
    height: 28,
    borderRadius: 9999,
    backgroundColor: colors.accent,
    top: 3,
    left: 3,
  },
  unitOption: {
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  heroWrap: {
    marginTop: -32,
    gap: spacing.md,
  },
  heroStack: {
    flexDirection: 'column',
  },
  heroWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});
