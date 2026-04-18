/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",  // covers root-level files too
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

