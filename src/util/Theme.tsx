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

function matchSelection(stack: Selector[], selection: Selector[]): boolean {
	if (selection.length > stack.length) return false; // rule can't match as the selector is longer as the real component path
	// component matches selection and parent path -> return true
	if (selection.length === 0) return true;

	for (const [selectionI, selector] of selection.entries()) {
		for (const [parentI, parent] of stack.entries()) {
			if (selectionI > stack.length) break;
			// check if any parent matches the selection
			if (!matchSelector(parent, selector)) continue; // didn't match -> skip
			return matchSelection(stack.slice(parentI + 1), selection.slice(selectionI + 1)); // parent matched path -> check further
		}
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

	const tag = type.replace("RCT", "").toLowerCase();
	props.className += " " + tag;
	const stack = useContext(ComponentStack);
	const classes = props.className?.split(" ") || [];
	const element = { tag, classes, id: props.id };
	const newStack = [...stack, element];

	console.log(tag);

	// check recursivly if the selection path matches any parent path combinaten
	const style = theme
		.filter((rule) => rule.selectors?.some((selection) => matchSelection(newStack, selection)))
		.map((x) => x.declarations)
		.reverse()
		.reduce((value, total) => ({ ...total, ...value }), {});

	return R(ComponentStack.Provider, { value: newStack }, R(type, { ...props, style: { ...style, ...props?.style } }, ...children));
}

// prevent override on web and recursion on hot reloading
if (R.name === "createElementWithValidation") {
	if (Platform.OS === "web") {
		// @ts-ignore
		React.createElement = function (type: any, props: any, ...children: ReactNode[]) {
			if (!props) props = {};
			if (!props.className) props.className = "";
			if (type?.render?.displayName) {
				props.className += " " + type.render.displayName.toLowerCase();
			}
			console.log(type, props);
			return R(type, props, ...children);
		};
	} else {
		// @ts-ignore
		React.createElement = function (type: any, props: any, ...children: ReactNode[]) {
			if (typeof type !== "string") return R(type, props, ...children);

			return R(StyleProxy.bind(null, type, props, children));
		};
	}
}
