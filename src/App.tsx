import { Button, NativeBaseProvider } from "native-base";
import React, { useState } from "react";
import { NativeModules } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./util/i18n";

export default function App() {
	return (
		<NativeBaseProvider>
			<SafeAreaView>
				<Button onPress={() => NativeModules.DevMenu.show()}>
					Open Dev tools
				</Button>
			</SafeAreaView>
		</NativeBaseProvider>
	);
}
