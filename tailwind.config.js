/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lavender': '#E6E6FA',
        'dark-violet': '#4B0082'
      }
    },
  },
  plugins: [],
}
