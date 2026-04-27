import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from "@expo-google-fonts/ibm-plex-mono";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { queryClient } from "@/store/queryClient";
import { WeatherProvider } from "@/store/WeatherContext";

import "../global.css";
import "react-native-reanimated";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <WeatherProvider>
          <StatusBar style="light" backgroundColor="#080810" />
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: "#080810" },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="search"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </WeatherProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
