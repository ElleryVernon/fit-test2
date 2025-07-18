/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hyrox-black': '#000808',
        'fitculator-blue': '#00C4CC',
        'fitculator-blue-dark': '#1ba8d3',
        'fitculator-blue-light': '#7de0ff',
        'dark-gray': '#1a1a1a',
        'light-gray': '#333333',
        'text-light': '#ffffff',
        'text-gray': '#cccccc',
        fitculator: {
          dark: '#000808', // hyrox-black
          light: '#ffffff', // text-light
          primary: '#00C4CC', // fitculator-blue (하이라이트 컬러)
          secondary: '#1ba8d3', // fitculator-blue-dark
          accent: '#7de0ff', // fitculator-blue-light
        },
        gradient: {
          primary: 'linear-gradient(90deg, #00C4CC, #1ba8d3)',
        },
      },
    },
  },
  plugins: [],
};
