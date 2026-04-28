import { ForecastItem } from "@/features/weather/api/weatherApi";
import dayjs from "dayjs";

export interface HourlyItem {
  dt: number; // Unix timestamp
  temp: number; // Kelvin
  conditionCode: number; // OWM weather condition code
  isDay: boolean; // Derived from sunrise/sunset (will be set by caller)
}

export interface DayForecast {
  dt: number; // Unix timestamp of the day (midday entry)
  high: number; // Max temperature for day (Kelvin)
  low: number; // Min temperature for day (Kelvin)
  conditionCode: number; // OWM weather condition code
  precipChance: number; // Probability of precipitation (0-1, then multiply by 100 for %)
}

export function getHourlyForToday(
  list: ForecastItem[],
  nowUnix: number,
): HourlyItem[] {
  const upcoming = list.filter((item) => item.dt >= nowUnix);
  const source = upcoming.length > 0 ? upcoming : list;

  return source.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    conditionCode: item.weather[0]?.id ?? 800,
    isDay: true,
  }));
}

export function groupByDay(
  list: ForecastItem[],
  nowUnix: number,
): DayForecast[] {
  // Group items by calendar day
  const grouped = new Map<string, ForecastItem[]>();

  list.forEach((item) => {
    const dayKey = dayjs.unix(item.dt).format("YYYY-MM-DD");
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    grouped.get(dayKey)!.push(item);
  });

  const todayKey = dayjs.unix(nowUnix).format("YYYY-MM-DD");

  const futureDays = Array.from(grouped.entries()).filter(
    ([dayKey]) => dayKey > todayKey,
  );
  const daysToRender =
    futureDays.length > 0 ? futureDays : Array.from(grouped.entries());

  return daysToRender
    .slice(0, 5) // Max 5 days
    .map(([_dayKey, dayItems]) => {
      // Find midday entry (closest to 12:00–15:00)
      const middayEntry = dayItems.reduce((best, current) => {
        const currentHour = dayjs.unix(current.dt).hour();
        const bestHour = dayjs.unix(best.dt).hour();

        // Prefer 12–15:00 range
        const currentDist = Math.abs(currentHour - 13.5); // 13:30 is center of 12–15
        const bestDist = Math.abs(bestHour - 13.5);

        return currentDist < bestDist ? current : best;
      });

      // Calculate high/low across all hours in day
      const high = Math.max(...dayItems.map((item) => item.main.temp));
      const low = Math.min(...dayItems.map((item) => item.main.temp));

      // Max precipitation chance in day
      const precipChance = Math.max(...dayItems.map((item) => item.pop ?? 0));

      return {
        dt: middayEntry.dt,
        high,
        low,
        conditionCode: middayEntry.weather[0]?.id ?? 800,
        precipChance,
      };
    });
}
