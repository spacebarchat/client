import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./src/app.json";

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));

// https://github.com/liuhong1happy/react-native-windows-svg
