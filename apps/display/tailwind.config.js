/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        discord: { bg: '#0b0d12', sidebar: '#111318', panel: '#161922', soft: '#1f2330', hover: '#2a2d38', border: '#2b2f3a', text: '#f2f3f5', muted: '#949ba4' },
        brand: { blurple: '#5865f2', online: '#23a55a', idle: '#f0b232', danger: '#f23f43', saffron: '#ff8a1f', indiaGreen: '#21c55d', gold: '#f6c453' },
      },
      fontFamily: { display: ['Space Grotesk', 'sans-serif'], ui: ['Inter', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
    },
  },
  plugins: [],
};
