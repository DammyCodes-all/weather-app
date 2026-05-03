import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import { getCurrentCoords } from "@/utils/location";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Typography } from "@/components/Typography";
import { useCurrentWeather } from "@/features/weather/hooks/useCurrentWeather";
import { useForecast } from "@/features/weather/hooks/useForecast";
import { ConditionBackground } from "@/features/weather/components/ConditionBackground";
import { DataStrip } from "@/features/weather/components/DataStrip";
import { HourlyStrip } from "@/features/weather/components/HourlyStrip";
import { ForecastSection } from "@/features/weather/components/ForecastSection";
import { HomeScreenSkeleton } from "@/features/weather/components/HomeScreenSkeleton";
import { TempDisplay } from "@/features/weather/components/TempDisplay";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { OfflineBanner } from "@/features/weather/components/OfflineBanner";
import { useWeatherStore } from "@/store/WeatherContext";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { colors, spacing } from "@/theme";
import { formatFullDate } from "@/utils/formatters";
import { getConditionMeta } from "@/utils/conditionMap";
import { getHourlyForToday, groupByDay } from "@/utils/forecastProcessor";
import { WeatherApiError } from "@/features/weather/api/weatherApi";

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width > 430;
  const { isOnline } = useNetworkStatus();

  const { unit, setUnit, coords, locationStatus } = useWeatherStore();
  const currentWeatherQuery = useCurrentWeather(coords);
  const forecastQuery = useForecast(coords);

  const weather = currentWeatherQuery.data;
  const conditionCode = weather?.weather[0]?.id ?? 800;
  const nowUnix = weather?.dt ?? Math.floor(Date.now() / 1000);
  const isDay = weather
    ? weather.dt >= weather.sys.sunrise && weather.dt <= weather.sys.sunset
    : true;
  const conditionLabel = weather?.weather[0]?.main ?? getConditionMeta(conditionCode, isDay).label;
  const cityName = weather?.name ?? "Unknown Station";
  const tempKelvin = weather?.main.temp ?? 297.15;
  const feelsLikeKelvin = weather?.main.feels_like ?? 296.65;
  const humidity = weather?.main.humidity ?? 72;
  const windSpeed = weather?.wind.speed ?? 5.2;

  const forecast = forecastQuery.data;
  const hourlyRaw = forecast ? getHourlyForToday(forecast.list, nowUnix) : [];
  const dailyRaw = forecast ? groupByDay(forecast.list, nowUnix) : [];

  const sunrise = weather?.sys.sunrise ?? 0;
  const sunset = weather?.sys.sunset ?? 86400;
  const hourlyData = hourlyRaw.map((item) => ({
    ...item,
    isDay: item.dt >= sunrise && item.dt <= sunset,
  }));

  const unitIndicatorX = useSharedValue(unit === "C" ? 0 : 40);
  const scrollY = useSharedValue(0);

  const { isUsingCurrentLocation, setCoords, setUsingCurrentLocation } = useWeatherStore();

  useEffect(() => {
    unitIndicatorX.value = withSpring(unit === "C" ? 0 : 40, {
      damping: 18,
      stiffness: 200,
    });
  }, [unit, unitIndicatorX]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -scrollY.value * 0.4 }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: unitIndicatorX.value }],
  }));

  const handleUnitChange = async (next: "C" | "F") => {
    if (next === unit) {
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUnit(next);
  };

  const handleRefresh = async () => {
    await Promise.all([currentWeatherQuery.refetch(), forecastQuery.refetch()]);
  };

  const handleReturnToCurrentLocation = async () => {
    if (!isUsingCurrentLocation) {
      try {
        const coords = await getCurrentCoords();
        setCoords(coords);
        setUsingCurrentLocation(true);
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    }
  };

  if (locationStatus === "denied") {
    return (
      <ScreenWrapper>
        <View className="flex-1">
          <ConditionBackground conditionCode={conditionCode} isDay={isDay} />
          <OfflineBanner isOnline={isOnline} />
          <View className="flex-1 items-center justify-center px-8">
            <Animated.View entering={FadeInUp.duration(500)}>
              <Typography variant="display" size="2xl" color={colors.textPrimary}>
                location access declined.
              </Typography>
              <Typography
                variant="mono"
                size="sm"
                color={colors.textMuted}
                style={{ marginTop: 12, letterSpacing: 1.2, textAlign: "center" }}
              >
                search for a city to get started
              </Typography>
            </Animated.View>
            <Pressable onPress={() => router.push("/search")} style={styles.searchPrompt}>
              <Typography variant="label" size="sm" color={colors.accent}>
                open city search
              </Typography>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  const initialLoading = currentWeatherQuery.isLoading && !currentWeatherQuery.data;
  if (initialLoading) {
    return (
      <ScreenWrapper>
        <View className="flex-1">
          <ConditionBackground conditionCode={conditionCode} isDay={isDay} />
          <HomeScreenSkeleton />
        </View>
      </ScreenWrapper>
    );
  }

  const apiError =
    currentWeatherQuery.error instanceof WeatherApiError ? currentWeatherQuery.error : null;
  const hasCache = Boolean(currentWeatherQuery.data);
  const shouldShowError = Boolean(currentWeatherQuery.error) && (!hasCache || isOnline);

  if (shouldShowError) {
    let title = "something broke.";
    let subtitle = "we'll try again soon";
    const showRetry = true;

    if (!isOnline && !hasCache) {
      title = "no signal.";
      subtitle = "connect to load weather";
    } else if (apiError?.code === 429) {
      title = "slow down.";
      subtitle = "api limit reached - try in a minute";
    } else if (apiError?.code === 0) {
      title = "no signal.";
      subtitle = "check your connection";
    }

    return (
      <ScreenWrapper>
        <View className="flex-1">
          <ConditionBackground conditionCode={conditionCode} isDay={isDay} />
          <View className="flex-1 items-center justify-center px-8">
            <Animated.View entering={FadeInUp.duration(500)}>
              <Typography variant="display" size="2xl" color={colors.textPrimary}>
                {title}
              </Typography>
              <Typography
                variant="mono"
                size="sm"
                color={colors.textMuted}
                style={{
                  marginTop: 8,
                  letterSpacing: 1.1,
                  textAlign: "center",
                }}
              >
                {subtitle}
              </Typography>
            </Animated.View>
            {showRetry ? (
              <Pressable onPress={handleRefresh} style={{ marginTop: 18 }}>
                <Typography variant="label" size="sm" color={colors.accent}>
                  retry
                </Typography>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <ConditionBackground conditionCode={conditionCode} isDay={isDay} />
        <OfflineBanner isOnline={isOnline} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={currentWeatherQuery.isFetching || forecastQuery.isFetching}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.headerContainer, parallaxStyle]}>
            <View
              className="flex-row items-start justify-between"
              style={{ marginTop: spacing.sm }}
            >
              <View className="gap-1">
                <Typography variant="display" size="xl" color={colors.textPrimary}>
                  {cityName}
                </Typography>
                <Typography
                  variant="mono"
                  size="xs"
                  color={colors.textMuted}
                  style={{ letterSpacing: 2 }}
                >
                  {formatFullDate(nowUnix).toUpperCase()}
                </Typography>
              </View>

              <View style={styles.topActions}>
                <View style={styles.unitToggle}>
                  <Animated.View style={[styles.unitActiveIndicator, indicatorStyle]} />
                  <Pressable style={styles.unitOption} onPress={() => handleUnitChange("C")}>
                    <Typography
                      variant="label"
                      size="xs"
                      color={unit === "C" ? colors.textPrimary : colors.textMuted}
                    >
                      °C
                    </Typography>
                  </Pressable>
                  <Pressable style={styles.unitOption} onPress={() => handleUnitChange("F")}>
                    <Typography
                      variant="label"
                      size="xs"
                      color={unit === "F" ? colors.textPrimary : colors.textMuted}
                    >
                      °F
                    </Typography>
                  </Pressable>
                </View>

                <Pressable hitSlop={10} onPress={() => router.push("/search")}>
                  <MaterialCommunityIcons name="magnify" size={24} color={colors.textPrimary} />
                </Pressable>
              </View>
            </View>
          </Animated.View>
          <View
            className={`flex-1 items-center justify-center my-2 ${Platform.OS === "web" ? "flex-col gap-2" : ""}`}
            style={[styles.heroWrap, isWide ? styles.heroWide : styles.heroStack]}
          >
            <WeatherIcon
              conditionCode={conditionCode}
              isDay={isDay}
              size={Platform.OS === "web" ? 220 : 180}
            />
            <TempDisplay tempKelvin={tempKelvin} unit={unit} conditionLabel={conditionLabel} />
          </View>
          <View
            style={{ marginVertical: spacing.lg }}
            className={`${Platform.OS === "web" ? "sm:mx-auto" : ""}`}
          >
            {hourlyData.length > 0 ? <HourlyStrip hourlyData={hourlyData} unit={unit} /> : null}
          </View>
          <View style={{ marginVertical: spacing.lg }}>
            <ForecastSection
              forecastData={dailyRaw}
              unit={unit}
              isLoading={forecastQuery.isLoading}
            />
          </View>
          <View style={{ paddingBottom: spacing.lg }}>
            <DataStrip
              humidity={humidity}
              windSpeed={windSpeed}
              feelsLike={feelsLikeKelvin}
              unit={unit}
            />
          </View>

          {!isUsingCurrentLocation && (
            <View style={{ marginVertical: spacing.lg, alignItems: "center" }}>
              <Pressable
                style={styles.currentLocationButton}
                onPress={handleReturnToCurrentLocation}
              >
                <Typography
                  variant="label"
                  size="sm"
                  color={colors.textMuted}
                  style={{ textAlign: "center" }}
                >
                  Return to Current Location
                </Typography>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  unitToggle: {
    width: 82,
    height: 34,
    borderRadius: 9999,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    position: "relative",
  },
  unitActiveIndicator: {
    position: "absolute",
    width: 36,
    height: 28,
    borderRadius: 9999,
    backgroundColor: colors.accent,
    top: 3,
    left: 3,
  },
  unitOption: {
    flex: 1,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 28,
  },
  heroWrap: {
    marginTop: -32,
    gap: spacing.md,
  },
  heroStack: {
    flexDirection: "column",
  },
  heroWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  headerContainer: {
    // No additional styling needed, inherits from parent
  },
  searchPrompt: {
    marginTop: 20,
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: colors.surface2,
  },
  currentLocationButton: {
    padding: 10,
    borderRadius: 99,
    backgroundColor: colors.surface2,
  },
});
