import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useSafeAreaStyle() {
	const x = useSafeAreaInsets();
	return { paddingBottom: x.bottom, paddingTop: x.top, paddingLeft: x.left, paddingRight: x.right };
}
