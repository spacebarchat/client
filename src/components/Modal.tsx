import { KeyboardAvoidingView } from "native-base";
import React, { useEffect, useState } from "react";
import Modal, { ModalProps } from "react-native-modal";
import { useHistory } from "react-router";
import { ModalAvoidingView } from "../util/ModalAvoidingView";
import { relativeScreenHeight } from "../util/Styles";

export default function (props: Partial<ModalProps>) {
	const history = useHistory();
	const [open, setOpen] = useState(true);

	function goBack() {
		setOpen(false);
		setTimeout(() => {
			history.goBack();
		}, 250);
	}

	useEffect(() => {
		// reset open value to true
		if (!open) setOpen(true);
	}, [open]);

	const children = props.children;
	delete props.children;

	return (
		// @ts-ignore
		<Modal
			style={{ margin: 0, justifyContent: "flex-end" }}
			propagateSwipe={true}
			useNativeDriver={true}
			// swipeDirection={["down", "up"]}
			isVisible={open}
			avoidKeyboard={true}
			coverScreen={false}
			onModalHide={goBack}
			onBackdropPress={goBack}
			onBackButtonPress={goBack}
			onSwipeComplete={goBack}
			{...props}
		>
			<ModalAvoidingView>{children}</ModalAvoidingView>
		</Modal>
	);
}
