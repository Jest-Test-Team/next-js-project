'use client';

import useSWR from 'swr';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = `https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=${API_KEY}`;

interface AQXRecord {
  siteid: string;
  sitename: string;
  county: string;
  'pm2.5_avg': string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getStatus = (pm25: number) => {
  if (pm25 <= 15) return { color: 'bg-green-500', text: '良好' };
  if (pm25 <= 35) return { color: 'bg-yellow-500', text: '普通' };
  if (pm25 <= 54) return { color: 'bg-red-500', text: '不健康' };
  return { color: 'bg-purple-500', text: '非常不健康' };
};

export default function Home() {
  const { data, error, isLoading } = useSWR<{ records: AQXRecord[] }>(
    API_URL,
    fetcher,
    { refreshInterval: 60000 }
  );

  if (isLoading)
    return <div className="text-center p-8">載入中...</div>;
  if (error)
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-md">
        載入資料失敗: 請檢查您的網路連線或 API Key 是否正確。
      </div>
    );

  if (!data || !data.records)
    return <div className="text-center p-8">沒有資料。</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">即時空氣品質儀表板</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.records.map((station: AQXRecord) => {
          const pm25Value = parseInt(station['pm2.5_avg']);
          const status = getStatus(pm25Value);
          return (
            <div
              key={station.siteid}
              className={`p-4 rounded-xl shadow-lg border border-gray-200 ${status.color} bg-opacity-20`}
            >
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
