/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E1E8EF',
          100: '#D4DEE7',
          200: '#B7C7D7',
          300: '#99B0C7',
          400: '#7C99B6',
          500: '#5E82A6',
          600: '#4C6B8A',
          700: '#3C546C',
          800: '#2C3D4F',
          900: '#1B2631',
          950: '#141C24',
        },
        accent: {
          50: '#F0FAF5',
          100: '#E1F4EC',
          200: '#BFE8D6',
          300: '#A2DDC2',
          400: '#84D2AF',
          500: '#63C699',
          600: '#43B783',
          700: '#359268',
          800: '#286C4D',
          900: '#1B4B35',
          950: '#143828',
        },
      },
    },
  },
  plugins: [],
};
