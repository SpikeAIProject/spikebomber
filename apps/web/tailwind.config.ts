import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': {
          DEFAULT: '#00D4FF',
          50: '#E6FAFF',
          100: '#CCF5FF',
          200: '#99EBFF',
          300: '#66E0FF',
          400: '#33D6FF',
          500: '#00D4FF',
          600: '#00AACC',
          700: '#008099',
          800: '#005566',
          900: '#002B33',
        },
        'neon-purple': {
          DEFAULT: '#7B2FFF',
          50: '#F2EBFF',
          100: '#E5D6FF',
          200: '#CBADFF',
          300: '#B185FF',
          400: '#975CFF',
          500: '#7B2FFF',
          600: '#6326CC',
          700: '#4A1C99',
          800: '#321366',
          900: '#190933',
        },
        background: {
          DEFAULT: '#0A0A0F',
          secondary: '#12121A',
          tertiary: '#1A1A27',
          card: '#14141E',
        },
        border: {
          DEFAULT: '#2A2A3E',
          light: '#3A3A52',
          focus: '#00D4FF',
        },
        text: {
          primary: '#E8E8F0',
          secondary: '#9090A8',
          muted: '#6060A0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neon': 'linear-gradient(135deg, #00D4FF 0%, #7B2FFF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0F 0%, #12121A 100%)',
        'hero-grid':
          'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        'card-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(123, 47, 255, 0.3)',
        'neon-blue-lg': '0 0 40px rgba(0, 212, 255, 0.5)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.5)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          from: { boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)' },
          to: { boxShadow: '0 0 40px rgba(0, 212, 255, 0.7)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
