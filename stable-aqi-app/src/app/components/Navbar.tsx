'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wind, CloudSun, Rss } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: '空氣品質',
      href: '/',
      icon: Wind,
      description: '台灣即時空氣品質指標'
    },
    {
      name: '天氣預報',
      href: '/weather',
      icon: CloudSun,
      description: '各縣市天氣預報'
    },
    {
      name: '近期地震',
      href: '/earthquake',
      icon: Rss,
      description: '近期地震'
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Wind className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">台灣環境資訊</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={item.description}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
