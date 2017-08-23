import { Font } from 'expo';

const cachedFonts = fonts =>
  fonts.map(font => Font.loadAsync(font));

export const fontAssets = cachedFonts([
  {
    catamaran: require('../assets/fonts/Catamaran-Regular.ttf')
  },
  {
    catamaranBold: require('../assets/fonts/Catamaran-Bold.ttf')
  },
  {
    catamaranLight: require('../assets/fonts/Catamaran-Light.ttf')
  },
  {
    catamaranMedium: require('../assets/fonts/Catamaran-Medium.ttf')
  }
]);