import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { ZoomIn } from "react-native-reanimated";

import { colors } from "@/theme";
import { getConditionMeta } from "@/utils/conditionMap";

interface WeatherIconProps {
  conditionCode: number;
  isDay: boolean;
  size?: number;
  color?: string;
  animated?: boolean;
}

export function WeatherIcon({
  conditionCode,
  isDay,
  size = 96,
  color = colors.textPrimary,
  animated = true,
}: WeatherIconProps) {
  const { iconName } = getConditionMeta(conditionCode, isDay);

  if (!animated) {
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  }

  return (
    <Animated.View entering={ZoomIn.duration(250)}>
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
    </Animated.View>
  );
}
