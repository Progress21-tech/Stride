import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        stride: {
          green: '#18A957',
          'green-hover': '#15944c',
          'green-light': '#e8f7ee',
          'green-dark': '#0d5c30',
        },
        surface: {
          dark: '#09090b',
          'dark-card': '#121215',
          'dark-border': '#27272a',
          light: '#ffffff',
          'light-card': '#f4f4f5',
          'light-border': '#e4e4e7',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
export default config;
