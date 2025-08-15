'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr'; // 推薦使用 SWR 來處理資料快取和更新

// 獲取環境變數中的 API Key
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = `https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=${API_KEY}`;


// 定義一個簡單的資料抓取函式
const fetcher = (url) => fetch(url).then(res => res.json());

// 根據 PM2.5 數值回傳對應的顏色和文字
const getStatus = (pm25) => {
  if (pm25 <= 15) return { color: 'bg-green-300', text: '良好' };
  if (pm25 <= 35) return { color: 'bg-yellow-500', text: '普通' };
  if (pm25 <= 54) return { color: 'bg-red-500', text: '不健康' };
  return { color: 'bg-purple-500', text: '非常不健康' };
};

export default function AirQualityDashboard() {
  // SWR 呼叫 API_URL，其中已包含了 API Key
  const { data, error, isLoading } = useSWR(API_URL, fetcher, { refreshInterval: 60000 });

  if (isLoading) return <div className="text-center p-8">載入中...</div>;
  if (error) return <div className="text-center p-8 text-red-500">載入資料失敗: {error.message}</div>;
  
  if (!data || !data.records) return <div className="text-center p-8">沒有資料。</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">即時空氣品質監測儀表板</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.records.map((station) => {
          const status = getStatus(parseInt(station['pm2.5_avg']));
          return (
            <div key={station.sitename} className={`p-4 rounded-xl shadow-lg border border-gray-200 ${status.color} bg-opacity-20`}>
              <h2 className="font-semibold text-lg">{station.sitename} ({station.county})</h2>
              <p className="text-sm text-gray-600 mt-1">PM2.5: <span className="font-bold">{station['pm2.5_avg']}</span> µg/m³</p>
              <p className="font-bold mt-2 text-white bg-opacity-80 rounded-full px-2 py-1 text-center" style={{ backgroundColor: status.color.replace('bg-', '') }}>{status.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
