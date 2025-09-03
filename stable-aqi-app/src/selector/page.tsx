<<<<<<< Updated upstream:stable-aqi-app/src/selector/page.tsx
// src/app/page.tsx

import CitySelector from "../app/components/CitySelector"; // <-- 引入客戶端元件

// 定義 TypeScript 型別 (保持不變)
=======
'use client';

import CitySelector from "@/app/components/CitySelector";
import useSWR from 'swr';
import { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

>>>>>>> Stashed changes:stable-aqi-app/src/app/selector/page.tsx
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

function SelectorContent() {
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

<<<<<<< Updated upstream:stable-aqi-app/src/selector/page.tsx
    const data = await res.json();

    // 如果 API 回傳的 records 是空的 (例如輸入了無效的縣市)，給予提示
    if (!data.records || data.records.location.length === 0) {
      console.warn(`No data found for location: ${location}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 主頁面元件，現在可以接收 searchParams
export default async function HomePage({
  searchParams,
}: {
  searchParams: { city?: string };
}) {
  // 從 URL 查詢參數中獲取縣市，如果沒有，則預設為 "臺北市"
  const selectedCity = searchParams.city || "臺北市";

  const weatherData = await getWeatherData(selectedCity);

  const location = weatherData?.records?.location?.[0];
  const weatherElements = location?.weatherElement || [];
=======
  const location = data?.records?.location?.[0];
  const weatherElements: WeatherElement[] = location?.weatherElement || [];
>>>>>>> Stashed changes:stable-aqi-app/src/app/selector/page.tsx

  const weatherInfo = {
    locationName: location?.locationName || selectedCity,
    wx: weatherElements.find((el) => el.elementName === 'Wx')?.time[0]?.parameter.parameterName || '-',
    pop: weatherElements.find((el) => el.elementName === 'PoP')?.time[0]?.parameter.parameterName || '-',
    minT: weatherElements.find((el) => el.elementName === 'MinT')?.time[0]?.parameter.parameterName || '-',
    maxT: weatherElements.find((el) => el.elementName === 'MaxT')?.time[0]?.parameter.parameterName || '-',
    ci: weatherElements.find((el) => el.elementName === 'CI')?.time[0]?.parameter.parameterName || '-',
  };

  return (
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
  );
}

export default function SelectorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-8 text-white">
      <CitySelector />
      <Suspense fallback={<div className="w-full max-w-md rounded-xl bg-white/30 p-8 shadow-lg backdrop-blur-md"><p className="text-2xl">載入中...</p></div>}>
        <SelectorContent />
      </Suspense>
      <footer className="mt-8 text-sm text-white/80">
        資料來源：中央氣象署開放資料平臺
      </footer>
    </main>
  );
}
