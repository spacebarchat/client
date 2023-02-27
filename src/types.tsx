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
  App: undefined;
  Channels: NavigatorScreenParams<ChannelsParamList> | undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Modal: undefined;
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
  primary99: string;
  primary95: string;
  primary90: string;
  primary80: string;
  primary70: string;
  primary60: string;
  primary50: string;
  primary40: string;
  primary30: string;
  primary20: string;
  primary10: string;
  primary0: string;
  secondary100: string;
  secondary99: string;
  secondary95: string;
  secondary90: string;
  secondary80: string;
  secondary70: string;
  secondary60: string;
  secondary50: string;
  secondary40: string;
  secondary30: string;
  secondary20: string;
  secondary10: string;
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
  neutral100: string;
  neutral95: string;
  neutral90: string;
  neutral85: string;
  neutral80: string;
  neutral75: string;
  neutral70: string;
  neutral65: string;
  neutral60: string;
  neutral55: string;
  neutral50: string;
  neutral45: string;
  neutral40: string;
  neutral35: string;
  neutral30: string;
  neutral25: string;
  neutral20: string;
  neutral15: string;
  neutral10: string;
  neutral5: string;
  neutral0: string;
  neutralVariant100: string;
  neutralVariant99: string;
  neutralVariant95: string;
  neutralVariant90: string;
  neutralVariant80: string;
  neutralVariant70: string;
  neutralVariant60: string;
  neutralVariant50: string;
  neutralVariant40: string;
  neutralVariant30: string;
  neutralVariant20: string;
  neutralVariant10: string;
  neutralVariant0: string;
  error100: string;
  error99: string;
  error95: string;
  error90: string;
  error80: string;
  error70: string;
  error60: string;
  error50: string;
  error40: string;
  error30: string;
  error20: string;
  error10: string;
  error0: string;
  status_online_100: string;
  status_online_99: string;
  status_online_95: string;
  status_online_90: string;
  status_online_80: string;
  status_online_70: string;
  status_online_60: string;
  status_online_50: string;
  status_online_40: string;
  status_online_30: string;
  status_online_20: string;
  status_online_10: string;
  status_online_0: string;
  status_offline_100: string;
  status_offline_99: string;
  status_offline_95: string;
  status_offline_90: string;
  status_offline_80: string;
  status_offline_70: string;
  status_offline_60: string;
  status_offline_50: string;
  status_offline_40: string;
  status_offline_30: string;
  status_offline_20: string;
  status_offline_10: string;
  status_offline_0: string;
  status_dnd_100: string;
  status_dnd_99: string;
  status_dnd_95: string;
  status_dnd_90: string;
  status_dnd_80: string;
  status_dnd_70: string;
  status_dnd_60: string;
  status_dnd_50: string;
  status_dnd_40: string;
  status_dnd_30: string;
  status_dnd_20: string;
  status_dnd_10: string;
  status_dnd_0: string;
  status_idle_100: string;
  status_idle_99: string;
  status_idle_95: string;
  status_idle_90: string;
  status_idle_80: string;
  status_idle_70: string;
  status_idle_60: string;
  status_idle_50: string;
  status_idle_40: string;
  status_idle_30: string;
  status_idle_20: string;
  status_idle_10: string;
  status_idle_0: string;
  status_streaming_100: string;
  status_streaming_99: string;
  status_streaming_95: string;
  status_streaming_90: string;
  status_streaming_80: string;
  status_streaming_70: string;
  status_streaming_60: string;
  status_streaming_50: string;
  status_streaming_40: string;
  status_streaming_30: string;
  status_streaming_20: string;
  status_streaming_10: string;
  status_streaming_0: string;
}

export interface CustomMD3Colors extends MD3Colors {
  text: string;
  textMuted: string;
}

export type CustomTheme = ThemeBase & {
  version: 3;
  isV3: true;
  colors: CustomMD3Colors & {palette: ColorPalette};
  fonts: MD3Typescale;
};
