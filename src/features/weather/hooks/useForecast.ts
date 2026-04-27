import { useQuery } from '@tanstack/react-query';

import { fetchForecast } from '@/features/weather/api/weatherApi';

type Coords = { lat: number; lon: number } | null;

export const useForecast = (coords: Coords) => {
  const lat = coords?.lat;
  const lon = coords?.lon;

  return useQuery({
    queryKey: ['weather', 'forecast', lat, lon],
    queryFn: () => {
      if (!coords) {
        throw new Error('Coordinates are required to fetch forecast');
      }
      return fetchForecast(coords.lat, coords.lon);
    },
    enabled: !!coords,
  });
};
