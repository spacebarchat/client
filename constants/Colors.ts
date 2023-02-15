import Color from "color";
import {
  adaptNavigationTheme,
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from "react-native-paper";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import { NavigationTheme } from "react-native-paper/lib/typescript/types";

// #262322 this is a nice color, maybe we can use this somewhere

export const CustomColorsCommon = {
  primary: Color("#FF5F00"),
  primaryContainer: Color("#FF5F00"),
  secondary: Color("#FF3D00"),
  secondaryContainer: Color("#FF3D00"),
};

export const CustomDarkColors = {
  text: Color("#727272"),
  textMuted: Color("#96989d"),
  disabled: Color("#474747"),
  active: Color("#323232"),
  green: Color("#c3e88d"),
  yellow: Color("#ffcb6b"),
  blue: Color("#82aaff"),
  red: Color("#ff5370"),
  purple: Color("#7c4dff"),
  orange: Color("#f78c6c"),
  cyan: Color("#89ddff"),
  gray: Color("#c0c5ce"),
  whiteBlack: Color("#ffffff"),
  error: Color("#ff5370"),
  backgroundPrimary: Color("#303030"), // #202020
  backgroundSecondary: Color("#292929"), // #212112
};

export const CustomLightColors = {
  text: Color("#94A7B0"),
  textMuted: Color("#96989d"),
  disabled: Color("#D2D4D5"),
  active: Color("#E7E7E8"),
  green: Color("#91b859"),
  yellow: Color("#f6a434"),
  blue: Color("#6182b8"),
  red: Color("#e53935"),
  purple: Color("#7c4dff"),
  orange: Color("#f76d47"),
  cyan: Color("#39adb5"),
  gray: Color("#AABFC9"),
  whiteBlack: Color("#000000"),
  error: Color("#e53935"),
  backgroundPrimary: Color("#cecece"),
  backgroundSecondary: Color("#e0e0e0"),
};

export const CustomPaletteDark = {
  primary0: CustomColorsCommon.primary.darken(0.5),
  primary10: CustomColorsCommon.primary.darken(0.4),
  primary20: CustomColorsCommon.primary.darken(0.3),
  primary30: CustomColorsCommon.primary.darken(0.2),
  primary40: CustomColorsCommon.primary.darken(0.1),
  primary50: CustomColorsCommon.primary,
  primary60: CustomColorsCommon.primary.lighten(0.1),
  primary70: CustomColorsCommon.primary.lighten(0.2),
  primary80: CustomColorsCommon.primary.lighten(0.3),
  primary90: CustomColorsCommon.primary.lighten(0.4),
  primary100: CustomColorsCommon.primary.lighten(0.5),
  secondary0: CustomColorsCommon.secondary.darken(0.5),
  secondary10: CustomColorsCommon.secondary.darken(0.4),
  secondary20: CustomColorsCommon.secondary.darken(0.3),
  secondary30: CustomColorsCommon.secondary.darken(0.2),
  secondary40: CustomColorsCommon.secondary.darken(0.1),
  secondary50: CustomColorsCommon.secondary,
  secondary60: CustomColorsCommon.secondary.lighten(0.1),
  secondary70: CustomColorsCommon.secondary.lighten(0.2),
  secondary80: CustomColorsCommon.secondary.lighten(0.3),
  secondary90: CustomColorsCommon.secondary.lighten(0.4),
  secondary100: CustomColorsCommon.secondary.lighten(0.5),
  backgroundPrimary0: CustomDarkColors.backgroundPrimary.darken(0.5),
  backgroundPrimary10: CustomDarkColors.backgroundPrimary.darken(0.4),
  backgroundPrimary20: CustomDarkColors.backgroundPrimary.darken(0.3),
  backgroundPrimary30: CustomDarkColors.backgroundPrimary.darken(0.2),
  backgroundPrimary40: CustomDarkColors.backgroundPrimary.darken(0.1),
  backgroundPrimary50: CustomDarkColors.backgroundPrimary,
  backgroundPrimary60: CustomDarkColors.backgroundPrimary.lighten(0.1),
  backgroundPrimary70: CustomDarkColors.backgroundPrimary.lighten(0.2),
  backgroundPrimary80: CustomDarkColors.backgroundPrimary.lighten(0.3),
  backgroundPrimary90: CustomDarkColors.backgroundPrimary.lighten(0.4),
  backgroundPrimary100: CustomDarkColors.backgroundPrimary.lighten(0.5),
  backgroundSecondary0: CustomDarkColors.backgroundSecondary.darken(0.5),
  backgroundSecondary10: CustomDarkColors.backgroundSecondary.darken(0.4),
  backgroundSecondary20: CustomDarkColors.backgroundSecondary.darken(0.3),
  backgroundSecondary30: CustomDarkColors.backgroundSecondary.darken(0.2),
  backgroundSecondary40: CustomDarkColors.backgroundSecondary.darken(0.1),
  backgroundSecondary50: CustomDarkColors.backgroundSecondary,
  backgroundSecondary60: CustomDarkColors.backgroundSecondary.lighten(0.1),
  backgroundSecondary70: CustomDarkColors.backgroundSecondary.lighten(0.2),
  backgroundSecondary80: CustomDarkColors.backgroundSecondary.lighten(0.3),
  backgroundSecondary90: CustomDarkColors.backgroundSecondary.lighten(0.4),
  backgroundSecondary100: CustomDarkColors.backgroundSecondary.lighten(0.5),
};

export const CustomPaletteLight = {
  primary0: CustomColorsCommon.primary.darken(0.5),
  primary10: CustomColorsCommon.primary.darken(0.4),
  primary20: CustomColorsCommon.primary.darken(0.3),
  primary30: CustomColorsCommon.primary.darken(0.2),
  primary40: CustomColorsCommon.primary.darken(0.1),
  primary50: CustomColorsCommon.primary,
  primary60: CustomColorsCommon.primary.lighten(0.1),
  primary70: CustomColorsCommon.primary.lighten(0.2),
  primary80: CustomColorsCommon.primary.lighten(0.3),
  primary90: CustomColorsCommon.primary.lighten(0.4),
  primary100: CustomColorsCommon.primary.lighten(0.5),
  secondary0: CustomColorsCommon.secondary.darken(0.5),
  secondary10: CustomColorsCommon.secondary.darken(0.4),
  secondary20: CustomColorsCommon.secondary.darken(0.3),
  secondary30: CustomColorsCommon.secondary.darken(0.2),
  secondary40: CustomColorsCommon.secondary.darken(0.1),
  secondary50: CustomColorsCommon.secondary,
  secondary60: CustomColorsCommon.secondary.lighten(0.1),
  secondary70: CustomColorsCommon.secondary.lighten(0.2),
  secondary80: CustomColorsCommon.secondary.lighten(0.3),
  secondary90: CustomColorsCommon.secondary.lighten(0.4),
  secondary100: CustomColorsCommon.secondary.lighten(0.5),
  backgroundPrimary0: CustomLightColors.backgroundPrimary.darken(0.5),
  backgroundPrimary10: CustomLightColors.backgroundPrimary.darken(0.4),
  backgroundPrimary20: CustomLightColors.backgroundPrimary.darken(0.3),
  backgroundPrimary30: CustomLightColors.backgroundPrimary.darken(0.2),
  backgroundPrimary40: CustomLightColors.backgroundPrimary.darken(0.1),
  backgroundPrimary50: CustomLightColors.backgroundPrimary,
  backgroundPrimary60: CustomLightColors.backgroundPrimary.lighten(0.1),
  backgroundPrimary70: CustomLightColors.backgroundPrimary.lighten(0.2),
  backgroundPrimary80: CustomLightColors.backgroundPrimary.lighten(0.3),
  backgroundPrimary90: CustomLightColors.backgroundPrimary.lighten(0.4),
  backgroundPrimary100: CustomLightColors.backgroundPrimary.lighten(0.5),
  backgroundSecondary0: CustomLightColors.backgroundSecondary.darken(0.5),
  backgroundSecondary10: CustomLightColors.backgroundSecondary.darken(0.4),
  backgroundSecondary20: CustomLightColors.backgroundSecondary.darken(0.3),
  backgroundSecondary30: CustomLightColors.backgroundSecondary.darken(0.2),
  backgroundSecondary40: CustomLightColors.backgroundSecondary.darken(0.1),
  backgroundSecondary50: CustomLightColors.backgroundSecondary,
  backgroundSecondary60: CustomLightColors.backgroundSecondary.lighten(0.1),
  backgroundSecondary70: CustomLightColors.backgroundSecondary.lighten(0.2),
  backgroundSecondary80: CustomLightColors.backgroundSecondary.lighten(0.3),
  backgroundSecondary90: CustomLightColors.backgroundSecondary.lighten(0.4),
  backgroundSecondary100: CustomLightColors.backgroundSecondary.lighten(0.5),
};

const CustomLightTheme: MD3Theme & {
  colors: { palette: { [key in keyof typeof CustomPaletteLight]: string } } & {
    [key in keyof typeof CustomLightColors]: string;
  } & {
    [key in keyof typeof CustomColorsCommon]: string;
  };
} = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...Object.entries(CustomColorsCommon).reduce((acc, [key, value]) => {
      acc[key as keyof typeof CustomColorsCommon] = value.string();
      return acc;
    }, {} as { [key in keyof typeof CustomColorsCommon]: string }),
    palette: Object.entries(CustomPaletteLight).reduce((acc, [key, value]) => {
      acc[key as keyof typeof CustomPaletteLight] = value.string();
      return acc;
    }, {} as { [key in keyof typeof CustomPaletteLight]: string }),
    onPrimary: CustomLightColors.whiteBlack.string(),
    onPrimaryContainer: CustomLightColors.whiteBlack.string(),
    onSecondary: CustomLightColors.whiteBlack.string(),
    onSecondaryContainer: CustomLightColors.whiteBlack.string(),
    errorContainer: CustomLightColors.error.string(),
    onError: CustomLightColors.whiteBlack.string(),
    onErrorContainer: CustomLightColors.whiteBlack.string(),
    onBackground: CustomLightColors.whiteBlack.string(),
    ...Object.entries(CustomLightColors).reduce((acc, [key, value]) => {
      acc[key as keyof typeof CustomLightColors] = value.string();
      return acc;
    }, {} as { [key in keyof typeof CustomLightColors]: string }),
    // surface: CustomPaletteLight.backgroundPrimary0.string(),
    // surfaceVariant: CustomPaletteLight.backgroundSecondary30.string(),
    // onSurfaceVariant: CustomPaletteLight.backgroundSecondary80.string(),
    // outline: CustomPaletteLight.backgroundSecondary60.string(),
    // outlineVariant: CustomPaletteLight.backgroundSecondary30.string(),
    // backdrop: CustomPaletteLight.backgroundSecondary20.alpha(0.4).string(),
    // surfaceDisabled: CustomPaletteLight.backgroundPrimary90
    //   .alpha(tokens.md.ref.opacity.level4)
    //   .string(),
    // background: CustomPaletteLight.backgroundPrimary0.string(),
    // onBackground: CustomLightColors.whiteBlack.string(),
    // shadow: CustomPaletteLight.backgroundPrimary0.string(),
    // elevation: {
    //   level0: "transparent",
    //   level1: CustomPaletteLight.backgroundSecondary100.alpha(0.05).string(),
    //   level2: CustomPaletteLight.backgroundSecondary100.alpha(0.08).string(),
    //   level3: CustomPaletteLight.backgroundSecondary100.alpha(0.11).string(),
    //   level4: CustomPaletteLight.backgroundSecondary100.alpha(0.12).string(),
    //   level5: CustomPaletteLight.backgroundSecondary100.alpha(0.14).string(),
    // },
  },
  fonts: configureFonts({
    config: {
      fontFamily: "source-sans-regular",
    },
  }),
};

