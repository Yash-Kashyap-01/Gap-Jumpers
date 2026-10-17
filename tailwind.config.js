/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigoDark: '#1B1464',
        marigold: '#FFB400',
        saffron: '#FF6B1A',
        magenta: '#E6007E',
        teal: '#00B8A9',
        cream: '#FFF6E0',
      },
      fontFamily: {
        bungee: ['Bungee', 'cursive', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-sm': '2px 2px 0px #000000',
      },
    },
  },
  plugins: [],
}
