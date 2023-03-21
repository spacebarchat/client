import { observer } from "mobx-react-lite";
import { createGlobalStyle } from "styled-components";
import { useAppStore } from "../stores/AppStore";

export type ThemeVariables = "primary" | "secondary" | "background" | "text";

export type Overrides = {
  [variable in ThemeVariables]: string;
};

export type Theme = Overrides & {
  light?: boolean;
};

export const ThemePresets: Record<string, Theme> = {
  light: {
    primary: "#FF5F00",
    secondary: "#FF3D00",
    background: "#e9e2e1",
    text: "#000000",
  },
  dark: {
    primary: "#FF5F00",
    secondary: "#FF3D00",
    background: "#141212",
    text: "#e9e2e1",
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
