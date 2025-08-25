## Meteo Ville — Technical Test

Small weather widget built with Next.js (App Router) and TanStack Query. It allows a user to enter an OpenWeatherMap API key, search for a city with autosuggest, and view current weather details with a clean UI.

### Demo Flow
- Enter your OpenWeatherMap API key
- Search a city (debounced autosuggest)
- Select a city to view current conditions (temperature, description, sunrise/sunset, wind, humidity, visibility)

### How to Run
```bash
npm i
npm run dev
# open http://localhost:3000
```

You will need an OpenWeatherMap API key. Create one from `https://home.openweathermap.org/api_keys` and paste it into the widget when prompted.

## Architecture Overview

### UI Composition
- `src/weather/index.tsx` (WeatherWidget): Orchestrates the widget UI, renders the search `Combobox`, skeleton loaders, and the weather card.
- `src/weather/AccessKeyForm.tsx`: Validates the user-provided API key on demand before enabling the widget.
- `src/weather/WeatherWidgetLoader.tsx`: Lightweight skeleton state while fetching.
- `src/components/ui/*`: Reusable UI primitives (Card, Button, Input, Combobox, Badge, Icon, Skeleton).

### State and Data Layer
- `src/app/providers.tsx`: Sets up `QueryClientProvider` for TanStack Query.
- `src/weather/useWeatherWidget.ts`: Single hook that owns widget state: API key, search term, selected city, and derived options. It composes data from the queries below and maps raw API responses to a typed domain model.
- `src/lib/openweathermap.queries.ts`:
  - `useGeoCities(query, apiKey)`: Calls OWM Geocoding Direct API for city suggestions. Enabled only when `query.length > 1` and `apiKey` is present.
  - `useWeather(lat, lon, apiKey)`: Calls OWM Current Weather API for selected coordinates. 1-minute `staleTime` for lightweight caching.
  - `useValidateApiKey(apiKey)`: Disabled-by-default query used via `refetch()` to validate keys using a simple geocoding request, surfacing OWM error messages when possible.
- `src/hooks/useDebounce.ts`: Stable debounce utility to limit network chatter as the user types.
- `src/lib/openweathermap.types.ts`: Narrow, explicit TypeScript types for the subset of OWM responses used by the UI, plus a `Weather` domain shape consumed by the component.

### Data Flow
1. User types a city → `useDebouncedValue` stabilizes the input.
2. `useGeoCities` fires (only with a valid key) and returns suggestions.
3. User picks a suggestion → `useWeather` fetches the current weather for its `lat/lon`.
4. `useWeatherWidget` maps the raw response to `Weather` and the UI renders it with loading states.

## Key Technical Choices

### Client-first widget
- Simpler integration for a technical test: all requests are executed client-side with the user-provided API key. No persistence or server proxy is needed for the exercise.
- Trade-off: the API key is used in the browser. In production, prefer a server-side proxy, rate limiting, and secret storage.

### TanStack Query for fetching, caching, and status
- Normalizes data fetching states (`isFetching`, `error`) and enables request deduplication and caching (`staleTime: 1min`).
- Conditional `enabled` flags prevent unnecessary calls (no key, no query, or no coordinates).

### Explicit types and domain mapping
- `OWMOneCallResponse` captures only the fields we consume; `Weather` is a UI-facing domain type created in `useWeatherWidget`. This keeps rendering code clean and strongly-typed.

### Debounced autosuggest
- `useDebouncedValue` (300ms) limits geocoding requests while typing. This improves UX and reduces quota usage.

### Simple, resilient validation path
- `useValidateApiKey` validates via a safe geocoding call and surfaces OWM error messages when available. The widget remains blocked until validation succeeds and resets validation if the key changes.

## UX Details
- Skeletons and loading states provide immediate feedback (`WeatherWidgetLoader`).
- Date/time formatting uses the user’s locale (`toLocaleDateString`, `toLocaleTimeString`).
- Weather icons are sourced from the OWM icon CDN via `next/image`.
- Combobox clears selection when the input is cleared.

## API Endpoints
- Geocoding (Direct): `https://api.openweathermap.org/geo/1.0/direct?q={q}&limit=5&appid={key}`
- Current Weather: `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={key}`

## Project Structure (excerpt)
```
src/
  app/
    providers.tsx            # React Query provider setup
  hooks/
    useDebounce.ts           # Debounce utility
  lib/
    openweathermap.types.ts  # Types for OWM + domain Weather
    openweathermap.queries.ts# React Query hooks for OWM
  weather/
    index.tsx                # Main WeatherWidget
    AccessKeyForm.tsx        # API key validation form
    WeatherWidgetLoader.tsx  # Loading skeletons
  components/ui/             # UI primitives
```

## Running the Technical Test
1. Install dependencies and run the dev server.
2. Open the app and paste your OWM API key when prompted.
3. Start typing a city name, pick a suggestion, and view the weather.

## Limitations and Next Steps
- Use a serverless function or server proxy to keep the API key private in production.
- Add tests around the data mapping and error states.
- Provide offline/empty states and i18n strings.
- Extend to forecast endpoints and per-city persistence.

## License
MIT
