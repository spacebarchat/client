import { Navigate } from "react-router-dom";
import { useAppStore } from "../../hooks/useAppStore";
import { LoadingSuspense } from "../../pages/LoadingPage";

interface Props {
	component: React.FC;
}

export const UnauthenticatedGuard = ({ component }: Props) => {
	const app = useAppStore();

	if (app.token) {
		return <Navigate to="/app" replace />;
	}

	const Component = component;
	return (
		<LoadingSuspense>
			<Component />
		</LoadingSuspense>
	);
};
