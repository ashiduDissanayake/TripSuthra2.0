/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scale: {
          '0%, 100%': { transform: 'scale(1)' }, // Normal size
          '50%': { transform: 'scale(1.1)' },   // Scale up to 1.1x at midpoint
        },
      },
      animation: {
        scale: 'scale 1.5s ease-in-out infinite', // Smooth scaling every 1.5 seconds
      },
    },
  },
  plugins: [],
}