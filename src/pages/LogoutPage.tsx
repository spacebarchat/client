import React from "react";
import { useAppStore } from "../hooks/useAppStore";

function LogoutPage() {
	const app = useAppStore();

	React.useEffect(() => {
		app.logout();
	}, []);

	return <div>LogoutPage</div>;
}

export default LogoutPage;
