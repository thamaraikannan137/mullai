/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        'tamil-serif': ['var(--font-tamil-serif)', '"Noto Serif Tamil"', 'serif'],
        'tamil-sans': ['var(--font-tamil-sans)', '"Anek Tamil"', 'sans-serif'],
        accent: ['var(--font-accent)', '"Cormorant Garamond"', 'Georgia', 'serif'],
        number: ['var(--font-accent)', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        cream: '#f6f2e8',
        'off-white': '#fbfcfa',
        'green-dark': '#064e3b',
        'green-mid': '#067a52',
        'green-light': '#0e9f6e',
        'green-bright': '#23c483',
        'green-pale': '#e6f6ee',
        gold: '#e6b130',
        'gold-dark': '#bc8e1c',
        'gold-pale': '#f3e3b3',
        'text-body': '#3c4a42',
        'text-muted': '#5a6b61',
        footer: '#053524',
      },
    },
  },
  plugins: [],
}
