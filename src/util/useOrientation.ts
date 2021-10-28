import { useWindowDimensions } from "react-native";

export function useOrientation() {
	const { width, height } = useWindowDimensions();

	return height >= width ? "portrait" : "landscape";
}
