# 環境變數設定說明

## 必要的 API 金鑰

本專案需要以下 API 金鑰才能正常運作：

### 1. 環境部空氣品質 API 金鑰

**用途**: 獲取台灣各縣市的即時空氣品質指標 (AQI) 資料

**申請步驟**:

1. 前往 [環境部資料開放平台](https://data.moenv.gov.tw/)
2. 註冊帳號並登入
3. 申請 API 金鑰
4. 將金鑰設定為 `NEXT_PUBLIC_API_KEY`

### 2. 中央氣象署 API 金鑰

**用途**: 獲取台灣各縣市的天氣預報資料

**申請步驟**:

1. 前往 [中央氣象署開放資料平台](https://opendata.cwb.gov.tw/)
2. 註冊帳號並登入
3. 申請 API 金鑰
4. 將金鑰設定為 `CWA_API_KEY`

## 環境變數設定

### 本地開發

創建 `.env.local` 檔案在專案根目錄：

```env
# 環境部空氣品質 API 金鑰
NEXT_PUBLIC_API_KEY=your_environment_api_key_here

# 中央氣象署 API 金鑰
CWA_API_KEY=your_cwa_api_key_here
```

### 生產環境部署

根據您的部署平台設定環境變數：

#### Vercel

- 在 Vercel 專案設定中的 Environment Variables 頁面設定
- 確保 `NEXT_PUBLIC_API_KEY` 設定為 Public（客戶端可存取）

#### 其他平台

- 在平台的控制台或設定頁面中設定環境變數
- 確保變數名稱與上述相同

## 注意事項

1. **安全性**: 不要將 API 金鑰提交到版本控制系統
2. **限制**: 各 API 都有使用限制，請查看官方文件
3. **更新頻率**:
   - 空氣品質資料每 10 分鐘自動更新
   - 天氣預報資料每 5 分鐘快取更新

## 測試 API 金鑰

設定完成後，您可以：

1. 啟動開發伺服器: `npm run dev`
2. 訪問 http://localhost:3000 查看空氣品質資料
3. 訪問 http://localhost:3000/weather 查看天氣預報資料

如果看到「找不到該地區的天氣資料」或載入錯誤，請檢查 API 金鑰是否正確設定。
