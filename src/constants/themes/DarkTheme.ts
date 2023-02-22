import Color from 'color';
import {Platform} from 'react-native';
import {configureFonts} from 'react-native-paper';
import {ColorPalette, CustomTheme, Font} from '../../types';
import CommonColors from './CommonColors';

const BaseColors = {
  neutral: Color('#1c1b1f'),
  text: Color('#ffffff'),
};

const palette: ColorPalette = {
  primary100: CommonColors.primary.lighten(0.4).hex(),
  primary99: CommonColors.primary.lighten(0.3).hex(),
  primary95: CommonColors.primary.lighten(0.2).hex(),
  primary90: CommonColors.primary.lighten(0.1).hex(),
  primary80: CommonColors.primary.hex(),
  primary70: CommonColors.primary.darken(0.1).hex(),
  primary60: CommonColors.primary.darken(0.2).hex(),
  primary50: CommonColors.primary.darken(0.3).hex(),
  primary40: CommonColors.primary.darken(0.4).hex(),
  primary30: CommonColors.primary.darken(0.5).hex(),
  primary20: CommonColors.primary.darken(0.6).hex(),
  primary10: CommonColors.primary.darken(0.7).hex(),
  primary0: 'rgba(0, 0, 0, 1)',
  secondary100: CommonColors.secondary.lighten(0.4).hex(),
  secondary99: CommonColors.secondary.lighten(0.3).hex(),
  secondary95: CommonColors.secondary.lighten(0.2).hex(),
  secondary90: CommonColors.secondary.lighten(0.1).hex(),
  secondary80: CommonColors.secondary.hex(),
  secondary70: CommonColors.secondary.darken(0.1).hex(),
  secondary60: CommonColors.secondary.darken(0.2).hex(),
  secondary50: CommonColors.secondary.darken(0.3).hex(),
  secondary40: CommonColors.secondary.darken(0.4).hex(),
  secondary30: CommonColors.secondary.darken(0.5).hex(),
  secondary20: CommonColors.secondary.darken(0.6).hex(),
  secondary10: CommonColors.secondary.darken(0.7).hex(),
  secondary0: 'rgba(0, 0, 0, 1)',
  tertiary100: 'rgba(255, 255, 255, 1)',
  tertiary99: 'rgba(255, 251, 250, 1)',
  tertiary95: 'rgba(255, 236, 241, 1)',
  tertiary90: 'rgba(255, 216, 228, 1)',
  tertiary80: 'rgba(239, 184, 200, 1)',
  tertiary70: 'rgba(210, 157, 172, 1)',
  tertiary60: 'rgba(181, 131, 146, 1)',
  tertiary50: 'rgba(152, 105, 119, 1)',
  tertiary40: 'rgba(125, 82, 96, 1)',
  tertiary30: 'rgba(99, 59, 72, 1)',
  tertiary20: 'rgba(73, 37, 50, 1)',
  tertiary10: 'rgba(49, 17, 29, 1)',
  tertiary0: 'rgba(0, 0, 0, 1)',
  neutral100: BaseColors.neutral.lighten(1.8).hex(),
  neutral95: BaseColors.neutral.lighten(1.7).hex(),
  neutral90: BaseColors.neutral.lighten(1.6).hex(),
  neutral85: BaseColors.neutral.lighten(1.5).hex(),
  neutral80: BaseColors.neutral.lighten(1.4).hex(),
  neutral75: BaseColors.neutral.lighten(1.3).hex(),
  neutral70: BaseColors.neutral.lighten(1.2).hex(),
  neutral65: BaseColors.neutral.lighten(1.1).hex(),
  neutral60: BaseColors.neutral.lighten(1).hex(),
  neutral55: BaseColors.neutral.lighten(0.9).hex(),
  neutral50: BaseColors.neutral.lighten(0.8).hex(),
  neutral45: BaseColors.neutral.lighten(0.7).hex(),
  neutral40: BaseColors.neutral.lighten(0.6).hex(),
  neutral35: BaseColors.neutral.lighten(0.5).hex(),
  neutral30: BaseColors.neutral.lighten(0.4).hex(),
  neutral25: BaseColors.neutral.lighten(0.3).hex(),
  neutral20: BaseColors.neutral.lighten(0.2).hex(),
  neutral15: BaseColors.neutral.lighten(0.1).hex(),
  neutral10: BaseColors.neutral.hex(),
  neutral5: BaseColors.neutral.darken(0.1).hex(),
  neutral0: 'rgba(0, 0, 0, 1)',
  neutralVariant100: 'rgba(255, 255, 255, 1)',
  neutralVariant99: 'rgba(255, 251, 254, 1)',
  neutralVariant95: 'rgba(245, 238, 250, 1)',
  neutralVariant90: 'rgba(231, 224, 236, 1)',
  neutralVariant80: 'rgba(202, 196, 208, 1)',
  neutralVariant70: 'rgba(174, 169, 180, 1)',
  neutralVariant60: 'rgba(147, 143, 153, 1)',
  neutralVariant50: 'rgba(121, 116, 126, 1)',
  neutralVariant40: 'rgba(96, 93, 102, 1)',
  neutralVariant30: 'rgba(73, 69, 79, 1)',
  neutralVariant20: 'rgba(50, 47, 55, 1)',
  neutralVariant10: 'rgba(29, 26, 34, 1)',
  neutralVariant0: 'rgba(0, 0, 0, 1)',
  error100: CommonColors.error.lighten(0.4).hex(),
  error99: CommonColors.error.lighten(0.3).hex(),
  error95: CommonColors.error.lighten(0.2).hex(),
  error90: CommonColors.error.lighten(0.1).hex(),
  error80: CommonColors.error.hex(),
  error70: CommonColors.error.darken(0.1).hex(),
  error60: CommonColors.error.darken(0.2).hex(),
  error50: CommonColors.error.darken(0.3).hex(),
  error40: CommonColors.error.darken(0.4).hex(),
  error30: CommonColors.error.darken(0.5).hex(),
  error20: CommonColors.error.darken(0.6).hex(),
  error10: CommonColors.error.darken(0.7).hex(),
  error0: 'rgba(0, 0, 0, 1)',
};

