import { useEffect } from "react";
import { DimensionValue } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme";

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
}

export function Skeleton({ width, height, borderRadius = 8 }: SkeletonProps) {
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.textGhost,
        },
        animatedStyle,
      ]}
      className={`my-1`}
    />
  );
}
