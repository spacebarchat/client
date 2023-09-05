// context to handle banner open/close state

import { MotionStyle } from "framer-motion";
import React from "react";

export interface BannerContent {
	element: React.ReactNode;
	style?: MotionStyle;
	forced?: boolean;
}

export type BannerContextType = {
	content?: BannerContent;
	setContent: React.Dispatch<React.SetStateAction<BannerContent | undefined>>;
	close: () => void;
};

// @ts-expect-error not specifying a default value here
export const BannerContext = React.createContext<BannerContextType>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BannerContextProvider: React.FC<any> = ({ children }) => {
	const [content, setContent] = React.useState<BannerContent>();

	const close = () => {
		// clear content
		setContent(undefined);
	};

	return <BannerContext.Provider value={{ content, setContent, close }}>{children}</BannerContext.Provider>;
};
