import { parseCSS, preDeclarations } from "./CSSToRN";
import React, { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Image, Platform, useColorScheme, useWindowDimensions } from "react-native";
import { Rules, Selector } from "./CSSToRN";
import { useAccessibilityInfo } from "./useAccessibilityInfo";
import { useOrientation } from "./useOrientation";
// @ts-ignore
import FosscordTheme from "../assets/themes/fosscord.css";
import { matchQuery } from "./MediaQuery";
import { useDispatch, useSelector } from "react-redux";
import themes from "../reducers/themes";

(global as any).themeCache = [];

export const ThemeContext = React.createContext<Rules[]>([]);
export const ComponentStack = React.createContext<Selector[]>([]);

const CSS_VARIABLE = /var\(([\w-]+)\)/;
let wasHotReloaded = false;

export function Theme(props: { children: ReactNode }) {
	const dispatch = useDispatch();
	const { width, height, fontScale, scale } = useWindowDimensions();
	const orientation = useOrientation();
	const colorScheme = "dark" || useColorScheme();
	const accessibilityInfo = useAccessibilityInfo();
	// TODO: suspense show spinning icon (only after a delay to prevent short flashes)

	function refetch() {
		if (typeof FosscordTheme === "object") return;
		fetch(Image.resolveAssetSource(FosscordTheme).uri)
			.then((x) => x.text())
			.then((x) => {
				const start = Date.now();
				(global as any).themeCache = parseCSS(x);
				// console.log("theme parsing took " + (Date.now() - start) + "ms");
				calculateTheme();
				// console.warn("wasHotReloaded");
			});
	}

	if (!wasHotReloaded) {
		wasHotReloaded = true;
		refetch();
	}

	useEffect(() => {
		refetch();
	}, []);

	function calculateTheme() {
		let temp: Rules[] = [];
		let themeCache = (global as any).themeCache as Rules[];
		themeCache.forEach((x) => {
			if (x.type !== "media") return true;
			if (
				matchQuery(x.media, {
					type: "screen",
					width,
					height,
					"device-width": width,
					"device-height": height,
					orientation,
					"prefers-color-scheme": colorScheme,
					"prefers-reduced-motion": accessibilityInfo.reduceMotion,
					"prefers-reduced-transparency": accessibilityInfo.reduceTransparency,
				})
			) {
				// @ts-ignore
				temp = temp.concat(x.rules);
			} else {
			}
		});
		temp = temp.concat(themeCache.filter((x) => x.type !== "media"));

		// update css variables that are in media queries
		temp = temp
			.sort((a, b) => {
				if (a.selectors?.find((s) => s.find((b) => b.tag === ":root"))) return -1;
				if (b.selectors?.find((s) => s.find((b) => b.tag === ":root"))) return 1;
				return 0;
			})
			.map((r, i) => {
				let rule = { ...r, declarations: { ...r.declarations } };
				Object.entries(rule.declarations || {})?.forEach(([key, value]) => {
					if (key.startsWith("--")) {
						preDeclarations[key] = value;
					} else if (typeof value === "string" && value.includes("var(")) {
						const match = value.match(CSS_VARIABLE);
						if (!match) return;
						rule.declarations[key] = value.replace(CSS_VARIABLE, preDeclarations[match[1]]);
					}
				});
				return rule;
			});

		// console.log("final computed theme:", temp, (global as any).themeCache);
		(global as any).theme = temp;

		dispatch(themes.set(temp));
	}

	useEffect(() => {
		// console.warn("recalculate");
		calculateTheme();
	}, [orientation, colorScheme, width, height]);

	return <>{props.children}</>;
}

const R = React.createElement;

function matchSelector(node: Selector, selector: Selector) {
	if (!node || !selector) return false;

	if (node.id === selector.id && selector.id) return true;
	if ((node.tag === selector.tag && selector.tag) || selector.tag === "*") return true;
	if (node.classes?.some((x) => selector.classes?.includes(x))) return true;

	return false;
}

