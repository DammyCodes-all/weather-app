import { MotiView } from "moti";
import { ScrollView, StyleSheet, View } from "react-native";

import { Typography } from "@/components/Typography";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { colors, spacing } from "@/theme";
import { HourlyItem } from "@/utils/forecastProcessor";
import { formatHour, formatTemp } from "@/utils/formatters";

interface HourlyStripProps {
  hourlyData: HourlyItem[];
  unit: "C" | "F";
}

/**
 * Horizontal scrollable strip showing next 8 hours of hourly forecast
 *
 * Each item displays: hour label (e.g., "3 PM") → weather icon (40px) → temperature
 * Current hour (first item) has an accent left border to highlight it.
 *
 * Animation: Each item stagger-enters from right (translateX: 15 → 0) with 60ms
 * delays between items, creating a smooth sequential reveal. Direction matches
 * the horizontal scroll direction, so animation feels natural.
 */
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
          <MotiView
            key={`${item.dt}-${index}`}
            from={{ opacity: 0, translateX: 15 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 500, delay: index * 60 }}
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
                <WeatherIcon
                  conditionCode={item.conditionCode}
                  isDay={item.isDay}
                  size={40}
                />
              </View>

              {/* Temperature */}
              <Typography
                variant="display"
                size="sm"
                color={colors.textPrimary}
              >
                {formatTemp(item.temp, unit)}
              </Typography>
            </View>
          </MotiView>
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
