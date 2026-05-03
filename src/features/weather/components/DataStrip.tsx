import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { Typography } from "@/components/Typography";
import { colors, radius, spacing } from "@/theme";
import { formatHumidity, formatTemp, formatWindSpeed } from "@/utils/formatters";

interface DataStripProps {
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  unit: "C" | "F";
}

const stripItems = (humidity: number, windSpeed: number, feelsLike: number, unit: "C" | "F") => [
  { label: "HUMIDITY", value: formatHumidity(humidity) },
  { label: "WIND", value: formatWindSpeed(windSpeed) },
  { label: "FEELS LIKE", value: formatTemp(feelsLike, unit) },
];

export function DataStrip({ humidity, windSpeed, feelsLike, unit }: DataStripProps) {
  const items = stripItems(humidity, windSpeed, feelsLike, unit);
  const isWeb = Platform.OS === "web";

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(500)} style={styles.wrapper}>
      {isWeb ? (
        <View
          style={[styles.blur]}
          className={`${Platform.OS === "web" ? "backdrop-blur-[1.5px] bg-transparent" : ""}`}
        >
          <View style={styles.row}>
            {items.map((item, index) => (
              <View key={item.label} style={styles.item}>
                <Typography
                  variant="label"
                  size="xs"
                  color={colors.textMuted}
                  style={styles.itemLabel}
                >
                  {item.label}
                </Typography>
                <Typography variant="mono" size="base" color={colors.textPrimary}>
                  {item.value}
                </Typography>
                {index < items.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </View>
        </View>
      ) : (
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <View style={styles.row}>
            {items.map((item, index) => (
              <View key={item.label} style={styles.item}>
                <Typography
                  variant="label"
                  size="xs"
                  color={colors.textMuted}
                  style={styles.itemLabel}
                >
                  {item.label}
                </Typography>
                <Typography variant="mono" size="base" color={colors.textPrimary}>
                  {item.value}
                </Typography>
                {index < items.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </View>
        </BlurView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  blur: {
    overflow: "hidden",
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.textGhost,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  item: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: spacing.sm,
  },
  itemLabel: {
    letterSpacing: 1.6,
    marginBottom: spacing.xs,
  },
  divider: {
    position: "absolute",
    right: 0,
    top: 4,
    bottom: 4,
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.textGhost,
  },
});
