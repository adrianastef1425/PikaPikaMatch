/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FCD34D',
        secondary: '#F9A8D4',
        accent: '#6EE7B7',
        'background-light': '#FFFBEB',
        'background-dark': '#292524',
        'card-light': '#ffffff',
        'card-dark': '#1c1917',
        'pastel-red': '#FCA5A5',
        'pastel-green': '#86EFAC',
        'pastel-pink': '#FBCFE8',
        'pastel-yellow': '#FEF08A',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px'
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(252, 211, 77, 0.15)',
        card: '0 20px 50px -12px rgba(252, 211, 77, 0.25)',
        'glow-green': '0 0 25px 5px rgba(134, 239, 172, 0.6)',
        'glow-red': '0 0 20px 4px rgba(239, 68, 68, 0.4)',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}

