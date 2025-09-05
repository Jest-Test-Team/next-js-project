import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SunriseSunsetData {
  'locationName': string;
  'data': {
    'sunrise': string;
    'sunset': string;
    'daylight': string;
    'twilight_begin': string;
    'twilight_end': string;
  };
}

const CITIES = [
  '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'
];

async function getSunriseSunsetData(city: string): Promise<SunriseSunsetData | null> {
  const API_KEY = process.env.CWA_API_KEY;
  const today = new Date().toISOString().split('T')[0];
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${API_KEY}&locationName=${encodeURI(city)}&timeFrom=${today}&timeTo=${today}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error('Failed to fetch sunrise/sunset data:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    
    // 增加更多檢查，確保 API 回傳的物件結構符合預期
    const record = data?.records?.locations?.location?.[0]?.time?.[0];
    const sunRiseSetInfo = record?.sunRiseSetInfo;

    if (!record || !sunRiseSetInfo) {
      console.warn(`No data found for location: ${city} on ${today}`);
      return null;
    }

    return {
      locationName: record.locationName,
      data: {
        sunrise: sunRiseSetInfo.sunrise,
        sunset: sunRiseSetInfo.sunset,
        daylight: sunRiseSetInfo.daylight,
        twilight_begin: sunRiseSetInfo.twilight_begin,
        twilight_end: sunRiseSetInfo.twilight_end,
      },
    };
  } catch (error) {
    console.error('Error fetching sunrise/sunset data:', error);
    return null;
  }
}

export default async function SunriseSunsetPage({ searchParams }: { searchParams: { city?: string } }) {
  const selectedCity = searchParams.city || "臺北市";
  const data = await getSunriseSunsetData(selectedCity);

  if (!data) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-indigo-400 to-purple-600 text-white font-sans pt-24">
      <div className="w-full max-w-lg space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">日出日落資訊</h1>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CITIES.map((city) => (
            <Link
              key={city}
              href={`/sunrise-sunset?city=${encodeURIComponent(city)}`}
              className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
                selectedCity === city
                  ? 'bg-white text-indigo-700 font-semibold shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
            >
              {city}
            </Link>
          ))}
        </div>
        <Suspense fallback={<p className="text-center text-xl">載入日出日落資料...</p>}>
          <div className="rounded-2xl bg-white/30 p-8 shadow-xl backdrop-blur-md transition-transform transform hover:scale-105 duration-300">
            <h2 className="text-3xl font-semibold mb-4 text-center">
              {data.locationName}
            </h2>
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">日出時間</span>
                <p className="font-medium text-xl mt-1">{data.data.sunrise}</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">日落時間</span>
                <p className="font-medium text-xl mt-1">{data.data.sunset}</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">晝長</span>
                <p className="font-medium text-xl mt-1">{data.data.daylight}</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">開始黃昏</span>
                <p className="font-medium text-xl mt-1">{data.data.twilight_begin}</p>
              </div>
              <div className="flex flex-col col-span-2 items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">結束黃昏</span>
                <p className="font-medium text-xl mt-1">{data.data.twilight_end}</p>
              </div>
            </div>
          </div>
        </Suspense>
      </div>
      <footer className="mt-12 text-sm text-white/80 text-center">
        資料來源：中央氣象署開放資料平臺
      </footer>
    </main>
  );
}
