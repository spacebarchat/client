import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useAccessibilityInfo() {
	const [reduceMotion, setreduceMotion] = useState(false);
	const [screenReader, setscreenReader] = useState(false);
	const [boldText, setboldText] = useState(false);
	const [grayScale, setgrayScale] = useState(false);
	const [invertColors, setinvertColors] = useState(false);
	const [reduceTransparency, setreduceTransparency] = useState(false);

	useEffect(() => {
		const reduceMotionChanged = AccessibilityInfo.addEventListener("reduceMotionChanged", (x) => setreduceMotion(x));
		const screenReaderChanged = AccessibilityInfo.addEventListener("screenReaderChanged", (x) => setscreenReader(x));
		const reduceTransparencyChanged = AccessibilityInfo.addEventListener("reduceTransparencyChanged", (x) => setreduceTransparency(x));
		const grayScaleChanged = AccessibilityInfo.addEventListener("grayscaleChanged", (x) => setgrayScale(x));
		const invertColorsChanged = AccessibilityInfo.addEventListener("invertColorsChanged", (x) => setinvertColors(x));
		const boldTextChanged = AccessibilityInfo.addEventListener("reduceTransparencyChanged", (x) => setboldText(x));

		AccessibilityInfo.isReduceMotionEnabled?.().then((x) => setreduceMotion(x));
		AccessibilityInfo.isScreenReaderEnabled?.().then((x) => setscreenReader(x));
		AccessibilityInfo.isBoldTextEnabled?.().then((x) => setboldText(x));
		AccessibilityInfo.isGrayscaleEnabled?.().then((x) => setgrayScale(x));
		AccessibilityInfo.isInvertColorsEnabled?.().then((x) => setinvertColors(x));
		AccessibilityInfo.isReduceTransparencyEnabled?.().then((x) => setreduceTransparency(x));

		return () => {
			reduceMotionChanged.remove();
			screenReaderChanged.remove();
			reduceTransparencyChanged.remove();
			grayScaleChanged.remove();
			boldTextChanged.remove();
			invertColorsChanged.remove();
		};
	}, []);

	return {
		reduceMotion,
		screenReader,
		boldText,
		grayScale,
		invertColors,
		reduceTransparency,
	};
}
