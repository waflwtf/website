/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.njk",
    "./src/**/*.md",
    "./src/**/*.js",
    "./src/**/*.webc",
    "./src/**/*.vue",
  ],
  theme: {
    fontFamily: {
      sans: ["Work Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
