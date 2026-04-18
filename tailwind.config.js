/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'moroccan-red':   '#C4374B',
        'moroccan-cream': '#FAF8F5',
        'moroccan-gold':  '#D4AF37',
        'moroccan-green': '#1B4332',
        'text-main':      '#2D2D2D',
        'text-light':     '#8E8E8E',
        'bg-darker':      '#E2DDD5',
      },
      fontFamily: {
        sans:    ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic:  ['"Amiri"', 'serif'],
        display: ['"Cairo"', 'sans-serif'],
        serif:   ['"Libre Baskerville"', 'serif'],
      },
    },
  },
  plugins: [],
}