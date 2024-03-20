/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        signature: "#008080",
        secondary: "#20B2AA",
        brighter: "#57b894",
        dark: "#001e2b",
      },
      colors: {
        signature: "#008080",
        dark: "#001e2b",
      },
    },
  },
  plugins: [],
};
