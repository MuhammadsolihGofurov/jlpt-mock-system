/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // '.s/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F5A623",
          light: "#FFD080",
          dark: "#E09000",
          50: "#FFF8F0",
          100: "#FFEDCC",
          500: "#F5A623",
          600: "#E09000",
          700: "#CC7A00",
        },
        heading: "#1A1C1E",
        body: "#3A3F44",
        muted: "#64748B",

        cream: "#FFFBF5",
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        small: "360px",
        // => @media (min-width: 360px) { ... }

        xs: "450px",
        // => @media (min-width: 450px) { ... }

        sm: "650px",
        // => @media (min-width: 650px) { ... }

        md: "770px",
        // => @media (min-width: 770px) { ... }

        lg: "992px",
        // => @media (min-width: 992px) { ... }

        "4xl": "1340px"
      },
    },
  },
  plugins: [],
};