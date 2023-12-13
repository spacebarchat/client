import { FloatingPortal } from "@floating-ui/react";
import { observer } from "mobx-react-lite";
import { floatingController } from "./FloatingController";

function FloatingRender() {
	return <FloatingPortal>{floatingController.rendered}</FloatingPortal>;
}

export default observer(FloatingRender);
