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
        fitculator: {
          dark: '#0d1117',
          light: '#ffffff',
          primary: '#0066cc',
          secondary: '#00cccc',
          accent: '#00cc99',
          coral: '#ff6b6b',
        },
        gradient: {
          primary: 'linear-gradient(90deg, #0066cc, #00cccc)',
        },
      },
    },
  },
  plugins: [],
};
