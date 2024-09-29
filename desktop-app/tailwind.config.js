/* eslint-disable @typescript-eslint/no-var-requires */
import tailwindAnimated from 'tailwindcss-animated';
import dashboardTheme from './src/renderer/themes/dashboard';
import readerTheme from './src/renderer/themes/reader';
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  content: ['./src/renderer/**/*.tsx', './src/renderer/**/*.ejs'], // purges not used css
  theme: {
    extend: {
      fontFamily: {
        'sailec-light': ['Sailec Light', 'sans-serif'],
      },
      colors: {
        ...dashboardTheme.extend.colors,
        ...readerTheme.extend.colors,
      },
    },
  },
  plugins: [tailwindAnimated],
};
