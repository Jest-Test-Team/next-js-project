import { Suspense } from 'react';
import React from 'react';
import { notFound } from 'next/navigation';
import CitySelector from "@/app/components/CitySelector";
interface WeatherElement {
  elementName: string;
  time: {
    startTime: string;
    endTime: string;
    parameter: {
      parameterName: string;
      parameterUnit?: string;
    };
  }[];
}

async function getWeatherData(location: string) {
  const API_KEY = process.env.CWA_API_KEY;
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${API_KEY}&locationName=${encodeURI(location)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("Failed to fetch data from CWA API:", res.statusText);
      return null;
    }

    const data = await res.json();
    
    if (!data.records || !data.records.location || data.records.location.length === 0) {
      console.warn(`No data found for location: ${location}`);
      return null;
    }

    return data;

  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export default async function WeatherPage({ searchParams }: { searchParams: { city?: string } }) {
  const selectedCity = searchParams.city || "臺北市";
  const weatherData = await getWeatherData(selectedCity);

  if (!weatherData) {
    return notFound();
  }

  const location = weatherData.records.location[0];
  const weatherElements = location.weatherElement;

  const weatherInfo = {
    locationName: location.locationName,
    wx: weatherElements.find((el: WeatherElement) => el.elementName === 'Wx')?.time[0]?.parameter.parameterName || '無資料',
    pop: weatherElements.find((el: WeatherElement) => el.elementName === 'PoP')?.time[0]?.parameter.parameterName || '無資料',
    minT: weatherElements.find((el: WeatherElement) => el.elementName === 'MinT')?.time[0]?.parameter.parameterName || '無資料',
    maxT: weatherElements.find((el: WeatherElement) => el.elementName === 'MaxT')?.time[0]?.parameter.parameterName || '無資料',
    ci: weatherElements.find((el: WeatherElement) => el.elementName === 'CI')?.time[0]?.parameter.parameterName || '無資料',
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-sans">
      <div className="w-full max-w-lg space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">天氣資訊</h1>
        <CitySelector />
        <div className="rounded-2xl bg-white/30 p-8 shadow-xl backdrop-blur-md transition-transform transform hover:scale-105 duration-300">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            {weatherInfo.locationName}
          </h2>
          <div className="grid grid-cols-2 gap-6 text-lg">
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
              <span className="text-sm opacity-80">天氣狀況</span>
              <p className="font-medium text-xl mt-1">{weatherInfo.wx}</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
              <span className="text-sm opacity-80">降雨機率</span>
              <p className="font-medium text-xl mt-1">{weatherInfo.pop}%</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
              <span className="text-sm opacity-80">最低溫</span>
              <p className="font-medium text-xl mt-1">{weatherInfo.minT}°C</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
              <span className="text-sm opacity-80">最高溫</span>
              <p className="font-medium text-xl mt-1">{weatherInfo.maxT}°C</p>
            </div>
            <div className="flex flex-col col-span-2 items-center p-4 rounded-lg bg-white/20">
              <span className="text-sm opacity-80">舒適度</span>
              <p className="font-medium text-xl mt-1">{weatherInfo.ci}</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-12 text-sm text-white/80 text-center">
        資料來源：中央氣象署開放資料平臺
      </footer>
    </main>
  );
}
