/** @type {import('tailwindcss').Config} */
export const content = ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    colors: {
      primary : '#030014',
      secondary : '#151312',
      light: {
        100: '#D6C6FF',
        200: '#A8B5DB',
        300: '#9CA4AB',
      },
      dark: {
        100: '#221F3D',
        200: '#0F0D23',
      }
    }
  },
};
export const plugins = [];