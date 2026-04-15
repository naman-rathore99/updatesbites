import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#E65100",    // Savor & Spice Primary
          secondary: "#37474F",  // Savor & Spice Secondary
          tertiary: "#FFAB40",   // Savor & Spice Tertiary
          neutral: "#FDF5E6",    // Savor & Spice Neutral / Bg
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(55, 71, 79, 0.08)',
      }
    },
  },
  plugins: [],
};
export default config;
