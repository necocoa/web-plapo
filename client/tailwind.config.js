module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './public/**/*.html'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      boxShadow: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
}
