// adapted from https://github.com/revoltchat/revite/blob/master/src/controllers/modals/ModalRenderer.tsx
// Removed usage of `Prompt`

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { modalController } from "./ModalController";

export default observer(() => {
	useEffect(() => {
		function keyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				modalController.pop("close");
			} else if (event.key === "Enter") {
				if (event.target instanceof HTMLSelectElement) return;
				modalController.pop("confirm");
			}
		}

		document.addEventListener("keydown", keyDown);
		return () => document.removeEventListener("keydown", keyDown);
	}, []);

	return <>{modalController.rendered}</>;
});
