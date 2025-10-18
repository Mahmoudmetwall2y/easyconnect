/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E90FF',
        secondary: '#F4F6F9',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

