import React from "react";
import { Platform, Text, View, ViewProps } from "react-native";
// import Svg, { Path, SvgProps } from "react-native-svg";
import Image from "../../../components/Image";
import FosscordLogo from "./icon.svg";

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
			{/*
			{Platform.OS === "windows" ? (
			*/}
			<Image style={{ width: props.width || 50, height: props.width || 50 }} source={FosscordLogo} />
			{/* ) : (
				<Svg width={props.width || 50} height={props.width || 50} viewBox="0 0 1778.84 1778.84">
					<Path
						fill={props.color || "#ff5f00"}
						d="M3235.06,1765.51H1748V3544.35A1785,1785,0,0,0,2112.26,3507c690.15-143.63,1233.56-687,1377.19-1377.19a1785,1785,0,0,0,37.36-364.29ZM2112.26,3173.15V2830.41q13.6-7.22,27-14.65a1783.11,1783.11,0,0,0,458.54-364.29H2112.26V2129.8H3142.83C2965.64,2608.58,2588.25,2990.23,2112.26,3173.15Z"
						transform="translate(-1747.97 -1765.51)"
					/>
				</Svg>
			)} */}
			<Text style={{ fontSize: props.fontSize || 50, marginLeft: 30 }}>Fosscord</Text>
		</View>
	);
}
