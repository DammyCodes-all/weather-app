import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Typography } from "@/components/Typography";
import { colors } from "@/theme";

interface OfflineBannerProps {
  isOnline: boolean;
}

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  const translateY = useSharedValue(-40);

  useEffect(() => {
    if (!isOnline) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 180,
      });
      Haptics.notificationAsync().catch(() => {});
    } else {
      translateY.value = withSpring(-40, {
        damping: 20,
        stiffness: 180,
      });
    }
  }, [isOnline, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <View style={styles.banner}>
        <Typography variant="mono" size="xs" color="#FFFFFF">
          offline — showing cached data
        </Typography>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
  },
  banner: {
    backgroundColor: `${colors.warm}E6`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
