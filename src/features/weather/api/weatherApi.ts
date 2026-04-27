import axios, { AxiosError } from "axios";

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherResponse {
  id: number;
  name: string;
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  dt: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
  };
  pop: number;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export class WeatherApiError extends Error {
  code: number;
  userMessage: string;

  constructor(code: number, userMessage: string, message?: string) {
    super(message ?? userMessage);
    this.name = "WeatherApiError";
    this.code = code;
    this.userMessage = userMessage;
  }
}

const getUserMessage = (status: number) => {
  if (status === 401) {
    return "Invalid weather API key.";
  }
  if (status === 404) {
    return "Weather data was not found for this location.";
  }
  if (status === 429) {
    return "Rate limit reached. Try again in a minute.";
  }
  if (status >= 500) {
    return "Weather service is temporarily unavailable.";
  }
  return "Unable to load weather data right now.";
};

const weatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
  params: {
    appid: process.env.EXPO_PUBLIC_OWM_KEY,
  },
});

weatherApi.interceptors.request.use((config) => {
  if (__DEV__) {
    const endpoint = config.url ?? "";
    console.log(`[API →] ${endpoint}`);
  }
  return config;
});

weatherApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    const responseMessage = error.response?.data?.message;
    const fallbackMessage = error.message || "Unknown API error";
    if (__DEV__) {
      console.error("[API ← ERROR]", {
        status,
        message: responseMessage ?? fallbackMessage,
        url: error.config?.url ?? "",
      });
    }
    throw new WeatherApiError(
      status,
      getUserMessage(status),
      responseMessage ?? fallbackMessage,
    );
  },
);

export const fetchCurrentWeather = async (
  lat: number,
  lon: number,
): Promise<CurrentWeatherResponse> => {
  const { data } = await weatherApi.get<CurrentWeatherResponse>("/weather", {
    params: { lat, lon },
  });
  return data;
};

export const fetchForecast = async (
  lat: number,
  lon: number,
): Promise<ForecastResponse> => {
  const { data } = await weatherApi.get<ForecastResponse>("/forecast", {
    params: { lat, lon },
  });
  return data;
};
