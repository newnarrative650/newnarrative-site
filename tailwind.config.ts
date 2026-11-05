import type { Config } from 'tailwindcss';

// Glow design system tokens
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#08080C',
        panel: '#101016',
        screen: '#121218',
        edge: '#1E1E26',
        grid: '#2A2A34',
        rim: '#3A3A46',
        dim: '#9A9AA8',
        soft: '#C8C8D2',
        light: '#F5F5F7',
        glow: { DEFAULT: '#8A6BFF', hover: '#A28AFF', press: '#C2B2FF' },
        success: '#3DE0A8',
        warning: '#FFC247',
        error: '#FF5C6C',
        disabled: '#6C6C78',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: { none: '0', DEFAULT: '0' },
      maxWidth: { page: '1440px' },
    },
  },
  plugins: [],
};

export default config;
