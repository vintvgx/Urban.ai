/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        lightgray: "#f2f2f2",
        darkgray: "#2c2c2c",
        hovergray: "#e6e6e6",
      },
      boxShadow: {
        "white-lg":
          "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["hover", "focus"], // just ensuring hover is included
    },
  },
  plugins: [],
};
