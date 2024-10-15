import { useAppStore } from "@hooks/useAppStore";
import React from "react";

function LogoutPage() {
	const app = useAppStore();

	React.useEffect(() => {
		app.logout();
	}, []);

	return <div>LogoutPage</div>;
}

export default LogoutPage;
