/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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
  Home: undefined;
  Channel: { id: string };
};

export type ChannelsStackScreenProps<Screen extends keyof ChannelsParamList> =
  NativeStackScreenProps<ChannelsParamList, Screen>;

declare module "react-native" {
  interface PlatformStatic {
    isDesktop?: boolean;
    isMobile?: boolean;
    isWeb?: boolean;
  }
}
