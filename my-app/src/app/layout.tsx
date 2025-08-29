'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: '空氣品質', href: '/' },
  { name: '酸雨分析', href: '/weather' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <html lang="zh-Hant">
      <head>
        <title>環境數據儀表板</title>
      </head>
      <body>
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-lg font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
