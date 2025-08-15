import Image from "next/image";
// 從 components 資料夾匯入您建立的組件
import AirQualityDashboard from "../components/api";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* 在這裡使用您的 API 組件，它會載入並顯示資料 */}
        <AirQualityDashboard />
     
      </main>
      
    </div>
  );
}