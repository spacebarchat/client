import { observer } from "mobx-react-lite";
import { createGlobalStyle } from "styled-components";
import { useAppStore } from "../stores/AppStore";

export type ThemeVariables =
	| "backgroundPrimary"
	| "backgroundPrimaryAlt"
	| "backgroundSecondary"
	| "backgroundSecondaryAlt"
	| "backgroundSecondaryHighlight"
	| "backgroundTertiary"
	| "textHeader"
	| "textHeaderSecondary"
	| "text"
	| "textSecondary"
	| "textDisabled"
	| "textHint"
	| "textLink"
	| "inputBackground"
	| "error"
	| "divider"
	| "primary"
	| "primaryLight"
	| "primaryDark"
	| "primaryContrastText"
	| "secondary"
	| "secondaryLight"
	| "secondaryDark"
	| "secondaryContrastText"
	| "danger"
	| "dangerLight"
	| "dangerDark"
	| "dangerContrastText"
	| "success"
	| "successLight"
	| "successDark"
	| "successContrastText"
	| "warning"
	| "warningLight"
	| "warningDark"
	| "warningContrastText";

export type Overrides = {
	[variable in ThemeVariables]: string;
};

export type Theme = Overrides & {
	light?: boolean;
};

export const ThemePresets: Record<string, Theme> = {
	light: {
		backgroundPrimary: "#ffffff",
		backgroundPrimaryAlt: "",
		backgroundSecondary: "#ebe5e4",
		backgroundSecondaryAlt: "#ebe5e4",
		backgroundSecondaryHighlight: "#ebe5e4",
		backgroundTertiary: "#e9e2e1",
		text: "#000000",
		textSecondary: "#bdbdbd",
		textDisabled: "#909090",
		textHeader: "#000000",
		textHeaderSecondary: "#000000",
		textHint: "#22194D",
		textLink: "#00a8fc",
		inputBackground: "#757575",
		error: "#e83f36",
		divider: "#3c3c3c",
		primary: "",
		primaryLight: "",
		primaryDark: "",
		primaryContrastText: "",
		secondary: "",
		secondaryLight: "",
		secondaryDark: "",
		secondaryContrastText: "",
		danger: "",
		dangerLight: "",
		dangerDark: "",
		dangerContrastText: "",
		success: "",
		successLight: "",
		successDark: "",
		successContrastText: "",
		warning: "",
		warningLight: "",
		warningDark: "",
		warningContrastText: "",
	},
	dark: {
		backgroundPrimary: "#2e2e2e",
		backgroundPrimaryAlt: "#2a2a2a",
		backgroundSecondary: "#232323",
		backgroundSecondaryAlt: "#1e1e1e",
		backgroundSecondaryHighlight: "#383838",
		backgroundTertiary: "#171717",
		text: "#e9e2e1",
		textSecondary: "#bdbdbd",
		textDisabled: "#909090",
		textHeader: "#ffffff",
		textHeaderSecondary: "#b3b3b3",
		textHint: "#22194D",
		textLink: "#00a8fc",
		inputBackground: "#121212",
		error: "#e83f36",
		divider: "#3c3c3c",
		primary: "#0185ff",
		primaryLight: "#339dff",
		primaryDark: "#005db2",
		primaryContrastText: "#ffffff",
		secondary: "#ff7c01",
		secondaryLight: "#ff9633",
		secondaryDark: "#b25600",
		secondaryContrastText: "#040404",
		danger: "#ff3a3b",
		dangerLight: "#ff6162",
		dangerDark: "#b22829",
		dangerContrastText: "#ffffff",
		success: "#34af65",
		successLight: "#5cbf83",
		successDark: "#247a46",
		successContrastText: "#040404",
		warning: "#faa61a",
		warningLight: "#fbb747",
		warningDark: "#af7412",
		warningContrastText: "#040404",
	},
};

const GlobalTheme = createGlobalStyle<{ theme: Theme }>`
:root {
    ${(props) => generateVariables(props.theme)}
}
`;

const toDashed = (str: string) => str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

export const generateVariables = (theme: Theme) => {
	return (Object.keys(theme) as ThemeVariables[]).map((key) => {
		const colour = theme[key];
		try {
			const r = parseInt(colour.substring(1, 3), 16);
			const g = parseInt(colour.substring(3, 5), 16);
			const b = parseInt(colour.substring(5, 7), 16);
			return `--${toDashed(key)}: ${theme[key]}; --${toDashed(key)}-rgb: rgb(${r}, ${g}, ${b});`;
		} catch {
			return `--${toDashed(key)}: ${theme[key]};`;
		}
	});
};

export default observer(() => {
	const appStore = useAppStore();
	const theme = appStore.theme;

	const variables = theme.computeVariables();

	return <GlobalTheme theme={variables} />;
});
