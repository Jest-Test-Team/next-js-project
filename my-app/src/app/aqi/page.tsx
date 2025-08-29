'use client';

import useSWR from 'swr';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { MdOutlineAir } from 'react-icons/md'; // 導入圖示

const API_KEY = process.env.NEXT_PUBLIC_MOENV_API_KEY;
const API_URL = `https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=${API_KEY}`;

interface AQIRecord {
  sitename: string;
  county: string;
  aqi: string;
  status: string;
  publishtime: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 根據 AQI 數值決定背景顏色的輔助函式
const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { text: '良好', color: 'bg-green-500', textColor: 'text-white', description: '空氣品質令人滿意' };
  if (aqi <= 100) return { text: '普通', color: 'bg-yellow-400', textColor: 'text-gray-800', description: '空氣品質可接受' };
  if (aqi <= 150) return { text: '對敏感族群不健康', color: 'bg-orange-500', textColor: 'text-white', description: '敏感族群應減少戶外活動' };
  if (aqi <= 200) return { text: '對所有族群不健康', color: 'bg-red-500', textColor: 'text-white', description: '所有人都可能出現健康問題' };
  if (aqi <= 300) return { text: '非常不健康', color: 'bg-purple-600', textColor: 'text-white', description: '健康警報，所有人應避免戶外活動' };
  return { text: '危害', color: 'bg-maroon-700', textColor: 'text-white', description: '緊急狀況，所有人應待在室內' };
};

export default function AqiPage() {
  const { data, error, isLoading } = useSWR<{ records: AQIRecord[] }>(
    API_URL,
    fetcher,
    { refreshInterval: 60000 }
  );

  if (isLoading) return <div className="flex justify-center items-center h-screen text-xl">載入中...</div>;
  if (error) return <div className="text-center p-8 text-red-600 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-lg mt-10">載入資料失敗，請檢查 API Key 或網路連線。</div>;
  if (!data || !data.records) return <div className="text-center p-8 text-gray-600 mx-auto max-w-lg mt-10">沒有資料。</div>;

  // Filter out records where AQI is invalid or empty
  const validRecords = data.records.filter(record => !isNaN(parseInt(record.aqi, 10)));
  if (validRecords.length === 0) return <div className="text-center p-8 text-gray-600 mx-auto max-w-lg mt-10">沒有有效的 AQI 資料。</div>;

  const latestPublishTime = validRecords[0]?.publishtime || 'N/A';

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold mb-4 text-center text-gray-800 flex items-center justify-center gap-3">
        <MdOutlineAir className="text-blue-600" /> 台灣空氣品質指標 (AQI)
      </h1>
      <p className="text-center text-gray-500 text-lg mb-8 flex items-center justify-center gap-2">
        <FaClock className="text-gray-400" /> 資料發布時間：{latestPublishTime}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {validRecords.map((record, index) => {
          const aqiValue = parseInt(record.aqi, 10);
          const { text, color, textColor, description } = getAQIStatus(aqiValue);

          return (
            <div
              key={`${record.sitename}-${index}`}
              className="relative p-6 rounded-2xl shadow-xl border border-gray-100 bg-white hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-0 w-full h-2 rounded-t-2xl ${color}`}></div> {/* 頂部顏色條 */}

              <div className="flex items-center justify-between mb-4 mt-2">
                <div>
                  <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" /> {record.sitename}
                  </h2>
                  <p className="text-sm text-gray-500 ml-6">{record.county}</p>
                </div>
                <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full ${color} ${textColor} shadow-md`}>
                  <span className="font-extrabold text-3xl">{record.aqi}</span>
                  <p className="text-xs -mt-1">{text}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 border-t border-gray-100 pt-4">
                <span className="font-semibold">狀態說明:</span> {description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}