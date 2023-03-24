import { observer } from "mobx-react-lite";
import { createGlobalStyle } from "styled-components";
import { useAppStore } from "../stores/AppStore";

export type ThemeVariables =
  | "brandPrimary"
  | "brandSecondary"
  | "primary"
  | "primaryAlt"
  | "secondary"
  | "tertiary"
  | "text"
  | "textMuted"
  | "inputBackground"
  | "error"
  | "buttonPrimary"
  | "buttonPrimaryHover"
  | "buttonPrimaryActive"
  | "buttonSecondary"
  | "buttonSecondaryHover"
  | "buttonSecondaryActive"
  | "buttonDanger"
  | "buttonDangerHover"
  | "buttonDangerActive"
  | "buttonSuccess"
  | "buttonSuccessHover"
  | "buttonSuccessActive"
  | "buttonWarning"
  | "buttonWarningHover"
  | "buttonWarningActive";

export type Overrides = {
  [variable in ThemeVariables]: string;
};

export type Theme = Overrides & {
  light?: boolean;
};

export const ThemePresets: Record<string, Theme> = {
  light: {
    brandPrimary: "#FF5F00",
    brandSecondary: "#FF3D00",
    primary: "#ede8e7",
    primaryAlt: "",
    secondary: "#ebe5e4",
    tertiary: "#e9e2e1",
    text: "#000000",
    textMuted: "#232120",
    inputBackground: "#757575",
    error: "#e83f36",
    buttonPrimary: "",
    buttonPrimaryHover: "",
    buttonPrimaryActive: "",
    buttonSecondary: "",
    buttonSecondaryHover: "",
    buttonSecondaryActive: "",
    buttonDanger: "",
    buttonDangerHover: "",
    buttonDangerActive: "",
    buttonSuccess: "",
    buttonSuccessHover: "",
    buttonSuccessActive: "",
    buttonWarning: "",
    buttonWarningHover: "",
    buttonWarningActive: "",
  },
  dark: {
    brandPrimary: "#FF5F00",
    brandSecondary: "#FF3D00",
    primary: "#232120",
    primaryAlt: "#312e2d",
    secondary: "#1b1918",
    tertiary: "#141212",
    text: "#e9e2e1",
    textMuted: "#85898f",
    inputBackground: "#121212",
    error: "#e83f36",
    // buttons
    buttonPrimary: "#FF5F00",
    buttonPrimaryHover: "#ff3d00",
    buttonPrimaryActive: "#BA4500",
    buttonSecondary: "#4a4544",
    buttonSecondaryHover: "#746d69",
    buttonSecondaryActive: "#5f5a59",
    buttonDanger: "#ff3a3b",
    buttonDangerHover: "#ff2d2f",
    buttonDangerActive: "#ff2425",
    buttonSuccess: "#34af65",
    buttonSuccessHover: "#31a660",
    buttonSuccessActive: "#2d9657",
    buttonWarning: "#faa61a",
    buttonWarningHover: "#e69105",
    buttonWarningActive: "#c27b04",
  },
};

const GlobalTheme = createGlobalStyle<{ theme: Theme }>`
:root {
    ${(props) => generateVariables(props.theme)}
}
`;

const toDashed = (str: string) =>
  str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

export const generateVariables = (theme: Theme) => {
  return (Object.keys(theme) as ThemeVariables[]).map((key) => {
    const colour = theme[key];
    try {
      const r = parseInt(colour.substring(1, 3), 16);
      const g = parseInt(colour.substring(3, 5), 16);
      const b = parseInt(colour.substring(5, 7), 16);
      return `--${toDashed(key)}: ${theme[key]}; --${toDashed(
        key
      )}-rgb: rgb(${r}, ${g}, ${b});`;
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
