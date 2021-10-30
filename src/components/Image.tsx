import React from "react";
import { Image, ImageProps as P, Platform } from "react-native";

export interface ImageProps extends P {
	source: any;
}

export default function (props: ImageProps) {
	return <Image {...props} source={Platform.OS === "web" ? { uri: props.source } : props.source}></Image>;
}