const CustomDarkTheme: MD3Theme & {
  colors: { palette: { [key in keyof typeof CustomPaletteDark]: string } } & {
    [key in keyof typeof CustomDarkColors]: string;
  } & {
    [key in keyof typeof CustomColorsCommon]: string;
  };
} = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...Object.entries(CustomColorsCommon).reduce((acc, [key, value]) => {
      acc[key as keyof typeof CustomColorsCommon] = value.string();
      return acc;
    }, {} as { [key in keyof typeof CustomColorsCommon]: string }),
    palette: Object.entries(CustomPaletteDark).reduce((acc, [key, value]) => {
      acc[key as keyof typeof CustomPaletteDark] = value.string();
      return acc;
    }, {} as { [key in keyof typeof CustomPaletteDark]: string }),
    onPrimary: CustomDarkColors.whiteBlack.string(),
    onPrimaryContainer: CustomDarkColors.whiteBlack.string(),
    onSecondary: CustomDarkColors.whiteBlack.string(),
    onSecondaryContainer: CustomDarkColors.whiteBlack.string(),
    errorContainer: CustomDarkColors.error.string(),
    onError: CustomDarkColors.whiteBlack.string(),
    onErrorContainer: CustomDarkColors.whiteBlack.string(),
    onBackground: CustomDarkColors.whiteBlack.string(),
    ...Object.entries(CustomDarkColors).reduce((acc, [key, value]) => {
      acc[key as keyof typeof CustomDarkColors] = value.string();
      return acc;
    }, {} as { [key in keyof typeof CustomDarkColors]: string }),
    // surface: CustomPaletteDark.backgroundPrimary0.string(),
    // surfaceVariant: CustomPaletteDark.backgroundSecondary30.string(),
    // onSurfaceVariant: CustomPaletteDark.backgroundSecondary80.string(),
    // outline: CustomPaletteDark.backgroundSecondary60.string(),
    // outlineVariant: CustomPaletteDark.backgroundSecondary30.string(),
    // backdrop: CustomPaletteDark.backgroundSecondary20.alpha(0.4).string(),
    // surfaceDisabled: CustomPaletteDark.backgroundPrimary90
    //   .alpha(tokens.md.ref.opacity.level4)
    //   .string(),
    // background: CustomPaletteDark.backgroundPrimary0.string(),
    // onBackground: CustomDarkColors.whiteBlack.string(),
    // shadow: CustomPaletteDark.backgroundPrimary0.string(),
    // elevation: {
    //   level0: "transparent",
    //   level1: CustomPaletteDark.backgroundSecondary100.alpha(0.05).string(),
    //   level2: CustomPaletteDark.backgroundSecondary100.alpha(0.08).string(),
    //   level3: CustomPaletteDark.backgroundSecondary100.alpha(0.11).string(),
    //   level4: CustomPaletteDark.backgroundSecondary100.alpha(0.12).string(),
    //   level5: CustomPaletteDark.backgroundSecondary100.alpha(0.14).string(),
    // },
  },
  fonts: configureFonts({
    config: {
      fontFamily: "source-sans-regular",
    },
  }),
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const CombinedLightTheme = merge<
  NavigationTheme,
  typeof CustomLightTheme
>(LightTheme, CustomLightTheme);

export const CombinedDarkTheme = merge<NavigationTheme, typeof CustomDarkTheme>(
  DarkTheme,
  CustomDarkTheme
);

export type CustomTheme = typeof CustomDarkTheme;
