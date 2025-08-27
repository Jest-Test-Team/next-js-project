'use client';

import { useState, useEffect } from 'react';
// 修正: 移除 './globals.css' 的匯入，因為在獨立編譯的環境中無法正確解析
// Next.js 專案會自動處理這個 CSS 檔案，但在這裡手動引入會造成錯誤
// import './globals.css';

// 定義一個通用導覽列元件
function Navbar() {
  const [pathname, setPathname] = useState('/');
  useEffect(() => {
    // 使用 window.location.pathname 來獲取當前路徑
    // 這確保了在獨立編譯環境中可以正常運作
    setPathname(window.location.pathname);
  }, []);

  const navLinks = [
    { name: '空氣品質', href: '/' },
    { name: '酸雨成分分析', href: '/weather' },   
  ];

  return (
    <nav className="flex justify-center space-x-4 mb-8 p-4 bg-gray-100 rounded-lg shadow-sm">
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
            ${pathname === link.href ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-200'}
          `}
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
}

// Layout 元件，用於所有頁面
export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        <title>台灣監測儀表板</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
      </head>
      <body className="bg-gray-50 text-gray-800">
        <div className="container mx-auto p-4">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
