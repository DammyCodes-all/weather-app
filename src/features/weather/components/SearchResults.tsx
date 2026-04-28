import { MotiView, View } from "moti";
import { Pressable, StyleSheet, FlatList } from "react-native";
import * as Haptics from "expo-haptics";

import { GeocodingResult } from "@/features/weather/api/weatherApi";
import { colors, spacing } from "@/theme";
import { Typography } from "@/components/Typography";

interface SearchResultsProps {
  results: GeocodingResult[];
  onSelectCity: (city: GeocodingResult) => void;
  isLoading: boolean;
}

export function SearchResults({ results, onSelectCity, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <FlatList
        data={Array(5).fill(0)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => (
          <MotiView
            from={{ opacity: 0.15 }}
            animate={{ opacity: 0.4 }}
            transition={{ loop: true, duration: 1200 }}
            style={styles.skeleton}
          />
        )}
      />
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Typography variant="mono" size="sm" color={colors.textMuted}>
          no cities found.
        </Typography>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => `${item.lat}-${item.lon}`}
      renderItem={({ item, index }) => (
        <MotiView
          from={{ opacity: 0, translateX: -15 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: index * 50 }}
        >
          <Pressable
            style={styles.resultItem}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectCity(item);
            }}
          >
            <Typography variant="display" size="base" color={colors.textPrimary}>
              {item.name}
            </Typography>
            <Typography variant="mono" size="xs" color={colors.textMuted}>
              {item.state ? `${item.state}, ${item.country}` : item.country}
            </Typography>
          </Pressable>
          <View style={styles.divider} />
        </MotiView>
      )}
      style={{ flex: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  resultItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.textGhost,
    marginLeft: spacing.lg,
    marginRight: spacing.lg,
  },
  emptyState: {
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  skeleton: {
    height: 40,
    backgroundColor: colors.surface2,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.lg,
    borderRadius: 8,
  },
});
