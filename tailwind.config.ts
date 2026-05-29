/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#19622B",
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },

      animation: {
        shine: "shine 1s ease-in-out infinite",
      },

      keyframes: {
        shine: {
          "100%": {
            left: "125%",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;