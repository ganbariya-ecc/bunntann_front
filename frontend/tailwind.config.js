const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'coment': ['"Kiwi Maru"', ...defaultTheme.fontFamily.sans],
        'title': ['"Yusei Magic"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'main-color': 'rgba(246, 219, 186, 0.5)',
        'sub-color': 'rgba(255 247 237)',
        'main-font-color': '#4AB4A1',

      },
    },
  },
  variants: {},
  plugins: [],
}

