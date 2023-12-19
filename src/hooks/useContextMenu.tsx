import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { useMemo, useState } from "react";
import ChannelContextMenu from "../components/contextMenus/ChannelContextMenu";
import MessageContextMenu from "../components/contextMenus/MessageContextMenu";
import UserContextMenu from "../components/contextMenus/UserContextMenu";
import { ContextMenuProps } from "../contexts/ContextMenuContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Components = Record<string, React.FC<any>>;

export const ContextMenuComponents: Components = {
	user: UserContextMenu,
	message: MessageContextMenu,
	channel: ChannelContextMenu,
};

export default function () {
	const [isOpen, setIsOpen] = useState(false);
	const [props, setProps] = useState<ContextMenuProps | null>(null);

	const data = useFloating({
		placement: "right-start",
		strategy: "fixed",
		open: isOpen && props !== null,
		onOpenChange: setIsOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(5),
			flip({
				fallbackPlacements: ["left-start"],
			}),
			shift({
				padding: 8,
			}),
		],
	});

	const context = data.context;

	const role = useRole(context, { role: "menu" });
	const dismiss = useDismiss(context);
	//   const listNavigation = useListNavigation(context, {
	//     listRef: listItemsRef,
	//     onNavigate: setActiveIndex,
	//     activeIndex
	//   });
	//   const typeahead = useTypeahead(context, {
	//     enabled: isOpen,
	//     listRef: listContentRef,
	//     onMatch: setActiveIndex,
	//     activeIndex
	//   });

	const interactions = useInteractions([dismiss, role]);

	const open = (props: ContextMenuProps) => {
		setProps(props);
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	function onContextMenu(e: React.MouseEvent, props: ContextMenuProps) {
		e.preventDefault();
		e.stopPropagation();

		data.refs.setPositionReference({
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x: e.clientX,
					y: e.clientY,
					top: e.clientY,
					right: e.clientX,
					bottom: e.clientY,
					left: e.clientX,
				};
			},
		});

		setProps(props);
		setIsOpen(true);
	}

	return useMemo(
		() => ({
			isOpen,
			props,
			setProps,
			open,
			close,
			onContextMenu,
			...interactions,
			...data,
		}),
		[isOpen, props, setProps, open, close, onContextMenu, interactions, data],
	);
}
