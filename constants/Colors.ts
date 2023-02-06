import Color from "color";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from "react-native-paper";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
const opacity = {
  level1: 0.08,
  level2: 0.12,
  level3: 0.16,
  level4: 0.38,
};

const neutralDark = Color("#121212");
const neutralDarkVariant = Color("#131313");

// Partial<typeof tokens.md.ref.palette>
const CustomDarkPalette = {
  // neutral10: 'rgba(28, 27, 31, 1)',
  // neutral20: 'rgba(34, 33, 40, 1)',
  // neutral30: 'rgba(48, 47, 55, 1)',
  // neutral40: 'rgba(75, 74, 79, 1)',
  // neutral50: 'rgba(100, 99, 105, 1)',
  // neutral60: 'rgba(126, 124, 131, 1)',
  // neutral70: 'rgba(151, 150, 156, 1)',
  // neutral80: 'rgba(177, 176, 181, 1)',
  // neutral90: 'rgba(203, 202, 206, 1)',
  neutral10: neutralDark.lighten(0.5),
  neutral20: neutralDark.lighten(1),
  neutral30: neutralDark.lighten(1.5),
  neutral40: neutralDark.lighten(2),
  neutral50: neutralDark.lighten(2.5),
  neutral60: neutralDark.lighten(3),
  neutral70: neutralDark.lighten(3.5),
  neutral80: neutralDark.lighten(4),
  neutral90: neutralDark.lighten(4.5),
  neutral95: neutralDark.lighten(5),
  neutral99: neutralDark.lighten(5.4),
  neutral100: neutralDark.lighten(5.5),
  neutralVariant10: neutralDarkVariant.lighten(0.5),
  neutralVariant20: neutralDarkVariant.lighten(1),
  neutralVariant30: neutralDarkVariant.lighten(1.5),
  neutralVariant40: neutralDarkVariant.lighten(2),
  neutralVariant50: neutralDarkVariant.lighten(2.5),
  neutralVariant60: neutralDarkVariant.lighten(3),
  neutralVariant70: neutralDarkVariant.lighten(3.5),
  neutralVariant80: neutralDarkVariant.lighten(4),
  neutralVariant90: neutralDarkVariant.lighten(4.5),
  neutralVariant95: neutralDarkVariant.lighten(5),
  neutralVariant99: neutralDarkVariant.lighten(5.4),
  neutralVariant100: neutralDarkVariant.lighten(5.5),
};

const CustomLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF5F00",
    secondary: "#FF3D00",
    onPrimary: "#FFFFFF",
  },
};

const CustomDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#FF5F00",
    secondary: "#FF3D00",
    onPrimary: "#FFFFFF",
    surface: CustomDarkPalette.neutral10.string(),
    surfaceVariant: CustomDarkPalette.neutralVariant30.string(),
    onSurfaceVariant: CustomDarkPalette.neutralVariant80.string(),
    outline: CustomDarkPalette.neutralVariant60.string(),
    outlineVariant: CustomDarkPalette.neutralVariant30.string(),
    backdrop: CustomDarkPalette.neutralVariant20.alpha(0.4).string(),
    surfaceDisabled: CustomDarkPalette.neutral90.alpha(opacity.level4).string(),
    background: CustomDarkPalette.neutral10.string(),
    onBackground: CustomDarkPalette.neutral90.string(),
    inverseSurface: CustomDarkPalette.neutral90.string(),
    inverseOnSurface: CustomDarkPalette.neutral20.string(),
    shadow: CustomDarkPalette.neutral10.string(),
    elevation: {
      level0: "transparent",
      level1: CustomDarkPalette.neutralVariant100.alpha(0.05).string(),
      level2: CustomDarkPalette.neutralVariant100.alpha(0.08).string(),
      level3: CustomDarkPalette.neutralVariant100.alpha(0.11).string(),
      level4: CustomDarkPalette.neutralVariant100.alpha(0.12).string(),
      level5: CustomDarkPalette.neutralVariant100.alpha(0.14).string(),
    },
  },
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const CombinedLightTheme = merge(LightTheme, CustomLightTheme);
export const CombinedDarkTheme = merge(DarkTheme, CustomDarkTheme);
