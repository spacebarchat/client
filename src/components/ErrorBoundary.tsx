import React from "react";
import { Button, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeModules } from "react-native";

export class ErrorBoundary extends React.Component {
	state: any;

	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: any) {
		console.error(error);
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	componentDidCatch(error: any, errorInfo: any) {
		// You can also log the error to an error reporting service
		console.error(error, errorInfo);
	}

	render = () => {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<SafeAreaView style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "white" }}>
					<ScrollView style={{ flexGrow: 1 }}>
						<Text style={{ fontSize: 20, color: "red" }}>Something went wrong.</Text>
						<Text style={{ fontSize: 20, color: "black" }}>{this.state.error?.toString()}</Text>
						<Text>StackTrace:</Text>
						<Text style={{ fontSize: 10 }}>{this.state.error?.componentStack}</Text>
					</ScrollView>

					<Button
						title="Reload"
						onPress={() => {
							// @ts-ignore
							NativeModules?.DevSettings?.reload?.() || globalThis?.location?.reload?.();
						}}
					/>
				</SafeAreaView>
			);
		}

		return this.props.children;
	};
}
