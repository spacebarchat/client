/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamsList } from "../types";

const linking: LinkingOptions<RootStackParamsList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Channels: {
        screens: {
          Channel: "channels/:guildId/:channelId?",
        },
      },
      Login: "login",
      Register: "register",
      Modal: "modal",
      ThemeOverview: "dev-theme-overview",
      Settings: "settings",
      NotFound: "*",
    },
  },
};

export default linking;
