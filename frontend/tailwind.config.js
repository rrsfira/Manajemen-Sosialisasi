/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      keyframes: {
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        scaleIn: "scaleIn 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#F36621",
          prm2: "#FFFFFF",
          secondary: "#2A3382",
          accent: "#37cdbe",
          neutral: "#3d4451",
          accentcont: "#000000",
          "base-100": "#ffffff",
        },
      },
      {
        dark: {
          primary: "#2A3382",
          prm2: "#000000",
          secondary: "#F36621",
          accent: "#1fb2a6",
          neutral: "#2a2e37",
          accentcont: "#5A607F",
          "base-100": "#191d24",
        },
      },
    ],
  },
};
