import type { Config } from "tailwindcss";

const config: Config = {
  // FIX: Menggunakan string "class" (bukan array) untuk validasi tipe data Tailwind v4
  darkMode: "class", 
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        accent: {
          DEFAULT: "#f36f21",
          hover: "#e05e12",
          soft: "#fff7ef",
          mid: "#fde8d3",
        },
        heading: "#171717",
        body: "#333333",
        muted: "#6b7280",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-down": "slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "modal-in": "modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 1.6s infinite",
        spin: "spin-smooth 1s linear infinite",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
        "card-hover":
          "0 12px 40px -8px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)",
        modal: "0 24px 80px -12px rgba(0, 0, 0, 0.18)",
        "orange-glow": "0 8px 24px -4px rgba(243, 111, 33, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;