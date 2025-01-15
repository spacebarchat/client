import { useMergeRefs } from "@floating-ui/react";
import useFloatingContext from "@hooks/useFloatingContext";
import React from "react";

interface PopoverTriggerProps {
	children: React.ReactNode;
	asChild?: boolean;
}

export default React.forwardRef<HTMLElement, React.HTMLProps<HTMLElement> & PopoverTriggerProps>(
	function FloatingTrigger({ children, asChild = false, ...props }, propRef) {
		const context = useFloatingContext();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const childrenRef = (children as any).ref;
		const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

		// `asChild` allows the user to pass any element as the anchor
		if (asChild && React.isValidElement(children)) {
			return React.cloneElement(
				children,
				context.getReferenceProps({
					ref,
					...props,
					...children.props,
					"data-state": context.open ? "open" : "closed",
				}),
			);
		}

		return (
			<span ref={ref} data-state={context.open ? "open" : "closed"} {...context.getReferenceProps(props)}>
				{children}
			</span>
		);
	},
);
