import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        // Border
        border: "var(--border)",
        // Accents
        teal: "var(--accent-teal)",
        gold: "var(--accent-gold)",
        danger: "var(--accent-danger)",
        // Text
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "text-micro": "var(--text-micro)",
        // Glows (semi-transparent, better as CSS vars)
        "glow-teal": "var(--glow-teal)",
        "glow-gold": "var(--glow-gold)",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      keyframes: {
        blobFloat: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(30px,-20px) scale(1.1)" },
        },
        floatBreath: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        orbit: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
          "50%": { transform: "translateX(-50%) translateY(8px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        barGrow: {
          from: { width: "0" },
        },
      },
      animation: {
        blobFloat: "blobFloat 8s ease-in-out infinite alternate",
        blobFloatReverse:
          "blobFloat 8s ease-in-out infinite alternate-reverse",
        floatBreath: "floatBreath 6s ease-in-out infinite",
        orbit: "orbit 12s linear infinite",
        bounce: "bounce 2s infinite",
        glowPulse: "glowPulse 3s ease-in-out infinite",
        slideInRight: "slideInRight 0.3s ease",
        pulseDot: "pulseDot 1s infinite",
        barGrow: "barGrow 2s ease-out",
      },
      borderRadius: {
        pill: "999px",
      },
      maxWidth: {
        container: "1200px",
      },
      backdropBlur: {
        nav: "12px",
        "app-nav": "14px",
      },
    },
  },
  plugins: [],
};

export default config;
