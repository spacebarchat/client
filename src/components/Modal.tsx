import React, { useState } from "react";
import Modal, { ModalProps } from "react-native-modal";
import { useNavigate } from "react-router";
import { ModalAvoidingView } from "../util/ModalAvoidingView";

export default function (props: Partial<ModalProps>) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(true);

	function goBack() {
		setOpen(false);
		setTimeout(() => {
			navigate(-1);
		}, 200);
	}

	const children = props.children;
	delete props.children;

	return (
		// @ts-ignore
		<Modal
			style={{ margin: 0, justifyContent: "flex-end" }}
			propagateSwipe={true}
			useNativeDriver={false}
			swipeDirection={["down", "up"]}
			isVisible={open}
			avoidKeyboard={true}
			coverScreen={false}
			onModalHide={goBack}
			onBackdropPress={goBack}
			onBackButtonPress={goBack}
			onSwipeComplete={goBack}
			{...props}
		>
			<ModalAvoidingView onKeyDown={(event: any) => console.log(event)}>{children}</ModalAvoidingView>
		</Modal>
	);
}
