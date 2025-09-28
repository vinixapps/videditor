/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // kalau pakai Next.js app dir
  ],
  theme: {
    extend: {
      // Tambahkan custom color/font jika perlu
      // colors: { primary: "#..." }
    },
  },
  plugins: [],
};

