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
        'neon-blue': { DEFAULT: '#00D4FF' },
        'neon-purple': { DEFAULT: '#7B2FFF' },
        background: { DEFAULT: '#0A0A0F', secondary: '#12121A', tertiary: '#1A1A27' },
        border: { DEFAULT: '#2A2A3E', light: '#3A3A52' },
        text: { primary: '#E8E8F0', secondary: '#9090A8', muted: '#6060A0' },
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00D4FF 0%, #7B2FFF 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
