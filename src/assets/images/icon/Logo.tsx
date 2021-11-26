import React from "react";
import { Platform, Text, View, ViewProps } from "react-native";
// import Svg, { Path, SvgProps } from "react-native-svg";
import Image from "../../../components/Image";
import FosscordLogo from "./icon.svg";
import FosscordLogoWhite from "./icon_white.svg";

export default function Logo(props: ViewProps & { fontSize?: number; width?: number; color?: string; style?: any }) {
	return (
		<View
			{...props}
			className="logo"
			style={{
				backgroundColor: "transparent",
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				...props.style,
				width: undefined,
			}}
		>
			<Image
				style={{ width: props.width || 50, height: props.width || 50 }}
				source={props.color === "white" ? FosscordLogoWhite : FosscordLogo}
			/>
			<Text style={{ fontSize: props.fontSize || 50, marginLeft: 30, color: props.color }}>Fosscord</Text>
		</View>
	);
}
