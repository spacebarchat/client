import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./src/app.json";
import { NativeModules } from "react-native";
NativeModules?.DevSettings.setIsSecondaryClickToShowDevMenuEnabled?.(false);

AppRegistry.registerComponent(appName, () => App);

if (module.hot) {
	module.hot.accept(["./src/app"], function () {
		const app = require("./src/App")["default"];
		AppRegistry.updateProxy(app);
	});
}
