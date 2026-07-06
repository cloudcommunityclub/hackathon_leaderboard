/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        discord: { bg: '#313338', sidebar: '#2b2d31', rail: '#1e1f22', panel: '#2b2d31', 'panel-soft': '#35373c', userbar: '#232428', input: '#383a40', hover: '#35373c', border: '#1f2023', text: '#f2f3f5', muted: '#949ba4' },
        brand: { blurple: '#5865f2', online: '#23a55a', idle: '#f0b232', danger: '#f23f43', saffron: '#ff8a1f', indiaGreen: '#21c55d', gold: '#f6c453' },
      },
      fontFamily: { display: ['Space Grotesk', 'sans-serif'], ui: ['Inter', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
    },
  },
  plugins: [],
};
