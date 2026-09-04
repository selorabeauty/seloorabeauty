import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* ── Selora Luxury Palette ─────────────────── */
        // Warm off-white backgrounds
        nude: {
          50:  '#FDFAF6',   // page bg
          100: '#F8F2EA',   // alt section bg
          200: '#EFE4D4',   // card border / dividers
          300: '#E0CEBA',   // muted decorative
        },
        // Rich warm dark-brown — primary text & buttons
        bark: {
          700: '#3D2B1F',
          800: '#2A1C12',
          900: '#1A0F08',
        },
        // Antique gold accent
        gold: {
          300: '#D4A96A',
          400: '#C4943E',
          500: '#A87830',
          600: '#8A611E',
        },
        // Muted body copy
        mink: {
          400: '#8C7B6E',
          500: '#6E5C50',
          600: '#5A4A3F',
        },
      },
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'Cairo', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        luxury:    '0 4px 32px -4px rgba(58,40,24,0.12)',
        'luxury-lg':'0 8px 48px -6px rgba(58,40,24,0.18)',
        gold:      '0 4px 24px -4px rgba(196,148,62,0.35)',
      },
      animation: {
        float:       'float 4s ease-in-out infinite',
        shimmer:     'shimmer 2.5s linear infinite',
        'pulse-slow':'pulse 3s ease-in-out infinite',
        'bounce-slow':'bounce 2s infinite',
        'cta-pulse':  'cta-pulse 2s ease-in-out infinite',
        'cta-glow':   'cta-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':  { backgroundPosition: '0% center' },
          '100%':{ backgroundPosition: '-200% center' },
        },
        'cta-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 24px -4px rgba(196,148,62,0.45)' },
          '50%':      { transform: 'scale(1.04)', boxShadow: '0 8px 36px -4px rgba(196,148,62,0.75)' },
        },
        'cta-glow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.82' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
