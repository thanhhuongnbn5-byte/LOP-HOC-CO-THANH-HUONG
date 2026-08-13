/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edublue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
        },
        edumint: {
          50: '#f2fbf9',
          100: '#e6f7f3',
          400: '#40c7b1',
          500: '#36b3a0',
          600: '#2b9484',
          700: '#22786b',
        },
        eduyellow: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Comfortaa', 'Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
