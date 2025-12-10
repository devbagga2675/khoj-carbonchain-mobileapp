/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // BACKGROUND: Soft Off-White
        primary: "#F9FAFB", 

        // CARDS/SURFACES: Pure White
        card: "#FFFFFF",

        // BRAND: Your "Eco-Teal" (Unchanged)
        secondary: {
          DEFAULT: "#4EA89A", 
          100: "#E0F2F1",     // Very light teal for backgrounds
          200: "#2D665B",     // Darker teal for text/borders
        },

        // TEXT: Dark Gray for readability on light bg
        dark: {
          DEFAULT: "#1F2937", // Main Text
          100: "#4B5563",     // Secondary Text
          200: "#9CA3AF",     // Placeholders
        },
        
        // Status Colors
        danger: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};