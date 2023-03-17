import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import {NavigationTheme} from 'react-native-paper/lib/typescript/types';

import CustomDarkTheme from './themes/Dark';
import CustomLightTheme from './themes/Light';
import CustomOceanicTheme from './themes/Oceanic';

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

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  OCEANIC = 'oceanic',
}

export function getTheme(theme: keyof typeof themes) {
  return themes[theme];
}

export type ThemeName = keyof typeof themes;
