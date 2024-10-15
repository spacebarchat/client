import { FloatingFocusManager, FloatingPortal, useMergeRefs } from "@floating-ui/react";
import useFloatingContext from "@hooks/useFloatingContext";
import { motion } from "framer-motion";
import React from "react";

export default React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function PopoverContent(
	{ style, ...props },
	propRef,
) {
	const { context: floatingContext, ...context } = useFloatingContext();
	const ref = useMergeRefs([context.refs.setFloating, propRef]);

	if (!floatingContext.open) return null;

	return (
		<FloatingPortal>
			<FloatingFocusManager context={floatingContext}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
				>
					<div
						ref={ref}
						style={{ ...context.floatingStyles, ...style, zIndex: 1000, outline: "none" }}
						{...context.getFloatingProps(props)}
					>
						{props.children}
					</div>
				</motion.div>
			</FloatingFocusManager>
		</FloatingPortal>
	);
});
