import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // <<<< 確保這一行有涵蓋到你的頁面
  ],
  theme: {
    extend: {
      // ...
    },
  },
  plugins: [],
};
export default config;