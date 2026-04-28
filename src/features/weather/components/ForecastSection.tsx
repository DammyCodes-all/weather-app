import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Typography } from "@/components/Typography";
import { ForecastRow } from "@/features/weather/components/ForecastRow";
import { colors, spacing } from "@/theme";
import { DayForecast } from "@/utils/forecastProcessor";

interface ForecastSectionProps {
  forecastData: DayForecast[];
  unit: "C" | "F";
  isLoading?: boolean;
}

export function ForecastSection({
  forecastData,
  unit,
  isLoading = false,
}: ForecastSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedValue = useSharedValue(0);

  /**
   * When user taps header, toggle expand state
   */
  const handleToggle = async () => {
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    expandedValue.value = withTiming(nextExpanded ? 1 : 0, { duration: 220 });
  };

  /**
   * Animated styles for chevron rotation
   * interpolate from 0→180° based on expandedValue
   */
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: interpolate(expandedValue.value, [0, 1], [0, 180]) + "deg",
      },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(expandedValue.value, [0, 1], [0, 320]),
    opacity: interpolate(expandedValue.value, [0, 1], [0, 1]),
  }));

  return (
    <View style={styles.wrapper}>
      {/* Header with chevron toggle */}
      <Pressable onPress={handleToggle} style={styles.header}>
        <Typography
          variant="label"
          size="xs"
          color={colors.textMuted}
          style={styles.headerText}
        >
          5-DAY FORECAST
        </Typography>

        <Animated.View style={chevronStyle}>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={colors.textMuted}
          />
        </Animated.View>
      </Pressable>

      {/* Animated content container with clipping and internal scroll for overflow */}
      <Animated.View style={[styles.contentWrapper, contentStyle]}>
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          pointerEvents={isExpanded ? "auto" : "none"}
        >
          {isLoading
            ? // Skeleton loaders while loading
              [...Array(5)].map((_, i) => (
                <View key={`skeleton-${i}`} style={styles.skeletonRow}>
                  <View style={styles.skeletonItem} />
                </View>
              ))
            : // Actual forecast rows
              forecastData.map((dayForecast, index) => (
                <ForecastRow
                  key={`${dayForecast.dt}-${index}`}
                  dayForecast={dayForecast}
                  unit={unit}
                />
              ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerText: {
    letterSpacing: 4,
  },
  contentWrapper: {
    overflow: "hidden",
  },
  contentScroll: {
    maxHeight: 320,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  // Skeleton placeholder styles (for loading state)
  skeletonRow: {
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  skeletonItem: {
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.textGhost,
    opacity: 0.3,
    flex: 1,
  },
});
