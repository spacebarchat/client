import MuiTooltip, {
	TooltipProps as MuiTooltipProps,
	tooltipClasses,
} from "@mui/material/Tooltip";
import styled from "styled-components";

export default styled(({ className, ...props }: MuiTooltipProps) => (
	<MuiTooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
	[`& .${tooltipClasses.popper}`]: {
		maxWidth: 200,
		borderRadius: 5,
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: "black",
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "black",
		fontSize: "14px",
		fontWeight: "600",
		padding: "8px 12px",
	},
}));
