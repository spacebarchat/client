// https://github.com/ruvkr/react-components-by-ruvkr/blob/master/src/hooks/useWindowResize.ts

import { useCallback, useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const useWindowResize = (callback: () => void = () => {}, interval = 100) => {
	const resizeTimeout = useRef<NodeJS.Timeout | null>(null);

	const resizeHandler = useCallback(() => {
		if (resizeTimeout.current != null) clearTimeout(resizeTimeout.current);
		resizeTimeout.current = setTimeout(() => {
			resizeTimeout.current = null;
			callback();
		}, interval);
	}, [interval, callback]);

	useEffect(() => {
		window.addEventListener("resize", resizeHandler);
		return () => {
			if (resizeTimeout.current != null) clearTimeout(resizeTimeout.current);
			window.removeEventListener("resize", resizeHandler);
		};
	}, [resizeHandler]);
};
