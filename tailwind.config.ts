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
      keyframes: {
        'hero-bg': {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '50%': { transform: 'translateX(-18px) translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'hero-bg': 'hero-bg 18s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
