import { FloatingPortal } from "@floating-ui/react";
import { observer } from "mobx-react-lite";
import { floatingController } from "./FloatingController";

export default observer(() => {
	// useEffect(() => {
	// 	function keyDown(event: KeyboardEvent) {
	// 		if (event.key === "Escape") {
	// 			modalController.pop("close");
	// 		} else if (event.key === "Enter") {
	// 			if (event.target instanceof HTMLSelectElement) return;
	// 			modalController.pop("confirm");
	// 		}
	// 	}

	// 	document.addEventListener("keydown", keyDown);
	// 	return () => document.removeEventListener("keydown", keyDown);
	// }, []);
	console.log(floatingController.elements);

	return <FloatingPortal>{floatingController.rendered}</FloatingPortal>;
});
