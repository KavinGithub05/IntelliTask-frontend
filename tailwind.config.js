/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "custom-bg": "#f6f2f1",
        "custom-card": "#fff",
        "custom-accent": "#f8e9a8",
        "custom-muted": "#bdb3ad",
      },
      borderRadius: {
        "3xl": "1.875rem",
      },
    },
  },
  plugins: [],
};
