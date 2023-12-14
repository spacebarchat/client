import { FloatingArrow, FloatingPortal, Placement } from "@floating-ui/react";
import { motion } from "framer-motion";
import { FloatingContext } from "../../contexts/FloatingContext";
import useFloating from "../../hooks/useFloating";
import GuildMember from "../../stores/objects/GuildMember";
import User from "../../stores/objects/User";
import Tooltip from "../Tooltip";
import UserProfilePopout from "./UserProfilePopout";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Components = Record<string, React.FC<any>>;

const components: Components = {
	userPopout: UserProfilePopout,
	tooltip: Tooltip,
};

export type FloatingOptions = {
	initialOpen?: boolean;
	placement?: Placement;
	offset?: number;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
} & (
	| {
			type: "userPopout";
			props: {
				user: User;
				member?: GuildMember;
			};
	  }
	| {
			type: "tooltip";
			props: {
				content: JSX.Element;
				aria?: string;
			};
	  }
);

export type FloatingProps<T extends FloatingOptions["type"]> = (FloatingOptions & {
	type: T;
})["props"];

function Floating({
	type,
	children,
	props,
	...restOptions
}: {
	children: React.ReactNode;
} & FloatingOptions) {
	const floating = useFloating({ type, ...restOptions });

	const Component = components[type];

	return (
		<FloatingContext.Provider value={floating}>
			{children}
			{Component && floating.open && (
				<FloatingPortal>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
						ref={floating.refs.setFloating}
						style={{ ...floating.context.floatingStyles, zIndex: 1000, outline: "none" }}
						{...floating.getFloatingProps()}
					>
						<Component {...props} />
						{type === "tooltip" && (
							<FloatingArrow
								ref={floating.arrowRef}
								context={floating.context}
								fill="var(--background-tertiary)"
							/>
						)}
					</motion.div>
				</FloatingPortal>
			)}
		</FloatingContext.Provider>
	);
}

export default Floating;
