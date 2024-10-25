/* eslint-disable @typescript-eslint/no-var-requires */
import tailwindAnimated from 'tailwindcss-animated';
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  content: ['./src/renderer/**/*.tsx', './src/renderer/**/*.ejs'], // purges not used css
  theme: {
    extend: {
      fontFamily: {
        'sailec-light': ['Sailec Light', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#A7F3D0', // Light shade for primary color (like a mint green)
          DEFAULT: '#34D399', // Main primary color
          dark: '#059669', // Dark shade for primary color
        },
        secondary: {
          light: '#FBCFE8', // Light shade for secondary color (like a pink)
          DEFAULT: '#F472B6', // Main secondary color
          dark: '#DB2777', // Dark shade for secondary color
        },
        accent: {
          light: '#BFDBFE', // Light shade for accent color (like a blue)
          DEFAULT: '#3B82F6', // Main accent color
          dark: '#1D4ED8', // Dark shade for accent color
        },
        neutral: {
          light: '#F3F4F6', // Light neutral color (background or cards)
          DEFAULT: '#9CA3AF', // Main neutral color
          dark: '#4B5563', // Darker neutral color (texts or headings)
        },
        success: {
          DEFAULT: '#10B981', // Success messages or indicators
        },
        warning: {
          DEFAULT: '#F59E0B', // Warning messages or indicators
        },
        error: {
          DEFAULT: '#EF4444', // Error messages or indicators
        },
        background: {
          light: '#ece8dd', // Light background color
          dark: '#2e2b26', // Dark mode background color
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [tailwindAnimated],
};
