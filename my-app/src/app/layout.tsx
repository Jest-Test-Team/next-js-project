import type { Metadata } from "next";
import Link from 'next/link'; // 匯入 Link 元件
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "台灣環境資訊網",
  description: "即時查詢空氣品質與紫外線指數",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={inter.className}>
        {/* --- Start: 新增的導覽列 --- */}
        <header className="bg-gray-800 text-white shadow-md">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-gray-300">
              台灣環境資訊網
            </Link>
            <div className="space-x-4">
              <Link href="/aqi" className="px-3 py-2 rounded hover:bg-gray-700">
                空氣品質 (AQI)
              </Link>
              <Link href="/uvi" className="px-3 py-2 rounded hover:bg-gray-700">
                紫外線 (UVI)
              </Link>
            </div>
          </nav>
        </header>
        {/* --- End: 新增的導覽列 --- */}

        {/* 主要頁面內容 */}
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}