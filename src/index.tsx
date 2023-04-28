import "@fontsource/urbanist";
import { ModalStack } from "@mattjennings/react-modal-stack";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Theme from "./contexts/Theme";
import "./index.css";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<BrowserRouter>
		<ModalStack>
			<App />
			<Theme />
		</ModalStack>
	</BrowserRouter>,
);
