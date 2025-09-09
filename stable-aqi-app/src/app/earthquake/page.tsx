import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Earthquake } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface EarthquakeData {
  ReportContent: string;
  EarthquakeInfo: {
    'FocalDepth': string;
    'Magnitude': {
      MagnitudeValue: string;
    };
    'OriginTime': string;
    'Epicenter': {
      Location: string;
      'EpicenterLon': string;
      'EpicenterLat': string;
    };
  };
}

async function getEarthquakeData(): Promise<EarthquakeData | null> {
  const API_KEY = process.env.CWA_API_KEY;
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${API_KEY}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      console.error('Failed to fetch earthquake data:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const record = data?.records?.Earthquake?.[0];

    if (!record) {
      console.warn('No recent earthquake data found.');
      return null;
    }
    
    return record as EarthquakeData;
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return null;
  }
}

export default async function EarthquakePage() {
  const earthquakeData = await getEarthquakeData();

  if (!earthquakeData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-red-400 to-rose-600 text-white font-sans">
        <div className="text-center text-xl p-8 bg-white/30 rounded-2xl shadow-xl backdrop-blur-md">
          <p>目前沒有最新的顯著有感地震報告。</p>
        </div>
        <footer className="mt-12 text-sm text-white/80 text-center">
          資料來源：中央氣象署開放資料平臺
        </footer>
      </main>
    );
  }

  const {
    ReportContent,
    EarthquakeInfo
  } = earthquakeData;

  const earthquakeInfo = {
    location: EarthquakeInfo?.Epicenter?.Location || '-',
    magnitude: EarthquakeInfo?.Magnitude?.MagnitudeValue || '-',
    depth: EarthquakeInfo?.FocalDepth || '-',
    originTime: new Date(EarthquakeInfo?.OriginTime || '').toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-red-400 to-rose-600 text-white font-sans pt-24">
      <div className="w-full max-w-lg space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">近期地震報告</h1>
        <Suspense fallback={<p className="text-center text-xl">載入地震資料...</p>}>
          <div className="rounded-2xl bg-white/30 p-8 shadow-xl backdrop-blur-md transition-transform transform hover:scale-105 duration-300">
            <h2 className="text-3xl font-semibold mb-4 text-center">
              規模 {earthquakeInfo.magnitude} 地震
            </h2>
            <div className="grid grid-cols-1 gap-4 text-lg">
              <div className="flex justify-between items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">震央位置</span>
                <p className="font-medium text-xl mt-1">{earthquakeInfo.location}</p>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">發生時間</span>
                <p className="font-medium text-xl mt-1">{earthquakeInfo.originTime}</p>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">地震深度</span>
                <p className="font-medium text-xl mt-1">{earthquakeInfo.depth} 公里</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-white/20">
                <span className="text-sm opacity-80">報告內容</span>
                <p className="font-medium text-base text-center mt-1">{ReportContent}</p>
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
