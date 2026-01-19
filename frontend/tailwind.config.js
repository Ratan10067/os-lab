/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#12121a",
          tertiary: "#1a1a24",
          card: "rgba(26, 26, 36, 0.8)",
          glass: "rgba(255, 255, 255, 0.03)",
        },
        accent: {
          green: "#22c55e",
          "green-dim": "rgba(34, 197, 94, 0.15)",
          blue: "#3b82f6",
          "blue-dim": "rgba(59, 130, 246, 0.15)",
          purple: "#a855f7",
          "purple-dim": "rgba(168, 85, 247, 0.15)",
          orange: "#f97316",
          "orange-dim": "rgba(249, 115, 22, 0.15)",
          red: "#ef4444",
        },
        text: {
          primary: "#f0f0f5",
          secondary: "#a0a0b0",
          muted: "#606070",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.15)",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
