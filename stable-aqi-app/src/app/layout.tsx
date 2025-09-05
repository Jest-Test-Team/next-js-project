import type { Metadata } from "next";
<<<<<<< Updated upstream
import { Inter } from "next/font/google";
=======
//import { Geist, Geist_Mono } from "next/font/google";
>>>>>>> Stashed changes
import "./globals.css";
import Navbar from "./components/Navbar";

<<<<<<< Updated upstream
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
=======
//const geistSans = Geist({
 // variable: "--font-geist-sans",
  //subsets: ["latin"],
//});

//const geistMono = Geist_Mono({
  //variable: "--font-geist-mono",
  //subsets: ["latin"],
//});
>>>>>>> Stashed changes

export const metadata: Metadata = {
  title: "台灣環境資訊平台",
  description: "台灣即時空氣品質指標與天氣預報資訊",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
<<<<<<< Updated upstream
        className={`${inter.variable} antialiased`}
=======
       // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
>>>>>>> Stashed changes
      >
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
