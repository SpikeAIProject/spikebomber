// =============================================================================
// SPIKE AI - Shared Configuration
// =============================================================================

// --------------------------------
// Tailwind Configuration
// --------------------------------
export const spikeAITailwindConfig = {
  darkMode: ['class'],
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
        },
        border: {
          DEFAULT: '#2A2A3E',
          light: '#3A3A52',
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
        'glass-dark':
          'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(123, 47, 255, 0.3)',
        'neon-blue-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          from: { boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)' },
          to: { boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
} as const;

// --------------------------------
// ESLint Configuration
// --------------------------------
export const spikeAIESLintConfig = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};

// --------------------------------
// App Constants
// --------------------------------
export const APP_NAME = 'SPIKE AI';
export const APP_DESCRIPTION = 'Enterprise AI Platform powered by Google Vertex AI and Gemini';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1';

export const PLAN_FEATURES = {
  FREE: {
    tokenLimit: 10_000,
    requestLimit: 100,
    models: ['gemini-1.5-flash'],
    features: ['Basic AI generation', 'Community support', '1 API key'],
  },
  STARTER: {
    tokenLimit: 500_000,
    requestLimit: 5_000,
    models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
    features: ['All AI models', 'Email support', '5 API keys', 'Usage analytics'],
  },
  PRO: {
    tokenLimit: 5_000_000,
    requestLimit: 50_000,
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro-vision'],
    features: [
      'All AI models',
      'Priority support',
      'Unlimited API keys',
      'Advanced analytics',
      'Custom prompts',
      'Streaming',
    ],
  },
  ENTERPRISE: {
    tokenLimit: -1, // unlimited
    requestLimit: -1, // unlimited
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro-vision', 'text-bison', 'chat-bison'],
    features: [
      'All AI models',
      'Dedicated support',
      'Unlimited everything',
      'Custom integrations',
      'SLA guarantee',
      'White-label option',
      'SSO/SAML',
    ],
  },
};
