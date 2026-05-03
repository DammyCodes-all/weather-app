import { Platform } from "react-native";

export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocationError";
  }
}

const isWebServer = Platform.OS === "web" && typeof window === "undefined";

async function loadLocationModule() {
  const Location = await import("expo-location");
  return Location;
}

export const requestLocationPermission = async (): Promise<"granted" | "denied"> => {
  if (isWebServer) {
    return "denied";
  }

  const Location = await loadLocationModule();
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted" ? "granted" : "denied";
};

export const getCurrentCoords = async (): Promise<{ lat: number; lon: number }> => {
  if (isWebServer) {
    throw new LocationError("Location is unavailable during server-side rendering");
  }

  const Location = await loadLocationModule();
  const permission = await requestLocationPermission();
  if (permission !== "granted") {
    throw new LocationError("Location permission denied");
  }

  try {
    const result = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new LocationError("Location request timed out")), 10000);
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
    throw new LocationError("Unable to determine current location");
  }
};
