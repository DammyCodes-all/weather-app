import * as Location from 'expo-location';

export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationError';
  }
}

export const requestLocationPermission = async (): Promise<'granted' | 'denied'> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted' ? 'granted' : 'denied';
};

export const getCurrentCoords = async (): Promise<{ lat: number; lon: number }> => {
  const permission = await requestLocationPermission();
  if (permission !== 'granted') {
    throw new LocationError('Location permission denied');
  }

  try {
    const result = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new LocationError('Location request timed out')), 10000);
      }),
    ]);

    return {
      lat: result.coords.latitude,
      lon: result.coords.longitude,
    };
  } catch (error) {
    if (error instanceof LocationError) {
      throw error;
    }
    throw new LocationError('Unable to determine current location');
  }
};
