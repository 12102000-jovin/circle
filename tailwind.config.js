/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        signature: "#008080",
        secondary: "#20B2AA",
        dark: "#332D2D",
      },
      colors: {
        signature: "#008080",
      },
    },
  },
  plugins: [],
};
