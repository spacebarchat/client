if (Platform.OS !== "windows" && Platform.OS !== "macos") require("react-native-gesture-handler");
import React from "react";
import { AppRegistry, Platform } from "react-native";
import App from "./src/App";
import { name as appName } from "./src/app.json";

AppRegistry.registerComponent(appName, () => App);
