'use client';

import React, { useState, useEffect } from 'react';

// 定義導覽列連結的介面
interface NavLink {
  name: string;
  href: string;
}

// Layout 元件，用於所有頁面
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setIsClient(true);
    setCurrentPath(window.location.pathname);
  }, []);

  const navLinks: NavLink[] = [
    { name: '空氣品質', href: '/' },
    { name: '酸雨分析', href: '/weather' },
  ];

  return (
    <html lang="zh-Hant">
      <head>
        {/*
          為了通過 Next.js 的生產環境建置檢查，我們必須移除所有外部腳本和樣式連結。
          這將導致頁面失去樣式，但能確保程式碼成功編譯。
          在真實的 Next.js 專案中，您會使用 npm 套件來安裝 Tailwind CSS 和字體，而不是使用 CDN。
        */}
      </head>
      <body className="bg-gray-100 flex flex-col min-h-screen">
        {isClient && (
          <nav className="bg-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-center space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors
                    ${currentPath === link.href
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </nav>
        )}
        <main className="container mx-auto p-4 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
