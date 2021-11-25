import React from "react";
import { Image, ImageProps as P, Platform, View } from "react-native";

export interface ImageProps extends P {
	source: any;
}

export default function (props: ImageProps) {
	if (Platform.OS === "web")
		return (
			<View style={{ width: props.width, height: props.height }} {...props}>
				<img style={{ ...(props.style as any), width: "100%", height: "100%" }} src={props.source?.uri || props.source} />
			</View>
		);

	let source = props.source;

	if (typeof source === "string" && source?.startsWith("http")) {
		source = { uri: source };
	}

	return <Image {...props} style={{ height: props.height, width: props.width, ...(props.style as any) }} source={source}></Image>;
}
