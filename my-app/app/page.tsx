'use client';

import useSWR from 'swr';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = `https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=${API_KEY}`;

// 修正：為 url 參數添加明確的型別註釋
const fetcher = (url: string) => fetch(url).then(res => res.json());

const getStatus = (pm25: number) => {
  if (pm25 <= 15) return { color: 'bg-green-500', text: '良好' };
  if (pm25 <= 35) return { color: 'bg-yellow-500', text: '普通' };
  if (pm25 <= 54) return { color: 'bg-red-500', text: '不健康' };
  return { color: 'bg-purple-500', text: '非常不健康' };
};

export default function AirQualityDashboard() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher, { refreshInterval: 60000 });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">載入中，請稍候...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg" role="alert">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold">載入資料失敗</p>
            <p className="text-sm mt-1">請檢查您的網路連線或 API Key 是否正確。</p>
            <p className="text-xs mt-2 text-red-500">錯誤訊息: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.records) return <div className="text-center p-8">沒有資料。</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">即時空氣品質監測儀表板</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.records.map((station: any) => {
          const pm25Value = parseInt(station['pm2.5_avg']);
          const status = getStatus(pm25Value);
          return (
            <div key={station.sitename} className={`p-4 rounded-xl shadow-lg border border-gray-200 ${status.color} bg-opacity-20`}>
              <h2 className="font-semibold text-lg">{station.sitename} ({station.county})</h2>
              <p className="text-sm text-gray-600 mt-1">PM2.5: <span className="font-bold">{station['pm2.5_avg']}</span> µg/m³</p>
              <p className="font-bold mt-2 text-white bg-opacity-80 rounded-full px-2 py-1 text-center" style={{ backgroundColor: status.color.replace('bg-', '') }}>{status.text}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
