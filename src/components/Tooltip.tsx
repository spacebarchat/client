import MuiTooltip, { TooltipProps as MuiTooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import styled from "styled-components";

export default styled(({ className, ...props }: MuiTooltipProps) => (
	<MuiTooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
	[`& .${tooltipClasses.popper}`]: {
		maxWidth: 200,
		borderRadius: 5,
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: "var(--background-tertiary)",
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "var(--background-tertiary)",
		fontWeight: "400", // TODO: current font doesn't have a 400 weight
		fontSize: "14px",
		padding: "8px 12px",
	},
}));
