import CitySelector from "@/app/components/CitySelector";

export const dynamic = 'force-dynamic';

// 定義 TypeScript 型別
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

// 修改 getWeatherData，讓它可以接收一個縣市名稱作為參數
async function getWeatherData(location: string) {
  const API_KEY = process.env.CWA_API_KEY;
  // 將 location 參數用於 API 請求
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${API_KEY}&locationName=${encodeURI(location)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data from CWA API");
    }

    const data = await res.json();
    
    // 如果 API 回傳的 records 是空的 (例如輸入了無效的縣市)，給予提示
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

// 主頁面元件，現在可以接收 searchParams
export default async function WeatherPage({ searchParams }: { searchParams: { city?: string } }) {
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

export default function WeatherPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-8 text-white">
      <Suspense fallback={<div className="w-full max-w-md rounded-xl bg-white/30 p-8 shadow-lg backdrop-blur-md"><p className="text-2xl">載入中...</p></div>}>
        <WeatherClient />
      </Suspense>
      <footer className="mt-8 text-sm text-white/80">
        資料來源：中央氣象署開放資料平臺
      </footer>
    </main>
  );
}
