"use client";

import { useDebouncedValue } from "@/hooks/useDebounce";
import { useGeoCities, useWeather } from "@/lib/openweathermap.queries";
import { GeoCity, Weather } from "@/lib/openweathermap.types";
import React from "react";

export type UseWeatherWidgetReturn = {
  accessKey: string;
  setAccessKey: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selected: GeoCity | null;
  setSelected: React.Dispatch<React.SetStateAction<GeoCity | null>>;
  comboboxOptions: { value: string; label: string; meta: GeoCity }[];
  isFetchingCities: boolean;
  isFetchingWeather: boolean;
  weather: Weather | undefined;
};

export function useWeatherWidget(): UseWeatherWidgetReturn {
  const [accessKey, setAccessKey] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<GeoCity | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: cities = [], isFetching: isFetchingCities } = useGeoCities(
    debouncedSearch,
    accessKey,
  );

  const { data: weather, isFetching: isFetchingWeather } = useWeather(
    selected?.lat,
    selected?.lon,
    accessKey,
  );
  const comboboxOptions = React.useMemo(
    () =>
      cities.map((c) => ({
        value: `${c.name}-${c.lat},${c.lon}`,
        label: `${c.name}${c.state ? ", " + c.state : ""}${
          c.country ? ", " + c.country : ""
        }`,
        meta: c,
      })),
    [cities],
  );

  return {
    accessKey,
    setAccessKey,
    search,
    setSearch,
    selected,
    setSelected,
    comboboxOptions,
    isFetchingCities,
    isFetchingWeather,
    weather: weather
      ? {
          date: weather?.dt,
          temperature: weather?.main.temp,
          feelsLike: weather?.main.feels_like,
          minTemp: weather?.main.temp_min,
          maxTemp: weather?.main.temp_max,
          humidity: weather?.main.humidity,
          pressure: weather?.main.pressure,
          cloudsPercent: weather?.clouds.all,
          visibility: weather?.visibility,
          windSpeed: weather?.wind.speed,
          windDirectionDeg: weather?.wind.deg,
          windGust: weather?.wind.speed,
          sunrise: weather?.sys.sunrise,
          sunset: weather?.sys.sunset,
          main: weather?.weather[0].main,
          description: weather?.weather[0].description,
          icon: weather?.weather[0].icon,
          timezone: weather?.timezone,
        }
      : undefined,
  };
}
