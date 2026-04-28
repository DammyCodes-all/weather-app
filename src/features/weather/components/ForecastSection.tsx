import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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

/**
 * Collapsible 5-day forecast container
 *
 * Header displays "5-DAY FORECAST" with a chevron (rotates 180° on expand).
 * Content animates in/out via Reanimated maxHeight animation with spring physics.
 * Collapsed by default (progressive disclosure — reduces cognitive load on open).
 *
 * Key technique: Can't animate to 'auto' height in RN, so we measure content height
 * with onLayout callback, then animate maxHeight to that pixel value.
 *
 * Animation details:
 * - Chevron: Reanimated rotation interpolation + withTiming
 * - MaxHeight: withSpring(damping: 18, stiffness: 200) for snappy, controlled feel
 */
export function ForecastSection({
  forecastData,
  unit,
  isLoading = false,
}: ForecastSectionProps) {
  // State: track if section is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // Shared values for animations
  const expandedValue = useSharedValue(0); // 0 = collapsed, 1 = expanded
  const contentHeightRef = useRef(0); // Store measured content height in pixels

  /**
   * When user taps header, toggle expand state
   */
  const handleToggle = async () => {
    setIsExpanded(!isExpanded);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate to 0 or 1
    expandedValue.value = withSpring(!isExpanded ? 1 : 0, {
      damping: 18,
      stiffness: 200,
    });
  };

  /**
   * Measure the content View height when it renders
   * Store it so we can animate maxHeight to this value
   */
  const handleContentLayout = (e: any) => {
    if (!isLoading) {
      contentHeightRef.current = e.nativeEvent.layout.height;
    }
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

  /**
   * Animated styles for content maxHeight
   * interpolate: 0 (collapsed) → contentHeight (expanded)
   */
  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(
      expandedValue.value,
      [0, 1],
      [0, contentHeightRef.current || 300], // Fallback to 300 if not measured yet
    ),
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

      {/* Animated content container with clipping */}
      <Animated.View style={[styles.contentWrapper, contentStyle]}>
        <View
          style={styles.content}
          onLayout={handleContentLayout}
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
                  index={index}
                />
              ))}
        </View>
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
  content: {
    paddingHorizontal: spacing.md,
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
