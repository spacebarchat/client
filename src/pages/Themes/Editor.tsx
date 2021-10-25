import React, { useState } from "react";
import { Box, Button, extendTheme, Heading, Input, KeyboardAvoidingView, NativeBaseProvider, useTheme } from "native-base";
import Styles from "../../util/Styles";
import "missing-native-js-functions";
import { Link } from "../../components/Router";

export default function ThemesEditor() {
	const [theme, setTheme] = useState<any>(useTheme());

	return (
		<KeyboardAvoidingView behavior='padding' style={Styles.h100}>
			<Box safeArea style={[Styles.h100, { alignItems: "center", display: "flex" }]}>
				<Heading>Theme editor</Heading>

				<Input placeholder='color' onChangeText={(val) => setTheme({ colors: { primary: { 500: val } } }.merge(theme))} />

				<NativeBaseProvider theme={extendTheme(theme)}>
					<Button>Test</Button>
				</NativeBaseProvider>
				<Link to='/'>Home</Link>
			</Box>
		</KeyboardAvoidingView>
	);
}
