import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
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
      },
    },
  },
  plugins: [],
};
export default config;
