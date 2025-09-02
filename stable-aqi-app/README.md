# 台灣環境資訊平台

這是一個整合台灣即時空氣品質指標與天氣預報的 Next.js 應用程式。

## 功能特色

- 🌬️ **即時空氣品質指標 (AQI)** - 顯示全台各縣市的空氣品質數據
- 🌤️ **天氣預報** - 提供各縣市的詳細天氣資訊
- 🎯 **縣市選擇器** - 可切換不同縣市查看對應資訊
- 📱 **響應式設計** - 支援各種裝置尺寸
- ⚡ **即時更新** - 資料每 10 分鐘自動更新

## 技術架構

- **框架**: Next.js 15.5.2 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **圖示**: Lucide React
- **資料獲取**: SWR
- **API**: 環境部開放資料平台、中央氣象署開放資料平台

## 開始使用

### 1. 安裝依賴

```bash
npm install
# 或
yarn install
```

### 2. 設定環境變數

創建 `.env.local` 檔案並加入以下變數：

```env
# 環境部空氣品質 API 金鑰
NEXT_PUBLIC_API_KEY=your_environment_api_key_here

# 中央氣象署 API 金鑰
CWA_API_KEY=your_cwa_api_key_here
```

### 3. 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## 專案結構

```
src/
├── app/
│   ├── components/
│   │   ├── CitySelector.tsx    # 縣市選擇器元件
│   │   └── Navbar.tsx         # 全域導航欄
│   ├── weather/
│   │   └── page.tsx           # 天氣預報頁面
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 空氣品質首頁
│   └── globals.css            # 全域樣式
```

## 路由說明

- `/` - 空氣品質指標首頁
- `/weather` - 天氣預報頁面

## API 金鑰申請

### 環境部空氣品質 API

1. 前往 [環境部資料開放平台](https://data.moenv.gov.tw/)
2. 註冊帳號並申請 API 金鑰
3. 將金鑰設定為 `NEXT_PUBLIC_API_KEY`

### 中央氣象署 API

1. 前往 [中央氣象署開放資料平台](https://opendata.cwb.gov.tw/)
2. 註冊帳號並申請 API 金鑰
3. 將金鑰設定為 `CWA_API_KEY`

## 部署

### Vercel 部署

最簡單的部署方式是使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

### 其他平台

參考 [Next.js 部署文件](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多部署選項。

## 開發指南

- 使用 TypeScript 確保型別安全
- 遵循 ESLint 規範
- 使用 Tailwind CSS 進行樣式設計
- 元件採用函數式寫法
- 使用 SWR 進行資料獲取與快取

## 授權

本專案採用 MIT 授權條款。
