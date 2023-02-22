import iconFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import SSR from './assets/fonts/SourceSans/SourceSans3-Regular.otf';

const fonts = [
  {font: SSR, name: 'source-sans-regular'},
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
