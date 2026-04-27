import { useQuery } from '@tanstack/react-query';

import { fetchCurrentWeather } from '@/features/weather/api/weatherApi';

type Coords = { lat: number; lon: number } | null;

export const useCurrentWeather = (coords: Coords) => {
  const lat = coords?.lat;
  const lon = coords?.lon;

  return useQuery({
    queryKey: ['weather', 'current', lat, lon],
    queryFn: () => {
      if (!coords) {
        throw new Error('Coordinates are required to fetch current weather');
      }
      return fetchCurrentWeather(coords.lat, coords.lon);
    },
    enabled: !!coords,
  });
};
