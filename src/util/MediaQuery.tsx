import { useWindowDimensions } from "react-native";

export function useDesktop() {
	return useWindowDimensions().width > 801;
}
