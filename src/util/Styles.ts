import { useMediaQuery } from "native-base";
import { Dimensions } from "react-native";
import StyleSheet from "react-native-media-query";

const { styles } = StyleSheet.create({
	flex: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
	},
	h100: {
		height: "100%",
	},
	container: {
		paddingRight: 15,
		paddingLeft: 15,
		marginRight: "auto",
		marginLeft: "auto",
		width: "100%",
		height: "100%",
		"@media (min-width: 768px)": {
			width: 750,
		},
		"@media (min-width: 992px)": {
			width: 970,
		},
		"@media (min-width: 1200px)": {
			width: 1170,
		},
	},
});
export default styles;

export function relativeScreenHeight(percentage: number) {
	return Dimensions.get("screen").height * (percentage / 100);
}

export function relativeScreenWidth(percentage: number) {
	return Dimensions.get("screen").width * (percentage / 100);
}

export function useMobile() {
	return useMediaQuery({ maxWidth: 480 })[0];
}

export function useTablet() {
	return useMediaQuery({ minWidth: 481, maxWidth: 801 })[0];
}

export function useDesktop() {
	return useMediaQuery({ minWidth: 1200 })[0];
}
