import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#123524', // Phthalo Green
          light: '#1a4d35',
          dark: '#0a1f15',
        },
        positive: '#097969', // Positive Green
        negative: '#880808', // Negative Red
        neutral: {
          light: '#b1bac4', // Midlight Grey
          DEFAULT: '#374151', // Dark Grey
          dark: '#1f2937',
        },
        background: '#ffffff',
        foreground: '#0a0a0a',
      },
    },
  },
  plugins: [],
};

export default config;
