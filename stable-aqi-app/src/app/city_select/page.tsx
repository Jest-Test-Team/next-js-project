// src/app/page.tsx (修正後版本)

import CitySelector from "../components/CitySelector";

// 定義 TypeScript 型別 (保持不變)
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

// getWeatherData 函式 (保持不變)
async function getWeatherData(location: string) {
  const API_KEY = process.env.CWA_API_KEY;
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${API_KEY}&locationName=${encodeURI(location)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data from CWA API");
    }

    const data = await res.json();
    
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

// ==================== 修改開始 ====================

// 1. 為頁面 props 建立一個獨立的 type
type Props = {
  searchParams: { city?: string };
};

// 2. 在函式簽名中使用這個 Props type
export default async function HomePage({ searchParams }: Props) {
  
// ==================== 修改結束 ====================

  // 從 URL 查詢參數中獲取縣市，如果沒有，則預設為 "臺北市"
  const selectedCity = searchParams.city || "臺北市";
  
  const weatherData = await getWeatherData(selectedCity);

  const location = weatherData?.records?.location?.[0];
  const weatherElements = location?.weatherElement || [];

  const weatherInfo = {
    locationName: location?.locationName || selectedCity,
    wx: weatherElements.find((el: WeatherElement) => el.elementName === 'Wx')?.time[0]?.parameter.parameterName || '-',
    pop: weatherElements.find((el: WeatherElement) => el.elementName === 'PoP')?.time[0]?.parameter.parameterName || '-',
    minT: weatherElements.find((el: WeatherElement) => el.elementName === 'MinT')?.time[0]?.parameter.parameterName || '-',
    maxT: weatherElements.find((el: WeatherElement) => el.elementName === 'MaxT')?.time[0]?.parameter.parameterName || '-',
    ci: weatherElements.find((el: WeatherElement) => el.elementName === 'CI')?.time[0]?.parameter.parameterName || '-',
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-8 text-white">
      
      <CitySelector />

      <div className="w-full max-w-md rounded-xl bg-white/30 p-8 shadow-lg backdrop-blur-md">
        <h1 className="text-4xl font-bold mb-2">{weatherInfo.locationName}</h1>
        <p className="text-lg mb-6">{new Date().toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="text-center my-8">
          {location ? (
            <>
              <p className="text-8xl font-extrabold tracking-tight">{weatherInfo.maxT}°</p>
              <p className="text-2xl font-medium">{weatherInfo.wx}</p>
            </>
          ) : (
            <p className="text-2xl font-medium">找不到該地區的天氣資料</p>
          )}
        </div>
        
        {location && (
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
      <footer className="mt-8 text-sm text-white/80">
        資料來源：中央氣-象署開放資料平臺
      </footer>
    </main>
  );
}