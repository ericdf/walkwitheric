/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js}"],
  theme: {
    extend: {
      colors: {
        ink: '#2a2118',
        'ink-mid': '#5a4e3c',
        'ink-light': '#8a7a66',
        parchment: '#f5f0e8',
        'parchment-dark': '#ede6d6',
        'parchment-deep': '#d4c9b0',
        accent: '#8b3a1a',
        'accent-light': '#c0582a',
        gold: '#b8932a',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      maxWidth: {
        'content': '780px',
      }
    }
  },
  plugins: [],
}
