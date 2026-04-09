/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cw-dark': '#0f1117',
        'cw-card': '#1a1d27',
        'cw-border': '#2a2d3a',
        'cw-hover': '#252836',
        'cw-accent': '#3b82f6',
        'cw-green': '#22c55e',
        'cw-yellow': '#eab308',
        'cw-red': '#ef4444',
        'cw-orange': '#f97316',
      },
    },
  },
  plugins: [],
}
