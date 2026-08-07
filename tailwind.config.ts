import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        milwaukee: {
          DEFAULT: '#DB0000',
          50: '#ffe5e5',
          100: '#ffb8b8',
          200: '#ff8a8a',
          300: '#ff5d5d',
          400: '#ff3030',
          500: '#db0000',
          600: '#b20000',
          700: '#880000',
          800: '#5f0000',
          900: '#330000',
        },
      },
      boxShadow: {
        industrial: '0 12px 30px rgba(0, 0, 0, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
