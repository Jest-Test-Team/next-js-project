import type { NextConfig } from 'next';

const config: NextConfig = {
  // 移除 output: 'export'，因為 Cloudflare Pages 不需要它
};

export default config;