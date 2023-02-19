import React from "react";
import { Dimensions, ScrollView } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../components/Container";
import { DomainContext } from "../stores/DomainStore";

const { width, height } = Dimensions.get("window");

function ThemeOverview() {
	const theme = useTheme();
	const domain = React.useContext(DomainContext);
	const items: JSX.Element[] = [];

	const process = (obj: any, key: string) => {
		let bgKey: string;
		let colorKey: string | null = null;

		if (key.startsWith("on")) {
			colorKey = key;
			bgKey = key.slice(2);
			bgKey = bgKey.substring(0, 1).toLowerCase() + bgKey.substring(1);
		} else {
			bgKey = key;
		}

		const item = (
			<Container
				key={key}
				style={{
					backgroundColor: obj[bgKey],
					width: width / 4,
					height: height / 4,
					justifyContent: "center",
					alignItems: "center",
					borderStyle: "solid",
					borderColor: "black",
					borderWidth: 2,
				}}
			>
				<Text
					style={{
						color: colorKey ? obj[colorKey] : undefined,
					}}
				>
					{key}
				</Text>
			</Container>
		);

		items.push(item);
	};

	Object.keys(theme.colors).forEach((key) => {
		if (typeof (theme.colors as any)[key] === "object") {
			if (key == "elevation") return;
			Object.keys((theme.colors as any)[key]).forEach((subKey) => {
				process((theme.colors as any)[key], subKey);
			});
		} else {
			process(theme.colors, key);
		}
	});

	const rows = [];
	for (let i = 0; i < items.length; i += 4) {
		const row = items.slice(i, i + 4);
		const rowElem = (
			<Container
				flexOne
				key={i}
				row
				style={{ justifyContent: "space-evenly", width: "100%" }}
			>
				{row}
			</Container>
		);

		rows.push(rowElem);
	}

	return (
		<Container flexOne element={SafeAreaView}>
			<Container
				flexOne
				style={{
					backgroundColor: theme.colors.background,
					position: "absolute",
					right: 20,
					top: 20,
					zIndex: 100,
				}}
			>
				<Button onPress={domain.toggleDarkTheme}>Switch Theme</Button>
			</Container>
			<ScrollView
				contentContainerStyle={{
					backgroundColor: theme.colors.background,
				}}
			>
				{rows}
			</ScrollView>
		</Container>
	);
}

export default ThemeOverview;
