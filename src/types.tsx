import {Snowflake} from '@puyodead1/fosscord-api-types/v9';
import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  MD3Colors,
  MD3Typescale,
  ThemeBase,
} from 'react-native-paper/lib/typescript/types';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamsList {}
  }
}

export type RootStackParamsList = {
  Splash: undefined;
  Root: undefined;
  App: NavigatorScreenParams<ChannelsParamList> | undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  ThemeOverview: undefined;
  NotFound: undefined;
  Settings: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamsList> =
  NativeStackScreenProps<RootStackParamsList, Screen>;

export type ChannelsParamList = {
  Channel: {guildId: Snowflake; channelId?: Snowflake};
  Settings: undefined;
};

export type ChannelsStackScreenProps<Screen extends keyof ChannelsParamList> =
  NativeStackScreenProps<ChannelsParamList, Screen>;

export type ChannelProps = NativeStackScreenProps<ChannelsParamList, 'Channel'>;
export type ChannelParams = ChannelProps['route'];

declare module 'react-native' {
  interface PlatformStatic {
    isDesktop?: boolean;
    isMobile?: boolean;
    isWeb?: boolean;
    isWindows?: boolean;
  }
}

export type Font = {
  fontFamily: string;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

export type Fonts = {
  regular: Font;
  medium: Font;
  light: Font;
  thin: Font;
};

export interface ColorPalette {
  primary100: string;
  primary95: string;
  primary90: string;
  primary85: string;
  primary80: string;
  primary75: string;
  primary70: string;
  primary65: string;
  primary60: string;
  primary55: string;
  primary50: string;
  primary45: string;
  primary40: string;
  primary35: string;
  primary30: string;
  primary25: string;
  primary20: string;
  primary15: string;
  primary10: string;
  primary5: string;
  primary0: string;
  secondary100: string;
  secondary95: string;
  secondary90: string;
  secondary85: string;
  secondary80: string;
  secondary75: string;
  secondary70: string;
  secondary65: string;
  secondary60: string;
  secondary55: string;
  secondary50: string;
  secondary45: string;
  secondary40: string;
  secondary35: string;
  secondary30: string;
  secondary25: string;
  secondary20: string;
  secondary15: string;
  secondary10: string;
  secondary5: string;
  secondary0: string;
  tertiary100: string;
  tertiary99: string;
  tertiary95: string;
  tertiary90: string;
  tertiary80: string;
  tertiary70: string;
  tertiary60: string;
  tertiary50: string;
  tertiary40: string;
  tertiary30: string;
  tertiary20: string;
  tertiary10: string;
  tertiary0: string;
  background100: string;
  background95: string;
  background90: string;
  background85: string;
  background80: string;
  background75: string;
  background70: string;
  background65: string;
  background60: string;
  background55: string;
  background50: string;
  background45: string;
  background40: string;
  background35: string;
  background30: string;
  background25: string;
  background20: string;
  background15: string;
  background10: string;
  background5: string;
  background0: string;
  backgroundSecondary100: string;
  backgroundSecondary95: string;
  backgroundSecondary90: string;
  backgroundSecondary85: string;
  backgroundSecondary80: string;
  backgroundSecondary75: string;
  backgroundSecondary70: string;
  backgroundSecondary65: string;
  backgroundSecondary60: string;
  backgroundSecondary55: string;
  backgroundSecondary50: string;
  backgroundSecondary45: string;
  backgroundSecondary40: string;
  backgroundSecondary35: string;
  backgroundSecondary30: string;
  backgroundSecondary25: string;
  backgroundSecondary20: string;
  backgroundSecondary15: string;
  backgroundSecondary10: string;
  backgroundSecondary5: string;
  backgroundSecondary0: string;
  error100: string;
  error95: string;
  error90: string;
  error85: string;
  error80: string;
  error75: string;
  error70: string;
  error65: string;
  error60: string;
  error55: string;
  error50: string;
  error45: string;
  error40: string;
  error35: string;
  error30: string;
  error25: string;
  error20: string;
  error15: string;
  error10: string;
  error5: string;
  error0: string;
  green100: string;
  green95: string;
  green90: string;
  green85: string;
  green80: string;
  green75: string;
  green70: string;
  green65: string;
  green60: string;
  green55: string;
  green50: string;
  green45: string;
  green40: string;
  green35: string;
  green30: string;
  green25: string;
  green20: string;
  green15: string;
  green10: string;
  green5: string;
  green0: string;
  gray100: string;
  gray95: string;
  gray90: string;
  gray85: string;
  gray80: string;
  gray75: string;
  gray70: string;
  gray65: string;
  gray60: string;
  gray55: string;
  gray50: string;
  gray45: string;
  gray40: string;
  gray35: string;
  gray30: string;
  gray25: string;
  gray20: string;
  gray15: string;
  gray10: string;
  gray5: string;
  gray0: string;
  red100: string;
  red95: string;
  red90: string;
  red85: string;
  red80: string;
  red75: string;
  red70: string;
  red65: string;
  red60: string;
  red55: string;
  red50: string;
  red45: string;
  red40: string;
  red35: string;
  red30: string;
  red25: string;
  red20: string;
  red15: string;
  red10: string;
  red5: string;
  red0: string;
  yellow100: string;
  yellow95: string;
  yellow90: string;
  yellow85: string;
  yellow80: string;
  yellow75: string;
  yellow70: string;
  yellow65: string;
  yellow60: string;
  yellow55: string;
  yellow50: string;
  yellow45: string;
  yellow40: string;
  yellow35: string;
  yellow30: string;
  yellow25: string;
  yellow20: string;
  yellow15: string;
  yellow10: string;
  yellow5: string;
  yellow0: string;
  purple100: string;
  purple95: string;
  purple90: string;
  purple85: string;
  purple80: string;
  purple75: string;
  purple70: string;
  purple65: string;
  purple60: string;
  purple55: string;
  purple50: string;
  purple45: string;
  purple40: string;
  purple35: string;
  purple30: string;
  purple25: string;
  purple20: string;
  purple15: string;
  purple10: string;
  purple5: string;
  purple0: string;
}

export interface CustomMD3Colors extends MD3Colors {
  text: string;
  textMuted: string;
  selectionBackground: string;
  selectionForeground: string;
  buttons: string;
  disabled: string;
  contrast: string;
  active: string;
  border: string;
  highlight: string;
  tree: string;
  notifications: string;
  accent: string;
  whiteBlack: string;
  link: string;
}

export type CustomTheme = ThemeBase & {
  name: string;
  version: 3;
  isV3: true;
  colors: CustomMD3Colors & {palette: ColorPalette};
  fonts: MD3Typescale;
};
