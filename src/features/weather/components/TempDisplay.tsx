import { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';

import { Typography } from '@/components/Typography';
import { colors } from '@/theme';
import { kelvinToCelsius, kelvinToFahrenheit } from '@/utils/formatters';

interface TempDisplayProps {
  tempKelvin: number;
  unit: 'C' | 'F';
  conditionLabel: string;
}

export function TempDisplay({ tempKelvin, unit, conditionLabel }: TempDisplayProps) {
  const tempValue = useMemo(
    () => (unit === 'C' ? kelvinToCelsius(tempKelvin) : kelvinToFahrenheit(tempKelvin)),
    [tempKelvin, unit],
  );

  const displaySize = Dimensions.get('window').width * 0.27;

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.tempWrap}
      >
        <Typography
          variant="display"
          color={colors.textPrimary}
          style={[styles.tempNumber, { fontSize: displaySize }]}
        >
          {tempValue}
        </Typography>
        <Typography variant="mono" size="xl" color={colors.textPrimary} style={styles.tempUnit}>
          °{unit}
        </Typography>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 200 }}
      >
        <Typography
          variant="mono"
          size="sm"
          color={colors.textMuted}
          style={styles.conditionLabel}
        >
          {conditionLabel.toUpperCase()}
        </Typography>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  tempWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  tempNumber: {
    lineHeight: 92,
  },
  tempUnit: {
    position: 'absolute',
    right: -26,
    top: 8,
  },
  conditionLabel: {
    letterSpacing: 3,
    marginTop: 10,
  },
});
