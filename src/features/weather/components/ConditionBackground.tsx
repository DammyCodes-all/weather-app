import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { runOnJS } from "react-native-worklets";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import { getConditionMeta } from "@/utils/conditionMap";

interface ConditionBackgroundProps {
  conditionCode: number;
  isDay: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function ConditionBackground({
  conditionCode,
  isDay,
}: ConditionBackgroundProps) {
  const initialColors = getConditionMeta(conditionCode, isDay).gradientColors;
  const [baseColors, setBaseColors] = useState<[string, string]>(initialColors);
  const [overlayColors, setOverlayColors] =
    useState<[string, string]>(initialColors);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    const nextColors = getConditionMeta(conditionCode, isDay).gradientColors;
    const unchanged =
      nextColors[0] === baseColors[0] && nextColors[1] === baseColors[1];
    if (unchanged) {
      return;
    }

    setOverlayColors(nextColors);
    overlayOpacity.value = 1;
    overlayOpacity.value = withTiming(
      0,
      { duration: 800, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) {
          runOnJS(setBaseColors)(nextColors);
        }
      },
    );
  }, [baseColors, conditionCode, isDay, overlayOpacity]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <View pointerEvents="none" style={styles.container}>
      <LinearGradient
        colors={baseColors}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Crossfade layer to transition between condition gradients. */}
      <AnimatedView style={[StyleSheet.absoluteFillObject, overlayStyle]}>
        <LinearGradient
          colors={overlayColors}
          style={StyleSheet.absoluteFillObject}
        />
      </AnimatedView>

      {/* Subtle repeating grain pattern prevents the gradient from feeling flat. */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <Pattern
            id="grainPattern"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="3" cy="4" r="0.9" fill="#FFFFFF" fillOpacity={0.08} />
            <Circle cx="12" cy="8" r="0.7" fill="#FFFFFF" fillOpacity={0.06} />
            <Circle cx="18" cy="17" r="1.0" fill="#FFFFFF" fillOpacity={0.05} />
            <Circle cx="7" cy="18" r="0.8" fill="#FFFFFF" fillOpacity={0.07} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grainPattern)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
