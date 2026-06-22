import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#174338",
          50:  "#eef5f2",
          100: "#d2e6df",
          200: "#a7ccc0",
          300: "#7aae9f",
          400: "#508f7e",
          500: "#317365",
          600: "#235c50",
          700: "#1c4a40",
          800: "#174338",
          900: "#0f4338",
          950: "#0a2e26",
        },
        accent: {
          DEFAULT: "#ff5938",
          50:  "#fff1ed",
          100: "#ffded3",
          200: "#ffbca8",
          300: "#ff8e72",
          400: "#ff7053",
          500: "#ff5938",
          600: "#ee3911",
          700: "#c92907",
          800: "#a0250a",
          900: "#82240e",
        },
        ink: {
          DEFAULT: "#1f1e1e",
          muted: "#9f908d",
          soft: "#5b5757",
        },
        cream: "#eee8e2",
        "cream-soft": "#f5f1ea",
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f9f9f9",
          muted: "#f2f2f2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.5rem" },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px -8px rgba(0,0,0,0.10)",
      },
      transitionTimingFunction: { brand: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
