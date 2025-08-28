/** @type {import('next').NextConfig} */
const nextConfig = {
    // 這行配置會讓 Next.js 在建置時，產生靜態 HTML 檔案
    // 這些檔案會被放置在一個名為 'out' 的資料夾中
    output: 'export',
  
    // 可選：如果你希望忽略對未使用的 CSS 進行警告，可以取消註解這行
    // experimental: {
    //   forceSwcTransforms: true,
    // },
  };
  
  module.exports = nextConfig;
  