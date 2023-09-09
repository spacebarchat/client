// https://github.com/revoltchat/revite/blob/master/src/lib/isTouchscreenDevice.ts

import { isDesktop, isMobile, isTablet } from "react-device-detect";

export const isTouchscreenDevice =
	isDesktop || isTablet ? false : (typeof window !== "undefined" ? navigator.maxTouchPoints > 0 : false) || isMobile;
