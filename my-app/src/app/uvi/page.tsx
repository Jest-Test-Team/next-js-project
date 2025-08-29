'use client';

import useSWR from 'swr';
import { FaSun, FaMapMarkerAlt, FaClock } from 'react-icons/fa'; // 導入圖示
import { LuSunMedium } from 'react-icons/lu'; // 導入圖示

const API_KEY = process.env.NEXT_PUBLIC_MOENV_API_KEY;
const API_URL = `https://data.moenv.gov.tw/api/v2/uv_s_01?api_key=${API_KEY}`;

interface UVIRecord {
  sitename: string;
  county: string;
  uvi: string;
  publishtime: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 根據 UVI 數值決定狀態和防護建議
const getUVIStatus = (uvi: number) => {
  if (uvi <= 2) return { text: '低量級', color: 'bg-green-500', advice: '可安心外出，無需特別防護。' };
  if (uvi <= 5) return { text: '中量級', color: 'bg-yellow-400', advice: '建議戴帽子、太陽眼鏡，並塗抹防曬乳。' };
  if (uvi <= 7) return { text: '高量級', color: 'bg-orange-500', advice: '盡量避免上午10點至下午2點外出，務必防護。' };
  if (uvi <= 10) return { text: '過量級', color: 'bg-red-500', advice: '盡量待在室內，外出時務必採取嚴密防護。' };
  return { text: '危險級', color: 'bg-purple-600', advice: '避免所有戶外活動，防護不足會很快曬傷。' };
};

export default function UviPage() {
  const { data, error, isLoading } = useSWR<{ records: UVIRecord[] }>(
    API_URL,
    fetcher,
    { refreshInterval: 300000 }
  );

  if (isLoading) return <div className="flex justify-center items-center h-screen text-xl">載入中...</div>;
  if (error) return <div className="text-center p-8 text-red-600 bg-red-50 border border-red-200 rounded-lg mx-auto max-w-lg mt-10">載入資料失敗，請檢查 API Key 或網路連線。</div>;
  if (!data || !data.records) return <div className="text-center p-8 text-gray-600 mx-auto max-w-lg mt-10">沒有資料。</div>;

  // Filter out records where UVI is invalid or empty
  const validRecords = data.records.filter(record => record.uvi && record.uvi.trim() !== "" && !isNaN(parseFloat(record.uvi)));
  if (validRecords.length === 0) return <div className="text-center p-8 text-gray-600 mx-auto max-w-lg mt-10">沒有有效的 UVI 資料。</div>;

  const latestPublishTime = validRecords[0]?.publishtime || 'N/A';

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold mb-4 text-center text-gray-800 flex items-center justify-center gap-3">
        <LuSunMedium className="text-orange-500" /> 台灣紫外線指數 (UVI)
      </h1>
      <p className="text-center text-gray-500 text-lg mb-8 flex items-center justify-center gap-2">
        <FaClock className="text-gray-400" /> 資料發布時間：{latestPublishTime}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {validRecords.map((record, index) => {
          const uviValue = parseFloat(record.uvi);
          const uviStatus = getUVIStatus(uviValue);

          return (
            <div
              key={`${record.sitename}-${index}`}
              className="relative p-6 rounded-2xl shadow-xl border border-gray-100 bg-white flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-0 w-full h-2 rounded-t-2xl ${uviStatus.color}`}></div> {/* 頂部顏色條 */}

              <h2 className="font-bold text-xl text-gray-800 mt-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-400" /> {record.sitename}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{record.county}</p>

              <div className={`relative flex flex-col justify-center items-center w-32 h-32 rounded-full ${uviStatus.color} text-white shadow-lg`}>
                <FaSun className="absolute text-white text-opacity-30 text-6xl" /> {/* 半透明太陽圖示 */}
                <span className="font-extrabold text-5xl relative z-10">{record.uvi}</span>
                <p className="text-sm relative z-10 -mt-1">{uviStatus.text}</p>
              </div>

              <p className="mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <span className="font-semibold">防護建議:</span> {uviStatus.advice}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}