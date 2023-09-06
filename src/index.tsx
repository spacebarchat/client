import "@fontsource/source-code-pro";
// import "@fontsource/source-sans-pro/200.css";
// import "@fontsource/source-sans-pro/300.css";
// import "@fontsource/source-sans-pro/400.css";
// import "@fontsource/source-sans-pro/600.css";
// import "@fontsource/source-sans-pro/700.css";
// import "@fontsource/source-sans-pro/900.css";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import { ModalStack } from "@mattjennings/react-modal-stack";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ModalRenderer from "./components/modals/ModalRenderer";
import { ContextMenuContextProvider } from "./contexts/ContextMenuContext";
import Theme from "./contexts/Theme";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<BrowserRouter>
		<ModalStack renderModals={ModalRenderer}>
			<ContextMenuContextProvider>
				<App />
			</ContextMenuContextProvider>
			<Theme />
		</ModalStack>
	</BrowserRouter>,
);
