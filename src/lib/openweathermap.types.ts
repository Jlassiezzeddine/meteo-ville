export type GeoCity = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
};

// Subset of OpenWeatherMap current weather response we rely on
export type OWMOneCallResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    },
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type Weather = {
  date: number;
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  pressure: number;
  cloudsPercent: number;
  visibility: number;
  windSpeed: number;
  windDirectionDeg: number;
  windGust: number;
  sunrise: number;
  sunset: number;
  main: string;
  description: string;
  icon: string;
  timezone: number;
};
