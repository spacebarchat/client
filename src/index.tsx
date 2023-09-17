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
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ModalRenderer from "./components/modals/ModalRenderer";
import { BannerContextProvider } from "./contexts/BannerContext";
import { ContextMenuContextProvider } from "./contexts/ContextMenuContext";
import Theme from "./contexts/Theme";
import "./index.css";
import { calendarStrings } from "./utils/i18n";

dayjs.extend(relativeTime);
dayjs.extend(calendar, calendarStrings);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<BrowserRouter>
		<ModalStack renderModals={ModalRenderer}>
			<ContextMenuContextProvider>
				<BannerContextProvider>
					<App />
				</BannerContextProvider>
			</ContextMenuContextProvider>
			<Theme />
		</ModalStack>
	</BrowserRouter>,
);
