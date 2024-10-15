import Loader from "@components/Loader";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

function AppPage() {
	return (
		<Loader>
			<Navigate to="/channels/@me" />
		</Loader>
	);
}

export default observer(AppPage);
