import { GeocodingResult } from "@/features/weather/api/weatherApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_SEARCHES_KEY = "@weather/recent_searches";

export const saveRecentSearch = async (city: GeocodingResult) => {
  try {
    const existing = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    const recent = existing ? JSON.parse(existing) : [];

    // Remove duplicates based on name and country
    const filtered = recent.filter(
      (c: GeocodingResult) => c.name !== city.name || c.country !== city.country,
    );

    // Add new city to the beginning
    const updated = [city, ...filtered];
    const trimmed = updated.slice(0, 5);

    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save recent search", error);
  }
};

export const loadRecentSearches = async (): Promise<GeocodingResult[]> => {
  try {
    const data = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load recent searches", error);
    return [];
  }
};

export const removeRecentSearch = async (index: number) => {
  try {
    const existing = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    if (!existing) return;

    const recent = JSON.parse(existing);
    recent.splice(index, 1);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
  } catch (error) {
    console.error("Failed to remove recent search", error);
  }
};
