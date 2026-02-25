import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: '#6366f1', // Indigo 500
        primaryHover: '#4f46e5', // Indigo 600
        brand: {
          DEFAULT: '#F39F29', // Lime Green
          hover: '#F39F29',
          glow: 'rgba(243, 159, 41, 0.5)',
        },
        dark: {
          900: '#111827', // Gray 900 (Dashboard) / #0B0C10 (Auth) -
          auth: {
            900: '#0B0C10',
            800: '#15171E',
            700: '#1F222E',
            600: '#2A2D3D',
          },
          // Keep existing mapping for Dashboard
          800: '#1f2937',
          700: '#374151',
        },
        light: {
          100: '#f3f4f6', // Gray 100
          200: '#e5e7eb', // Gray 200
        },
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(198, 241, 40, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