const typeface = {
  brandRegular: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }),
  weightRegular: '400' as Font['fontWeight'],

  plainMedium: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif-medium',
  }),
  weightMedium: '500' as Font['fontWeight'],
};

const opacity = {
  level1: 0.08,
  level2: 0.12,
  level3: 0.16,
  level4: 0.38,
};

const Theme: CustomTheme = {
  dark: true,
  roundness: 4,
  mode: 'adaptive',
  version: 3,
  isV3: true,
  colors: {
    palette,
    text: BaseColors.text.hex(),
    textMuted: BaseColors.text.darken(0.3).hex(),
    primary: palette.primary80,
    primaryContainer: palette.primary30,
    secondary: palette.secondary80,
    secondaryContainer: palette.secondary30,
    tertiary: palette.tertiary80,
    tertiaryContainer: palette.tertiary30,
    surface: palette.neutral10,
    surfaceVariant: palette.neutralVariant30,
    surfaceDisabled: Color(palette.neutral90)
      .alpha(opacity.level2)
      .rgb()
      .string(),
    background: palette.neutral10,
    error: palette.error80,
    errorContainer: palette.error30,
    onPrimary: BaseColors.text.hex(),
    onPrimaryContainer: BaseColors.text.hex(),
    onSecondary: BaseColors.text.hex(),
    onSecondaryContainer: BaseColors.text.hex(),
    onTertiary: BaseColors.text.hex(),
    onTertiaryContainer: BaseColors.text.hex(),
    onSurface: BaseColors.text.hex(),
    onSurfaceVariant: BaseColors.text.hex(),
    onSurfaceDisabled: BaseColors.text.alpha(opacity.level4).rgb().string(),
    onError: BaseColors.text.hex(),
    onErrorContainer: BaseColors.text.hex(),
    onBackground: BaseColors.text.hex(),
    outline: palette.neutralVariant60,
    outlineVariant: palette.neutralVariant30,
    inverseSurface: palette.neutral90,
    inverseOnSurface: palette.neutral20,
    inversePrimary: palette.primary40,
    shadow: palette.neutral0,
    scrim: palette.neutral0,
    backdrop: Color(palette.neutralVariant20).alpha(0.4).rgb().string(),
    elevation: {
      level0: 'transparent',
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      // Opaque color values generated with `palette.primary80` used as background
      level1: 'rgb(37, 35, 42)', // palette.primary80, alpha 0.05
      level2: 'rgb(44, 40, 49)', // palette.primary80, alpha 0.08
      level3: 'rgb(49, 44, 56)', // palette.primary80, alpha 0.11
      level4: 'rgb(51, 46, 58)', // palette.primary80, alpha 0.12
      level5: 'rgb(52, 49, 63)', // palette.primary80, alpha 0.14
    },
  },
  fonts: configureFonts(), // TODO: add typeface
  animation: {
    scale: 1.0,
  },
};

export default Theme;