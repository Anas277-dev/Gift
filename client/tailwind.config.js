/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0F766E', // Deep Teal
          800: '#115e59',
          900: '#134e4a',
        },
        coral: {
          400: '#ff8787',
          500: '#FF6B6B', // Vibrant Coral
          600: '#ee5253',
        },
        amber: {
          500: '#F59E0B', // Amber Gold
          600: '#d97706',
        },
        charcoal: '#1F2937',
        lavender: '#F3F0FF',
        offwhite: '#FAFAF9',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        display: ['Fredoka', 'Quicksand', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
