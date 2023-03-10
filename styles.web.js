import iconFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import SSL from './assets/fonts/SourceSans/SourceSans3-Light.otf';
import SSR from './assets/fonts/SourceSans/SourceSans3-Regular.otf';
import SSSB from './assets/fonts/SourceSans/SourceSans3-Semibold.otf';

const fonts = [
  {font: SSR, name: 'SourceSans3-Regular'},
  {font: SSSB, name: 'SourceSans3-Semibold'},
  {font: SSL, name: 'SourceSans3-Light'},
  {font: iconFont, name: 'MaterialCommunityIcons'},
];

for (const font of fonts) {
  const iconFontStyles = `@font-face {
        src: url(${font.font});
        font-family: ${font.name};
      }`;

  // Create stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = iconFontStyles;
  } else {
    style.appendChild(document.createTextNode(iconFontStyles));
  }

  // Inject stylesheet
  document.head.appendChild(style);
}
