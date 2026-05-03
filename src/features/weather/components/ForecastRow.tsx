import { Platform, StyleSheet, View } from "react-native";

import { Typography } from "@/components/Typography";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { colors, spacing } from "@/theme";
import { DayForecast } from "@/utils/forecastProcessor";
import { formatDay, formatTemp } from "@/utils/formatters";

interface ForecastRowProps {
  dayForecast: DayForecast;
  unit: "C" | "F";
}

export function ForecastRow({ dayForecast, unit }: ForecastRowProps) {
  const dayName = formatDay(dayForecast.dt);
  const highTemp = formatTemp(dayForecast.high, unit);
  const lowTemp = formatTemp(dayForecast.low, unit);
  const precipPercent = Math.round(dayForecast.precipChance * 100);
  const showPrecip = precipPercent > 20;

  return (
    <View>
      {/* Row container: flex row with items */}
      <View style={styles.row}>
        <Typography variant="label" size={"sm"} color={colors.textMuted} style={styles.dayName}>
          {dayName}
        </Typography>

        {/* Weather icon (30px) */}
        <View style={styles.icon}>
          <WeatherIcon
            conditionCode={dayForecast.conditionCode}
            isDay={true}
            size={Platform.OS === "web" ? 40 : 30}
            animated={false}
          />
        </View>

        {/* High/Low temps: "24° / 18°" */}
        <Typography
          variant="display"
          size={Platform.OS === "web" ? "sm" : "xs"}
          color={colors.textPrimary}
          style={styles.tempRange}
        >
          {highTemp} / {lowTemp}
        </Typography>

        {/* Precipitation % (right, only if > 20%) */}
        {showPrecip ? (
          <Typography
            variant="mono"
            size={Platform.OS === "web" ? "sm" : "xs"}
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
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  dayName: {
    width: Platform.OS === "web" ? 40 : 36,
    letterSpacing: 1.5,
  }
  icon: {
    width: Platform.OS === "web" ? 40 : 30,
    height: Platform.OS === "web" ? 40 : 30,
    justifyContent: "center",
    alignItems: "center",
  },
  tempRange: {
    flex: 1,
  },
  precipPercent: {
    width: 32,
    textAlign: "right",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.textGhost,
    marginTop: spacing.sm,
  },
});
