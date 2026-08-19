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
        background: '#fdfcf9',
        surface: '#ffffff',
        'surface-elevated': '#fdfcfa',
        border: '#ece9e4',
        ink: '#0f172a',
        muted: '#64748b',
        brass: {
          DEFAULT: '#b8945a',
          soft: '#c9a86a',
          light: '#e2d1b1',
          ink: '#2a2215',
        },
        accent: {
          emerald: '#0d7a5f',
          cyan: '#0e7490',
          amber: '#a16207',
          rose: '#be123c',
          indigo: '#4f46e5',
        },
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        stone: '0 1px 2px rgba(0,0,0,0.04), 0 12px 32px -16px rgba(0,0,0,0.08)',
        'stone-hover': '0 8px 24px -12px rgba(0,0,0,0.08), 0 16px 40px -20px rgba(0,0,0,0.10)',
        brass: '0 0 0 1px rgba(201,168,106,0.14), 0 8px 24px -12px rgba(201,168,106,0.18)',
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
