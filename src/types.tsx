declare module 'react-native' {
  interface PlatformStatic {
    isDesktop?: boolean;
    isMobile?: boolean;
    isWeb?: boolean;
  }
}
