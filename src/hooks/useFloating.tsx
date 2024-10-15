import { FloatingOptions } from "@components/floating/Floating";
import {
	arrow,
	autoUpdate,
	flip,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useMemo, useRef, useState } from "react";

export default function ({
	type,
	initialOpen = false,
	offset: offsetMiddlewareOffset,
	placement,
	open: controlledOpen,
	onOpenChange: setControlledOpen,
}: Omit<FloatingOptions, "props">) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
	const arrowRef = useRef<SVGSVGElement>(null);

	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = setControlledOpen ?? setUncontrolledOpen;

	const data = useFloating({
		placement: placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(type === "tooltip" && !offsetMiddlewareOffset ? 10 : offsetMiddlewareOffset ?? 5),
			flip(),
			shift({
				padding: 8,
			}),
			arrow({
				element: arrowRef,
				padding: 4,
			}),
		],
	});

	const context = data.context;

	const click = useClick(context, {
		enabled: type !== "tooltip",
	});
	const dismiss = useDismiss(context);
	const role = useRole(context, {
		role: type === "tooltip" ? "tooltip" : undefined,
	});

	const hover = useHover(context, {
		move: false,
		enabled: type == "tooltip",
	});
	const focus = useFocus(context, {
		enabled: type == "tooltip",
	});

	const interactions = useInteractions([click, dismiss, role, hover, focus]);

	return useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data,
			arrowRef,
		}),
		[open, setOpen, interactions, data],
	);
}
