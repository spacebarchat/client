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
  | "inputBackground";

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
  },
};

const GlobalTheme = createGlobalStyle<{ theme: Theme }>`
:root {
    ${(props) => generateVariables(props.theme)}
}
`;

export const generateVariables = (theme: Theme) => {
  return (Object.keys(theme) as ThemeVariables[]).map((key) => {
    const colour = theme[key];
    try {
      const r = parseInt(colour.substring(1, 3), 16);
      const g = parseInt(colour.substring(3, 5), 16);
      const b = parseInt(colour.substring(5, 7), 16);
      return `--${key}: ${theme[key]}; --${key}-rgb: rgb(${r}, ${g}, ${b});`;
    } catch {
      return `--${key}: ${theme[key]};`;
    }
  });
};

export default observer(() => {
  const appStore = useAppStore();
  const theme = appStore.theme;

  const variables = theme.computeVariables();

  return <GlobalTheme theme={variables} />;
});
