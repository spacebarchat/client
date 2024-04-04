import "@fontsource/roboto-mono/100.css";
import "@fontsource/roboto-mono/200.css";
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/600.css";
import "@fontsource/roboto-mono/700.css";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundaryContext } from "react-use-error-boundary";
import App from "./App";
import { ContextMenuContextProvider } from "./contexts/ContextMenuContext";
import Theme from "./contexts/Theme";
import ModalRenderer from "./controllers/modals/ModalRenderer";
import "./index.css";
import { calendarStrings } from "./utils/i18n";

dayjs.extend(relativeTime);
dayjs.extend(calendar, calendarStrings);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ErrorBoundaryContext>
		<BrowserRouter>
			<ContextMenuContextProvider>
				<App />
				<ModalRenderer />
			</ContextMenuContextProvider>
			<Theme />
		</BrowserRouter>
	</ErrorBoundaryContext>,
);
