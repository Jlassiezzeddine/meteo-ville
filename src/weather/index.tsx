"use client";

import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { useWeatherWidget } from "@/weather/useWeatherWidget";
import Image from "next/image";
import React from "react";
import AccessKeyForm from "./AccessKeyForm";
import { GeoCity } from "@/lib/openweathermap.types";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

function WeatherWidget() {
  const {
    accessKey,
    setAccessKey,
    search,
    setSearch,
    selected,
    setSelected,
    comboboxOptions,
    isFetching,
    weather,
  } = useWeatherWidget();
  const [isKeyValid, setIsKeyValid] = React.useState(false);

  React.useEffect(() => {
    setIsKeyValid(false);
  }, [accessKey]);

  if (!isKeyValid) {
    return (
      <AccessKeyForm
        accessKey={accessKey}
        setAccessKey={setAccessKey}
        setIsKeyValid={setIsKeyValid}
      />
    );
  }
  return (
    <div className="flex h-full w-full max-w-xs flex-col space-y-6">
      <Combobox
        className="w-full"
        placeholder="Search city"
        inputValue={search}
        onInputChange={(v) => {
          setSearch(v);
          if (!v) setSelected(null);
        }}
        value={
          selected
            ? `${selected.name}-${selected.lat},${selected.lon}`
            : undefined
        }
        onValueChange={(_, option) => {
          const meta = (option?.meta || null) as GeoCity | null;
          setSelected(meta);
        }}
        options={comboboxOptions}
        isLoading={isFetching}
      />

      {weather && selected && (
        <>
          <Badge variant="secondary" className="rounded-full">
            {new Date(weather.date * 1000).toLocaleDateString(undefined, {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </Badge>
          <Card className="p-8 text-sm">
            <div>
              <div className="relative h-40 w-32">
                <Image
                  src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                  alt={weather.main ?? "Weather icon"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="text-8xl">
                {Math.round(weather.temperature ?? 0)}°
              </p>
              <p className="text-sm font-bold capitalize">
                {weather.description}
              </p>
              <p className="text-xs">
                {weather.feelsLike !== weather.temperature &&
                  ` Feels like ${weather.feelsLike ?? 0}°`}
                <br />
                Sunrise will be at{" "}
                {new Date(weather.sunrise * 1000).toLocaleTimeString(
                  undefined,
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}{" "}
                <br />
                Sunset will be at{" "}
                {new Date(weather.sunset * 1000).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <Card className="bg-primary grid grid-cols-3 gap-3 p-4">
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <Icon icon="wind" className="mx-auto size-7" />
                <div>
                  <p className="text-sm font-semibold">
                    {Math.round(weather.windSpeed ?? 0)} km/h
                  </p>
                  <p className="text-muted-foreground text-xs">Wind</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <Icon icon="droplet" className="mx-auto size-7" />
                <div>
                  <p className="text-sm font-semibold">{weather.humidity}%</p>
                  <p className="text-muted-foreground text-xs">Humidity</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <Icon icon="eye" className="mx-auto size-7" />
                <div>
                  <p className="text-sm font-semibold">
                    {(weather.visibility ?? 0) / 1000}km
                  </p>
                  <p className="text-muted-foreground text-xs">Visibility</p>
                </div>
              </div>
            </Card>
          </Card>
        </>
      )}
    </div>
  );
}

export default WeatherWidget;
