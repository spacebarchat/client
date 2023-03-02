import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import {NavigationTheme} from 'react-native-paper/lib/typescript/types';

import CustomDarkTheme from './themes/Dark';
import CustomLightTheme from './themes/Light';
import CustomOceanicTheme from './themes/Oceanic';

// #262322 this is a nice color, maybe we can use this somewhere

// const {LightTheme, DarkTheme} = adaptNavigationTheme({
//   reactNavigationLight: NavigationDefaultTheme,
//   reactNavigationDark: NavigationDarkTheme,
// });

// export const CombinedLightTheme = merge<
//   NavigationTheme,
//   typeof CustomLightTheme
// >(LightTheme, CustomLightTheme);

// export const CombinedDarkTheme = merge<NavigationTheme, typeof CustomDarkTheme>(
//   DarkTheme,
//   CustomDarkTheme,
// );

// export const Themes = {
//   light: CombinedLightTheme,
//   dark: CombinedDarkTheme,
// }

function combineTheme(
  reactNavigationTheme: NavigationTheme,
  customTheme: typeof CustomLightTheme,
) {
  return merge<NavigationTheme, typeof CustomLightTheme>(
    reactNavigationTheme,
    customTheme,
  );
}

export const themes = {
  light: combineTheme(NavigationDefaultTheme, CustomLightTheme),
  dark: combineTheme(NavigationDarkTheme, CustomDarkTheme),
  oceanic: combineTheme(NavigationDarkTheme, CustomOceanicTheme),
};

export enum Themes {
  LIGHT = 'light',
  DARK = 'dark',
  OCEANIC = 'oceanic',
}

export function getTheme(theme: keyof typeof themes) {
  return themes[theme];
}

export type ThemeName = keyof typeof themes;
