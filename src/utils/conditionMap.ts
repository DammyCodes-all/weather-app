export type WeatherIconKey =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'mist';

export interface ConditionMeta {
  label: string;
  iconComponent: WeatherIconKey;
  gradientColors: [string, string];
}

const clearDayMeta: ConditionMeta = {
  label: 'Clear',
  iconComponent: 'clear-day',
  gradientColors: ['#0A0F2E', '#0D1B4B'],
};

const clearNightMeta: ConditionMeta = {
  label: 'Clear',
  iconComponent: 'clear-night',
  gradientColors: ['#070B1A', '#0A122B'],
};

const cloudyMeta: ConditionMeta = {
  label: 'Cloudy',
  iconComponent: 'cloudy',
  gradientColors: ['#0B101B', '#141C2E'],
};

const rainMeta: ConditionMeta = {
  label: 'Rain',
  iconComponent: 'rain',
  gradientColors: ['#0A0E14', '#0F1824'],
};

const thunderMeta: ConditionMeta = {
  label: 'Thunderstorm',
  iconComponent: 'thunderstorm',
  gradientColors: ['#080A0F', '#0D0F1A'],
};

const snowMeta: ConditionMeta = {
  label: 'Snow',
  iconComponent: 'snow',
  gradientColors: ['#0D1420', '#1C2A3D'],
};

const mistMeta: ConditionMeta = {
  label: 'Mist',
  iconComponent: 'mist',
  gradientColors: ['#0B0F17', '#121A24'],
};

export const getConditionMeta = (code: number, isDay: boolean): ConditionMeta => {
  if (code >= 200 && code <= 299) {
    return thunderMeta;
  }
  if (code >= 300 && code <= 399) {
    return { ...rainMeta, label: 'Drizzle' };
  }
  if (code >= 500 && code <= 599) {
    if (code >= 520) {
      return { ...rainMeta, label: 'Heavy Rain' };
    }
    return rainMeta;
  }
  if (code >= 600 && code <= 699) {
    return snowMeta;
  }
  if (code >= 700 && code <= 799) {
    return mistMeta;
  }
  if (code === 800) {
    return isDay ? clearDayMeta : clearNightMeta;
  }
  if (code >= 801 && code <= 804) {
    if (code >= 803) {
      return { ...cloudyMeta, label: 'Overcast' };
    }
    return { ...cloudyMeta, label: 'Partly Cloudy' };
  }
  return cloudyMeta;
};
