import { View, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useEffect, useState } from "react";

import { GeocodingResult } from "@/features/weather/api/weatherApi";
import { colors, spacing } from "@/theme";
import { Typography } from "@/components/Typography";

interface RecentSearchesProps {
  onRemove: (index: number) => void;
  onSelect: (city: GeocodingResult) => void;
  onRemoveComplete: (index: number) => void;
}

export function RecentSearches({ onRemove, onSelect, onRemoveComplete }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>([]);

  useEffect(() => {
    loadRecentSearches().then(setRecentSearches);
  }, []);

  const loadRecentSearches = async (): Promise<GeocodingResult[]> => {
    try {
      const data = await AsyncStorage.getItem("@weather/recent_searches");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load recent searches", error);
      return [];
    }
  };

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Typography variant="mono" size="xs" color={colors.textMuted} style={styles.title}>
        RECENT SEARCHES
      </Typography>
      <View style={styles.chipContainer}>
        {recentSearches.map((city, index) => (
          <Animated.View
            key={`${city.lat}-${city.lon}`}
            style={styles.chip}
            entering={ZoomIn.duration(180)}
          >
            <Pressable style={styles.chipContent} onPress={() => onSelect(city)}>
              <Typography variant="label" size="sm" color={colors.textPrimary}>
                {city.name}
                {city.state ? `, ${city.state}` : ""}
              </Typography>
            </Pressable>
            <Pressable style={styles.removeButton} onPress={() => onRemoveComplete(index)}>
              <Typography variant="label" size="sm" color={colors.textMuted}>
                ×
              </Typography>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipContent: {
    marginRight: 6,
  },
  removeButton: {
    padding: 4,
  },
});
