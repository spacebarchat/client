import React from "react";
import { Text, useWindowDimensions, View, ViewProps } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function Logo(props: SvgProps & { color?: string }) {
	return (
		<View className="waves">
			<Svg viewBox={`0 0 440 220`}>
				<Path
					fill={props.color || "#ff5f00"}
					d="m-43.88489,224l17.06475,-37.3c17.06475,-37.7 51.19424,-111.7 85.32373,-122.7c34.12949,-11 68.25899,43 102.38848,58.7c34.12949,16.3 68.25899,-5.7 102.38848,-32c34.12949,-26.7 68.25899,-58.7 102.38848,-58.7c34.12949,0 68.25899,32 85.32373,48l17.06475,16l0,-96l-17.06475,0c-17.06475,0 -51.19424,0 -85.32373,0c-34.12949,0 -68.25899,0 -102.38848,0c-34.12949,0 -68.25899,0 -102.38848,0c-34.12949,0 -68.25899,0 -102.38848,0c-34.12949,0 -68.25899,0 -85.32373,0l-17.06475,0l0,224z"
				/>
			</Svg>
		</View>
	);
}
