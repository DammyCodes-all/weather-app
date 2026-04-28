import { MotiView } from "moti";
import { StyleSheet, View } from "react-native";

import { Typography } from "@/components/Typography";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { colors, spacing } from "@/theme";
import { DayForecast } from "@/utils/forecastProcessor";
import { formatDay, formatTemp } from "@/utils/formatters";

interface ForecastRowProps {
  dayForecast: DayForecast;
  unit: "C" | "F";
  index: number;
}

/**
 * Single forecast day row showing day name, condition icon, high/low temps, and precip %
 *
 * Layout: day name (left) → icon (30px) → high/low temps → precip % (if >20%, else hidden)
 * Precip threshold of 20% filters noise (anything meaningful enough to mention).
 *
 * Animation: Stagger-enters from left (translateX: -15 → 0) with 80ms delays between
 * items. Negative X direction (left-slide) for vertical list creates visual contrast
 * with horizontal HourlyStrip (which slides right), establishing animation rhythm.
 */
export function ForecastRow({ dayForecast, unit, index }: ForecastRowProps) {
  const dayName = formatDay(dayForecast.dt); // "MON", "TUE", etc.
  const highTemp = formatTemp(dayForecast.high, unit); // "24°"
  const lowTemp = formatTemp(dayForecast.low, unit); // "18°"
  const precipPercent = Math.round(dayForecast.precipChance * 100); // 65
  const showPrecip = precipPercent > 20; // Only show if meaningful

  return (
    <MotiView
      from={{ opacity: 0, translateX: -15 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 500, delay: index * 80 }}
    >
      <View>
        {/* Row container: flex row with items */}
        <View style={styles.row}>
          {/* Day name (left) */}
          <Typography
            variant="label"
            size="sm"
            color={colors.textMuted}
            style={styles.dayName}
          >
            {dayName}
          </Typography>

          {/* Weather icon (30px) */}
          <View style={styles.icon}>
            <WeatherIcon
              conditionCode={dayForecast.conditionCode}
              isDay={true}
              size={30}
            />
          </View>

          {/* High/Low temps: "24° / 18°" */}
          <Typography
            variant="display"
            size="xs"
            color={colors.textPrimary}
            style={styles.tempRange}
          >
            {highTemp} / {lowTemp}
          </Typography>

          {/* Precipitation % (right, only if > 20%) */}
          {showPrecip ? (
            <Typography
              variant="mono"
              size="xs"
              color={colors.textMuted}
              style={styles.precipPercent}
            >
              {precipPercent}%
            </Typography>
          ) : null}
        </View>

        {/* Thin horizontal divider below row */}
        <View style={styles.divider} />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md, // 16px between elements
    paddingVertical: spacing.md,
  },
  dayName: {
    width: 36, // Fixed width so all days align
    letterSpacing: 1.5,
  },
  icon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  tempRange: {
    flex: 1, // Takes available space
  },
  precipPercent: {
    width: 32, // Fixed width for right alignment
    textAlign: "right",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.textGhost,
    marginTop: spacing.sm,
  },
});
