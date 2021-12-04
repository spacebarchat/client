import { createContext } from "react";
import { Rules } from "../util/CSSToRN";

export class Themes {
	cache = [] as Rules[];

	constructor() {}
}

export const ThemesContext = createContext<any>([[]]);
