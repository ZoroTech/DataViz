/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          '800': '#1a1f35',
          '900': '#0f172a',
          '950': '#0a0f1d',
        },
      },
      animation: {
        'pulse': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};