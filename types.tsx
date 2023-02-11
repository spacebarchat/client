/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Snowflake } from "./interfaces/common";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamsList {}
  }
}

export type RootStackParamsList = {
  App: undefined;
  Channels: NavigatorScreenParams<ChannelsParamList> | undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Modal: undefined;
  ThemeOverview: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamsList> =
  NativeStackScreenProps<RootStackParamsList, Screen>;

export type ChannelsParamList = {
  Channel: { guildId: Snowflake; channelId?: Snowflake };
};

export type ChannelsStackScreenProps<Screen extends keyof ChannelsParamList> =
  NativeStackScreenProps<ChannelsParamList, Screen>;

export type ChannelProps = NativeStackScreenProps<ChannelsParamList, "Channel">;
export type ChannelParams = ChannelProps["route"];

declare module "react-native" {
  interface PlatformStatic {
    isDesktop?: boolean;
    isMobile?: boolean;
    isWeb?: boolean;
  }
}
