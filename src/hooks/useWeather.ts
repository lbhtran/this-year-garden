import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export interface WeatherForecast {
  current: WeatherData | null;
  daily: {
    date: string;
    maxTemp: number;
    minTemp: number;
    weathercode: number;
  }[];
  loading: boolean;
  error: string | null;
}

const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0: { label: 'Clear sky', emoji: '☀️' },
  1: { label: 'Mainly clear', emoji: '🌤️' },
  2: { label: 'Partly cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  48: { label: 'Depositing rime fog', emoji: '🌫️' },
  51: { label: 'Light drizzle', emoji: '🌦️' },
  53: { label: 'Moderate drizzle', emoji: '🌦️' },
  55: { label: 'Dense drizzle', emoji: '🌧️' },
  61: { label: 'Slight rain', emoji: '🌧️' },
  63: { label: 'Moderate rain', emoji: '🌧️' },
  65: { label: 'Heavy rain', emoji: '🌧️' },
  71: { label: 'Slight snow', emoji: '🌨️' },
  73: { label: 'Moderate snow', emoji: '🌨️' },
  75: { label: 'Heavy snow', emoji: '❄️' },
  77: { label: 'Snow grains', emoji: '❄️' },
  80: { label: 'Slight showers', emoji: '🌦️' },
  81: { label: 'Moderate showers', emoji: '🌧️' },
  82: { label: 'Violent showers', emoji: '⛈️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
  96: { label: 'Thunderstorm w/ hail', emoji: '⛈️' },
  99: { label: 'Thunderstorm w/ heavy hail', emoji: '⛈️' },
};

export function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { label: 'Unknown', emoji: '🌡️' };
}

export function useWeather(lat = 52.04, lon = -0.76): WeatherForecast {
  const [data, setData] = useState<WeatherForecast>({ current: null, daily: [], loading: true, error: null });

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FLondon&forecast_days=5`;

    fetch(url)
      .then(r => r.json())
      .then(json => {
        const cw = json.current_weather;
        const daily = json.daily;
        setData({
          current: { temperature: cw.temperature, windspeed: cw.windspeed, weathercode: cw.weathercode, time: cw.time },
          daily: daily.time.map((date: string, i: number) => ({
            date,
            maxTemp: daily.temperature_2m_max[i],
            minTemp: daily.temperature_2m_min[i],
            weathercode: daily.weathercode[i],
          })),
          loading: false,
          error: null,
        });
      })
      .catch(err => setData(d => ({ ...d, loading: false, error: err.message })));
  }, [lat, lon]);

  return data;
}
