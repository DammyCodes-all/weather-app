import dayjs from 'dayjs';

const kelvinOffset = 273.15;

export const kelvinToCelsius = (kelvin: number): number =>
  Math.round(kelvin - kelvinOffset);

export const kelvinToFahrenheit = (kelvin: number): number =>
  Math.round(((kelvin - kelvinOffset) * 9) / 5 + 32);

export const formatTemp = (kelvin: number, unit: 'C' | 'F'): string => {
  const temp = unit === 'C' ? kelvinToCelsius(kelvin) : kelvinToFahrenheit(kelvin);
  return `${temp}°`;
};

export const formatWindSpeed = (metersPerSecond: number): string => {
  const kmPerHour = Math.round(metersPerSecond * 3.6);
  return `${kmPerHour} km/h`;
};

export const formatHumidity = (humidity: number): string => `${Math.round(humidity)}%`;

export const formatHour = (unix: number): string => dayjs.unix(unix).format('h A');

export const formatDay = (unix: number): string =>
  dayjs.unix(unix).format('ddd').toUpperCase();

export const formatFullDate = (unix: number): string =>
  dayjs.unix(unix).format('dddd, MMMM D');
