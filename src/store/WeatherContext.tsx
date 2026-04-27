import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type Unit = 'C' | 'F';
type Coords = { lat: number; lon: number } | null;

interface WeatherContextValue {
  unit: Unit;
  setUnit: (next: Unit) => void;
  coords: Coords;
  setCoords: (next: Coords) => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>('C');
  const [coords, setCoords] = useState<Coords>(null);

  const value = useMemo(
    () => ({
      unit,
      setUnit,
      coords,
      setCoords,
    }),
    [coords, unit],
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within WeatherProvider');
  }
  return context;
}
