import { useQuery } from "@tanstack/react-query";
import { GeoCity, OWMOneCallResponse } from "./openweathermap.types";

export function useGeoCities(query: string, apiKey: string) {
  return useQuery({
    queryKey: ["geo", query],
    enabled: query.trim().length > 1 && !!apiKey,
    queryFn: async (): Promise<GeoCity[]> => {
      const url = new URL("https://api.openweathermap.org/geo/1.0/direct");
      url.searchParams.set("q", query);
      url.searchParams.set("limit", "5");
      url.searchParams.set("appid", apiKey);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch city suggestions");
      const data = (await res.json()) as GeoCity[];
      return data.map((d) => ({
        name: d.name,
        lat: d.lat,
        lon: d.lon,
        country: d.country,
        state: d.state,
      }));
    },
  });
}

export function useWeather(lat?: number, lon?: number, apiKey?: string) {
  return useQuery({
    queryKey: ["weather-full", lat, lon],
    enabled: lat !== undefined && lon !== undefined && !!apiKey,
    queryFn: async (): Promise<OWMOneCallResponse> => {
      const url = new URL("https://api.openweathermap.org/data/2.5/weather");
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("lon", String(lon));
      url.searchParams.set("units", "metric");
      url.searchParams.set("exclude", "minutely,hourly,alerts");
      url.searchParams.set("appid", String(apiKey));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch weather");
      return (await res.json()) as OWMOneCallResponse;
    },
    staleTime: 1000 * 60, // 1 min
  });
}

export function useValidateApiKey(apiKey: string) {
  return useQuery({
    queryKey: ["validate-api-key", apiKey],
    enabled: false, // validate on demand
    retry: 0,
    queryFn: async (): Promise<boolean> => {
      const url = new URL("https://api.openweathermap.org/geo/1.0/direct");
      url.searchParams.set("q", "London");
      url.searchParams.set("limit", "1");
      url.searchParams.set("appid", apiKey);
      const res = await fetch(url.toString());
      if (!res.ok) {
        let message = "Invalid API key";
        try {
          const err = await res.json();
          if (err && typeof err.message === "string") message = err.message;
        } catch {}
        throw new Error(message);
      }
      return true;
    },
  });
}
