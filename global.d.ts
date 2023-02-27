declare module 'react-native-web-webview';
declare module 'react-fps-stats';
declare module '@qeepsake/react-navigation-overlay';

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
