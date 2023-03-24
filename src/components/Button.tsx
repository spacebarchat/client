import styled from "styled-components";

interface Props {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  outlined?: boolean;
}

export default styled.button<Props>`
background: ${(props) => {
  if (props.outlined) return "transparent";
  switch (props.variant) {
    case "primary":
      return "var(--button-primary)";
    case "secondary":
      return "var(--button-secondary)";
    case "danger":
      return "var(--button-danger)";
    case "success":
      return "var(--button-success)";
    case "warning":
      return "var(--button-warning)";
    default:
      return "var(--button-primary)";
  }
}};

border: ${(props) => {
  if (!props.outlined) return "none";
  switch (props.variant) {
    case "primary":
      return "1px solid var(--button-primary)";
    case "secondary":
      return "1px solid var(--button-secondary)";
    case "danger":
      return "1px solid var(--button-danger)";
    case "success":
      return "1px solid var(--button-success)";
    case "warning":
      return "1px solid var(--button-warning)";
    default:
      return "1px solid var(--button-primary)";
  }
}};

color: var(--text);
padding: 8px 16px;
border-radius: 8px;
font-size: 13px;
font-weight: 700;
cursor: pointer;
outline: none;
transition: background 0.2s ease-in-out;
pointer-events:${(props) => (props.disabled ? "none" : null)};
opacity: ${(props) => (props.disabled ? 0.5 : 1)};

&:hover {
    background: ${(props) => {
      switch (props.variant) {
        case "primary":
          return "var(--button-primary-hover)";
        case "secondary":
          return "var(--button-secondary-hover)";
        case "danger":
          return "var(--button-danger-hover)";
        case "success":
          return "var(--button-success-hover)";
        case "warning":
          return "var(--button-warning-hover)";
        default:
          return "var(--button-primary-hover)";
      }
    }};

&:active {
    background: ${(props) => {
      switch (props.variant) {
        case "primary":
          return "var(--button-primary-active)";
        case "secondary":
          return "var(--button-secondary-active)";
        case "danger":
          return "var(--button-danger-active)";
        case "success":
          return "var(--button-success-active)";
        case "warning":
          return "var(--button-warning-active)";
        default:
          return "var(--button-primary-active)";
      }
    }};
`;
