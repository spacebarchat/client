import React, { ReactNode, useContext } from "react";
import { Platform } from "react-native";
import { Rules, Selector } from "./CSSToRN";

export const ThemeContext = React.createContext<Rules[]>([]);
export const ComponentStack = React.createContext<Selector[]>([]);

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
	return tag.toLowerCase().replace("rct", "").replace("virtualtext", "text").replace("textinput", "input").replace("rnc", "");
}

// force skip is used for > css operators and to skip if the next element does not match it
function matchSelection(stack: Selector[], selection: Selector[], forceSkip?: boolean): boolean {
	if (selection.length > stack.length) {
		// rule can't match as the selector is longer as the real component path
		return false;
	}
	if (selection.length === 0 && stack.length === 0) {
		// component matches selection and parent path -> return true
		return true;
	}

	const i = selection[1]?.tag === ">" ? 1 : 0;
	const selector = selection[0];
	if (!selector) return false;

	for (const [parentI, parent] of stack.entries()) {
		// selection is bigger than actual component path -> abort
		if (selection.length - i > stack.length) return false;

		// check if any parent matches the selection
		if (!matchSelector(parent, selector)) {
			if (forceSkip) return false;
			continue;
		}
		if (forceSkip && selection.length !== stack.length) {
			return false;
		}

		if (selection.length - i <= 1 && stack.length <= 1) {
			// console.log("matched | " + parent.classes?.join(".") + " | " + selector.classes?.join("."));
		}

		// parent matched path -> check further | early return to skip unecessary checks
		if (matchSelection(stack.slice(parentI + 1), selection.slice(i + 1), i === 1)) return true;
	}

	return false;
}

function StyleProxy(type: string, props: any, children: ReactNode[]) {
	if (!props) props = {};
	if (!props.className) props.className = "";

	const theme = useContext(ThemeContext);
	if (!Array.isArray(theme) || !theme.length) {
		return R(type, props, ...children);
	}

	const tag = getTagName(type);
	props.className += " " + tag;
	const stack = useContext(ComponentStack);
	const classes = props.className?.split(" ") || [];
	const element = { tag, classes, id: props.id };
	const newStack = [...stack, element];
	const start = Date.now();
	// console.log("_________________");

	// TODO: use react memo
	// check recursivly if the selection path matches any parent path combinaten
	const style = theme
		.filter((rule) => rule.selectors?.some((selection) => matchSelection(newStack, selection)))
		.map((x) => x.declarations)
		.reverse()
		.reduce((value, total) => ({ ...total, ...value }), {});

	// console.log("styling took " + (Date.now() - start) + "ms");

	// console.log(newStack.map((x) => x.classes.join(".")).join(" -> "));

	return R(ComponentStack.Provider, { value: newStack }, R(type, { ...props, style: { ...style, ...props?.style } }, ...children));
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
			if (
				typeof type !== "string" ||
				type === "RCTSinglelineTextInputView" ||
				type == "RCTScrollContentView" ||
				type == "RCTVirtualText" ||
				type == "RCTScrollView"
			)
				return R(type, props, ...children);
			// console.log("create", type, props.className);

			return R(StyleProxy.bind(null, type, props, children));
		};
	}
}
