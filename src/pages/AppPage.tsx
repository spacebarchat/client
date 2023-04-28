import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

function AppPage() {
	return (
		<Loader>
			<Navigate to="/channels/@me" />
		</Loader>
	);
}

export default observer(AppPage);