function getTagName(tag: string) {
	if (!tag) return "";
	if ((tag as any)?.displayName) tag = (tag as any).displayName;
	if (typeof tag === "object") return "";

	return tag.toLowerCase().replace("rct", "").replace("virtualtext", "text").replace("textinput", "input").replace("rnc", "");
}

// force skip is used for > css operators and to skip if the next element does not match it
// function matchSelection(stack: Selector[], selection: Selector[], forceSkip?: boolean): boolean {
// 	if (selection.length > stack.length) {
// 		// rule can't match as the selector is longer as the real component path
// 		return false;
// 	}
// 	if (selection.length === 0 && stack.length === 0) {
// 		// component matches selection and parent path -> return true
// 		return true;
// 	}

// 	const i = selection[1]?.tag === ">" ? 1 : 0;
// 	const selector = selection[0];
// 	if (!selector) return false;

// 	for (const [parentI, parent] of stack.entries()) {
// 		// selection is bigger than actual component path -> abort
// 		if (selection.length - i > stack.length) return false;

// 		// check if any parent matches the selection
// 		if (!matchSelector(parent, selector)) {
// 			if (forceSkip) return false;
// 			continue;
// 		}
// 		if (forceSkip && selection.length !== stack.length) {
// 			return false;
// 		}

// 		if (selection.length - i <= 1 && stack.length <= 1) {
// 			// console.log("matched | " + parent.classes?.join(".") + " | " + selector.classes?.join("."));
// 		}

// 		// parent matched path -> check further | early return to skip unecessary checks
// 		if (matchSelection(stack.slice(parentI + 1), selection.slice(i + 1), i === 1)) return true;
// 	}

// 	return false;
// }

function StyleProxy(type: string, props: any, children: ReactNode[]) {
	if (!props) props = {};
	if (!props.className) props.className = "";

	var theme = [] as Rules[];
	try {
		theme = useSelector((s: any) => s.themes) as Rules[];
	} catch (error) {}

	const tag = getTagName(type);
	const className = props.className + " " + tag;
	const classes = className?.split(" ") || [];
	const element = { tag, classes, id: props.id };
	const start = Date.now();

	// console.log("_________________");
	// TODO: use react memo
	// check recursivly if the selection path matches any parent path combinaten
	// console.log("styling took " + (Date.now() - start) + "ms");
	// console.log(newStack.map((x) => x.classes.join(".")).join(" -> "), style);

	// @ts-ignore

	const style = theme
		.filter((rule) => rule.selectors?.some((selectors) => matchSelector(selectors[0], element)))
		.map((x) => x.declarations)
		.reverse()
		.reduce((value, total) => ({ ...total, ...value }), {});

	console.log("use theme for", classes.join("."), style);

	return R(type, { ...props, style: { ...style, ...props?.style }, className }, ...children);
}

// setting this in react-app-env.d.ts doesn't work
declare module "react" {
	interface Attributes {
		className?: string;
	}
}

declare module "react-native" {
	interface ViewProps {
		className?: string;
	}
}

// prevent override on web and recursion on hot reloading
if (R.name === "createElementWithValidation") {
	if (Platform.OS === "web") {
		// @ts-ignore
		React.createElement = function (type: any, props: any, ...children: ReactNode[]) {
			if (!props) props = {};
			if (type?.render?.displayName && type?.render?.displayName !== "awd") {
				if (!props.className) props.className = "";
				props.className += " " + getTagName(type.render.displayName);
			}
			return R(type, props, ...children);
		};
	} else {
		// @ts-ignore
		React.createElement = function (type: any, props: any, ...children: ReactNode[]) {
			var forward = false;
			try {
				forward = Symbol.keyFor(type?.["$$typeof"]) === "react.forward_ref" && type.displayName === "View";
			} catch (error) {}

			if (
				(typeof type !== "string" && !forward) ||
				type === "RCTSinglelineTextInputView" ||
				// type == "RCTVirtualText" ||
				type == "RCTScrollContentView" ||
				type == "RCTScrollView"
			) {
				return R(type, props, ...children);
			}

			// console.log("create", type.displayName, type, props, children);

			return R(StyleProxy.bind(null, type, props, children));
		};
	}
}
