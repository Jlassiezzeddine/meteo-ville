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
  isFetching: boolean;
  weather: Weather | undefined;
};

export function useWeatherWidget(): UseWeatherWidgetReturn {
  const [accessKey, setAccessKey] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<GeoCity | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: cities = [], isFetching } = useGeoCities(
    debouncedSearch,
    accessKey,
  );

  const { data: weather } = useWeather(selected?.lat, selected?.lon, accessKey);
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
    isFetching,
    weather: {
      date: weather?.dt ?? 0,
      temperature: weather?.main.temp ?? 0,
      feelsLike: weather?.main.feels_like ?? 0,
      minTemp: weather?.main.temp_min ?? 0,
      maxTemp: weather?.main.temp_max ?? 0,
      humidity: weather?.main.humidity ?? 0,
      pressure: weather?.main.pressure ?? 0,
      cloudsPercent: weather?.clouds.all ?? 0,
      visibility: weather?.visibility ?? 0,
      windSpeed: weather?.wind.speed ?? 0,
      windDirectionDeg: weather?.wind.deg ?? 0,
      windGust: weather?.wind.speed ?? 0,
      sunrise: weather?.sys.sunrise ?? 0,
      sunset: weather?.sys.sunset ?? 0,
      main: weather?.weather[0].main ?? "",
      description: weather?.weather[0].description ?? "",
      icon: weather?.weather[0].icon ?? "",
      timezone: weather?.timezone ?? 0,
    },
  };
}
