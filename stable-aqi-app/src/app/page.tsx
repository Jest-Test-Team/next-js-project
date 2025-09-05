'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Wind, MapPin, Search, CloudSun, CloudFog } from 'lucide-react';
export const dynamic = 'force-dynamic';
// --- API 設定 ---
const API_KEY = process.env.NEXT_PUBLIC_API_KEY|| '79533238-5664-4522-9f5a-b96a87b589b7';
const API_URL = `https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=${API_KEY}`;

// --- TypeScript 型別定義 ---
interface AQIRecord {
  sitename: string;
  county: string;
  aqi: string;
  status: string;
  pm2_5: string; // API 欄位名稱為 'pm2.5'，但SWR會自動處理
  publishtime: string;
}

// --- 資料抓取函式 ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- 根據 AQI 數值決定樣式的輔助函式 ---
const getAqiStyle = (aqi: number) => {
  if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-50', ring: 'ring-emerald-400', label: '良好' };
  if (aqi <= 100) return { bg: 'bg-yellow-500', text: 'text-yellow-50', ring: 'ring-yellow-400', label: '普通' };
  if (aqi <= 150) return { bg: 'bg-orange-500', text: 'text-orange-50', ring: 'ring-orange-400', label: '對敏感族群不健康' };
  if (aqi <= 200) return { bg: 'bg-red-500', text: 'text-red-50', ring: 'ring-red-400', label: '對所有族群不健康' };
  if (aqi <= 300) return { bg: 'bg-purple-600', text: 'text-purple-50', ring: 'ring-purple-400', label: '非常不健康' };
  return { bg: 'bg-rose-800', text: 'text-rose-50', ring: 'ring-rose-700', label: '危害' };
};

// --- 主頁面元件 ---
export default function AirQualityPage() {
  const [filterCounty, setFilterCounty] = useState('all');
  const { data, error, isLoading } = useSWR<{ records: AQIRecord[] }>(API_URL, fetcher, {
    refreshInterval: 600000, // 每 10 分鐘自動更新一次
  });

  // --- 資料處理與篩選 ---
  const { filteredRecords, allCounties, summary } = useMemo(() => {
    if (!data?.records) {
      return { filteredRecords: [], allCounties: [], summary: { best: null, worst: null } };
    }
    
    const validRecords = data.records
      .filter(r => r.aqi && !isNaN(parseInt(r.aqi)))
      .map(r => ({ ...r, aqiValue: parseInt(r.aqi) }));

    const filtered = filterCounty === 'all'
      ? validRecords
      : validRecords.filter(record => record.county === filterCounty);
    
    const counties = [...new Set(validRecords.map(record => record.county))].sort((a, b) => a.localeCompare(b, 'zh-Hant'));

    const sortedByAqi = [...validRecords].sort((a, b) => a.aqiValue - b.aqiValue);
    const summaryData = {
      best: sortedByAqi[0] || null,
      worst: sortedByAqi[sortedByAqi.length - 1] || null,
    };

    return { filteredRecords: filtered, allCounties: counties, summary: summaryData };
  }, [data, filterCounty]);

  // --- 處理各種狀態 ---
  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center text-red-600">
        <h2 className="text-2xl font-bold">資料載入失敗</h2>
        <p>請檢查您的網路連線或 API Key 是否正確。</p>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center text-gray-600">
        <Wind className="mx-auto h-12 w-12 animate-spin" />
        <h2 className="mt-4 text-2xl font-bold">正在載入即時數據...</h2>
      </div>
    </div>
  );

  // --- 渲染主畫面 ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="container mx-auto px-4 py-8">
        {/* 標題 */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Wind className="h-10 w-10 text-blue-500" />
            <h1 className="text-4xl font-extrabold text-gray-800">台灣即時空氣品質指標 (AQI)</h1>
          </div>
          <p className="mt-2 text-gray-500">
            資料來源：環境部資料開放平台，更新於 {data?.records[0]?.publishtime || 'N/A'}
          </p>
        </header>

        {/* 摘要區 */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-emerald-600"><CloudSun /> 目前空氣品質最佳</h3>
            {summary.best ? (
              <p className="text-2xl font-bold">{summary.best.county} - {summary.best.sitename}: <span className="text-emerald-500">AQI {summary.best.aqi}</span></p>
            ) : <p>無資料</p>}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-rose-600"><CloudFog /> 目前空氣品質最需注意</h3>
            {summary.worst ? (
              <p className="text-2xl font-bold">{summary.worst.county} - {summary.worst.sitename}: <span className="text-rose-500">AQI {summary.worst.aqi}</span></p>
            ) : <p>無資料</p>}
          </div>
        </div>
        
        {/* 篩選區 */}
        <div className="mb-6 flex items-center gap-4 rounded-lg bg-white p-4 shadow">
          <label htmlFor="county-select" className="flex items-center gap-2 text-gray-600">
            <Search className="h-6 w-6" />
            篩選縣市:
          </label>
          <select
            id="county-select"
            value={filterCounty}
            onChange={(e) => setFilterCounty(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="all">所有縣市</option>
            {allCounties.map(county => <option key={county} value={county}>{county}</option>)}
          </select>
        </div>

        {/* 卡片列表 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecords.map(record => {
            const style = getAqiStyle(record.aqiValue);
            return (
              <div key={record.sitename} className={`transform rounded-2xl border bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl ${style.ring} ring-2`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`px-3 py-1 text-sm font-bold ${style.bg} ${style.text} rounded-full`}>{style.label}</p>
                    <h2 className="mt-3 text-2xl font-bold text-gray-800">{record.sitename}</h2>
                    <p className="flex items-center gap-1 text-sm text-gray-500"><MapPin size={14} /> {record.county}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-extrabold text-gray-700">{record.aqi}</p>
                    <p className="text-sm text-gray-400">AQI</p>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4 text-sm text-gray-600">
                  PM2.5: <span className="font-semibold">{record.pm2_5 || 'N/A'}</span> µg/m³
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

