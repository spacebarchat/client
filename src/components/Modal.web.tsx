// @ts-nocheck
import Modal from "modal-react-native-web";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { ModalAvoidingView } from "../util/ModalAvoidingView";

export default function (props: any = {}) {
	const history = useHistory();
	const [open, setOpen] = useState(true);

	function goBack() {
		setOpen(false);
		setTimeout(() => {
			history.goBack();
		}, 250);
	}

	const handleUserKeyPress = useCallback((event) => {
		const { key, keyCode } = event;
		if (keyCode === 27) {
			document.body.classList.remove("modal-open");
			goBack();
		}
	}, []);

	useEffect(() => {
		window.addEventListener("keydown", handleUserKeyPress);
		return () => {
			window.removeEventListener("keydown", handleUserKeyPress);
		};
	}, [handleUserKeyPress]);

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				document.body.classList.add("modal-open");
			}, 50);
		}
	}, [open]);

	return (
		<Modal ariaHideApp={false} transparent={props.coverScreen} visible={open} onDismiss={goBack} {...props}>
			<ModalAvoidingView>{props.children}</ModalAvoidingView>
		</Modal>
	);
}
