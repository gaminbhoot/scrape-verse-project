/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#02050a',
        surface: '#0e1a30',
        'surface-elevated': '#142040',
        border: '#1b2b4d',
        brass: {
          DEFAULT: '#c9a86a',
          soft: '#b8945a',
          ink: '#2a2215',
          light: '#e2d1b1',
        },
        accent: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          amber: '#e8a63c',
          rose: '#f43f5e',
          indigo: '#7074e8',
        },
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        premium:
          '0 1px 0 rgba(255,255,255,0.06) inset, 0 28px 64px -28px rgba(0,0,0,0.65), 0 8px 24px -12px rgba(0,0,0,0.5)',
        'premium-hover':
          '0 1px 0 rgba(255,255,255,0.07) inset, 0 32px 72px -28px rgba(0,0,0,0.7), 0 12px 28px -14px rgba(0,0,0,0.55)',
        brass: '0 0 0 1px rgba(201,168,106,0.16), 0 8px 24px -12px rgba(201,168,106,0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'float-subtle': 'float-subtle 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.455,0.03,0.515,0.955) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-subtle': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '1' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
