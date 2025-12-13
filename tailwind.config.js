/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // BACKGROUND: Now the deep dark background
        primary: "#040D07", 

        // CARDS/SURFACES: Slightly lighter dark surface for card separation
        card: "#121E18",

        // BRAND: The core green accent colors
        secondary: {
          DEFAULT: "#22C55E",    // Core Primary/Accent Green (replaces old #4EA89A)
          100: "#4EA89A",        // Primary Light (from your button style, for lighter tints/gradients)
          200: "#2D665B",        // Primary Dark (from your button style, for dark borders/shadows)
        },

        // TEXT/NEUTRAL: Light colors for readability on dark background
        dark: {
          DEFAULT: "#EAFDF4",    // High-Contrast Text (replaces old #1F2937)
          100: "#D1FADF",        // Secondary Text/Description (replaces old #4B5563)
          200: "#000000",        // Pure Black (For text on the bright secondary buttons/surfaces)
        },
        
        // Status Colors (Retained the standard values)
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