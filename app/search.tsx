import { View, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Typography } from "@/components/Typography";
import { colors, spacing } from "@/theme";
import { SearchInput } from "@/features/weather/components/SearchInput";
import { SearchResults } from "@/features/weather/components/SearchResults";
import { RecentSearches } from "@/features/weather/components/RecentSearches";
import { fetchGeocodingResults, GeocodingResult } from "@/features/weather/api/weatherApi";
import { useWeatherStore } from "@/store/WeatherContext";
import { saveRecentSearch, loadRecentSearches, removeRecentSearch } from "@/utils/geocoding";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>([]);
  const searchTimeout = useRef<any | null>(null);
  const { setCoords } = useWeatherStore();

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches().then(setRecentSearches);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      loadRecentSearches().then(setRecentSearches);
      return;
    }

    // Debounce search requests
    searchTimeout.current = setTimeout(() => {
      setIsLoading(true);
      fetchGeocodingResults(searchQuery)
        .then((geocodingResults) => {
          setResults(geocodingResults);
        })
        .catch((error) => {
          console.error("Search error:", error);
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 400);
  };

  const handleSelectCity = async (city: GeocodingResult) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCoords({ lat: city.lat, lon: city.lon });
    await saveRecentSearch(city);
    router.back();
  };

  const handleRemoveRecent = async (index: number) => {
    await removeRecentSearch(index);
    loadRecentSearches().then(setRecentSearches);
  };

  const handleRemoveComplete = (index: number) => {
    const updated = [...recentSearches];
    updated.splice(index, 1);
    setRecentSearches(updated);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="display" size="xl" color={colors.textPrimary}>
            search.
          </Typography>
        </View>

        <SearchInput query={query} onQueryChange={handleSearch} />

        <RecentSearches
          onRemove={handleRemoveRecent}
          onSelect={handleSelectCity}
          onRemoveComplete={handleRemoveComplete}
        />

        <SearchResults results={results} isLoading={isLoading} onSelectCity={handleSelectCity} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
