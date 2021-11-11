require("react-native-gesture-handler");
import { AppRegistry, Platform } from "react-native";
import App from "./src/App";
import { name as appName } from "./src/app.json";

AppRegistry.registerComponent(appName, () => App);
