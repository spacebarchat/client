import parse from "./css";
import transform from "css-to-react-native";
import { PixelRatio } from "react-native";
import { toPx } from "./MediaQuery";

const SPLIT_CSS = /(?=[.#])/g;

export interface Rule {
	/** The list of selectors of the rule, split on commas. Each selector is trimmed from whitespace and comments. */
	selectors?: Array<string>;
	/** Array of nodes with the types declaration and comment. */
	declarations?: Array<
		| {
				/** The property name, trimmed from whitespace and comments. May not be empty. */
				property?: string;
				/** The value of the property, trimmed from whitespace and comments. Empty values are allowed. */
				value?: string;
		  }
		| {
				comment?: string;
		  }
	>;
	type?: string;
	/** A reference to the parent node, or null if the node has no parent. */
	parent?: Rule;
	/** Information about the position in the source string that corresponds to the node. */
	position?: {
		start?: Position;
		end?: Position;
		/** The value of options.source if passed to css.parse. Otherwise undefined. */
		source?: string;
		/** The full source string passed to css.parse. */
		content?: string;
	};
}

export interface Position {
	line?: number;
	column?: number;
}

export interface Selector {
	tag?: string;
	id?: string;
	classes?: string[];
}

export interface Rules {
	selectors?: Selector[][];
	declarations?: Record<string, string | number>;
	rules?: Rule[];
	media?: string;
	type: string;
}

const CSS_VARIABLE = /var\(([\w-]+)\)/;
const preDeclarations: any = {}; // used for :root css variables

function handleRule(rule: Rule): Rules | undefined {
	// @ts-ignore
	if (!rule) return;
	const type = rule.type as string;
	if (type !== "rule") {
		if (type !== "media") return;

		return {
			type: "media",
			// @ts-ignore
			media: rule.media,
			// @ts-ignore
			rules: rule.rules.map(handleRule),
		};
	}
	const selectors: Selector[][] = [];
	const declarationsArray: [string, string][] = [];

	rule.declarations?.forEach((decl: any) => {
		if (!decl.property || !decl.value) return;
		if (decl.property.startsWith("--")) {
			console.log("set css variable", decl);
			preDeclarations[decl.property] = decl.value;
			return;
		} else if (decl.value?.startsWith("var(")) {
			const [_, val] = decl.value.match(CSS_VARIABLE);
			console.log("css variable", val, decl.value, preDeclarations[val]);
			decl.value = preDeclarations[val];
		}

		declarationsArray.push([decl.property, decl.value?.replace("!important", "")?.trim()]);
	});

	const declarations = transform(declarationsArray) as Record<string, string>;

	rule.selectors?.forEach((selector: string) => {
		const sel: Selector[] = [];
		selector.split(" ").forEach((element) => {
			var tag = undefined;
			var id = undefined;
			var classes: string[] = [];

			element.split(SPLIT_CSS).forEach((part) => {
				if (part.startsWith(".")) {
					classes.push(part.slice(1));
				} else if (part.startsWith("#")) {
					id = part.slice(1);
				} else {
					tag = part;
				}
			});
			sel.push({ tag, id, classes });
		});
		selectors.push(sel);
	});

	return { selectors, declarations, type: type };
}

export function parseCSS(str: string): Rules[] {
	if (!str || typeof str !== "string") return [];
	const { stylesheet } = parse(str, { silent: true });
	if (!stylesheet) return [];

	const rules: Rules[] = stylesheet.rules
		.sort((a: any, b: any) => {
			if (a.selectors?.includes(":root")) return -1;
			if (b.selectors?.includes(":root")) return 1;
			if (a.rules?.[0]?.selectors?.includes(":root")) return -1;
			if (b.rules?.[0]?.selectors?.includes(":root")) return 1;

			return 0;
		})
		.map((r: Rule) => handleRule(r));
	console.log(rules);

	return rules;
}

export interface Position {
	line?: number;
	column?: number;
}

export interface Selector {
	tag?: string;
	id?: string;
	classes?: string[];
}

export interface Rules {
	selectors?: Selector[][];
	declarations?: Record<string, string | number>;
	rules?: Rule[];
	media?: string;
	type: string;
}
