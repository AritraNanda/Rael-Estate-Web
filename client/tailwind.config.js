/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightblue: '#ADD8E6',  // Custom Light Blue color
      },
    },
  },
  plugins: [],
}
