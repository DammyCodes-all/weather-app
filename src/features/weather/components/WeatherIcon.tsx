import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';

import { colors } from '@/theme';
import { getConditionMeta } from '@/utils/conditionMap';

interface WeatherIconProps {
  conditionCode: number;
  isDay: boolean;
  size?: number;
  color?: string;
}

export function WeatherIcon({
  conditionCode,
  isDay,
  size = 96,
  color = colors.textPrimary,
}: WeatherIconProps) {
  const { iconName } = getConditionMeta(conditionCode, isDay);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
    </MotiView>
  );
}
