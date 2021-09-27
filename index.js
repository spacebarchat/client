/**
 * @format
 */

// import { setJSExceptionHandler, getJSExceptionHandler } from "react-native-exception-handler";
// import { setNativeExceptionHandler } from "react-native-exception-handler";

// const exceptionhandler = (error, isFatal) => {
// 	console.error(error, isFatal);
// };
// setNativeExceptionHandler(exceptionhandler, true);
// setJSExceptionHandler(exceptionhandler, true);

import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./src/app.json";
import { NativeModules } from "react-native";
NativeModules.DevSettings.setIsSecondaryClickToShowDevMenuEnabled?.(false);

AppRegistry.registerComponent(appName, () => App);
