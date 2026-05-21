import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#f5f1ed',
          surface: '#ffffff',
          warm: '#faf6f2',
        },
        ink: {
          primary: '#6b5d52',
          secondary: '#8b7d72',
        },
        border: {
          DEFAULT: '#6b5d52',
          soft: '#d4ccc4',
        },
        accent: {
          gold: '#c9a96e',
        },
        feedback: {
          error: '#a85d4e',
          success: '#7a8a6e',
        },
      },
      fontFamily: {
        serif: ['var(--font-nanum-myeongjo)', 'var(--font-noto-serif-kr)', 'serif'],
      },
      letterSpacing: {
        brand: '0.5em',
        wide6: '0.375em',
        caption: '0.5em',
      },
      borderRadius: {
        card: '40px',
        'card-inner': '32px',
      },
      maxWidth: {
        content: '600px',
        page: '1200px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(107, 93, 82, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
