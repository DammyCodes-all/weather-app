import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { getCurrentCoords, requestLocationPermission } from "@/utils/location";

type Unit = "C" | "F";
type Coords = { lat: number; lon: number } | null;
type LocationStatus = "loading" | "granted" | "denied" | "error";

interface WeatherState {
  unit: Unit;
  coords: Coords;
  locationStatus: LocationStatus;
}

type WeatherAction =
  | { type: "SET_COORDS"; payload: Coords }
  | { type: "SET_UNIT"; payload: Unit }
  | { type: "SET_LOCATION_STATUS"; payload: LocationStatus };

interface WeatherContextValue extends WeatherState {
  dispatch: React.Dispatch<WeatherAction>;
  setUnit: (next: Unit) => void;
  setCoords: (next: Coords) => void;
}

const UNIT_STORAGE_KEY = "@weather/unit";

const initialState: WeatherState = {
  unit: "C",
  coords: null,
  locationStatus: "loading",
};

const weatherReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
  switch (action.type) {
    case "SET_COORDS":
      return { ...state, coords: action.payload };
    case "SET_UNIT":
      return { ...state, unit: action.payload };
    case "SET_LOCATION_STATUS":
      return { ...state, locationStatus: action.payload };
    default:
      return state;
  }
};

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateAndLocate = async () => {
      try {
        const storedUnit = await AsyncStorage.getItem(UNIT_STORAGE_KEY);
        if (storedUnit === "C" || storedUnit === "F") {
          dispatch({ type: "SET_UNIT", payload: storedUnit });
        }

        const permission = await requestLocationPermission();
        if (permission === "denied") {
          dispatch({ type: "SET_LOCATION_STATUS", payload: "denied" });
          setIsHydrating(false);
          return;
        }

        const coords = await getCurrentCoords();
        dispatch({ type: "SET_COORDS", payload: coords });
        dispatch({ type: "SET_LOCATION_STATUS", payload: "granted" });
        setIsHydrating(false);
      } catch {
        dispatch({ type: "SET_LOCATION_STATUS", payload: "error" });
        setIsHydrating(false);
      }
    };

    hydrateAndLocate();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(UNIT_STORAGE_KEY, state.unit).catch(() => {});
  }, [state.unit]);

  if (isHydrating) {
    return null;
  }

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      setUnit: (next: Unit) => dispatch({ type: "SET_UNIT", payload: next }),
      setCoords: (next: Coords) => dispatch({ type: "SET_COORDS", payload: next }),
    }),
    [state],
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeatherStore() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherStore must be used within WeatherProvider");
  }
  return context;
}

export const useWeatherContext = useWeatherStore;
