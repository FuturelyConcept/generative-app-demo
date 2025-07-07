/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ai-blue': '#3b82f6',
        'ai-green': '#10b981',
        'ai-red': '#ef4444',
        'ai-gray': '#6b7280',
      },
    },
  },
  plugins: [],
}