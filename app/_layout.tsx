import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useRef } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "expo-router";

import { queryClient } from "@/store/queryClient";
import { WeatherProvider } from "@/store/WeatherContext";

import "../global.css";
import "react-native-reanimated";

export default function RootLayout() {
  const appState = useRef(AppState.currentState);

  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener("change", (nextAppState) => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
          const queries = queryClient.getQueryCache().findAll();
          const now = Date.now();

          // Check if any queries are stale (older than 10 minutes)
          const isStale = queries.some((query) => {
            const state = queryClient.getQueryState(query.queryKey);
            return !state || (state.dataUpdatedAt && now - state.dataUpdatedAt > 600000);
          });

          if (isStale) {
            queryClient.invalidateQueries({ queryKey: ["weather"] });
          }
        }

        appState.current = nextAppState;
      });

      return () => subscription?.remove();
    }, []),
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <WeatherProvider>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: "#080810" },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ presentation: "modal", headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </WeatherProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
