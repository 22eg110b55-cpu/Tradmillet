import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2E7D32",
          brown: "#6D4C41",
          cream: "#FFF8E1",
          orange: "#F57C00"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.10)"
      }
    }
  },
  plugins: []
} satisfies Config;


