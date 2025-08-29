'use client';

import useSWR from 'swr';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = `https://data.moenv.gov.tw/api/v2/acidr_p_04?api_key=${API_KEY}`;

interface AcidRainRecord {
  SiteName: string;
  County: string;
  RainFall: string;
  pH: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getPHStatus = (ph: number) => {
  if (ph < 5.0) return { color: 'bg-red-500', text: '強酸性' };
  if (ph >= 5.0 && ph <= 5.6) return { color: 'bg-yellow-500', text: '弱酸性' };
  return { color: 'bg-green-500', text: '正常' };
};

export default function WeatherPage() {
  const { data, error, isLoading } = useSWR<{ records: AcidRainRecord[] }>(
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
      <h1 className="text-2xl font-bold mb-6 text-center">台灣酸雨成份分析</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.records.map((record: AcidRainRecord, index: number) => {
          const phValue = parseFloat(record.pH);
          const phStatus = getPHStatus(phValue);
          return (
            <div
              key={`${record.SiteName}-${index}`} // ✅ 使用 SiteName 結合索引來建立唯一 key
              className={`p-4 rounded-xl shadow-lg border border-gray-200 ${phStatus.color} bg-opacity-20`}
            >
              <h2 className="font-semibold text-lg">{record.SiteName} ({record.County})</h2>
              <p className="text-sm text-gray-600 mt-1">降雨量: {record.RainFall} mm</p>
              <p className="font-bold mt-2 text-white bg-opacity-80 rounded-full px-2 py-1 text-center" style={{ backgroundColor: phStatus.color.replace('bg-', '') }}>pH 值: {record.pH} - {phStatus.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
