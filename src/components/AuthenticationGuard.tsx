import { useAppStore } from "@hooks/useAppStore";
import { LoadingSuspense } from "@pages/LoadingPage";
import { Navigate } from "react-router-dom";

interface Props {
	component: React.FC;
	requireUnauthenticated?: boolean;
}

export default function AuthenticationGuard({ component, requireUnauthenticated }: Props) {
	const app = useAppStore();

	// if we need the user to be logged in, and there isn't a token, go to login page
	if (!requireUnauthenticated && !app.token) {
		return <Navigate to="/login" replace />;
	}

	// if we need the user to be logged out to access the page, but there is a token, go to the app page
	if (requireUnauthenticated && app.token) {
		return <Navigate to="/app" replace />;
	}

	const Component = component;
	return (
		<LoadingSuspense>
			<Component />
		</LoadingSuspense>
	);
}
