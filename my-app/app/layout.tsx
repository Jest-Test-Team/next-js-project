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
          由於在獨立環境中無法直接使用 Tailwind CLI，
          我們將 Tailwind CSS CDN 重新加回，確保樣式可以正常顯示。
          雖然這可能會觸發 Next.js 的警告，但這是確保介面顯示的最快方式。
        */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/*
          Google Fonts CDN
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
