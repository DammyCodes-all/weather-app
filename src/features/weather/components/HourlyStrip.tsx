import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { Typography } from "@/components/Typography";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { colors, spacing } from "@/theme";
import { HourlyItem } from "@/utils/forecastProcessor";
import { formatHour, formatTemp } from "@/utils/formatters";

interface HourlyStripProps {
  hourlyData: HourlyItem[];
  unit: "C" | "F";
}
export function HourlyStrip({ hourlyData, unit }: HourlyStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      {hourlyData.map((item, index) => {
        const isCurrentHour = index === 0;

        return (
          <Animated.View
            key={`${item.dt}-${index}`}
            entering={FadeInRight.delay(index * 60).duration(300)}
          >
            <View style={[styles.item, isCurrentHour && styles.itemCurrent]}>
              {/* Hour label: e.g., "3 PM" */}
              <Typography
                variant="mono"
                size="xs"
                color={colors.textMuted}
                style={styles.hourLabel}
              >
                {formatHour(item.dt)}
              </Typography>

              {/* Weather icon (40px) */}
              <View style={styles.iconWrap}>
                <WeatherIcon conditionCode={item.conditionCode} isDay={item.isDay} size={40} />
              </View>

              {/* Temperature */}
              <Typography variant="display" size="sm" color={colors.textPrimary}>
                {formatTemp(item.temp, unit)}
              </Typography>
            </View>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm, // 8px between items
  },
  item: {
    alignItems: "center",
    justifyContent: "space-between",
    width: 64, // Fixed width for each item
    paddingVertical: spacing.md,
  },
  itemCurrent: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.sm,
  },
  hourLabel: {
    marginBottom: spacing.xs,
    lineHeight: 14,
  },
  iconWrap: {
    marginVertical: spacing.xs,
  },
});
