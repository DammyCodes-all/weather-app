import { Dimensions, StyleSheet, View, Text, Platform } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { Typography } from "@/components/Typography";
import { colors } from "@/theme";
import { kelvinToCelsius, kelvinToFahrenheit } from "@/utils/formatters";

interface TempDisplayProps {
  tempKelvin: number;
  unit: "C" | "F";
  conditionLabel: string;
}

export function TempDisplay({ tempKelvin, unit, conditionLabel }: TempDisplayProps) {
  const tempValue = unit === "C" ? kelvinToCelsius(tempKelvin) : kelvinToFahrenheit(tempKelvin);

  const displaySize =
    Platform.OS === "web"
      ? Dimensions.get("window").width * 0.15
      : Dimensions.get("window").width * 0.27;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.temperatureBlock}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Typography
            variant="display"
            color={colors.textPrimary}
            style={[styles.tempNumber, { fontSize: displaySize }]}
          >
            {tempValue}
          </Typography>
          <Text
            style={[styles.unit, { fontSize: displaySize * 0.3, lineHeight: displaySize * 0.3 }]}
          >
            °{unit}
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(200)}>
        <Typography variant="mono" size="sm" color={colors.textMuted} style={styles.conditionLabel}>
          {conditionLabel.toUpperCase()}
        </Typography>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
  },
  temperatureBlock: {
    marginBottom: 8,
  },
  tempNumber: {
    lineHeight: 92,
  },
  conditionLabel: {
    letterSpacing: 3,
    marginTop: Platform.select({
      web: 2,
      default: 10,
    }),
  },
  unit: {
    fontFamily: "IBMPlexMono_400Regular",
    fontWeight: "600",
    position: "relative",
    top: 2,
    lineHeight: 1,
    color: "white",
  },
});
