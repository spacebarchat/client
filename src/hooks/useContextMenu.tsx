import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { useMemo, useState } from "react";
import GuildMember from "../stores/objects/GuildMember";
import User from "../stores/objects/User";

interface MenuProps {
	user: User;
	member?: GuildMember;
}

export default function (type: "user") {
	const [isOpen, setIsOpen] = useState(false);
	const [props, setProps] = useState<MenuProps | null>(null);

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

	const open = (props: MenuProps) => {
		setProps(props);
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	function onContextMenu(e: React.MouseEvent, props: MenuProps) {
		e.preventDefault();

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
