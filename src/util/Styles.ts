import { useWindowDimensions } from "react-native";

export function container() {
	const width = useWindowDimensions().width;
	if (width < 480) return { width: "100%" };
	if (width > 480 && width < 801) return { maxWidth: width, width: "100%" };
	return { maxWidth: 1200, width: "100%" };
}

export function relativeScreenHeight(percentage: number) {
	return useWindowDimensions().height * (percentage / 100);
}

export function relativeScreenWidth(percentage: number) {
	return useWindowDimensions().width * (percentage / 100);
}

export function useMobile() {
	return useWindowDimensions().width < 480;
}

export function useTablet() {
	const width = useWindowDimensions().width;
	return width > 480 && width < 801;
}

export function useDesktop() {
	return useWindowDimensions().width > 1200;
}
