import { ModalStackValue } from "@mattjennings/react-modal-stack";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export type AnimatedModalProps = {
	open: boolean;
};

function ModalRenderer({ stack }: ModalStackValue) {
	const [displayedStack, setDisplayedStack] = React.useState(stack);
	const [isOpen, setOpen] = React.useState(false);

	React.useEffect(() => {
		console.log(stack.length, displayedStack.length);
		// we're opening the first modal, so update the stack right away
		if (stack.length === 1 && displayedStack.length === 0) {
			setOpen(true);
			setDisplayedStack(stack);
		}
		// stack updated, trigger a dismissal of the current modal
		else {
			setOpen(false);
		}
	}, [stack]);

	return (
		<>
			<AnimatePresence>
				{stack.length > 0 && (
					<motion.div
						style={{
							zIndex: 90,
							position: `fixed`,
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: "rgba(0,0,0,0.8)",
						}}
						variants={{
							show: { opacity: 1 },
							hide: { opacity: 0 },
						}}
						initial="hide"
						animate="show"
						exit="hide"
					/>
				)}
			</AnimatePresence>
			{displayedStack.map((modal, index) => (
				<modal.component
					key={index}
					open={index === displayedStack.length - 1 && isOpen}
					onAnimationComplete={() => {
						// set open state for next modal
						if (stack.length > 0) {
							setOpen(true);
						} else {
							setOpen(false);
						}

						// update displayed stack
						// setTimeout is a hack to prevent a warning about updating state
						// in an unmounted component (I can't figure out why it happens, or why this fixes it)
						setTimeout(() => setDisplayedStack(stack));

						modal.props?.onAnimationComplete?.();
					}}
					{...modal.props}
				/>
			))}
		</>
	);
}

export default ModalRenderer;
