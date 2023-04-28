import React from "react";
import { useAppStore } from "../stores/AppStore";

function LogoutPage() {
	const app = useAppStore();

	React.useEffect(() => {
		app.logout();
	}, []);

	return <div>LogoutPage</div>;
}

export default LogoutPage;
