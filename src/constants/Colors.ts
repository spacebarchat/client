import {adaptNavigationTheme} from 'react-native-paper';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import {NavigationTheme} from 'react-native-paper/lib/typescript/types';

import CustomDarkTheme from './themes/DarkTheme';
import CustomLightTheme from './themes/LightTheme';

// #262322 this is a nice color, maybe we can use this somewhere

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const CombinedLightTheme = merge<
  NavigationTheme,
  typeof CustomLightTheme
>(LightTheme, CustomLightTheme);

export const CombinedDarkTheme = merge<NavigationTheme, typeof CustomDarkTheme>(
  DarkTheme,
  CustomDarkTheme,
);

export type CustomTheme = typeof CustomLightTheme;
