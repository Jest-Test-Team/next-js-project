'use client';

import CitySelector from "@/app/components/CitySelector";
import useSWR from 'swr';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

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

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data from CWA API');
  return res.json();
};

export default function SelectorClient() {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('city') || '臺北市';

  const apiUrl = useMemo(() => {
    const apiKey = process.env.NEXT_PUBLIC_CWA_API_KEY;
    const query = new URLSearchParams({
      Authorization: String(apiKey ?? ''),
      locationName: selectedCity,
    });
    return `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?${query.toString()}`;
  }, [selectedCity]);

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, { revalidateOnFocus: false, refreshInterval: 300_000 });

  const location = data?.records?.location?.[0];
  const weatherElements: WeatherElement[] = location?.weatherElement || [];

  const weatherInfo = {
    locationName: location?.locationName || selectedCity,
    wx: weatherElements.find((el) => el.elementName === 'Wx')?.time[0]?.parameter.parameterName || '-',
    pop: weatherElements.find((el) => el.elementName === 'PoP')?.time[0]?.parameter.parameterName || '-',
    minT: weatherElements.find((el) => el.elementName === 'MinT')?.time[0]?.parameter.parameterName || '-',
    maxT: weatherElements.find((el) => el.elementName === 'MaxT')?.time[0]?.parameter.parameterName || '-',
    ci: weatherElements.find((el) => el.elementName === 'CI')?.time[0]?.parameter.parameterName || '-',
  };

  return (
    <>
      <CitySelector />
      <div className="w-full max-w-md rounded-xl bg-white/30 p-8 shadow-lg backdrop-blur-md">
        <h1 className="text-4xl font-bold mb-2">{weatherInfo.locationName}</h1>
        <p className="text-lg mb-6">{new Date().toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="text-center my-8">
          {isLoading ? (
            <p className="text-2xl font-medium">載入中...</p>
          ) : error ? (
            <p className="text-2xl font-medium">資料載入失敗</p>
          ) : location ? (
            <>
              <p className="text-8xl font-extrabold tracking-tight">{weatherInfo.maxT}°</p>
              <p className="text-2xl font-medium">{weatherInfo.wx}</p>
            </>
          ) : (
            <p className="text-2xl font-medium">找不到該地區的天氣資料</p>
          )}
        </div>

        {location && !isLoading && !error && (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/20 rounded-lg">
              <span className="font-semibold">最高/最低溫度</span>
              <span>{weatherInfo.minT}° / {weatherInfo.maxT}° C</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/20 rounded-lg">
              <span className="font-semibold">降雨機率</span>
              <span>{weatherInfo.pop} %</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/20 rounded-lg">
              <span className="font-semibold">舒適度</span>
              <span>{weatherInfo.ci}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
