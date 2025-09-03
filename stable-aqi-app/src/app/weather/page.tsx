import { Suspense } from "react";
import WeatherClient from "./WeatherClient";

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
