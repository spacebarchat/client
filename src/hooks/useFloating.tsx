import {
	Placement,
	autoUpdate,
	flip,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useEffect, useMemo, useState } from "react";
import { floatingController } from "../controllers/modals/floating/FloatingController";
import GuildMember from "../stores/objects/GuildMember";
import User from "../stores/objects/User";

interface FloatingProps {
	type: "userPopout";
	initialOpen?: boolean;
	placement: Placement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	config: {
		user: User;
		member?: GuildMember;
	};
}

export default function ({
	type,
	initialOpen = false,
	placement,
	open: controlledOpen,
	onOpenChange: setControlledOpen,
	config,
}: FloatingProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
	const [key, setKey] = useState<string>();

	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = setControlledOpen ?? setUncontrolledOpen;

	const data = useFloating({
		placement: placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [offset(5), flip(), shift()],
	});

	const context = data.context;

	const click = useClick(context);
	const dismiss = useDismiss(context);
	const role = useRole(context);
	const interactions = useInteractions([click, dismiss, role]);

	useEffect(() => {
		if (open) {
			const k = floatingController.add({
				type,
				data: {
					...interactions,
					...data,
				},
				open,
				props: config,
			});
			setKey(k);
		} else {
			key && floatingController.remove(key);
		}
	}, [open]);

	return useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data,
		}),
		[open, setOpen, interactions, data],
	);
}
